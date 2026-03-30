import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";

const techColors: Record<string, string> = {
  "Next JS":       "#e6edf3",
  "TypeScript":    "#3178c6",
  "Tailwind CSS":  "#06b6d4",
  "Zustand":       "#433e38",
  "Vercel":        "#e6edf3",
  "Git":           "#f05032",
  "Webflow":       "#4353ff",
  "React":         "#61dafb",
  "React Native":  "#61dafb",
  "React Navigation": "#61dafb",
  "Expo":          "#000020",
};

const projects = [
  {
    title: "Web-Based POS System",
    description:
      "A modern web-based Point of Sale (POS) system built with Next.js, featuring real-time inventory management, seamless payment integration, and an intuitive admin dashboard.",
    image: "/images/pos.png",
    technologies: [
      "Next JS",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Vercel",
      "Git",
    ],
    primaryLang: "TypeScript",
    liveUrl:
      "https://pos-system-git-josh-joshuas-projects-a95d0abd.vercel.app/login?redirect=%2F",
    githubUrl: "https://github.com/Joshclxx/POS-System",
    stars: 2,
  },
  {
    title: "Card Again",
    description:
      "Teamed up to build a responsive e-commerce platform for Pokemon Cards, focusing on user dashboard, membership features, and performance.",
    image: "/images/card-again.png",
    technologies: ["Webflow"],
    primaryLang: "Webflow",
    liveUrl: "https://cardagain-d79530.webflow.io/sign-in",
    stars: 1,
  },
  {
    title: "School Management System",
    description:
      "Built the frontend of a non-financial school management information system, ensuring responsive design and optimized performance.",
    image: "/images/sms.png",
    technologies: [
      "Next JS",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Vercel",
      "Git",
    ],
    primaryLang: "TypeScript",
    stars: 3,
  },
  {
    title: "Thrift Market Mobile App",
    description:
      "Built the frontend of a thrift market mobile application, ensuring responsive design and optimized performance.",
    image: "/images/thrift.png",
    technologies: [
      "React Native",
      "TypeScript",
      "React Navigation",
      "Zustand",
      "Git",
      "Expo",
    ],
    primaryLang: "TypeScript",
    stars: 1,
  },
  {
    title: "Palabooks",
    description:
      "Palabooks is a modern web app designed for discovering new stories and showcasing the creativity of emerging writers.",
    image: "/images/palabooks.png",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Git"],
    primaryLang: "TypeScript",
    stars: 2,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-8">
      {/* Section header — GitHub style */}
      <ScrollReveal>
        <div className="gh-section-heading text-base">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
          Pinned Repositories
          <span className="gh-counter">{projects.length}</span>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <ScrollReveal key={project.title} delay={index * 80}>
            <div className="repo-card flex flex-col" style={{ height: '268px' }}>
              {/* Repo header */}
              <div className="flex items-start gap-2 flex-shrink-0">
                <svg className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.githubUrl || project.liveUrl ? (
                      <a
                        href={project.githubUrl || project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gh-link text-sm font-semibold truncate"
                      >
                        {project.title}
                      </a>
                    ) : (
                      <span className="gh-link text-sm font-semibold truncate">
                        {project.title}
                      </span>
                    )}
                    <span className="gh-badge text-[10px] py-0">Public</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-shrink-0">
                {project.description}
              </p>

              {/* Preview image — fills remaining space */}
              <div className="relative overflow-hidden rounded-md border border-[var(--gh-border)] mt-1 flex-1 min-h-0">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={600}
                  height={300}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              {/* Footer — language + stars */}
              <div className="flex items-center gap-4 mt-auto pt-2 text-xs text-muted-foreground flex-shrink-0">
                <span className="flex items-center gap-1.5">
                  <span
                    className="lang-dot w-3 h-3"
                    style={{ backgroundColor: techColors[project.primaryLang] || "#8b949e" }}
                  />
                  {project.primaryLang}
                </span>

                {/* Star count (decorative) */}
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {project.stars}
                </span>

                {/* Links */}
                <div className="flex items-center gap-2 ml-auto">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--gh-accent-blue)] transition-colors flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5Zm5.22-.53L14 2.97v3.28a.75.75 0 0 0 1.5 0V1.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h3.28l-4.03 4.03a.75.75 0 0 0 1.06 1.06Z" />
                      </svg>
                      Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--gh-accent-blue)] transition-colors flex items-center gap-1"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                      </svg>
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
