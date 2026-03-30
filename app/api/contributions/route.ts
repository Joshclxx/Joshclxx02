import { NextResponse } from "next/server";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/**
 * Fetches real contribution data by scraping GitHub's public contributions SVG.
 * GitHub exposes this at: https://github.com/users/{username}/contributions
 * Each <rect> in the SVG has data-count and data-date attributes.
 */
export async function GET() {
  try {
    const res = await fetch(
      "https://github.com/users/Joshclxx/contributions",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; portfolio/1.0)",
          Accept: "text/html",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub returned ${res.status}`);
    }

    const html = await res.text();

    // Extract all rect elements with data-count and data-date
    const rectRegex =
      /<rect[^>]*data-count="(\d+)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
    const days: ContributionDay[] = [];

    let match;
    while ((match = rectRegex.exec(html)) !== null) {
      const count = parseInt(match[1], 10);
      const date = match[2];

      // Map count → level (0-4) matching GitHub's thresholds
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 3) level = 1;
      else if (count <= 6) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;

      days.push({ date, count, level });
    }

    // Also extract the total contributions count from the heading
    const totalMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in\s+\d{4}/i);
    const total = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : null;

    if (days.length === 0) {
      throw new Error("No contribution data found in response");
    }

    return NextResponse.json({ days, total });
  } catch (err) {
    console.error("Failed to fetch GitHub contributions:", err);
    return NextResponse.json(
      { error: "Failed to fetch contributions", days: [], total: null },
      { status: 500 }
    );
  }
}
