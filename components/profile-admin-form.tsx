"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioProfile } from "@/lib/types";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MediaUploadField } from "@/components/media-upload-field";

export function ProfileAdminForm({ initialProfile }: { initialProfile: PortfolioProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [darkImage, setDarkImage] = useState<File | null>(null);
  const [lightImage, setLightImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (patch: Partial<PortfolioProfile>) => setProfile((current) => ({ ...current, ...patch }));
  const moveFact = (index: number, direction: -1 | 1) => {
    const next = [...profile.quick_facts];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ quick_facts: next });
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const form = new FormData();
      form.set("payload", JSON.stringify({ display_name: profile.display_name, availability: profile.availability, experience_years: profile.experience_years, short_bio: profile.short_bio, about_markdown: profile.about_markdown, quick_facts: profile.quick_facts }));
      if (darkImage) form.set("darkImage", darkImage);
      if (lightImage) form.set("lightImage", lightImage);
      const response = await fetch("/api/admin/profile", { method: "POST", body: form });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Unable to save profile.");
      setDarkImage(null); setLightImage(null); toast.success("Profile updated."); window.location.reload();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Unable to save profile."); } finally { setBusy(false); }
  };

  return <form onSubmit={save} className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-medium text-foreground">Display name<input required maxLength={120} value={profile.display_name} onChange={(event) => update({ display_name: event.target.value })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><label className="block text-sm font-medium text-foreground">Experience years<input required type="number" min={0} max={100} value={profile.experience_years} onChange={(event) => update({ experience_years: Number(event.target.value) })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label></div><fieldset><legend className="mb-2 text-sm font-medium text-foreground">Availability</legend><div className="grid gap-2 sm:grid-cols-3">{(["available", "open_to_work", "unavailable"] as const).map((status) => <label key={status} className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${profile.availability === status ? "border-[var(--gh-accent-blue)] bg-[var(--gh-accent-blue)]/10" : "border-[var(--gh-border)]"}`}><input type="radio" name="availability" value={status} checked={profile.availability === status} onChange={() => update({ availability: status })} className="sr-only" />{status === "available" ? "Available" : status === "open_to_work" ? "Open to Work" : "Unavailable"}</label>)}</div></fieldset><div className="grid gap-4 md:grid-cols-2"><MediaUploadField label="Dark theme profile image" accept="image/jpeg,image/png,image/webp" currentUrl={profile.dark_image_url ?? profile.dark_image_path ?? undefined} onChange={setDarkImage} /><MediaUploadField label="Light theme profile image" accept="image/jpeg,image/png,image/webp" currentUrl={profile.light_image_url ?? profile.light_image_path ?? undefined} onChange={setLightImage} /></div><label className="block text-sm font-medium text-foreground">Short bio<textarea required maxLength={1000} rows={4} value={profile.short_bio} onChange={(event) => update({ short_bio: event.target.value })} className="mt-1 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /></label><MarkdownEditor label="About introduction" value={profile.about_markdown} onChange={(value) => update({ about_markdown: value })} rows={8} /><div><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-medium text-foreground">Quick Facts</h2><button type="button" onClick={() => update({ quick_facts: [...profile.quick_facts, "New fact"] })} className="gh-btn text-xs"><Plus className="h-3.5 w-3.5" /> Add fact</button></div><div className="space-y-2">{profile.quick_facts.map((fact, index) => <div key={`${index}-${fact}`} className="flex items-start gap-2"><span className="pt-2 text-[var(--gh-accent-green)]">▸</span><textarea required maxLength={500} rows={2} value={fact} onChange={(event) => update({ quick_facts: profile.quick_facts.map((current, currentIndex) => currentIndex === index ? event.target.value : current) })} className="min-w-0 flex-1 rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm" /><button type="button" aria-label={`Move fact ${index + 1} up`} onClick={() => moveFact(index, -1)} className="gh-btn p-2" disabled={index === 0}><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label={`Move fact ${index + 1} down`} onClick={() => moveFact(index, 1)} className="gh-btn p-2" disabled={index === profile.quick_facts.length - 1}><ArrowDown className="h-4 w-4" /></button><button type="button" aria-label={`Delete fact ${index + 1}`} onClick={() => update({ quick_facts: profile.quick_facts.filter((_, currentIndex) => currentIndex !== index) })} className="gh-btn p-2 text-[var(--gh-accent-red)]"><Trash2 className="h-4 w-4" /></button></div>)}</div></div><button type="submit" disabled={busy} className="gh-btn gh-btn-primary"><Save className="h-4 w-4" />{busy ? "Saving..." : "Save profile"}</button></form>;
}
