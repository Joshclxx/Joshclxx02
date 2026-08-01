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

/** A publicly displayable testimonial row from Supabase. */
export interface Testimonial {
  id: string;
  name: string;
  role_or_company: string | null;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

/** Fields accepted from the private testimonial submission form. */
export interface TestimonialSubmission {
  name: string;
  roleOrCompany?: string;
  rating: number;
  message: string;
}

export type AvailabilityStatus = "available" | "open_to_work" | "unavailable";
export type ProjectCategory = "work_experience" | "personal_project";

export interface PortfolioProfile {
  id: "default";
  display_name: string;
  availability: AvailabilityStatus;
  experience_years: number;
  short_bio: string;
  about_markdown: string;
  quick_facts: string[];
  dark_image_path: string | null;
  light_image_path: string | null;
  updated_at?: string;
  dark_image_url?: string;
  light_image_url?: string;
}

export interface ProjectTechnology {
  name: string;
  color: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image_path: string;
  image_url: string;
  category: ProjectCategory;
  coming_soon: boolean;
  technologies: ProjectTechnology[];
  live_url: string | null;
  code_url: string | null;
  position: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AchievementCredentialType = "upload" | "external";

export interface PortfolioAchievement {
  id: string;
  title: string;
  issuer: string;
  issue_year: number;
  thumbnail_path: string;
  thumbnail_url: string;
  credential_type: AchievementCredentialType;
  credential_path: string | null;
  external_url: string | null;
  credential_url: string;
  position: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}
