"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { InteractiveGraph } from "@/components/interactive-graph";
import type { GitHubUser, GitHubRepo } from "@/lib/github";

const USERNAME = "Joshclxx";

export function ContributionGraph() {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  // Watch theme changes via MutationObserver on <html class>
  useEffect(() => {
    const check = () =>
      setIsDark(!document.documentElement.classList.contains("light"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Fetch real GitHub user + repo data for stats card
  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`).then((r) => r.json()),
      fetch(
        `https://api.github.com/users/${USERNAME}/repos?per_page=100`
      ).then((r) => r.json()),
    ])
      .then(([u, r]) => {
        setUser(u);
        setRepos(Array.isArray(r) ? r : []);
      })
      .catch(() => {});
  }, []);

  // Derived stats from live API data
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const languages = [
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ].slice(0, 4);

  // Streak stats URL — theme-aware
  const streakUrl = isDark
    ? `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=github-dark&hide_border=true&background=0d1117&stroke=30363d&ring=3fb950&fire=f78166&currStreakLabel=e6edf3&dates=8b949e&sideNums=e6edf3&sideLabels=8b949e`
    : `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=default&hide_border=true&background=f6f8fa&stroke=d0d7de&ring=2da44e&fire=f78166&currStreakLabel=24292f&dates=57606a&sideNums=24292f&sideLabels=57606a`;

  const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
  };

  return (
    <ScrollReveal>
      <div className="mt-6 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Activity overview
          </h3>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-[var(--gh-accent-blue)] transition-colors"
          >
            View on GitHub ↗
          </a>
        </div>

        <div className="gh-card overflow-hidden">
          {/* Activity graph — interactive with hover tooltips */}
          <div className="p-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              Contribution Graph
            </p>
            <InteractiveGraph isDark={isDark} />
          </div>

          <div className="border-t border-[var(--gh-border)]" />

          {/* Bottom row: custom stats card + streak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--gh-border)]">

            {/* Custom GitHub Stats Card — built with live API data */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">
                GitHub Stats
              </p>
              {user ? (
                <div className="space-y-2.5">
                  {/* Stat rows */}
                  {[
                    {
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                        </svg>
                      ),
                      label: "Public Repos",
                      value: user.public_repos,
                      color: "var(--gh-accent-blue)",
                    },
                    {
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                        </svg>
                      ),
                      label: "Total Stars",
                      value: totalStars,
                      color: "#d29922",
                    },
                    {
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                        </svg>
                      ),
                      label: "Total Forks",
                      value: totalForks,
                      color: "var(--gh-accent-green)",
                    },
                    {
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z" />
                        </svg>
                      ),
                      label: "Followers",
                      value: user.followers,
                      color: "var(--gh-accent-purple)",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span style={{ color: stat.color }}>{stat.icon}</span>
                        <span className="text-xs">{stat.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {(stat.value ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {/* Top languages */}
                  {languages.length > 0 && (
                    <div className="pt-1 border-t border-[var(--gh-border)]">
                      <p className="text-[10px] text-muted-foreground mb-1.5">
                        Top Languages
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map((lang) => (
                          <span
                            key={lang}
                            className="flex items-center gap-1 text-[11px] text-muted-foreground"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  langColors[lang!] || "#8b949e",
                              }}
                            />
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Loading skeleton
                <div className="space-y-2.5 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-3 bg-[var(--gh-btn-bg)] rounded w-1/3" />
                      <div className="h-3 bg-[var(--gh-btn-bg)] rounded w-8" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Streak stats image */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium">
                Contribution Streak
              </p>
              <img
                key={`streak-${isDark}`}
                src={streakUrl}
                alt="GitHub Streak Stats"
                className="w-full h-auto block rounded-md"
                style={{ minHeight: "80px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
