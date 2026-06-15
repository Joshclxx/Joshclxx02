---
name: new-feature
argument: $ARG "Name of the feature to scaffold (e.g., testimonials-section, typing-game)"
---

# Scaffold New Feature

Create all files for a new feature in the portfolio.

## Steps

1. **Identify the feature type:**

   | Type | Location | Example |
   |---|---|---|
   | Portfolio section | `components/<name>-section.tsx` + add to `app/page.tsx` | testimonials |
   | Game | `app/play/<name>/page.tsx` + add to play index | typing-game |
   | Interactive widget | `components/<name>.tsx` | music-player |
   | API endpoint | `app/api/<name>/route.ts` | analytics |
   | Blog feature | `app/blog/<name>/` | categories |

2. **For a new portfolio section:**

   a. **Create component** — `components/$ARG-section.tsx`:
      ```typescript
      "use client";

      import { cn } from "@/lib/utils";

      export function ${PascalCase}Section() {
        return (
          <section className="py-3 sm:py-6 lg:py-8">
            {/* Section content */}
          </section>
        );
      }
      ```

   b. **Add to page** — Update `app/page.tsx`:
      ```typescript
      import { ${PascalCase}Section } from "@/components/$ARG-section";

      <SectionWrapper sectionId="$ARG">
        <${PascalCase}Section />
      </SectionWrapper>
      ```

   c. **Add navigation** — Update `components/navigation.tsx` if the section needs a nav link.

3. **For a new game:**

   a. **Create page** — `app/play/$ARG/page.tsx`:
      - Self-contained `"use client"` component with game logic
      - Include back link to `/play`
      - Must work on desktop (keyboard/mouse) and mobile (touch)
      - Handle game state with `useState`/`useReducer`

   b. **Add to play index** — Update `app/play/page.tsx` with a card linking to the new game.

4. **For a new API route:**

   a. **Create route** — `app/api/$ARG/route.ts`:
      ```typescript
      import { NextRequest, NextResponse } from "next/server";
      import { z } from "zod";

      const requestSchema = z.object({ /* ... */ });

      export async function POST(req: NextRequest) {
        try {
          const body = await req.json();
          const validated = requestSchema.parse(body);
          // Process...
          return NextResponse.json({ success: true, data: result });
        } catch (err: unknown) {
          return NextResponse.json(
            { success: false, error: "Request failed" },
            { status: 500 }
          );
        }
      }
      ```

5. **Verify:**
   ```bash
   yarn lint
   yarn build
   ```
