# Joshclxx Portfolio — Project Rules

## Tech Stack
Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, Radix UI (shadcn/ui), Lucide React, Framer Motion (via tailwindcss-animate), Three.js, Supabase, Google Generative AI, React Hook Form, Zod, Sonner (toast), Recharts, Vercel Analytics, Yarn

## Commands
- `yarn dev` — Start dev server (port 3000)
- `yarn build` — Production build
- `yarn start` — Start production server
- `yarn lint` — ESLint check

## Pre-Commit Gate
Before every `git commit`, run in order:
1. `yarn lint` — must pass (zero errors)
2. Verify no `.env` or `.env.local` files are staged

---

## Architecture

### Directory Map

| Directory | Purpose |
|---|---|
| `app/` | Pages, layouts, API routes (App Router) |
| `app/api/` | API route handlers (contributions, generate-blog, send-email) |
| `app/play/` | Interactive games (memory, xox, sudoku, chase) |
| `app/blog/` | Blog section |
| `components/` | Feature components (flat structure) |
| `components/ui/` | Radix/shadcn UI primitives |
| `components/world/` | Three.js 3D components |
| `lib/` | Utilities: Gemini AI, GitHub API, Supabase client, types |
| `utils/` | Shared utility functions |
| `public/` | Static assets |

### Component Conventions
- Components are flat in `components/` — no nested feature folders.
- UI primitives live in `components/ui/` (shadcn/ui pattern).
- Each section of the portfolio is a standalone component: `hero-section.tsx`, `about-section.tsx`, etc.
- Use `"use client"` directive for interactive components.
- Kebab-case filenames: `desktop-pet.tsx`, `contribution-graph.tsx`.

### Styling
- **Tailwind CSS** is the primary styling approach.
- Use `cn()` from `lib/utils.ts` for conditional class merging (`clsx` + `tailwind-merge`).
- Inline `style={{}}` only for: runtime-calculated values, CSS variables, safe-area insets, and Three.js/canvas.
- Use `lucide-react` as the primary icon library. `react-icons` is available as secondary.
- Design tokens and theme config live in `tailwind.config.ts`.

### API Routes
- Route handlers are in `app/api/` using Next.js App Router conventions.
- Use Zod for request body validation.
- Never expose API keys, secrets, or internal error details in responses.
- External services: Supabase (data), Resend/Nodemailer (email), Google Generative AI (blog generation), GitHub API (contributions).

### State & Data
- No global state library — component-local state with `useState`/`useReducer`.
- Forms use React Hook Form + Zod resolvers.
- Toast notifications via Sonner (`sonner` package, `<Toaster>` in root layout).
- GitHub data fetched via `lib/github.ts`.
- AI content generation via `lib/gemini.ts`.

---

## Rules

### TypeScript
- Strict mode enabled. Avoid `any` — use proper types or `unknown`.
- All `catch` blocks should use `(err: unknown)`.
- Shared types live in `lib/types.ts`.
- Path alias: `@/*` maps to project root.

### Components
- Every interactive element must be keyboard accessible.
- Preserve existing animations and micro-interactions when editing nearby code.
- The portfolio has a GitHub-inspired dark theme — maintain visual consistency.
- Games in `app/play/` are self-contained page components with their own game logic.

### Environment Variables
- `NEXT_PUBLIC_*` prefix for client-accessible variables.
- Server-only secrets (Supabase, Resend, Gemini API keys) must never reach the client bundle.
- Never commit `.env` or `.env.local`.

### Performance
- Next.js font optimization is configured (Inter, JetBrains Mono, Geist Mono).
- Use `next/image` for optimized images.
- Vercel Analytics is integrated — don't duplicate tracking.

---

## Auto-Start Workflow
When starting any task:
1. Read this file to understand current architecture and constraints.
2. Check `components/` for existing components before creating new ones.
3. Check `lib/` and `utils/` for existing utilities before duplicating logic.
4. Follow the existing pattern in the target area — match naming, structure, and style conventions.
