import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { IMAGE_BUCKET, MediaValidationError, objectPath, removeFile, uploadFile, validateUpload } from "@/lib/admin-media";

const profileSchema = z.object({
  display_name: z.string().trim().min(1).max(120),
  availability: z.enum(["available", "open_to_work", "unavailable"]),
  experience_years: z.number().int().min(0).max(100),
  short_bio: z.string().trim().min(1).max(1000),
  about_markdown: z.string().trim().min(1).max(8000),
  quick_facts: z.array(z.string().trim().min(1).max(500)).max(20),
});

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const uploaded: string[] = [];
  try {
    const form = await request.formData();
    const payload = JSON.parse(String(form.get("payload") ?? "")) as unknown;
    const parsed = profileSchema.safeParse(payload);
    if (!parsed.success) return NextResponse.json({ error: "Invalid profile details." }, { status: 400 });
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase.from("portfolio_profile").select("dark_image_path, light_image_path").eq("id", "default").maybeSingle();
    const dark = form.get("darkImage");
    const light = form.get("lightImage");
    let darkPath = (existing as { dark_image_path?: string | null } | null)?.dark_image_path ?? null;
    let lightPath = (existing as { light_image_path?: string | null } | null)?.light_image_path ?? null;
    if (dark instanceof File && dark.size > 0) { validateUpload(dark, "image"); darkPath = objectPath("profile", dark); await uploadFile(IMAGE_BUCKET, darkPath, dark); uploaded.push(darkPath); }
    if (light instanceof File && light.size > 0) { validateUpload(light, "image"); lightPath = objectPath("profile", light); await uploadFile(IMAGE_BUCKET, lightPath, light); uploaded.push(lightPath); }
    const { error } = await supabase.from("portfolio_profile").upsert({ id: "default", ...parsed.data, dark_image_path: darkPath, light_image_path: lightPath, updated_at: new Date().toISOString() });
    if (error) throw new Error("Unable to save profile.");
    if (darkPath !== (existing as { dark_image_path?: string | null } | null)?.dark_image_path) await removeFile(IMAGE_BUCKET, (existing as { dark_image_path?: string | null } | null)?.dark_image_path);
    if (lightPath !== (existing as { light_image_path?: string | null } | null)?.light_image_path) await removeFile(IMAGE_BUCKET, (existing as { light_image_path?: string | null } | null)?.light_image_path);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    await Promise.all(uploaded.map((path) => removeFile(IMAGE_BUCKET, path)));
    if (err instanceof MediaValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[portfolio-admin] Profile update failed", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Unable to save profile." }, { status: 503 });
  }
}
