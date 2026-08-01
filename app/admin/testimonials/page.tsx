import { getSupabaseAdmin } from "@/lib/supabase";
import type { Testimonial } from "@/lib/types";
import { TestimonialAdminDashboard } from "@/components/testimonial-admin-dashboard";

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await getSupabaseAdmin().from("testimonials").select("id, name, role_or_company, rating, message, approved, created_at").order("created_at", { ascending: false });
    if (error) return [];
    return (data as Testimonial[] | null) ?? [];
  } catch (err: unknown) {
    console.error("[testimonial-admin] Unable to fetch testimonials", err instanceof Error ? err.message : "Unknown error");
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  return <TestimonialAdminDashboard initialTestimonials={await getTestimonials()} />;
}
