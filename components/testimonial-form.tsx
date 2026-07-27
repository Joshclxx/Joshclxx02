"use client";

import { useState, type FormEvent } from "react";
import { Send, Star } from "lucide-react";
import { toast } from "sonner";

const initialForm = {
  name: "",
  roleOrCompany: "",
  rating: 0,
  message: "",
};

export function TestimonialForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.rating) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "Unable to submit your testimonial right now.";
        throw new Error(message);
      }

      setForm(initialForm);
      toast.success("Thank you! Your testimonial has been submitted for review.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to submit your testimonial right now.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="testimonial-name" className="mb-1 block text-sm font-medium text-foreground">
            Your name
          </label>
          <input
            id="testimonial-name"
            name="name"
            required
            maxLength={100}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--gh-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--gh-accent-blue)]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="testimonial-role" className="mb-1 block text-sm font-medium text-foreground">
            Role or company <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="testimonial-role"
            name="roleOrCompany"
            maxLength={120}
            value={form.roleOrCompany}
            onChange={(event) => setForm({ ...form, roleOrCompany: event.target.value })}
            className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--gh-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--gh-accent-blue)]"
            placeholder="e.g. Founder, Acme Co."
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-foreground">Your rating</legend>
        <div className="flex items-center gap-1" role="radiogroup" aria-describedby="testimonial-rating-help">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-[var(--gh-accent-yellow)] focus-within:ring-2 focus-within:ring-[var(--gh-accent-blue)]">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={form.rating === rating}
                onChange={() => setForm({ ...form, rating })}
                className="sr-only"
              />
              <Star className={`h-6 w-6 ${rating <= form.rating ? "fill-current text-[var(--gh-accent-yellow)]" : ""}`} aria-hidden="true" />
              <span className="sr-only">{rating} star{rating === 1 ? "" : "s"}</span>
            </label>
          ))}
        </div>
        <p id="testimonial-rating-help" className="mt-1 text-xs text-muted-foreground">Select one to five stars.</p>
      </fieldset>

      <div>
        <label htmlFor="testimonial-message" className="mb-1 block text-sm font-medium text-foreground">
          Your testimonial
        </label>
        <textarea
          id="testimonial-message"
          name="message"
          required
          maxLength={2000}
          rows={6}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="w-full resize-none rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--gh-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--gh-accent-blue)]"
          placeholder="Share your experience working with Josh..."
        />
      </div>

      {error && <p role="alert" className="text-sm text-[var(--gh-accent-red)]">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="gh-btn gh-btn-primary w-full justify-center py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70">
        <Send className="h-4 w-4" />
        {isSubmitting ? "Submitting..." : "Submit testimonial"}
      </button>
      <p className="text-center text-xs text-muted-foreground" aria-live="polite">Testimonials are reviewed before appearing on the portfolio.</p>
    </form>
  );
}
