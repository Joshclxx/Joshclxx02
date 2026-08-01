"use client";

import { useState } from "react";
import { SafeMarkdown } from "@/components/safe-markdown";

export function MarkdownEditor({ label, value, onChange, rows = 8 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  const [preview, setPreview] = useState(false);
  return <div><div className="mb-1 flex items-center justify-between gap-3"><label className="block text-sm font-medium text-foreground">{label}</label><div className="flex rounded-md border border-[var(--gh-border)] p-0.5 text-xs"><button type="button" onClick={() => setPreview(false)} className={`rounded px-2 py-1 ${!preview ? "bg-[var(--gh-btn-bg)] text-foreground" : "text-muted-foreground"}`}>Write</button><button type="button" onClick={() => setPreview(true)} className={`rounded px-2 py-1 ${preview ? "bg-[var(--gh-btn-bg)] text-foreground" : "text-muted-foreground"}`}>Preview</button></div></div>{preview ? <div className="min-h-[140px] rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-sm leading-relaxed text-muted-foreground"><SafeMarkdown source={value || "Nothing to preview yet."} className="space-y-3" /></div> : <textarea required value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm text-foreground focus:border-[var(--gh-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--gh-accent-blue)]" />}</div>;
}
