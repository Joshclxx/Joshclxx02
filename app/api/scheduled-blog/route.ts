import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";

const scheduledBlogSchema = z.object({
  sourceId: z.string().trim().min(1),
  key: z.string().optional(),
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  content: z.string().trim().min(1),
  tags: z.array(z.string()),
});

export async function POST(request: Request) {
  const syncSecret = process.env.PORTFOLIO_SYNC_SECRET;
  const authorization = request.headers.get("authorization");

  if (!syncSecret) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (authorization !== `Bearer ${syncSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = scheduledBlogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const { sourceId, title, slug, summary, content, tags } = parsed.data;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("blogs")
      .upsert(
        {
          source_id: sourceId,
          title,
          slug,
          summary,
          content,
          tags,
          published: true,
          cover_image: null,
        },
        { onConflict: "source_id" }
      )
      .select("slug")
      .single();

    if (error) {
      console.error("[scheduled-blog] Supabase upsert error:", error.message);
      return NextResponse.json(
        { error: "Failed to save blog post" },
        { status: 500 }
      );
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json({
      post: {
        slug: data.slug,
        url: new URL(`/blog/${encodeURIComponent(data.slug)}`, siteUrl).toString(),
      },
    });
  } catch (err: unknown) {
    console.error("[scheduled-blog] Unhandled error:", err);
    return NextResponse.json(
      { error: "Failed to save blog post" },
      { status: 500 }
    );
  }
}
