import { NextResponse } from "next/server";
import { generateBlogPost } from "@/lib/gemini";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/generate-blog
 *
 * Triggered by Vercel Cron daily at 9:00 AM (Asia/Manila / UTC+8).
 * Generates a blog post via Gemini 2.0 Flash and inserts it into Supabase.
 *
 * Authentication: `Authorization: Bearer <CRON_SECRET>`
 */
export async function POST(request: Request) {
  try {
    /* ── 1. Authenticate ──────────────────────────────── */
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET is not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ── 2. Generate blog post via Gemini ──────────────── */
    const post = await generateBlogPost();
    const supabase = getSupabaseAdmin();

    /* ── 3. Handle slug collisions ────────────────────── */
    const { data: existingPost } = await supabase
      .from("blogs")
      .select("slug")
      .eq("slug", post.slug)
      .single();

    if (existingPost) {
      const dateSuffix = new Date().toISOString().split("T")[0];
      post.slug = `${post.slug}-${dateSuffix}`;
    }

    if (existingPost) {
      const { data: doubleCheck } = await supabase
        .from("blogs")
        .select("slug")
        .eq("slug", post.slug)
        .single();

      if (doubleCheck) {
        post.slug = `${post.slug}-${Date.now()}`;
      }
    }

    /* ── 4. Insert into Supabase ──────────────────────── */
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        tags: post.tags,
        cover_image: post.cover_image,
        published: true,
      })
      .select("id, title, slug")
      .single();

    if (error) {
      console.error("[generate-blog] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save blog post", details: error.message },
        { status: 500 }
      );
    }

    /* ── 5. Success ───────────────────────────────────── */
    return NextResponse.json({
      success: true,
      post: {
        id: data.id,
        title: data.title,
        slug: data.slug,
      },
    });
  } catch (err) {
    console.error("[generate-blog] Unhandled error:", err);

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";

    return NextResponse.json(
      { error: "Blog generation failed", details: message },
      { status: 500 }
    );
  }
}

/**
 * GET handler for Vercel Cron compatibility.
 * Vercel Cron sends GET requests, so we proxy to the POST handler.
 */
export async function GET(request: Request) {
  return POST(request);
}
