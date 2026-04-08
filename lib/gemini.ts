import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeneratedBlogContent } from "./types";

/* ── Gemini Client (lazy init) ─────────────────────────── */

let _model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getModel() {
  if (_model) return _model;

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GEMINI_API_KEY — add it to .env.local");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  _model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  return _model;
}

/* ── Topic Categories (rotate daily) ───────────────────── */

const TOPIC_CATEGORIES = [
  {
    name: "Frameworks & Libraries",
    prompt:
      "Write about a trending web framework or library. Cover what makes it unique, its ecosystem, and why developers should care.",
  },
  {
    name: "Programming Languages",
    prompt:
      "Write about a programming language that's gaining traction or has had a notable update. Discuss new features, community growth, and real-world use cases.",
  },
  {
    name: "Developer Tools & DX",
    prompt:
      "Write about a developer tool, IDE extension, or CLI utility that improves developer experience. Explain the problem it solves and include practical tips.",
  },
  {
    name: "Productivity & Workflow",
    prompt:
      "Write about developer productivity: time management, focus techniques, efficient code review practices, or automation strategies that save hours.",
  },
  {
    name: "Dev Culture & Career",
    prompt:
      "Write about developer culture: open-source contributions, tech interviews, remote work, burnout prevention, or building a personal brand as a developer.",
  },
  {
    name: "AI & Machine Learning",
    prompt:
      "Write about AI/ML tools for developers: code assistants, model deployment, prompt engineering, or how AI is changing the software development lifecycle.",
  },
  {
    name: "Security & Best Practices",
    prompt:
      "Write about web security best practices: authentication patterns, common vulnerabilities, secure coding habits, or recent security incidents developers should learn from.",
  },
  {
    name: "Cloud & Infrastructure",
    prompt:
      "Write about cloud computing, serverless architecture, containerization, or infrastructure-as-code. Cover practical patterns for modern deployments.",
  },
  {
    name: "Open Source Spotlight",
    prompt:
      "Spotlight an interesting open-source project. Explain what it does, its architecture, how to contribute, and why it matters to the community.",
  },
  {
    name: "New Releases & Updates",
    prompt:
      "Cover a recent major release or update in the developer ecosystem. Discuss breaking changes, migration guides, and the impact on existing projects.",
  },
] as const;

/* ── Generation Logic ──────────────────────────────────── */

/**
 * Select today's topic category by rotating through the list
 * based on the day-of-year number.
 */
function getTodayCategory(): (typeof TOPIC_CATEGORIES)[number] {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return TOPIC_CATEGORIES[dayOfYear % TOPIC_CATEGORIES.length];
}

/**
 * Generate a complete blog post using Google Gemini 2.0 Flash.
 *
 * Returns a validated `GeneratedBlogContent` object ready for
 * database insertion.
 *
 * @throws {Error} If the Gemini API fails or returns invalid JSON.
 */
export async function generateBlogPost(): Promise<GeneratedBlogContent> {
  const model = getModel();
  const category = getTodayCategory();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const prompt = `You are a senior developer and tech writer. Today is ${today}.
Category: ${category.name}

${category.prompt}

Write a blog post targeting developers. The tone should be engaging, informative, and slightly opinionated. Include code snippets where relevant. The post should be 800-1200 words.

Respond ONLY with valid JSON matching this exact structure (no markdown code fences, no extra text):

{
  "title": "An engaging, specific title (not generic)",
  "slug": "url-friendly-slug-using-hyphens",
  "summary": "2-3 sentence summary that hooks the reader",
  "content": "Full markdown body with ## headings, code blocks, bullet points, and bold text where appropriate",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "cover_image": null
}

Rules:
- The slug must be lowercase, use hyphens, no special characters
- Tags should be lowercase, 3-5 tags maximum
- Content should use proper markdown: ## for headings, \`\`\` for code blocks, **bold**, *italic*, - for lists
- Do NOT wrap the JSON in markdown code fences
- Ensure the JSON is valid and parseable`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text().trim();

  // Strip markdown code fences if Gemini wraps them anyway
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: GeneratedBlogContent;

  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    throw new Error(
      `Failed to parse Gemini response as JSON: ${parseError instanceof Error ? parseError.message : "Unknown error"}\n\nRaw response:\n${text.slice(0, 500)}`
    );
  }

  // Validate required fields
  const requiredFields: (keyof GeneratedBlogContent)[] = [
    "title",
    "slug",
    "summary",
    "content",
    "tags",
  ];

  for (const field of requiredFields) {
    if (!parsed[field]) {
      throw new Error(`Generated blog post is missing required field: ${field}`);
    }
  }

  // Normalize slug: lowercase, hyphens only, no trailing hyphens
  parsed.slug = parsed.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // Ensure tags is an array
  if (!Array.isArray(parsed.tags)) {
    parsed.tags = [];
  }

  // Ensure cover_image is null if not provided
  if (!parsed.cover_image) {
    parsed.cover_image = null;
  }

  return parsed;
}
