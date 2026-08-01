import { ScrollReveal } from "@/components/scroll-reveal";
import { TypewriterText } from "@/components/typewriter-text";
import { SafeMarkdown } from "@/components/safe-markdown";
import type { PortfolioProfile } from "@/lib/types";

export function AboutSection({ profile }: { profile: PortfolioProfile }) {
  return (
    <section id="about">
      <ScrollReveal>
        <div className="gh-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--gh-bg-secondary)] border-b border-[var(--gh-border)]">
            <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" /></svg>
            <span className="text-sm font-semibold text-foreground">README.md</span>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--gh-border)]">
              <h2 className="text-2xl font-semibold text-foreground"><TypewriterText text="Hi there" speed={60} delay={400} /></h2>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <SafeMarkdown source={profile.about_markdown} className="space-y-4 [&>p]:m-0" />
              <div className="mt-6">
                <h3 className="text-base font-semibold text-foreground mb-3">Quick Facts</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {profile.quick_facts.map((fact, index) => (
                    <li key={`${fact}-${index}`} className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--gh-btn-bg)] transition-colors cursor-default">
                      <span className="text-[var(--gh-accent-green)] mt-0.5">▸</span>
                      <SafeMarkdown source={fact} className="min-w-0" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
