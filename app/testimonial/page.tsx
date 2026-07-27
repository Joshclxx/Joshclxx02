import type { Metadata } from "next";
import { MessageSquareQuote } from "lucide-react";
import { TestimonialForm } from "@/components/testimonial-form";

export const metadata: Metadata = {
  title: "Leave a Testimonial | Joshclxx",
  description: "Share your experience working with Joshclxx.",
  robots: { index: false, follow: false },
};

export default function TestimonialPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="gh-card overflow-hidden">
          <div className="border-b border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageSquareQuote className="h-5 w-5 text-[var(--gh-accent-blue)]" />
              Share your feedback
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Leave a testimonial</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">Your feedback is appreciated. Submitted testimonials are reviewed before they appear on the portfolio.</p>
            <div className="mt-7">
              <TestimonialForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
