---
name: new-page
description: Scaffold a new page route in the portfolio site, following App Router conventions and existing patterns.
---

# Scaffold New Page — Joshclxx Portfolio

## Trigger
When creating a new page or section in the portfolio.

## Instructions

1. **Determine the page type:**

   | Type | Location | Example |
   |---|---|---|
   | Portfolio section | `app/page.tsx` (add to main page) | New section like certifications |
   | Standalone page | `app/<name>/page.tsx` | Blog, play games |
   | Game page | `app/play/<name>/page.tsx` | Memory, XOX, Sudoku, Chase |
   | API route | `app/api/<name>/route.ts` | Data endpoints |

2. **For a new portfolio section:**

   a. Create the component in `components/<name>-section.tsx`:
   ```typescript
   "use client";

   export function NameSection() {
     return (
       <section className="py-3 sm:py-6 lg:py-8">
         {/* Section content */}
       </section>
     );
   }
   ```

   b. Import and add to `app/page.tsx` inside the appropriate `<SectionWrapper>`:
   ```typescript
   import { NameSection } from "@/components/name-section";

   <SectionWrapper sectionId="name">
     <NameSection />
   </SectionWrapper>
   ```

   c. Add navigation entry in `components/navigation.tsx` if needed.

3. **For a new game page (`app/play/<name>/page.tsx`):**

   - Follow the pattern of existing games (memory, xox, sudoku, chase)
   - Self-contained page component with game logic
   - Add `"use client"` directive
   - Include a back link to `/play`
   - Add the game to the play index at `app/play/page.tsx`

4. **For a new API route:**

   - Create `app/api/<name>/route.ts`
   - Use Zod for request validation
   - Never expose secrets in responses
   - Follow Next.js App Router route handler conventions

5. **Verify:**
   ```bash
   yarn lint
   ```
