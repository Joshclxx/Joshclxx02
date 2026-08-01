"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/media-upload-field";
import { DEFAULT_CONTENT_IMAGE_PATH } from "@/lib/portfolio-defaults";
import type { PortfolioProject, ProjectCategory, ProjectTechnology } from "@/lib/types";

const emptyProject = { title: "", description: "", category: "personal_project" as ProjectCategory, coming_soon: false, technologies: [] as ProjectTechnology[], live_url: "", code_url: "" };
const technologyPalette = ["#58a6ff", "#3fb950", "#bc8cff", "#d29922", "#f778ba", "#06b6d4", "#f85149"];

function defaultTechnologyColor(name: string): string {
  const hash = [...name].reduce((total, character) => total + character.charCodeAt(0), 0);
  return technologyPalette[hash % technologyPalette.length];
}

export function ProjectAdminForm({ initialProject, onSaved, onCancel }: { initialProject?: PortfolioProject; onSaved: () => void; onCancel?: () => void }) {
  const [project, setProject] = useState(initialProject ? { title: initialProject.title, description: initialProject.description, category: initialProject.category, coming_soon: initialProject.coming_soon, technologies: initialProject.technologies, live_url: initialProject.live_url ?? "", code_url: initialProject.code_url ?? "" } : emptyProject);
  const [image, setImage] = useState<File | null>(null);
  const [newTech, setNewTech] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (patch: Partial<typeof project>) => setProject((current) => ({ ...current, ...patch }));
  const addTech = () => { const name = newTech.trim(); if (!name || project.technologies.some((technology) => technology.name.toLowerCase() === name.toLowerCase())) return; update({ technologies: [...project.technologies, { name, color: defaultTechnologyColor(name) }] }); setNewTech(""); };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const form = new FormData();
      form.set("payload", JSON.stringify({ ...project, live_url: project.live_url || null, code_url: project.code_url || null }));
      if (image) form.set("image", image);
      const response = await fetch(initialProject ? `/api/admin/projects/${initialProject.id}` : "/api/admin/projects", { method: "POST", body: form });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Unable to save project.");
      toast.success(initialProject ? "Project updated." : "Project added."); onSaved();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Unable to save project."); } finally { setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-4 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">{initialProject ? "Edit project" : "Add project"}</h3>{onCancel && <button type="button" onClick={onCancel} className="gh-btn text-xs">Cancel</button>}</div><MediaUploadField label={initialProject ? "Project image (optional replacement)" : "Project image (optional — default profile image will be used)"} accept="image/jpeg,image/png,image/webp" currentUrl={initialProject?.image_url ?? DEFAULT_CONTENT_IMAGE_PATH} onChange={setImage} /><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-medium text-foreground">Title<input required maxLength={160} value={project.title} onChange={(event) => update({ title: event.target.value })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><label className="block text-sm font-medium text-foreground">Category<select value={project.category} onChange={(event) => update({ category: event.target.value as ProjectCategory })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm"><option value="work_experience">Work Experience</option><option value="personal_project">Personal Project</option></select></label></div><label className="block text-sm font-medium text-foreground">Description<textarea required maxLength={3000} rows={4} value={project.description} onChange={(event) => update({ description: event.target.value })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={project.coming_soon} onChange={(event) => update({ coming_soon: event.target.checked })} /> Coming Soon</label><div><p className="mb-2 text-sm font-medium text-foreground">Tech stack</p><div className="space-y-2">{project.technologies.map((technology, index) => <div key={`${technology.name}-${index}`} className="flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: technology.color }} /><input value={technology.name} onChange={(event) => update({ technologies: project.technologies.map((current, currentIndex) => currentIndex === index ? { ...current, name: event.target.value } : current) })} className="min-w-0 flex-1 rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2 py-1.5 text-sm" /><input type="color" aria-label={`Color for ${technology.name}`} value={technology.color} onChange={(event) => update({ technologies: project.technologies.map((current, currentIndex) => currentIndex === index ? { ...current, color: event.target.value } : current) })} className="h-8 w-10 rounded border border-[var(--gh-border)] bg-transparent" /><button type="button" aria-label={`Remove ${technology.name}`} onClick={() => update({ technologies: project.technologies.filter((_, currentIndex) => currentIndex !== index) })} className="gh-btn p-2 text-[var(--gh-accent-red)]"><Trash2 className="h-4 w-4" /></button></div>)}</div><div className="mt-2 flex gap-2"><input value={newTech} onChange={(event) => setNewTech(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTech(); } }} placeholder="Add technology" className="min-w-0 flex-1 rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /><button type="button" onClick={addTech} className="gh-btn text-sm"><Plus className="h-4 w-4" /> Add</button></div></div><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-medium text-foreground">Live URL<input type="url" value={project.live_url} onChange={(event) => update({ live_url: event.target.value })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><label className="block text-sm font-medium text-foreground">Code URL<input type="url" value={project.code_url} onChange={(event) => update({ code_url: event.target.value })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label></div><button type="submit" disabled={busy} className="gh-btn gh-btn-primary"><Save className="h-4 w-4" />{busy ? "Saving..." : "Save project"}</button></form>;
}
