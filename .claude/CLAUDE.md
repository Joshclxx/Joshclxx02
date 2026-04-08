# NFSMIS — School Management Information System

## Tech Stack
Next.js 15 (App Router + Turbopack), React 19, TypeScript (strict), PostgreSQL (pg + node-pg-migrate), Redis (Upstash), Zustand, TanStack Query, TanStack Table, React Hook Form, Zod, Tailwind CSS, Framer Motion, Lucide React, react-hot-toast, Playwright, Yarn 4

## Commands
- `yarn dev` — Start dev server (Turbopack, port 3000)
- `yarn build` — Production build (Turbopack)
- `yarn start` — Start production server
- `yarn lint` — ESLint check
- `yarn typecheck` — TypeScript strict type check (`tsc --noEmit`)
- `yarn verify` — Run lint + typecheck together
- `yarn migrate` — Run database migrations (node-pg-migrate)
- `yarn seed` — Seed database (`tsx ./configs/seed.ts`)
- `yarn e2e` — Run all Playwright E2E tests
- `yarn e2e:smoke` — Run smoke-tagged E2E tests only
- `yarn e2e:install` — Install Playwright browsers
- `yarn sync-permissions` — Sync permission seeds to database
- `yarn grant-admin` — Grant admin permissions via script

## Rules
- Never use `any`. Use generics or `unknown` with narrowing. Always `catch (err: unknown)`.
- Frontend code must never import from `src/database/`. No DB or cache calls from client components.
- All protected API routes must use `withAuth` or `withPermission` wrappers from `src/lib/auth/`.
- Never trust frontend validation alone — backend must re-validate with Zod at route boundaries.
- Keep route handlers thin. Business logic belongs in `src/services/`.
- Shared cross-layer schemas go in `src/schemas/`. Layer-specific schemas stay near their owner.
- Use TanStack Query for server state. No raw `useEffect` for fetching.
- Use React Hook Form + Zod for substantial forms.
- Every implemented feature must have a matching doc in `docs/features/`.
- `docs/TECHNICAL_DOCUMENTATION.md` is a system blueprint — architecture only, no UI behavior.
- API contract changes require `docs/openapi.yaml` updates.
- Never expose raw stack traces, secrets, tokens, or internal error details to end users.
- Never commit `.env` or `.env.local`. Environment variables use `UPPERCASE_SNAKE_CASE`.
- Use parameterized queries and prepared statements for all database access.
- Use semantic design tokens over raw colors. Prefer existing `src/components/ui/` primitives.
- Mark undefined business behavior as `UNDEFINED - REQUIRES CLARIFICATION` — never guess.

## Auto-make first change
When starting any task:
1. Read `PROJECT_RULES.md` and `docs/TECHNICAL_DOCUMENTATION.md` to understand current architecture and constraints.
2. Check `src/schemas/` and `src/types/` for existing contracts before creating new ones.
3. Find and follow the existing pattern in the target domain — check `src/services/`, `src/app/api/v1/`, and `src/components/features/` for the closest analogue.
4. After implementation, update the matching doc in `docs/features/` and `docs/TECHNICAL_DOCUMENTATION.md` if architecture changed.
