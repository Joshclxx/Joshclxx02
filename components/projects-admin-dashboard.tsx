"use client";

import { useState } from "react";
import { Archive, ArrowDown, ArrowUp, Edit3, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioProject } from "@/lib/types";
import { ProjectAdminForm } from "@/components/project-admin-form";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export function ProjectsAdminDashboard({ initialProjects }: { initialProjects: PortfolioProject[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [deleting, setDeleting] = useState<PortfolioProject | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const refresh = () => window.location.reload();
  const action = async (project: PortfolioProject, kind: "archive" | "restore" | "delete") => {
    setBusy(project.id);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(kind === "delete" ? { action: kind, confirmationTitle: project.title } : { action: kind }) });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Unable to update project.");
      toast.success(kind === "archive" ? "Project archived." : kind === "restore" ? "Project restored." : "Project deleted.");
      if (kind === "delete") setProjects((current) => current.filter((item) => item.id !== project.id)); else setProjects((current) => current.map((item) => item.id === project.id ? { ...item, archived_at: kind === "archive" ? new Date().toISOString() : null } : item));
      setDeleting(null);
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Unable to update project."); } finally { setBusy(null); }
  };
  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction; if (target < 0 || target >= projects.length) return;
    const next = [...projects]; [next[index], next[target]] = [next[target], next[index]]; setProjects(next);
    const response = await fetch("/api/admin/projects/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((project) => project.id) }) });
    if (!response.ok) { toast.error("Unable to reorder projects."); refresh(); }
  };
  return <section aria-labelledby="projects-admin-heading"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="projects-admin-heading" className="text-xl font-semibold text-foreground">Projects</h2><p className="mt-1 text-sm text-muted-foreground">Manage the projects displayed in your portfolio.</p></div><button type="button" onClick={() => setEditing("new")} className="gh-btn gh-btn-primary text-sm"><Plus className="h-4 w-4" /> Add project</button></div>{editing === "new" && <div className="mb-5"><ProjectAdminForm onSaved={refresh} onCancel={() => setEditing(null)} /></div>}{projects.length === 0 ? <div className="repo-card border-dashed py-10 text-center text-sm text-muted-foreground">No projects yet. Add your first project.</div> : <div className="space-y-3">{projects.map((project, index) => <article key={project.id} className={`repo-card ${project.archived_at ? "opacity-70" : ""}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><img src={project.image_url} alt="" className="h-20 w-28 rounded-md object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-foreground">{project.title}</h3><span className="gh-badge">{project.archived_at ? "Archived" : project.coming_soon ? "Coming Soon" : "Public"}</span></div><p className="mt-1 text-xs text-muted-foreground">{project.category === "work_experience" ? "Work Experience" : "Personal Project"} · {project.technologies.map((technology) => technology.name).join(", ") || "No technologies"}</p><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" aria-label={`Move ${project.title} up`} disabled={index === 0} onClick={() => move(index, -1)} className="gh-btn p-2"><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label={`Move ${project.title} down`} disabled={index === projects.length - 1} onClick={() => move(index, 1)} className="gh-btn p-2"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => setEditing(project.id)} className="gh-btn p-2" aria-label={`Edit ${project.title}`}><Edit3 className="h-4 w-4" /></button>{project.archived_at ? <button type="button" disabled={busy === project.id} onClick={() => action(project, "restore")} className="gh-btn p-2" aria-label={`Restore ${project.title}`}><RotateCcw className="h-4 w-4" /></button> : <button type="button" disabled={busy === project.id} onClick={() => action(project, "archive")} className="gh-btn p-2" aria-label={`Archive ${project.title}`}><Archive className="h-4 w-4" /></button>}<button type="button" disabled={busy === project.id} onClick={() => setDeleting(project)} className="gh-btn p-2 text-[var(--gh-accent-red)]" aria-label={`Delete ${project.title}`}><Trash2 className="h-4 w-4" /></button></div></div>{editing === project.id && <div className="mt-4"><ProjectAdminForm initialProject={project} onSaved={refresh} onCancel={() => setEditing(null)} /></div>}</article>)}</div>}{deleting && <DeleteConfirmationDialog title={deleting.title} busy={busy === deleting.id} onClose={() => setDeleting(null)} onConfirm={() => action(deleting, "delete")} />}</section>;
}
