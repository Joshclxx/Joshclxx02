import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";
import { CREDENTIAL_BUCKET, IMAGE_BUCKET, MediaValidationError, objectPath, removeFile, uploadFile, validateUpload } from "@/lib/admin-media";
import { DEFAULT_CONTENT_IMAGE_PATH } from "@/lib/portfolio-defaults";

const achievementSchema = z.object({ title: z.string().trim().min(1).max(160), issuer: z.string().trim().min(1).max(160), issue_year: z.number().int().min(1900).max(2200), credential_type: z.enum(["upload", "external"]), external_url: z.string().url().startsWith("http").nullable() });

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const uploaded: Array<[string, string]> = [];
  try {
    const form = await request.formData();
    const parsed = achievementSchema.safeParse(JSON.parse(String(form.get("payload") ?? "")) as unknown);
    const thumbnail = form.get("thumbnail");
    const credential = form.get("credential");
    if (!parsed.success) return NextResponse.json({ error: "Valid achievement details are required." }, { status: 400 });
    let thumbnailPath = DEFAULT_CONTENT_IMAGE_PATH;
    if (thumbnail instanceof File && thumbnail.size > 0) {
      validateUpload(thumbnail, "image");
      thumbnailPath = objectPath("achievements", thumbnail);
      await uploadFile(IMAGE_BUCKET, thumbnailPath, thumbnail); uploaded.push([IMAGE_BUCKET, thumbnailPath]);
    }
    let credentialPath: string | null = null;
    if (parsed.data.credential_type === "upload") {
      if (!(credential instanceof File) || credential.size === 0) throw new MediaValidationError("A credential file is required.");
      validateUpload(credential, "credential"); credentialPath = objectPath("credentials", credential); await uploadFile(CREDENTIAL_BUCKET, credentialPath, credential); uploaded.push([CREDENTIAL_BUCKET, credentialPath]);
    } else if (!parsed.data.external_url) throw new MediaValidationError("A credential URL is required.");
    const { data: last } = await getSupabaseAdmin().from("achievements").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
    const { error } = await getSupabaseAdmin().from("achievements").insert({ title: parsed.data.title, issuer: parsed.data.issuer, issue_year: parsed.data.issue_year, thumbnail_path: thumbnailPath, credential_type: parsed.data.credential_type, credential_path: credentialPath, external_url: parsed.data.credential_type === "external" ? parsed.data.external_url : null, position: (last?.position ?? -1) + 1 });
    if (error) throw new Error("Unable to save achievement.");
    revalidatePath("/"); return NextResponse.json({ success: true });
  } catch (err: unknown) {
    await Promise.all(uploaded.map(([bucket, path]) => removeFile(bucket, path)));
    if (err instanceof MediaValidationError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[portfolio-admin] Achievement create failed", err instanceof Error ? err.message : "Unknown error"); return NextResponse.json({ error: "Unable to save achievement." }, { status: 503 });
  }
}
