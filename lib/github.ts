// GitHub API data types and fetching utilities
// Uses the public GitHub API (no auth required for public data)

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  homepage: string | null;
  updated_at: string;
  pushed_at: string;
  created_at: string;
  size: number;
  topics: string[];
  fork: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    commits?: Array<{
      message: string;
      sha: string;
    }>;
  };
}

const GITHUB_USERNAME = "Joshclxx";
const GITHUB_API = "https://api.github.com";

/**
 * Fetch GitHub user profile
 */
export async function fetchGitHubUser(): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub user");
  return res.json();
}

/**
 * Fetch GitHub repos (sorted by most recently updated)
 */
export async function fetchGitHubRepos(count = 6): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=${count}&direction=desc`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  const repos: GitHubRepo[] = await res.json();
  // Filter out forks and sort by pushed_at
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
}

/**
 * Fetch recent GitHub events (activity feed)
 */
export async function fetchGitHubEvents(count = 10): Promise<GitHubEvent[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/events/public?per_page=${count}`,
    { next: { revalidate: 1800 } } // Cache for 30 mins
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub events");
  return res.json();
}

/**
 * GitHub language colors (from GitHub Linguist)
 */
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Vue: "#41b883",
  SCSS: "#c6538c",
  Dockerfile: "#384d54",
};

/**
 * Format a date string to "X ago" relative format
 */
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}
