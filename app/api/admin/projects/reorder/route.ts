import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const parsed = z.object({ ids: z.array(z.string().uuid()).min(0) }).safeParse(await request.json());
    if (!parsed.success || new Set(parsed.data.ids).size !== parsed.data.ids.length) return NextResponse.json({ error: "Invalid project order." }, { status: 400 });
    const { data: rows } = await getSupabaseAdmin().from("projects").select("id");
    const existing = new Set((rows ?? []).map((row) => row.id as string));
    if (existing.size !== parsed.data.ids.length || parsed.data.ids.some((id) => !existing.has(id))) return NextResponse.json({ error: "Project order is stale." }, { status: 409 });
    const supabase = getSupabaseAdmin();
    for (const [position, id] of parsed.data.ids.entries()) {
      const { error } = await supabase.from("projects").update({ position, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error("Unable to reorder projects.");
    }
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) { console.error("[portfolio-admin] Project reorder failed", err instanceof Error ? err.message : "Unknown error"); return NextResponse.json({ error: "Unable to reorder projects." }, { status: 503 }); }
}
