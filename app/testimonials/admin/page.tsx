import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isValidAdminSession, TESTIMONIAL_ADMIN_SESSION_COOKIE } from "@/lib/testimonial-admin-auth";
import type { Testimonial } from "@/lib/types";
import { TestimonialAdminDashboard } from "@/components/testimonial-admin-dashboard";
import { TestimonialAdminLogin } from "@/components/testimonial-admin-login";

export const dynamic = "force-dynamic";

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("testimonials")
      .select("id, name, role_or_company, rating, message, approved, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[testimonial-admin] Failed to fetch testimonials", error.code);
      return [];
    }

    return (data as Testimonial[] | null) ?? [];
  } catch (err: unknown) {
    console.error(
      "[testimonial-admin] Unable to fetch testimonials",
      err instanceof Error ? err.message : "Unknown error"
    );
    return [];
  }
}

export default async function TestimonialAdminPage() {
  const session = cookies().get(TESTIMONIAL_ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(session)) {
    return <TestimonialAdminLogin />;
  }

  const testimonials = await getTestimonials();
  return <TestimonialAdminDashboard initialTestimonials={testimonials} />;
}
