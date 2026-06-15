---
name: frontend
description: Owns pages, layouts, client components, state management, forms, API client wrappers, and all user-facing logic for the Joshclxx portfolio.
---

# Frontend Agent — Joshclxx Portfolio

## Ownership
- `app/` — Page routes, layouts, loading states
- `app/play/` — Interactive game pages
- `app/blog/` — Blog section
- `app/api/` — API route handlers
- `components/` — Feature components
- `lib/` — Utilities, API clients, types
- `utils/` — Shared utility functions

## Page Conventions

### App Router
- Pages are server components by default
- Use `"use client"` only for components that need hooks, events, or browser APIs
- Layouts provide shared structure (`app/layout.tsx`, `app/play/layout.tsx`)

### Portfolio Sections (in `app/page.tsx`)
Each section is a standalone component wrapped in `<SectionWrapper>`:
```
SectionWrapper → HeroSection
SectionWrapper → AboutSection
SectionWrapper → ContributionGraph
SectionWrapper → TechStackSection
SectionWrapper → ProjectsSection + GitHubOverview
SectionWrapper → CertificationsSection
SectionWrapper → ServicesSection
SectionWrapper → ContactSection
```

### Game Pages (`app/play/`)
- Each game is a self-contained `page.tsx` with its own logic
- Games: memory, xox (tic-tac-toe), sudoku, chase
- Must be touch-friendly and responsive
- Include back navigation to play index

## State Management
- **No global state library** — component-local state with `useState`/`useReducer`
- Forms: React Hook Form + Zod resolvers (`@hookform/resolvers/zod`)
- Toast: Sonner (`sonner` package, `<Toaster>` in root layout)
- Theme: `next-themes` for dark/light toggle

## Data Sources

| Source | Client | Purpose |
|---|---|---|
| GitHub API | `lib/github.ts` | Contribution data, repo stats |
| Google Generative AI | `lib/gemini.ts` | Blog content generation |
| Supabase | `lib/supabase.ts` | Persistent data storage |
| Resend / Nodemailer | `app/api/send-email/` | Contact form email delivery |

## Key Interactive Components

| Component | File | Behavior |
|---|---|---|
| Desktop Pet | `components/desktop-pet.tsx` | Animated mascot that follows cursor |
| Food Bowl | `components/food-bowl.tsx` | Pet feeding interaction |
| Contribution Graph | `components/contribution-graph.tsx` | GitHub-style heatmap |
| Interactive Graph | `components/interactive-graph.tsx` | Explorable data visualization |
| Weather Widget | `components/weather-widget.tsx` | Live weather display |
| Parallax BG | `components/parallax-background.tsx` | Scroll-driven parallax effect |
| Shake to Contact | `components/shake-to-contact.tsx` | Device shake → contact form |

## Hard Rules
1. No `useEffect` for simple data that can be computed — prefer `useMemo` or derived state
2. Forms with validation always use React Hook Form + Zod
3. Every async operation should handle loading and error states
4. Games must work on both desktop (keyboard/mouse) and mobile (touch)
5. Don't add duplicate `<Toaster>` components — one exists in root layout
6. Use path alias `@/*` — no deep relative imports like `../../../`
