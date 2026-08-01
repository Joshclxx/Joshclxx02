"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export function DeleteConfirmationDialog({ title, onConfirm, onClose, busy = false }: { title: string; onConfirm: () => void; onClose: () => void; busy?: boolean }) {
  const [confirmation, setConfirmation] = useState("");
  const matches = confirmation === title;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}><div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><AlertTriangle className="mb-3 h-6 w-6 text-[var(--gh-accent-red)]" /><h2 id="delete-title" className="text-lg font-semibold text-foreground">Delete permanently?</h2><p className="mt-1 text-sm text-muted-foreground">This cannot be undone. Type <strong className="text-foreground">{title}</strong> to confirm.</p></div><button type="button" aria-label="Close delete confirmation" onClick={onClose} className="gh-btn p-2"><X className="h-4 w-4" /></button></div><input autoFocus value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={title} className="mt-4 w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-2 text-sm text-foreground" /><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="gh-btn text-sm">Cancel</button><button type="button" disabled={!matches || busy} onClick={onConfirm} className="gh-btn text-sm text-[var(--gh-accent-red)] disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-4 w-4" />{busy ? "Deleting..." : "Delete permanently"}</button></div></div></div>;
}
