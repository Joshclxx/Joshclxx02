"use client";

import { useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Testimonial } from "@/lib/types";

type ManageAction = "approve" | "hide" | "delete";

export function TestimonialAdminDashboard({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [busyId, setBusyId] = useState<string | null>(null);

  const manage = async (id: string, action: ManageAction) => {
    if (action === "delete" && !window.confirm("Delete this testimonial permanently?")) return;

    setBusyId(id);
    try {
      const response = await fetch("/api/testimonials/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "Unable to update the testimonial.";
        throw new Error(message);
      }

      if (action === "delete") {
        setTestimonials((current) => current.filter((testimonial) => testimonial.id !== id));
        toast.success("Testimonial deleted.");
      } else {
        setTestimonials((current) =>
          current.map((testimonial) =>
            testimonial.id === id ? { ...testimonial, approved: action === "approve" } : testimonial
          )
        );
        toast.success(action === "approve" ? "Testimonial approved." : "Testimonial hidden.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unable to update the testimonial.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section aria-labelledby="testimonial-manager-heading">
      <h2 id="testimonial-manager-heading" className="sr-only">Testimonial manager</h2>
        {testimonials.length === 0 ? (
          <div className="repo-card py-10 text-center text-sm text-muted-foreground">No testimonial submissions yet.</div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => {
              const busy = busyId === testimonial.id;
              return (
                <article key={testimonial.id} className="repo-card">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-foreground">{testimonial.name}</h2>
                        <span className={`gh-badge ${testimonial.approved ? "border-[var(--gh-accent-green)]/50 text-[var(--gh-accent-green)]" : ""}`}>
                          {testimonial.approved ? "Visible" : "Pending"}
                        </span>
                        <span className="text-xs text-muted-foreground">{testimonial.rating}/5 stars</span>
                      </div>
                      {testimonial.role_or_company && <p className="mt-1 text-xs text-muted-foreground">{testimonial.role_or_company}</p>}
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{testimonial.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {testimonial.approved ? (
                        <button type="button" onClick={() => manage(testimonial.id, "hide")} disabled={busy} className="gh-btn text-sm disabled:opacity-60">
                          <EyeOff className="h-4 w-4" /> Hide
                        </button>
                      ) : (
                        <button type="button" onClick={() => manage(testimonial.id, "approve")} disabled={busy} className="gh-btn gh-btn-primary text-sm disabled:opacity-60">
                          <Eye className="h-4 w-4" /> Approve
                        </button>
                      )}
                      <button type="button" onClick={() => manage(testimonial.id, "delete")} disabled={busy} className="gh-btn text-sm text-[var(--gh-accent-red)] disabled:opacity-60">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </section>
  );
}
