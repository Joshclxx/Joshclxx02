import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * GitHub-style language colors — sourced from GitHub Linguist
 */
const techColors: Record<string, string> = {
  "React":         "#61dafb",
  "Next.js":       "#e6edf3",
  "TypeScript":    "#3178c6",
  "JavaScript":    "#f1e05a",
  "Tailwind CSS":  "#06b6d4",
  "Node.js":       "#339933",
  "HTML":          "#e34c26",
  "CSS":           "#563d7c",
  "Webflow":       "#4353ff",
  "Git":           "#f05032",
  "GitHub":        "#8b949e",
  "Figma":         "#f24e1e",
  "VS Code":       "#007acc",
  "Vercel":        "#e6edf3",
  "React Native":  "#61dafb",
  "Zustand":       "#433e38",
  "Expo":          "#000020",
};

const frameworks = [
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "HTML", "CSS", "Webflow",
];

const tools = [
  "Git", "GitHub", "Figma", "VS Code", "Vercel",
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="mt-6">
      <ScrollReveal>
        <div className="gh-section-heading">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.5 3.25c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 5.75 7.5h-2.5A1.75 1.75 0 0 1 1.5 5.75Zm7 0c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5A1.75 1.75 0 0 1 8.5 5.75Zm-7 7c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a1.75 1.75 0 0 1-1.75-1.75Zm7 0c0-.966.784-1.75 1.75-1.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a1.75 1.75 0 0 1-1.75-1.75Z" />
          </svg>
          Languages & Frameworks
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="flex flex-wrap gap-3 mb-8">
          {frameworks.map((tech) => (
            <div
              key={tech}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] hover:border-[var(--gh-text-secondary)] transition-colors text-sm"
            >
              <span
                className="lang-dot"
                style={{ backgroundColor: techColors[tech] || "#8b949e" }}
              />
              <span className="text-foreground font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <div className="gh-section-heading">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.122.392a1.75 1.75 0 0 1 1.756 0l5.003 2.902c.83.483.83 1.69 0 2.174L8.878 8.37a1.75 1.75 0 0 1-1.756 0L2.119 5.468a1.265 1.265 0 0 1 0-2.174ZM8.125 1.95a.25.25 0 0 0-.25 0l-4.63 2.685 4.63 2.685a.25.25 0 0 0 .25 0l4.63-2.685ZM1.81 7.078a.75.75 0 0 1 1.015-.309l5.05 2.93a.25.25 0 0 0 .25 0l5.05-2.93a.75.75 0 1 1 .71 1.322l-5.05 2.93a1.75 1.75 0 0 1-1.67 0l-5.05-2.93a.75.75 0 0 1-.31-1.013Zm0 3.2a.75.75 0 0 1 1.015-.309l5.05 2.93a.25.25 0 0 0 .25 0l5.05-2.93a.75.75 0 1 1 .71 1.322l-5.05 2.93a1.75 1.75 0 0 1-1.67 0l-5.05-2.93a.75.75 0 0 1-.31-1.013Z" />
          </svg>
          Tools & Collaboration
        </div>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <div className="flex flex-wrap gap-3">
          {tools.map((tool) => (
            <div
              key={tool}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] hover:border-[var(--gh-text-secondary)] transition-colors text-sm"
            >
              <span
                className="lang-dot"
                style={{ backgroundColor: techColors[tool] || "#8b949e" }}
              />
              <span className="text-foreground font-medium">{tool}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
