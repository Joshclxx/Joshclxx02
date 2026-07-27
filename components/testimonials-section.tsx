import { MessageSquareQuote, Star } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Testimonial } from "@/lib/types";
import { ScrollReveal } from "@/components/scroll-reveal";

async function getApprovedTestimonials(): Promise<Testimonial[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("testimonials")
      .select("id, name, role_or_company, rating, message, approved, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("[testimonials] Failed to fetch approved testimonials", error.code);
      return [];
    }

    return (data as Testimonial[] | null) ?? [];
  } catch (err: unknown) {
    console.error(
      "[testimonials] Unable to fetch approved testimonials",
      err instanceof Error ? err.message : "Unknown error"
    );
    return [];
  }
}

export async function TestimonialsSection() {
  const testimonials = await getApprovedTestimonials();

  return (
    <section id="testimonials" className="py-8">
      <ScrollReveal>
        <div className="gh-section-heading text-base">
          <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          Testimonials
        </div>
      </ScrollReveal>

      {testimonials.length === 0 ? (
        <ScrollReveal>
          <div className="repo-card border-dashed py-8 text-center">
            <MessageSquareQuote className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">Client feedback is on the way.</p>
            <p className="mt-1 text-xs text-muted-foreground">Approved testimonials will appear here.</p>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} delay={index * 80}>
              <article className="repo-card flex h-full flex-col">
                <div className="flex gap-0.5 text-[var(--gh-accent-yellow)]" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, rating) => (
                    <Star key={rating} className={`h-3.5 w-3.5 ${rating < testimonial.rating ? "fill-current" : "text-muted-foreground/40"}`} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{testimonial.message}&rdquo;</blockquote>
                <footer className="mt-4 border-t border-[var(--gh-border)] pt-3">
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  {testimonial.role_or_company && <p className="mt-0.5 text-xs text-muted-foreground">{testimonial.role_or_company}</p>}
                </footer>
              </article>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
