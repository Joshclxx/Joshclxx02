"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, Github, X, FolderGit2 } from "lucide-react";
import type { PortfolioProject } from "@/lib/types";

const categoryLabels = { work_experience: "Work Experience", personal_project: "Personal Project" } as const;

export function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(0, projects.length - 1)));
  }, [projects.length]);

  return (
    <section id="projects" className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="gh-section-heading text-base"><FolderGit2 className="h-4 w-4 text-muted-foreground" /> Pinned Repositories <span className="gh-counter">{projects.length}</span></div>
      </div>
      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
      {projects.length === 0 ? (
        <div className="repo-card border-dashed py-10 text-center"><FolderGit2 className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium text-foreground">Projects are on the way.</p><p className="mt-1 text-xs text-muted-foreground">Published projects will appear here.</p></div>
      ) : (
        <>
          <div className="hidden h-[420px] gap-2 sm:flex" role="tablist" aria-label="Project showcase" onKeyDown={(event) => { if (event.key === "ArrowRight") setActive((value) => Math.min(value + 1, projects.length - 1)); if (event.key === "ArrowLeft") setActive((value) => Math.max(value - 1, 0)); }} tabIndex={0}>
            {projects.map((project, index) => {
              const isActive = active === index;
              return <ProjectPanel key={project.id} project={project} active={isActive} onSelect={() => isActive ? setSelected(project) : setActive(index)} />;
            })}
          </div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:hidden">
            {projects.map((project) => <div key={project.id} className="min-w-[88vw] snap-center"><ProjectCard project={project} onSelect={() => setSelected(project)} /></div>)}
          </div>
          <div className="mt-4 flex justify-center gap-1.5" aria-label="Project selection">
            {projects.map((project, index) => <button type="button" key={project.id} onClick={() => setActive(index)} aria-label={`Go to project ${index + 1}`} className="rounded-full transition-all duration-300" style={{ height: 5, width: active === index ? 20 : 5, background: active === index ? "var(--gh-accent-blue)" : "var(--gh-border)" }} />)}
          </div>
        </>
      )}
    </section>
  );
}

function ProjectPanel({ project, active, onSelect }: { project: PortfolioProject; active: boolean; onSelect: () => void }) {
  return <button type="button" role="tab" aria-selected={active} aria-label={project.title} onClick={onSelect} className={`relative min-w-0 overflow-hidden rounded-2xl border text-left transition-all duration-500 ${active ? "flex-[4] border-[var(--gh-border-hover)]" : "flex-[0.5] border-[var(--gh-border)] hover:flex-[0.7]"}`}>
    <Image src={project.image_url} alt={project.title} fill className={`object-cover transition-all duration-700 ${active ? "scale-100 opacity-100" : "scale-110 opacity-50 brightness-50"}`} sizes={active ? "60vw" : "8vw"} />
    <div className="absolute inset-0" style={{ background: active ? "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.25) 50%, transparent 75%)" : "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.4))" }} />
    <ProjectBadges project={project} />
    {active ? <ProjectOverlay project={project} /> : <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-semibold uppercase tracking-wider text-white/80 [writing-mode:vertical-rl]">{project.title}</span></div>}
  </button>;
}

function ProjectCard({ project, onSelect }: { project: PortfolioProject; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} className="relative block h-[420px] w-full overflow-hidden rounded-2xl border border-[var(--gh-border)] text-left"><Image src={project.image_url} alt={project.title} fill className="object-cover" sizes="90vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" /><ProjectBadges project={project} /><ProjectOverlay project={project} /></button>;
}

function ProjectBadges({ project }: { project: PortfolioProject }) {
  return <><div className="absolute left-3 top-3 z-10"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${project.coming_soon ? "border-amber-500/30 bg-amber-500/20 text-amber-300" : "border-white/15 bg-white/10 text-white/80"}`}>{project.coming_soon ? "Coming Soon" : "Public"}</span></div><div className="absolute right-3 top-3 z-10"><span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">{categoryLabels[project.category]}</span></div></>;
}

function ProjectOverlay({ project }: { project: PortfolioProject }) {
  return <div className="absolute bottom-0 left-0 right-0 z-10 p-5"><h3 className="mb-1.5 text-lg font-bold leading-tight text-white">{project.title}</h3><p className="mb-3 line-clamp-2 max-w-md text-xs leading-relaxed text-white/70">{project.description}</p><div className="mb-3 flex flex-wrap gap-1.5">{project.technologies.slice(0, 4).map((technology) => <span key={technology.name} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: technology.color }} />{technology.name}</span>)}{project.technologies.length > 4 && <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-white/80">+{project.technologies.length - 4}</span>}</div><div className="flex items-center gap-3">{!project.coming_soon && project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-medium text-white"><ExternalLink className="h-3 w-3" /> Live</a>}{!project.coming_soon && project.code_url && <a href={project.code_url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-medium text-white"><Github className="h-3 w-3" /> Code</a>}</div></div>;
}

function ProjectDetailModal({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  useEffect(() => { const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; }; }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}><div role="dialog" aria-modal="true" aria-labelledby="project-detail-title" className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] shadow-2xl sm:rounded-2xl" onClick={(event) => event.stopPropagation()}><button type="button" onClick={onClose} aria-label="Close project details" className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/40 p-1.5 text-white/80"><X className="h-4 w-4" /></button><div className="relative aspect-video"><Image src={project.image_url} alt={project.title} fill className="rounded-t-2xl object-cover" sizes="(max-width: 640px) 100vw, 512px" /><div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--gh-bg)] to-transparent" /></div><div className="relative z-10 -mt-4 p-5"><div className="mb-3 flex flex-wrap gap-2"><span className="gh-badge">{project.coming_soon ? "Coming Soon" : "Public"}</span><span className="gh-badge">{categoryLabels[project.category]}</span></div><h3 id="project-detail-title" className="mb-2 text-xl font-bold text-foreground">{project.title}</h3><p className="mb-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p><h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Technologies</h4><div className="mb-4 flex flex-wrap gap-1.5">{project.technologies.map((technology) => <span key={technology.name} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-1 text-xs font-medium text-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: technology.color }} />{technology.name}</span>)}</div>{!project.coming_soon && (project.live_url || project.code_url) && <div className="flex gap-3">{project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="gh-btn gh-btn-primary flex-1 justify-center"><ExternalLink className="h-4 w-4" /> View Live</a>}{project.code_url && <a href={project.code_url} target="_blank" rel="noopener noreferrer" className="gh-btn flex-1 justify-center"><Github className="h-4 w-4" /> View Code</a>}</div>}</div></div></div>;
}
