"use client";

import { useEffect, useState } from "react";
import type { GitHubUser, GitHubRepo, GitHubEvent } from "@/lib/github";
import { languageColors, timeAgo } from "@/lib/github";
import { ScrollReveal } from "@/components/scroll-reveal";

interface GitHubOverviewProps {
  initialUser?: GitHubUser | null;
  initialRepos?: GitHubRepo[];
  initialEvents?: GitHubEvent[];
}

export function GitHubOverview({ initialUser, initialRepos, initialEvents }: GitHubOverviewProps) {
  const [user, setUser] = useState<GitHubUser | null>(initialUser || null);
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos || []);
  const [events, setEvents] = useState<GitHubEvent[]>(initialEvents || []);
  const [activeTab, setActiveTab] = useState<"repos" | "activity">("repos");
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (initialUser) return; // Already have data from server

    const fetchData = async () => {
      try {
        const [userRes, reposRes, eventsRes] = await Promise.all([
          fetch("https://api.github.com/users/Joshclxx"),
          fetch("https://api.github.com/users/Joshclxx/repos?sort=pushed&per_page=6"),
          fetch("https://api.github.com/users/Joshclxx/events/public?per_page=10"),
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (reposRes.ok) setRepos(await reposRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (err) {
        console.error("Failed to fetch GitHub data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialUser]);

  const formatEventDescription = (event: GitHubEvent): string => {
    const repoName = event.repo.name.replace("Joshclxx/", "");
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits?.length || 0;
        return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repoName}`;
      case "CreateEvent":
        return `Created ${event.payload.ref_type || "repository"} ${event.payload.ref ? `"${event.payload.ref}"` : ""} in ${repoName}`;
      case "WatchEvent":
        return `Starred ${repoName}`;
      case "ForkEvent":
        return `Forked ${repoName}`;
      case "IssuesEvent":
        return `${event.payload.action} an issue in ${repoName}`;
      case "PullRequestEvent":
        return `${event.payload.action} a pull request in ${repoName}`;
      case "DeleteEvent":
        return `Deleted ${event.payload.ref_type} "${event.payload.ref}" in ${repoName}`;
      default:
        return `Activity in ${repoName}`;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return (
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.5.75a.75.75 0 0 0-1.5 0v5.19L4.28 3.22a.75.75 0 0 0-1.06 1.06l4.25 4.25a.75.75 0 0 0 1.06 0l4.25-4.25a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L8.5 5.94ZM1.75 13a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5Z" />
          </svg>
        );
      case "CreateEvent":
        return (
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="repo-card animate-pulse"
          >
            <div className="h-4 bg-[var(--gh-btn-bg)] rounded w-1/3 mb-2" />
            <div className="h-3 bg-[var(--gh-btn-bg)] rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      {user && (
        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-sm">
            <a
              href={`${user.html_url}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-[var(--gh-accent-blue)] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
              </svg>
              <span className="font-semibold text-foreground">{user.public_repos}</span>
              <span>repositories</span>
            </a>
            <a
              href={`${user.html_url}?tab=followers`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-[var(--gh-accent-blue)] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z" />
              </svg>
              <span className="font-semibold text-foreground">{user.followers}</span>
              <span>followers</span>
            </a>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <a
              href={`${user.html_url}?tab=following`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-[var(--gh-accent-blue)] transition-colors"
            >
              <span className="font-semibold text-foreground">{user.following}</span>
              <span>following</span>
            </a>
          </div>
        </ScrollReveal>
      )}

      {/* Tab switcher */}
      <ScrollReveal>
        <div className="flex items-center border-b border-[var(--gh-border)] mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("repos")}
            className={`relative flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "repos"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
              </svg>
              Repositories
              <span className="gh-counter">{repos.length}</span>
            </span>
            {activeTab === "repos" && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#f78166] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`relative flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "activity"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
              </svg>
              Activity
              <span className="gh-counter">{events.length}</span>
            </span>
            {activeTab === "activity" && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#f78166] rounded-full" />
            )}
          </button>
        </div>
      </ScrollReveal>

      {/* Repos tab */}
      {activeTab === "repos" && (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {repos.map((repo, index) => (
            <ScrollReveal key={repo.id} delay={index * 60}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card h-full group"
              >
                {/* Repo header */}
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[var(--gh-accent-blue)] group-hover:underline truncate">
                        {repo.name}
                      </span>
                      <span className="gh-badge text-[10px] py-0">Public</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                )}

                {/* Footer — language + stars + updated */}
                <div className="flex items-center gap-4 mt-auto pt-1 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="lang-dot w-3 h-3"
                        style={{ backgroundColor: languageColors[repo.language] || "#8b949e" }}
                      />
                      {repo.language}
                    </span>
                  )}

                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                      </svg>
                      {repo.stargazers_count}
                    </span>
                  )}

                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                      </svg>
                      {repo.forks_count}
                    </span>
                  )}

                  <span className="ml-auto text-[11px]">
                    Updated {timeAgo(repo.pushed_at)}
                  </span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Activity tab */}
      {activeTab === "activity" && (
        <div className="space-y-px">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
          ) : (
            events.map((event, index) => (
              <ScrollReveal key={event.id} delay={index * 40}>
                <div className="flex items-start gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-md hover:bg-[var(--gh-bg-secondary)] transition-colors">
                  <div className="mt-0.5 text-muted-foreground">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-foreground">
                      {formatEventDescription(event)}
                    </p>
                    {event.type === "PushEvent" && event.payload.commits?.[0] && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
                        {event.payload.commits[0].sha.slice(0, 7)}{" "}
                        {event.payload.commits[0].message}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0 mt-0.5">
                    {timeAgo(event.created_at)}
                  </span>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      )}
    </div>
  );
}
