"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

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
  "Node.js":          "#339933",
  "PostgreSQL":       "#4169e1",
};

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
      "A reading, writing, and earning platform that gives every reader and writer a direct share in the value they create.",
    image: "/images/palabooks.png",
    technologies: ["Next JS", "TypeScript", "Tailwind CSS", "Node.js", "Zustand"],
    primaryLang: "TypeScript",
    stars: 2,
  },
  {
    title: "SoundWave",
    description:
      "A modern music streaming and discovery platform built for seamless listening, playlist curation, and artist exploration.",
    image: "/images/soundwave.png",
    technologies: ["Next JS", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    primaryLang: "TypeScript",
    stars: 0,
    comingSoon: true,
  },
  {
    title: "Aura",
    description:
      "Your all-in-one mobile companion for health and wellness — track daily habits, practice mindfulness, and prioritize your well-being.",
    image: "/images/aura.png",
    technologies: ["React Native", "Expo"],
    primaryLang: "React Native",
    stars: 0,
    comingSoon: true,
  },
  {
    title: "Dokit",
    description:
      "An all-in-one toolkit built for developers, freelancers, students, and creators — bringing essential everyday tools into a single platform.",
    image: "/images/dokit_image.png",
    technologies: ["Next JS", "TypeScript", "Tailwind CSS"],
    primaryLang: "TypeScript",
    stars: 0,
    comingSoon: true,
  },
];

type Project = (typeof projects)[0];

