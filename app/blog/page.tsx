import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/lib/types";
import { samplePosts } from "@/lib/sample-posts";

export const revalidate = 3600; // ISR: revalidate every hour

/* ── Gradient palettes for cover image placeholders ──── */
const CATEGORY_GRADIENTS = [
  "from-blue-600/20 via-cyan-500/10 to-purple-600/20",
  "from-emerald-600/20 via-teal-500/10 to-cyan-600/20",
  "from-orange-600/20 via-amber-500/10 to-yellow-600/20",
  "from-purple-600/20 via-pink-500/10 to-rose-600/20",
  "from-indigo-600/20 via-blue-500/10 to-violet-600/20",
  "from-rose-600/20 via-red-500/10 to-orange-600/20",
  "from-teal-600/20 via-emerald-500/10 to-green-600/20",
  "from-violet-600/20 via-purple-500/10 to-indigo-600/20",
];

function getGradient(index: number) {
  return CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];
}

/** Estimate reading time (average 200 wpm) */
function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Fetch published posts from Supabase, with sample fallback */
async function getPosts(): Promise<BlogPost[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Fallback to sample posts when Supabase is not configured
  if (!url || !key) {
    console.info("[blog] Supabase not configured — using sample posts");
    return samplePosts;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[blog] Failed to fetch posts:", error.message);
    return samplePosts; // Fallback to samples on error too
  }

  const posts = (data as BlogPost[]) ?? [];
  return posts.length > 0 ? posts : samplePosts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Hero Header ─────────────────────────────────── */}
      <header className="mb-10 sm:mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-[var(--gh-accent-green)] animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground tracking-wide uppercase">
            Latest posts
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
          JOSHCLXX BLOG
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Fresh insights on the developer ecosystem — trending tools, frameworks,
          best practices, and tech industry updates.
        </p>
      </header>

      {/* ── Posts Grid ───────────────────────────────────── */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gh-btn-bg)] border border-[var(--gh-border)] mb-4">
            <svg
              className="h-7 w-7 text-muted-foreground"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No posts yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            New posts are on the way.
            Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-card group"
              id={`blog-card-${post.slug}`}
            >
              {/* Gradient cover */}
              <div
                className={`h-24 md:h-28 xl:h-32 bg-gradient-to-br ${getGradient(index)} relative overflow-hidden`}
              >
                {/* Decorative grid pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, var(--gh-border) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                {/* Floating code decoration */}
                <div className="absolute bottom-2 right-2 font-mono text-[8px] xl:text-[10px] text-muted-foreground/40 leading-tight text-right hidden sm:block">
                  <div>{"{"}</div>
                  <div>&nbsp;&nbsp;&quot;dev&quot;: true,</div>
                  <div>&nbsp;&nbsp;&quot;fresh&quot;: true</div>
                  <div>{"}"}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-2.5 md:p-3 xl:p-4 flex flex-col flex-1">
                {/* Date + reading time */}
                <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-muted-foreground mb-1.5 md:mb-2">
                  <time dateTime={post.created_at}>
                    {format(new Date(post.created_at), "MMM d")}
                  </time>
                  <span>·</span>
                  <span>{getReadingTime(post.content)}m</span>
                </div>

                {/* Title */}
                <h2 className="text-sm md:text-base font-semibold text-foreground group-hover:text-[var(--gh-accent-blue)] transition-colors mb-1.5 md:mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h2>

                {/* Summary */}
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-2 md:mb-3 flex-1">
                  {post.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 md:gap-1.5 mt-auto">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="gh-badge text-[9px] md:text-[10px] py-0"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
