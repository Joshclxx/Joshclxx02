---
name: review
description: Run a comprehensive code review against portfolio project conventions. Checks TypeScript safety, component patterns, styling rules, and accessibility.
---

# Code Review — Joshclxx Portfolio

## Trigger
When asked to review code, review changes, or before merging.

## Steps

1. **Show changed files:**
   ```bash
   git diff HEAD~${ARG:-1} --stat
   ```

2. **For each changed file, check against these rules:**

   ### TypeScript
   - [ ] No `any` usage — use proper types or `unknown`
   - [ ] `catch (err: unknown)` on async boundaries
   - [ ] Shared types use `lib/types.ts`
   - [ ] Path alias `@/*` used consistently (no relative `../../`)

   ### Components
   - [ ] Kebab-case filename convention maintained
   - [ ] `"use client"` directive present for interactive components
   - [ ] UI primitives from `components/ui/` reused before creating new ones
   - [ ] Keyboard accessibility for interactive elements
   - [ ] Loading states handled for async operations

   ### Styling
   - [ ] Tailwind CSS used (no inline CSS unless justified)
   - [ ] `cn()` used for conditional classes
   - [ ] `lucide-react` for icons (not introducing a third icon library)
   - [ ] Dark theme consistency maintained

   ### API Routes
   - [ ] Zod validation on request bodies
   - [ ] No secrets or API keys in responses
   - [ ] No raw stack traces exposed to clients
   - [ ] Environment variables use `NEXT_PUBLIC_` prefix only for client-safe values

   ### Security
   - [ ] No `.env` or `.env.local` committed
   - [ ] No hardcoded secrets, tokens, or API keys
   - [ ] Server-only imports not leaking to client components

3. **Output results in two sections:**

   ### BLOCKING — Must Fix
   List all issues that MUST be fixed (security, correctness, type safety).

   ### NON-BLOCKING — Advisory
   List suggestions and minor improvements (naming, perf, accessibility).

4. If no issues found, output: "✅ All checks passed."
