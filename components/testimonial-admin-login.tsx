"use client";

import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";

export function TestimonialAdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "Unable to sign in right now.";
        throw new Error(message);
      }

      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-md gh-card overflow-hidden">
        <div className="border-b border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LockKeyhole className="h-4 w-4 text-[var(--gh-accent-blue)]" />
            Testimonial manager
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-foreground">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm text-foreground focus:border-[var(--gh-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--gh-accent-blue)]"
            />
          </div>
          {error && <p role="alert" className="text-sm text-[var(--gh-accent-red)]">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="gh-btn gh-btn-primary w-full justify-center py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
