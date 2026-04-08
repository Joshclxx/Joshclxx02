/**
 * Blog type definitions for the JOSHCLXX BLOG system.
 *
 * These types represent the Supabase `blogs` table schema and the
 * structured output from the content generation pipeline.
 */

/** Row shape returned from the Supabase `blogs` table. */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  cover_image: string | null;
  created_at: string;
  published: boolean;
}

/**
 * Structured content before it is persisted.
 * Excludes database-managed fields (id, created_at, published).
 */
export interface GeneratedBlogContent {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  cover_image: string | null;
}
