import { getSupabaseAdmin } from "@/lib/supabase";
import { CREDENTIAL_BUCKET, IMAGE_BUCKET, publicFileUrl } from "@/lib/admin-media";
import { DEFAULT_CONTENT_IMAGE_PATH, DEFAULT_PROFILE_DARK_IMAGE_PATH, DEFAULT_PROFILE_LIGHT_IMAGE_PATH } from "@/lib/portfolio-defaults";
import type { AvailabilityStatus, PortfolioAchievement, PortfolioProject, PortfolioProfile, ProjectTechnology } from "@/lib/types";

export const defaultPortfolioProfile: PortfolioProfile = {
  id: "default",
  display_name: "Joshua Colobong",
  availability: "available",
  experience_years: 1,
  short_bio: "Junior Frontend Developer specializing in fast, responsive, and user-centric web applications using React, Next.js, TypeScript, and Tailwind CSS. Focused on clean code, performance, and accessibility.",
  about_markdown: "I'm a junior frontend developer specializing in fast, responsive, and user-centric web applications using **React**, **Next.js**, **TypeScript**, and **Tailwind CSS** — focused on clean code, performance, and accessibility.\n\nBeyond the web, I also work with **React Native** for mobile development, **Godot Engine** for game development, and explore **AI Engineering** with multi-agent orchestration and prompt architecture.",
  quick_facts: [
    "Currently working as a **Software Engineer | Frontend Developer | Mobile App Developer**",
    "Core strengths: **Frontend Development**, **Mobile Apps** & **Responsive Design**",
    "Open to new opportunities and collaborations",
    "Ask me about `React` `Next.js` `React Native` `TypeScript`",
  ],
  dark_image_path: DEFAULT_PROFILE_DARK_IMAGE_PATH,
  light_image_path: DEFAULT_PROFILE_LIGHT_IMAGE_PATH,
  dark_image_url: DEFAULT_PROFILE_DARK_IMAGE_PATH,
  light_image_url: DEFAULT_PROFILE_LIGHT_IMAGE_PATH,
};

const isConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

function profileWithUrls(row: PortfolioProfile): PortfolioProfile {
  return { ...row, dark_image_url: publicFileUrl(IMAGE_BUCKET, row.dark_image_path) ?? DEFAULT_PROFILE_DARK_IMAGE_PATH, light_image_url: publicFileUrl(IMAGE_BUCKET, row.light_image_path) ?? DEFAULT_PROFILE_LIGHT_IMAGE_PATH };
}

function normalizeTechnologies(value: unknown): ProjectTechnology[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null || !("name" in item)) return [];
    const name = item.name;
    const color = "color" in item ? item.color : null;
    return typeof name === "string" && typeof color === "string" ? [{ name, color }] : [];
  });
}

function projectWithUrl(row: Omit<PortfolioProject, "image_url" | "technologies"> & { technologies: unknown }): PortfolioProject {
  return { ...row, technologies: normalizeTechnologies(row.technologies), image_url: publicFileUrl(IMAGE_BUCKET, row.image_path) ?? DEFAULT_CONTENT_IMAGE_PATH };
}

function achievementWithUrls(row: Omit<PortfolioAchievement, "thumbnail_url" | "credential_url">): PortfolioAchievement {
  return { ...row, thumbnail_url: publicFileUrl(IMAGE_BUCKET, row.thumbnail_path) ?? DEFAULT_CONTENT_IMAGE_PATH, credential_url: row.external_url ?? publicFileUrl(CREDENTIAL_BUCKET, row.credential_path) ?? "#" };
}

export async function getPortfolioProfile(): Promise<PortfolioProfile> {
  if (!isConfigured()) return defaultPortfolioProfile;
  try {
    const { data, error } = await getSupabaseAdmin().from("portfolio_profile").select("*").eq("id", "default").maybeSingle();
    return error || !data ? defaultPortfolioProfile : profileWithUrls(data as unknown as PortfolioProfile);
  } catch (err: unknown) {
    console.error("[portfolio] Profile read failed", err instanceof Error ? err.message : "Unknown error");
    return defaultPortfolioProfile;
  }
}

async function readProjects(includeArchived: boolean): Promise<PortfolioProject[]> {
  if (!isConfigured()) return [];
  try {
    let query = getSupabaseAdmin().from("projects").select("*").order("position", { ascending: true }).order("created_at", { ascending: true });
    if (!includeArchived) query = query.is("archived_at", null);
    const { data, error } = await query;
    return error ? [] : ((data ?? []) as unknown as Array<Omit<PortfolioProject, "image_url" | "technologies"> & { technologies: unknown }>).map(projectWithUrl);
  } catch (err: unknown) {
    console.error("[portfolio] Project read failed", err instanceof Error ? err.message : "Unknown error");
    return [];
  }
}

export const getVisibleProjects = () => readProjects(false);
export const getAllProjects = () => readProjects(true);

async function readAchievements(includeArchived: boolean): Promise<PortfolioAchievement[]> {
  if (!isConfigured()) return [];
  try {
    let query = getSupabaseAdmin().from("achievements").select("*").order("position", { ascending: true }).order("created_at", { ascending: true });
    if (!includeArchived) query = query.is("archived_at", null);
    const { data, error } = await query;
    return error ? [] : ((data ?? []) as unknown as PortfolioAchievement[]).map(achievementWithUrls);
  } catch (err: unknown) {
    console.error("[portfolio] Achievement read failed", err instanceof Error ? err.message : "Unknown error");
    return [];
  }
}

export const getVisibleAchievements = () => readAchievements(false);
export const getAllAchievements = () => readAchievements(true);

export const availabilityLabels: Record<AvailabilityStatus, string> = { available: "Available", open_to_work: "Open to Work", unavailable: "Unavailable" };
