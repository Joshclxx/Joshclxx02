"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioAchievement } from "@/lib/types";
import { MediaUploadField } from "@/components/media-upload-field";

export function AchievementAdminForm({ initialAchievement, onSaved, onCancel }: { initialAchievement?: PortfolioAchievement; onSaved: () => void; onCancel?: () => void }) {
  const [title, setTitle] = useState(initialAchievement?.title ?? "");
  const [issuer, setIssuer] = useState(initialAchievement?.issuer ?? "");
  const [year, setYear] = useState(String(initialAchievement?.issue_year ?? new Date().getFullYear()));
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [credential, setCredential] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState(initialAchievement?.external_url ?? "");
  const [source, setSource] = useState<"upload" | "external">(initialAchievement?.credential_type ?? "upload");
  const [busy, setBusy] = useState(false);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!initialAchievement && !thumbnail) { toast.error("Choose a thumbnail image."); return; }
    if (source === "upload" && !initialAchievement && !credential) { toast.error("Choose a credential file."); return; }
    if (source === "external" && !externalUrl) { toast.error("Enter a credential URL."); return; }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("payload", JSON.stringify({ title, issuer, issue_year: Number(year), credential_type: source, external_url: source === "external" ? externalUrl : null }));
      if (thumbnail) form.set("thumbnail", thumbnail);
      if (credential) form.set("credential", credential);
      const response = await fetch(initialAchievement ? `/api/admin/achievements/${initialAchievement.id}` : "/api/admin/achievements", { method: "POST", body: form });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Unable to save achievement.");
      toast.success(initialAchievement ? "Achievement updated." : "Achievement added."); onSaved();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Unable to save achievement."); } finally { setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-4 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">{initialAchievement ? "Edit achievement" : "Add achievement"}</h3>{onCancel && <button type="button" onClick={onCancel} className="gh-btn text-xs">Cancel</button>}</div><MediaUploadField label={initialAchievement ? "Thumbnail (optional replacement)" : "Thumbnail"} accept="image/jpeg,image/png,image/webp" currentUrl={initialAchievement?.thumbnail_url} onChange={setThumbnail} required={!initialAchievement} /><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-medium text-foreground">Title<input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><label className="block text-sm font-medium text-foreground">Issuer<input required maxLength={160} value={issuer} onChange={(event) => setIssuer(event.target.value)} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label></div><label className="block text-sm font-medium text-foreground">Year<input required type="number" min={1900} max={2200} value={year} onChange={(event) => setYear(event.target.value)} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><fieldset><legend className="mb-2 text-sm font-medium text-foreground">Credential source</legend><div className="flex gap-2"><label className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${source === "upload" ? "border-[var(--gh-accent-blue)] bg-[var(--gh-accent-blue)]/10" : "border-[var(--gh-border)]"}`}><input type="radio" className="sr-only" checked={source === "upload"} onChange={() => setSource("upload")} />Upload file</label><label className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${source === "external" ? "border-[var(--gh-accent-blue)] bg-[var(--gh-accent-blue)]/10" : "border-[var(--gh-border)]"}`}><input type="radio" className="sr-only" checked={source === "external"} onChange={() => setSource("external")} />External URL</label></div></fieldset>{source === "upload" ? <div><label className="mb-1 block text-sm font-medium text-foreground">Credential file{initialAchievement?.credential_type === "upload" ? " (optional replacement)" : ""}</label><input type="file" accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png" required={!initialAchievement || initialAchievement.credential_type !== "upload"} onChange={(event) => setCredential(event.target.files?.[0] ?? null)} className="block w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, JPEG, or PNG up to 10 MB.</p></div> : <label className="block text-sm font-medium text-foreground">Credential URL<input type="url" required value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label>}<button type="submit" disabled={busy} className="gh-btn gh-btn-primary"><Save className="h-4 w-4" />{busy ? "Saving..." : "Save achievement"}</button></form>;
}
