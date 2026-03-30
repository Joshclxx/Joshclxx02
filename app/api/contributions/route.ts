import { NextResponse } from "next/server";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/**
 * Fetches real contribution data by scraping GitHub's public contributions page.
 * GitHub exposes this at: https://github.com/users/{username}/contributions
 * Each <td> has data-date and data-level attributes.
 * Contribution counts are in <tool-tip> elements: "X contributions on ..."
 */
export async function GET() {
  try {
    const res = await fetch(
      "https://github.com/users/Joshclxx/contributions",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; portfolio/1.0)",
          Accept: "text/html",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub returned ${res.status}`);
    }

    const html = await res.text();

    // Extract date + level from <td> elements with data-date and data-level
    const dateLevelMap = new Map<string, number>();
    const tdRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(html)) !== null) {
      dateLevelMap.set(tdMatch[1], parseInt(tdMatch[2], 10));
    }

    // Extract counts from <tool-tip> elements
    // Format: "3 contributions on April 6th." or "No contributions on March 30th."
    // Each tooltip is linked to a contribution-day-component via for="..."
    // We'll match each td's component ID to its tooltip to get counts
    const componentCountMap = new Map<string, number>();
    const tooltipRegex =
      /for="(contribution-day-component-[^"]*)"[^>]*>(?:(\d+)\s+contributions?|No contributions)/g;
    let tipMatch;
    while ((tipMatch = tooltipRegex.exec(html)) !== null) {
      const componentId = tipMatch[1];
      const count = tipMatch[2] ? parseInt(tipMatch[2], 10) : 0;
      componentCountMap.set(componentId, count);
    }

    // Extract the component ID → date mapping
    const componentDateMap = new Map<string, string>();
    const compRegex =
      /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]*)"/g;
    let compMatch;
    while ((compMatch = compRegex.exec(html)) !== null) {
      componentDateMap.set(compMatch[2], compMatch[1]);
    }

    // Build the final days array by joining component → date → count + level
    const days: ContributionDay[] = [];
    for (const [componentId, date] of componentDateMap) {
      const count = componentCountMap.get(componentId) ?? 0;
      const level = (dateLevelMap.get(date) ?? 0) as 0 | 1 | 2 | 3 | 4;
      days.push({ date, count, level });
    }

    // Sort by date
    days.sort((a, b) => a.date.localeCompare(b.date));

    // Fallback: if component matching failed, use level-based estimation
    if (days.length === 0 && dateLevelMap.size > 0) {
      for (const [date, level] of dateLevelMap) {
        const estimatedCount = [0, 2, 5, 8, 12][level] || 0;
        days.push({
          date,
          count: estimatedCount,
          level: level as 0 | 1 | 2 | 3 | 4,
        });
      }
      days.sort((a, b) => a.date.localeCompare(b.date));
    }

    // Extract total contributions from the heading
    const totalMatch = html.match(
      /(\d[\d,]*)\s+contributions?\s+in\s+the\s+last/i
    );
    const total = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : null;

    if (days.length === 0) {
      throw new Error("No contribution data found in response");
    }

    return NextResponse.json({ days, total });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to fetch GitHub contributions:", message);
    return NextResponse.json(
      { error: "Failed to fetch contributions", days: [], total: null },
      { status: 500 }
    );
  }
}
