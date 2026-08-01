import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminRequest, isSameOriginRequest } from "@/lib/admin-auth";

const manageSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["approve", "hide", "delete"]),
});

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request format." }, { status: 415 });
  }

  try {
    const parsed = manageSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid management request." }, { status: 400 });
    }

    const { action, id } = parsed.data;
    const supabase = getSupabaseAdmin();
    const { error } =
      action === "delete"
        ? await supabase.from("testimonials").delete().eq("id", id)
        : await supabase
            .from("testimonials")
            .update({ approved: action === "approve" })
            .eq("id", id);

    if (error) {
      console.error("[testimonial-admin] Update failed", error.code);
      return NextResponse.json({ error: "Unable to update the testimonial." }, { status: 503 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(
      "[testimonial-admin] Management request failed",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json({ error: "Unable to update the testimonial." }, { status: 503 });
  }
}
