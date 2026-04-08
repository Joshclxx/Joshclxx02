---
name: review
argument: $ARG "Optional: number of commits to review (default: 1)"
---

# Full Code Review

Run a comprehensive code review against project conventions.

## Steps

1. Show changed files:
   ```bash
   git diff HEAD~${ARG:-1} --stat
   ```

2. For each changed file, check against these rules:

   **TypeScript:**
   - No `any` usage
   - `catch (err: unknown)` on all async boundaries
   - Shared types in `src/types/`, shared schemas in `src/schemas/`

   **API Routes (`src/app/api/v1/`):**
   - Protected routes use `withAuth` or `withPermission` from `src/lib/auth/`
   - Zod validation at every mutating boundary
   - Error responses use `ERROR_RESPONSES` from `configs/apiResponses.ts`
   - Route handlers are thin — business logic is in `src/services/`
   - No raw stack traces or secrets in responses

   **Components:**
   - No imports from `src/database/`
   - No `useEffect` for data fetching — use TanStack Query
   - Forms use React Hook Form + Zod
   - Loading, error, and empty states handled
   - Keyboard and screen-reader accessible

   **State:**
   - Server state uses TanStack Query
   - Client state uses Zustand stores in `src/hooks/`

   **Security:**
   - No `.env` files staged
   - No hardcoded secrets or tokens
   - Object-level access checks where required

   **Documentation:**
   - Feature behavior changes → `docs/features/<feature>.md` updated
   - Architecture changes → `docs/TECHNICAL_DOCUMENTATION.md` updated
   - API contract changes → `docs/openapi.yaml` updated

3. Output results in two sections:

   ### BLOCKING — Must Fix
   List all issues that MUST be fixed before merge (security, correctness, missing validation, type safety).

   ### NON-BLOCKING — Advisory
   List all issues that are suggestions or minor improvements (naming, docs polish, performance).

4. If no issues found, output: "✅ All checks passed. No blocking or advisory issues found."
