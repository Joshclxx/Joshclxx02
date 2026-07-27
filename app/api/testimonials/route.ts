import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isWithinSlidingWindowLog } from "@/utils/cacheUtils";
import { getClientIp, hashDeviceFingerprint } from "@/utils/clientCredentials";
import { sanitizeTestimonialInput } from "@/utils/sanitizer";

const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(100),
  roleOrCompany: z.string().trim().max(120).optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request format." }, { status: 415 });
  }

  const ip = getClientIp(req);
  const deviceHash = hashDeviceFingerprint(req);

  if (
    !isWithinSlidingWindowLog(`swl:testimonial:device:${deviceHash}`, 2, 300) ||
    !isWithinSlidingWindowLog(`swl:testimonial:ip:${ip}`, 4, 300) ||
    !isWithinSlidingWindowLog("swl:testimonial:global", 20, 300)
  ) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const body: unknown = await req.json();
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete the form correctly." },
        { status: 400 }
      );
    }

    const testimonial = sanitizeTestimonialInput(parsed.data);
    const { error } = await getSupabaseAdmin()
      .from("testimonials")
      .insert({ ...testimonial, approved: false });

    if (error) {
      console.error("[testimonials] Supabase insert failed", error.code);
      return NextResponse.json(
        { error: "Unable to submit your testimonial right now." },
        { status: 503 }
      );
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(
      "[testimonials] Submission failed",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Unable to submit your testimonial right now." },
      { status: 503 }
    );
  }
}
