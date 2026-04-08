import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import type { BlogPost } from "@/lib/types";
import { samplePosts } from "@/lib/sample-posts";
import { BlogContent } from "./blog-content";

export const revalidate = 3600; // ISR: revalidate every hour

/* ── Supabase Helper ───────────────────────────────────── */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabase();

  // Fallback to sample posts when Supabase is not configured
  if (!supabase) {
    return samplePosts.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    // Try sample posts as fallback
    return samplePosts.find((p) => p.slug === slug) ?? null;
  }
  return data as BlogPost;
}

/* ── Static Params ─────────────────────────────────────── */

export async function generateStaticParams() {
  const supabase = getSupabase();

  // Use sample slugs when Supabase is not configured
  if (!supabase) {
    return samplePosts.map((p) => ({ slug: p.slug }));
  }

  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("published", true);

  const slugs = (data ?? []).map((post) => ({ slug: post.slug }));
  if (slugs.length === 0) {
    return samplePosts.map((p) => ({ slug: p.slug }));
  }
  return slugs;
}

/* ── Metadata ──────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found — Joshclxx Blog" };
  }

  return {
    title: `${post.title} — Joshclxx Blog`,
    description: post.summary,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.created_at,
      tags: post.tags,
    },
  };
}

/* ── Reading Time ──────────────────────────────────────── */

function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ── Page Component ────────────────────────────────────── */

export default async function BlogDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.content);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Back Link ─────────────────────────────────── */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" />
        </svg>
        Back to Blog
      </Link>

      {/* ── Header ────────────────────────────────────── */}
      <header className="mb-8 pb-6 border-b border-[var(--gh-border)]">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 opacity-60"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z" />
            </svg>
            <time dateTime={post.created_at}>
              {format(new Date(post.created_at), "MMMM d, yyyy")}
            </time>
          </div>

          <span className="text-[var(--gh-border)]">·</span>

          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 opacity-60"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1h-1.25v1.532a7 7 0 1 1-3.5 0V1H4a.5.5 0 0 1 0-1h1.5ZM8 4a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 8 4Zm.5 5.5a.5.5 0 0 0-1 0V12a.5.5 0 0 0 1 0V9.5Z" />
            </svg>
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="gh-badge text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Markdown Content ──────────────────────────── */}
      <BlogContent content={post.content} />

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="mt-12 pt-6 border-t border-[var(--gh-border)]">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--gh-accent-blue)] hover:underline"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" />
            </svg>
            All Posts
          </Link>

          <span className="text-xs text-muted-foreground font-mono">
            joshclxx.dev
          </span>
        </div>
      </footer>
    </article>
  );
}
