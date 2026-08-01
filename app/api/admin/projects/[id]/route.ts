import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { IMAGE_BUCKET, MediaValidationError, objectPath, removeFile, uploadFile, validateUpload } from "@/lib/admin-media";

const technologySchema = z.array(z.object({ name: z.string().trim().min(1).max(60), color: z.string().regex(/^#[0-9a-f]{6}$/i) })).max(20);
const projectSchema = z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(3000), category: z.enum(["work_experience", "personal_project"]), coming_soon: z.boolean(), technologies: technologySchema, live_url: z.string().url().startsWith("http").nullable(), code_url: z.string().url().startsWith("http").nullable() });
const paramsSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const params = paramsSchema.safeParse(context.params);
  if (!params.success) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  let uploadedPath: string | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase.from("projects").select("*").eq("id", params.data.id).maybeSingle();
    if (!existing) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = (await request.json()) as unknown;
      const action = z.object({ action: z.enum(["archive", "restore", "delete"]), confirmationTitle: z.string().optional() }).safeParse(body);
      if (!action.success) return NextResponse.json({ error: "Invalid project action." }, { status: 400 });
      if (action.data.action === "delete") {
        if (action.data.confirmationTitle !== existing.title) return NextResponse.json({ error: "Title confirmation does not match." }, { status: 400 });
        const { error } = await supabase.from("projects").delete().eq("id", params.data.id);
        if (error) throw new Error("Unable to delete project.");
        await removeFile(IMAGE_BUCKET, existing.image_path as string);
      } else {
        const { error } = await supabase.from("projects").update({ archived_at: action.data.action === "archive" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", params.data.id);
        if (error) throw new Error("Unable to update project.");
      }
      revalidatePath("/");
      return NextResponse.json({ success: true });
    }
    const form = await request.formData();
    const parsed = projectSchema.safeParse(JSON.parse(String(form.get("payload") ?? "")) as unknown);
    if (!parsed.success) return NextResponse.json({ error: "Invalid project details." }, { status: 400 });
    const image = form.get("image");
    let imagePath = existing.image_path as string;
    if (image instanceof File && image.size > 0) { validateUpload(image, "image"); uploadedPath = objectPath("projects", image); await uploadFile(IMAGE_BUCKET, uploadedPath, image); imagePath = uploadedPath; }
    const { error } = await supabase.from("projects").update({ ...parsed.data, image_path: imagePath, updated_at: new Date().toISOString() }).eq("id", params.data.id);
    if (error) throw new Error("Unable to update project.");
    if (uploadedPath) await removeFile(IMAGE_BUCKET, existing.image_path as string);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (uploadedPath) await removeFile(IMAGE_BUCKET, uploadedPath);
    if (err instanceof MediaValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[portfolio-admin] Project update failed", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Unable to update project." }, { status: 503 });
  }
}
