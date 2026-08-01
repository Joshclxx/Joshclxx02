import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { IMAGE_BUCKET, MediaValidationError, objectPath, removeFile, uploadFile, validateUpload } from "@/lib/admin-media";

const technologySchema = z.array(z.object({ name: z.string().trim().min(1).max(60), color: z.string().regex(/^#[0-9a-f]{6}$/i) })).max(20);
const projectSchema = z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(3000), category: z.enum(["work_experience", "personal_project"]), coming_soon: z.boolean(), technologies: technologySchema, live_url: z.string().url().startsWith("http").nullable(), code_url: z.string().url().startsWith("http").nullable() });

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let imagePath: string | null = null;
  try {
    const form = await request.formData();
    const parsed = projectSchema.safeParse(JSON.parse(String(form.get("payload") ?? "")) as unknown);
    const image = form.get("image");
    if (!parsed.success || !(image instanceof File) || image.size === 0) return NextResponse.json({ error: "Valid project details and an image are required." }, { status: 400 });
    validateUpload(image, "image");
    imagePath = objectPath("projects", image);
    await uploadFile(IMAGE_BUCKET, imagePath, image);
    const { data: last } = await getSupabaseAdmin().from("projects").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
    const { error } = await getSupabaseAdmin().from("projects").insert({ ...parsed.data, image_path: imagePath, position: (last?.position ?? -1) + 1 });
    if (error) throw new Error("Unable to save project.");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (imagePath) await removeFile(IMAGE_BUCKET, imagePath);
    if (err instanceof MediaValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[portfolio-admin] Project create failed", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Unable to save project." }, { status: 503 });
  }
}
