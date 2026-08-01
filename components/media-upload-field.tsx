"use client";

import { useEffect, useState } from "react";

export function MediaUploadField({ label, accept, currentUrl, onChange, required = false }: { label: string; accept: string; currentUrl?: string; onChange: (file: File | null) => void; required?: boolean }) {
  const [preview, setPreview] = useState(currentUrl);
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  const handleChange = (file: File | null) => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : currentUrl);
    onChange(file);
  };
  return <div><label className="mb-1 block text-sm font-medium text-foreground">{label}</label><div className="flex flex-col gap-3 rounded-md border border-dashed border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 sm:flex-row sm:items-center"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]">{preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-muted-foreground">None</span>}</div><div className="min-w-0"><input type="file" accept={accept} required={required && !preview} onChange={(event) => handleChange(event.target.files?.[0] ?? null)} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-[var(--gh-btn-bg)] file:px-3 file:py-1.5 file:text-sm file:text-foreground" /><p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, or WebP up to 5 MB.</p></div></div></div>;
}
