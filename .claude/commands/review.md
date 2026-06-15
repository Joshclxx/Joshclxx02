---
name: review
argument: $ARG "Optional: number of commits to review (default: 1)"
---

# Full Code Review

Run a comprehensive code review against portfolio project conventions.

## Steps

1. Show changed files:
   ```bash
   git diff HEAD~${ARG:-1} --stat
   ```

2. For each changed file, check against these rules:

   **TypeScript:**
   - No `any` usage
   - `catch (err: unknown)` on all async boundaries
   - Shared types in `lib/types.ts`
   - Path alias `@/*` used consistently

   **Components (`components/`):**
   - Kebab-case filenames
   - `"use client"` present on interactive components
   - Named exports only
   - `cn()` used for conditional classes
   - UI primitives from `components/ui/` reused
   - Loading and error states handled
   - Keyboard accessible

   **Styling:**
   - Tailwind CSS used (no raw CSS unless justified)
   - `lucide-react` for icons
   - Dark theme consistency maintained
   - Responsive at 320px, 768px, 1280px+

   **API Routes (`app/api/`):**
   - Zod validation on request bodies
   - No secrets or stack traces in responses
   - `NEXT_PUBLIC_*` only for client-safe values

   **Games (`app/play/`):**
   - Touch-friendly for mobile
   - Game state managed correctly
   - Back navigation to play index

   **Security:**
   - No `.env` files staged
   - No hardcoded secrets or tokens

3. Output results in two sections:

   ### BLOCKING — Must Fix
   List all issues that MUST be fixed before commit (security, correctness, type safety, accessibility).

   ### NON-BLOCKING — Advisory
   List suggestions and minor improvements (naming, performance, polish).

4. If no issues found, output: "✅ All checks passed. No blocking or advisory issues found."
