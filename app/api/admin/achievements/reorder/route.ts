import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const parsed = z.object({ ids: z.array(z.string().uuid()) }).safeParse(await request.json());
    if (!parsed.success || new Set(parsed.data.ids).size !== parsed.data.ids.length) return NextResponse.json({ error: "Invalid achievement order." }, { status: 400 });
    const { data: rows } = await getSupabaseAdmin().from("achievements").select("id");
    const existing = new Set((rows ?? []).map((row) => row.id as string));
    if (existing.size !== parsed.data.ids.length || parsed.data.ids.some((id) => !existing.has(id))) return NextResponse.json({ error: "Achievement order is stale." }, { status: 409 });
    const supabase = getSupabaseAdmin();
    for (const [position, id] of parsed.data.ids.entries()) {
      const { error } = await supabase.from("achievements").update({ position, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error("Unable to reorder achievements.");
    }
    revalidatePath("/"); return NextResponse.json({ success: true });
  } catch (err: unknown) { console.error("[portfolio-admin] Achievement reorder failed", err instanceof Error ? err.message : "Unknown error"); return NextResponse.json({ error: "Unable to reorder achievements." }, { status: 503 }); }
}
