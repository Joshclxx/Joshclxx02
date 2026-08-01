import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { CREDENTIAL_BUCKET, IMAGE_BUCKET, MediaValidationError, objectPath, removeFile, uploadFile, validateUpload } from "@/lib/admin-media";

const achievementSchema = z.object({ title: z.string().trim().min(1).max(160), issuer: z.string().trim().min(1).max(160), issue_year: z.number().int().min(1900).max(2200), credential_type: z.enum(["upload", "external"]), external_url: z.string().url().startsWith("http").nullable() });

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!z.string().uuid().safeParse(context.params.id).success) return NextResponse.json({ error: "Invalid achievement." }, { status: 400 });
  const uploaded: Array<[string, string]> = [];
  try {
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase.from("achievements").select("*").eq("id", context.params.id).maybeSingle();
    if (!existing) return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
    if (request.headers.get("content-type")?.includes("application/json")) {
      const action = z.object({ action: z.enum(["archive", "restore", "delete"]), confirmationTitle: z.string().optional() }).safeParse(await request.json());
      if (!action.success) return NextResponse.json({ error: "Invalid achievement action." }, { status: 400 });
      if (action.data.action === "delete") {
        if (action.data.confirmationTitle !== existing.title) return NextResponse.json({ error: "Title confirmation does not match." }, { status: 400 });
        const { error } = await supabase.from("achievements").delete().eq("id", context.params.id); if (error) throw new Error("Unable to delete achievement.");
        await Promise.all([removeFile(IMAGE_BUCKET, existing.thumbnail_path as string), removeFile(CREDENTIAL_BUCKET, existing.credential_path as string | null)]);
      } else {
        const { error } = await supabase.from("achievements").update({ archived_at: action.data.action === "archive" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", context.params.id); if (error) throw new Error("Unable to update achievement.");
      }
      revalidatePath("/"); return NextResponse.json({ success: true });
    }
    const form = await request.formData();
    const parsed = achievementSchema.safeParse(JSON.parse(String(form.get("payload") ?? "")) as unknown);
    if (!parsed.success) return NextResponse.json({ error: "Invalid achievement details." }, { status: 400 });
    let thumbnailPath = existing.thumbnail_path as string;
    const thumbnail = form.get("thumbnail");
    if (thumbnail instanceof File && thumbnail.size > 0) { validateUpload(thumbnail, "image"); thumbnailPath = objectPath("achievements", thumbnail); await uploadFile(IMAGE_BUCKET, thumbnailPath, thumbnail); uploaded.push([IMAGE_BUCKET, thumbnailPath]); }
    let credentialPath: string | null = parsed.data.credential_type === "upload" ? existing.credential_path as string | null : null;
    const credential = form.get("credential");
    if (parsed.data.credential_type === "upload") {
      if (credential instanceof File && credential.size > 0) { validateUpload(credential, "credential"); credentialPath = objectPath("credentials", credential); await uploadFile(CREDENTIAL_BUCKET, credentialPath, credential); uploaded.push([CREDENTIAL_BUCKET, credentialPath]); }
      if (!credentialPath) throw new MediaValidationError("A credential file is required.");
    } else if (!parsed.data.external_url) throw new MediaValidationError("A credential URL is required.");
    const { error } = await supabase.from("achievements").update({ title: parsed.data.title, issuer: parsed.data.issuer, issue_year: parsed.data.issue_year, thumbnail_path: thumbnailPath, credential_type: parsed.data.credential_type, credential_path: credentialPath, external_url: parsed.data.credential_type === "external" ? parsed.data.external_url : null, updated_at: new Date().toISOString() }).eq("id", context.params.id);
    if (error) throw new Error("Unable to update achievement.");
    if (thumbnailPath !== existing.thumbnail_path) await removeFile(IMAGE_BUCKET, existing.thumbnail_path as string);
    if (credentialPath !== existing.credential_path) await removeFile(CREDENTIAL_BUCKET, existing.credential_path as string | null);
    revalidatePath("/"); return NextResponse.json({ success: true });
  } catch (err: unknown) {
    await Promise.all(uploaded.map(([bucket, path]) => removeFile(bucket, path)));
    if (err instanceof MediaValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[portfolio-admin] Achievement update failed", err instanceof Error ? err.message : "Unknown error"); return NextResponse.json({ error: "Unable to update achievement." }, { status: 503 });
  }
}
