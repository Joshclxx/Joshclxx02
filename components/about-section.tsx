import { ScrollReveal } from "@/components/scroll-reveal";

export function AboutSection() {
  return (
    <section id="about">
      <ScrollReveal>
        {/* README.md header — GitHub file viewer style */}
        <div className="gh-card overflow-hidden">
          {/* File header bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--gh-bg-secondary)] border-b border-[var(--gh-border)]">
            <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
            </svg>
            <span className="text-sm font-semibold text-foreground">README.md</span>
          </div>

          {/* README content — markdown-like styling */}
          <div className="p-6 md:p-8">
            {/* Heading */}
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--gh-border)]">
              <h2 className="text-2xl font-semibold text-foreground">
                Hi there 👋
              </h2>
            </div>

            {/* Content in markdown style */}
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                I&apos;m a frontend developer passionate about building
                fast, accessible, and responsive web interfaces. I
                specialize in <strong className="text-foreground font-medium">React</strong>,{" "}
                <strong className="text-foreground font-medium">Next.js</strong>,{" "}
                <strong className="text-foreground font-medium">TypeScript</strong>, and{" "}
                <strong className="text-foreground font-medium">Tailwind CSS</strong> —
                transforming ideas and designs into smooth, pixel-perfect experiences.
              </p>
              <p>
                With a strong focus on clean code, performance, and
                responsive design, I enjoy turning complex requirements
                into intuitive user interfaces that work seamlessly
                across all devices.
              </p>

              {/* Quick facts — GitHub list style */}
              <div className="mt-6">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  ⚡ Quick Facts
                </h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--gh-accent-green)] mt-0.5">▸</span>
                    <span>Currently studying & building <strong className="text-foreground font-medium">Frontend Development</strong> projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--gh-accent-green)] mt-0.5">▸</span>
                    <span>Core strengths: <strong className="text-foreground font-medium">Frontend Development</strong> & <strong className="text-foreground font-medium">Responsive Design</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--gh-accent-green)] mt-0.5">▸</span>
                    <span>Open to new opportunities and collaborations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--gh-accent-green)] mt-0.5">▸</span>
                    <span>Ask me about <code className="px-1.5 py-0.5 rounded bg-[var(--gh-btn-bg)] text-xs font-mono text-foreground">React</code> <code className="px-1.5 py-0.5 rounded bg-[var(--gh-btn-bg)] text-xs font-mono text-foreground">Next.js</code> <code className="px-1.5 py-0.5 rounded bg-[var(--gh-btn-bg)] text-xs font-mono text-foreground">TypeScript</code></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