export function ProjectsSection() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  /* ── Responsive: stack on mobile, accordion on desktop ── */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActive((p) => Math.min(p + 1, projects.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActive((p) => Math.max(p - 1, 0));
      }
    },
    []
  );

  return (
    <section id="projects" className="py-8">
      {/* Detail modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="gh-section-heading text-base">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
          Pinned Repositories
          <span className="gh-counter">{projects.length}</span>
        </div>
      </div>

      {/* ── Mobile: swipeable carousel ── */}
      {isMobile ? (
        <MobileCarousel active={active} setActive={setActive} onSelect={setSelectedProject} />
      ) : (
        /* ── Desktop: accordion carousel ── */
        <>
          <div
            className="accordion-carousel flex gap-2"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="tablist"
            aria-label="Project showcase"
            style={{ height: 420 }}
          >
            {projects.map((project, index) => {
              const isActive = active === index;
              return (
                <button
                  key={project.title}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={project.title}
                  onClick={() => {
                    if (isActive) setSelectedProject(project);
                    else setActive(index);
                  }}
                  className={`accordion-panel relative overflow-hidden rounded-2xl border
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gh-accent-blue)]
                    ${isActive
                      ? "flex-[4] border-[var(--gh-border-hover)]"
                      : "flex-[0.5] border-[var(--gh-border)] hover:flex-[0.7]"
                    }`}
                  style={{ minWidth: 0 }}
                >
                  {/* Background image */}
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className={`object-cover transition-all duration-700 ease-out
                      ${isActive ? "scale-100 opacity-100" : "scale-110 opacity-50 brightness-50"}`}
                    sizes={isActive ? "60vw" : "8vw"}
                    priority={index < 3}
                  />

                  {/* Dark overlay gradient — always present, stronger on inactive */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: isActive
                        ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
                    }}
                  />

                  {/* Top badge */}
                  <div className={`absolute top-3 left-3 z-10 transition-all duration-400
                    ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
                    {project.comingSoon ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                        bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Coming Soon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                        bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Stars badge — top right */}
                  {isActive && !project.comingSoon && project.stars > 0 && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full
                      text-[11px] font-medium bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm
                      transition-all duration-400">
                      <svg className="h-2.5 w-2.5 text-yellow-400" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                      </svg>
                      {project.stars}
                    </div>
                  )}

                  {/* Content overlay — only visible when active */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-5 z-10 text-left
                      transition-all duration-500 ease-out
                      ${isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                      }`}
                  >
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/70 leading-relaxed mb-3 line-clamp-2 max-w-md">
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full
                            bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm"
                        >
                          {t}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full
                          bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    {!project.comingSoon && (
                      <div className="flex items-center gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                              bg-white/15 text-white hover:bg-white/25 border border-white/20
                              backdrop-blur-sm transition-all duration-200"
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
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                              bg-white/15 text-white hover:bg-white/25 border border-white/20
                              backdrop-blur-sm transition-all duration-200"
                          >
                            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                            </svg>
                            Code
                          </a>
                        )}
                      </div>
                    )}
                    {project.comingSoon && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-300/80">
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
                        </svg>
                        In Development
                      </div>
                    )}
                  </div>

                  {/* Vertical title for inactive panels */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center z-10
                      transition-all duration-400
                      ${isActive ? "opacity-0" : "opacity-100"}`}
                  >
                    <span
                      className="text-xs font-semibold text-white/80 tracking-wider uppercase whitespace-nowrap"
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                      }}
                    >
                      {project.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-1.5 mt-4">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
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
        </>
      )}
    </section>
  );
}

/* ── Mobile carousel — swipeable image cards ── */
function MobileCarousel({
  active,
  setActive,
  onSelect,
}: {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  onSelect: (p: Project) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);

  const goTo = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(i, projects.length - 1))),
    [setActive]
  );

  /* Sync scroll position when active changes */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.offsetWidth;
    el.scrollTo({ left: active * cardW, behavior: "smooth" });
  }, [active]);

  /* Touch swipe handling */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchDelta.current < -50) goTo(active + 1);
    else if (touchDelta.current > 50) goTo(active - 1);
    touchDelta.current = 0;
  };

  /* Snap scroll detection fallback */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const cardW = el.offsetWidth;
        if (cardW > 0) {
          const idx = Math.round(el.scrollLeft / cardW);
          setActive(Math.max(0, Math.min(idx, projects.length - 1)));
        }
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [setActive]);

  return (
    <>
      <div className="relative">
        {/* Prev / Next arrows */}
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full
            bg-black/40 text-white/80 backdrop-blur-sm border border-white/10
            disabled:opacity-0 transition-all duration-200 hover:bg-black/60"
          aria-label="Previous project"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
          </svg>
        </button>
        <button
          onClick={() => goTo(active + 1)}
          disabled={active === projects.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full
            bg-black/40 text-white/80 backdrop-blur-sm border border-white/10
            disabled:opacity-0 transition-all duration-200 hover:bg-black/60"
          aria-label="Next project"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {projects.map((project) => (
            <div
              key={project.title}
              onClick={() => onSelect(project)}
              className="flex-shrink-0 w-full snap-center relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ height: 360 }}
            >
              {/* Background image */}
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                sizes="100vw"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
                }}
              />

              {/* Top badge */}
              <div className="absolute top-3 left-3 z-10">
                {project.comingSoon ? (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium
                    bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm"
                  >
                    <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Coming Soon
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium
                    bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm"
                  >
                    Public
                  </span>
                )}
              </div>

              {/* Stars */}
              {!project.comingSoon && project.stars > 0 && (
                <div
                  className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full
                  text-[11px] text-white/80 bg-white/10 border border-white/15 backdrop-blur-sm"
                >
                  <svg className="h-2.5 w-2.5 text-yellow-400" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {project.stars}
                </div>
              )}

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-base font-bold text-white mb-1.5">{project.title}</h3>
                <p className="text-xs text-white/65 leading-relaxed line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full
                      bg-white/10 text-white/75 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full
                      bg-white/10 text-white/75 border border-white/10"
                    >
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Links */}
                {!project.comingSoon && (
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                          bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-colors"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                          bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-colors"
                      >
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                        </svg>
                        Code
                      </a>
                    )}
                  </div>
                )}
                {project.comingSoon && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-300/80">
                    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
                    </svg>
                    In Development
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-4">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
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
    </>
  );
}

/* ── Project detail modal ── */
function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  /* Animate in on mount */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Escape to close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6
        transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className={`relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto
          bg-[var(--gh-bg)] border border-[var(--gh-border)]
          rounded-t-2xl sm:rounded-2xl shadow-2xl
          transition-all duration-300 ease-out
          ${visible ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full
            bg-black/40 text-white/80 backdrop-blur-sm border border-white/10
            hover:bg-black/60 transition-colors"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>

        {/* Full image */}
        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />
          {/* Gradient fade into content */}
          <div className="absolute inset-x-0 bottom-0 h-16
            bg-gradient-to-t from-[var(--gh-bg)] to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            {project.comingSoon ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
                </svg>
                Coming Soon
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium
                bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm">
                Public
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 -mt-4 relative z-10">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {project.description}
          </p>

          {/* All tech badges */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md
                    bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] text-foreground font-medium"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: techColors[t] || "#8b949e" }}
                  />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {!project.comingSoon && (project.liveUrl || project.githubUrl) && (
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-btn gh-btn-primary flex-1 justify-center text-sm py-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5Zm5.22-.53L14 2.97v3.28a.75.75 0 0 0 1.5 0V1.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h3.28l-4.03 4.03a.75.75 0 0 0 1.06 1.06Z" />
                  </svg>
                  View Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-btn flex-1 justify-center text-sm py-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                  </svg>
                  View Code
                </a>
              )}
            </div>
          )}
          {project.comingSoon && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg
              bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300/90">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" />
              </svg>
              This project is currently in development. Stay tuned!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

