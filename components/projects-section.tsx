"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

const techColors: Record<string, string> = {
  "Next JS":          "#e6edf3",
  "TypeScript":       "#3178c6",
  "Tailwind CSS":     "#06b6d4",
  "Zustand":          "#433e38",
  "Vercel":           "#e6edf3",
  "Git":              "#f05032",
  "Webflow":          "#4353ff",
  "React":            "#61dafb",
  "React Native":     "#61dafb",
  "React Navigation": "#61dafb",
  "Expo":             "#8b949e",
};

const CARD_W = 300; // px + gap synced below
const CARD_GAP = 16;

const projects = [
  {
    title: "Web-Based POS System",
    description:
      "A modern web-based Point of Sale system featuring real-time inventory management, seamless payment integration, and an intuitive admin dashboard.",
    image: "/images/pos.png",
    technologies: ["Next JS", "TypeScript", "Tailwind CSS", "Zustand", "Vercel", "Git"],
    primaryLang: "TypeScript",
    liveUrl: "https://pos-system-git-josh-joshuas-projects-a95d0abd.vercel.app/login?redirect=%2F",
    githubUrl: "https://github.com/Joshclxx/POS-System",
    stars: 2,
  },
  {
    title: "Card Again",
    description:
      "Responsive e-commerce platform for Pokemon Cards focused on user dashboard, membership features, and smooth performance.",
    image: "/images/card-again.png",
    technologies: ["Webflow"],
    primaryLang: "Webflow",
    liveUrl: "https://cardagain-d79530.webflow.io/sign-in",
    stars: 1,
  },
  {
    title: "School Management System",
    description:
      "Frontend of a non-financial school management information system with responsive design and optimized performance.",
    image: "/images/sms.png",
    technologies: ["Next JS", "TypeScript", "Tailwind CSS", "Zustand", "Vercel", "Git"],
    primaryLang: "TypeScript",
    stars: 3,
  },
  {
    title: "Thrift Market Mobile App",
    description:
      "Frontend of a thrift market mobile application built with React Native, ensuring responsive design and optimized performance.",
    image: "/images/thrift.png",
    technologies: ["React Native", "TypeScript", "React Navigation", "Zustand", "Git", "Expo"],
    primaryLang: "TypeScript",
    stars: 1,
  },
  {
    title: "Palabooks",
    description:
      "Modern web app designed for discovering new stories and showcasing the creativity of emerging writers.",
    image: "/images/palabooks.png",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Git"],
    primaryLang: "TypeScript",
    stars: 2,
  },
];

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <article
      className="flex flex-col flex-shrink-0 overflow-hidden group
        border border-[var(--gh-border)] rounded-xl bg-[var(--gh-bg-secondary)]
        hover:border-[var(--gh-border-hover)] hover:-translate-y-1.5
        transition-all duration-300 ease-out"
      style={{ width: CARD_W, scrollSnapAlign: "start" }}
    >
      {/* Screenshot */}
      <div className="relative overflow-hidden" style={{ height: 164 }}>
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={600}
          height={300}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100
            group-hover:scale-105 transition-all duration-500 ease-out"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2
          bg-gradient-to-t from-[var(--gh-bg-secondary)] to-transparent pointer-events-none" />
        {/* Public badge */}
        <span className="absolute top-2.5 left-2.5 gh-badge text-[10px] py-0.5 px-2
          backdrop-blur-sm bg-[var(--gh-bg-secondary)]/70">
          Public
        </span>
        {/* Stars */}
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1
          text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-full
          bg-[var(--gh-bg-secondary)]/70 backdrop-blur-sm border border-[var(--gh-border)]">
          <svg className="h-2.5 w-2.5 text-yellow-400" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {project.stars}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2.5 p-3.5">
        {/* Title + lang */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="lang-dot w-2.5 h-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: techColors[project.primaryLang] || "#8b949e" }} />
          {project.githubUrl || project.liveUrl ? (
            <a href={project.githubUrl || project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="gh-link text-sm font-semibold truncate">{project.title}</a>
          ) : (
            <span className="text-sm font-semibold truncate text-foreground">{project.title}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map(t => (
            <span key={t}
              className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--gh-border)]
                text-muted-foreground bg-[var(--gh-btn-bg)]">
              {t}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--gh-border)]
              text-muted-foreground bg-[var(--gh-btn-bg)]">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--gh-border)] text-xs text-muted-foreground">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--gh-accent-blue)] transition-colors">
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5Zm5.22-.53L14 2.97v3.28a.75.75 0 0 0 1.5 0V1.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h3.28l-4.03 4.03a.75.75 0 0 0 1.06 1.06Z" />
              </svg>
              Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--gh-accent-blue)] transition-colors">
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [active, setActive]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX   = useRef(0);
  const dragScrollL  = useRef(0);

  /* ── Drag-to-scroll ── */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    dragStartX.current  = e.pageX;
    dragScrollL.current = scrollRef.current?.scrollLeft ?? 0;
  }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !scrollRef.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft = dragScrollL.current - (e.pageX - dragStartX.current);
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  /* ── Active dot from scroll ── */
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (CARD_W + CARD_GAP));
      setActive(Math.max(0, Math.min(idx, projects.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (idx: number) => {
    scrollRef.current?.scrollTo({ left: idx * (CARD_W + CARD_GAP), behavior: "smooth" });
  };
  const prev = () => scrollTo(Math.max(0, active - 1));
  const next = () => scrollTo(Math.min(projects.length - 1, active + 1));

  return (
    <section id="projects" className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="gh-section-heading text-base">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
          Pinned Repositories
          <span className="gh-counter">{projects.length}</span>
        </div>
        {/* Prev / Next */}
        <div className="flex items-center gap-1">
          <button onClick={prev} disabled={active === 0}
            className="p-1.5 rounded-md border border-[var(--gh-border)] text-muted-foreground
              hover:text-foreground hover:bg-[var(--gh-btn-bg)] disabled:opacity-30
              disabled:cursor-not-allowed transition-all"
            aria-label="Previous project">
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
            </svg>
          </button>
          <button onClick={next} disabled={active === projects.length - 1}
            className="p-1.5 rounded-md border border-[var(--gh-border)] text-muted-foreground
              hover:text-foreground hover:bg-[var(--gh-btn-bg)] disabled:opacity-30
              disabled:cursor-not-allowed transition-all"
            aria-label="Next project">
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll track — bleeds past container padding so cards reach the edge */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none
          bg-gradient-to-r from-background to-transparent" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none
          bg-gradient-to-l from-background to-transparent" />

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="flex select-none pb-3"
          style={{
            gap: CARD_GAP,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            cursor: dragging ? "grabbing" : "grab",
            WebkitOverflowScrolling: "touch",
            paddingLeft:  "1rem",
            paddingRight: "1rem",
          }}
        >
          {projects.map(p => <ProjectCard key={p.title} project={p} />)}
          {/* Trailing spacer so last card has right breathing room */}
          <div className="flex-shrink-0" style={{ width: 8 }} />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-3">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to project ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              height: 5,
              width: active === i ? 20 : 5,
              background: active === i ? "var(--gh-accent-blue)" : "var(--gh-border)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
