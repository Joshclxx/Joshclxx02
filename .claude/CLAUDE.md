# Joshclxx Portfolio — Developer Portfolio & Interactive Playground

## Tech Stack
Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, Radix UI (shadcn/ui), Lucide React, Three.js, Supabase, Google Generative AI, React Hook Form, Zod, Sonner, Recharts, Vercel Analytics, Yarn

## Commands
- `yarn dev` — Start dev server (port 3000)
- `yarn build` — Production build
- `yarn start` — Start production server
- `yarn lint` — ESLint check

## Rules
- Avoid `any`. Use proper types or `unknown` with narrowing. Always `catch (err: unknown)`.
- Use `"use client"` directive on components that use hooks, events, or browser APIs.
- Use Tailwind CSS for styling. Use `cn()` from `lib/utils.ts` for conditional classes.
- Use `lucide-react` as primary icon library. `react-icons` as secondary only.
- Use React Hook Form + Zod for forms with validation.
- Use `@/*` path alias consistently — no deep relative imports.
- Reuse existing `components/ui/` primitives before creating new ones.
- Use named exports only (no default exports) for components.
- Kebab-case filenames: `desktop-pet.tsx`, `contribution-graph.tsx`.
- Never expose API keys, secrets, or internal error details in API responses.
- Never commit `.env` or `.env.local`. Use `NEXT_PUBLIC_*` only for client-safe values.
- Preserve existing animations and micro-interactions when editing nearby code.
- Games in `app/play/` must work on both desktop and mobile (touch-friendly).

## Auto-make first change
When starting any task:
1. Read `PROJECT_RULES.md` for current architecture and constraints.
2. Check `components/` and `components/ui/` for existing components before creating new ones.
3. Check `lib/` and `utils/` for existing utilities before duplicating logic.
4. Follow the existing pattern in the target area — match naming, structure, and style conventions.
