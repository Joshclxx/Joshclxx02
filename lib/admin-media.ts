import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export const IMAGE_BUCKET = "portfolio-images";
export const CREDENTIAL_BUCKET = "portfolio-credentials";

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CREDENTIAL_MIME_TYPES = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"]);
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const CREDENTIAL_EXTENSIONS = new Set(["pdf", "docx", "jpg", "jpeg", "png"]);

export class MediaValidationError extends Error {}

function extensionOf(file: File): string {
  const name = file.name.toLowerCase();
  return name.includes(".") ? name.split(".").pop() ?? "" : "";
}

export function validateUpload(file: File, kind: "image" | "credential"): void {
  const maxBytes = kind === "image" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  const mimeTypes = kind === "image" ? IMAGE_MIME_TYPES : CREDENTIAL_MIME_TYPES;
  const extensions = kind === "image" ? IMAGE_EXTENSIONS : CREDENTIAL_EXTENSIONS;
  if (file.size <= 0 || file.size > maxBytes) throw new MediaValidationError(`The ${kind} file must be smaller than ${kind === "image" ? "5 MB" : "10 MB"}.`);
  if (!mimeTypes.has(file.type) || !extensions.has(extensionOf(file))) throw new MediaValidationError(`This ${kind} file type is not supported.`);
}

export function objectPath(prefix: string, file: File): string {
  return `${prefix}/${randomUUID()}.${extensionOf(file)}`;
}

export async function uploadFile(bucket: string, path: string, file: File): Promise<void> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await getSupabaseAdmin().storage.from(bucket).upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error("Unable to store the uploaded file.");
}

export async function removeFile(bucket: string, path: string | null | undefined): Promise<void> {
  if (!path || path.startsWith("/")) return;
  const ownedPath = bucket === IMAGE_BUCKET
    ? /^(profile|projects|achievements)\/[a-f0-9-]+\.[a-z0-9]+$/i.test(path)
    : bucket === CREDENTIAL_BUCKET
      ? /^credentials\/[a-f0-9-]+\.[a-z0-9]+$/i.test(path)
      : false;
  if (!ownedPath) {
    console.error("[portfolio-media] Refusing to remove an unowned path");
    return;
  }
  const { error } = await getSupabaseAdmin().storage.from(bucket).remove([path]);
  if (error) console.error("[portfolio-media] Cleanup failed", error.message);
}

export function publicFileUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  return getSupabaseAdmin().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
