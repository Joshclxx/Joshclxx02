---
path: "components/"
---

# Source Rules — Joshclxx Portfolio

## TypeScript
- No `any` — use proper types, `unknown`, or generics.
- All `catch` blocks use `(err: unknown)`.
- Shared types in `lib/types.ts`.
- Use path alias `@/*` — no deep relative imports like `../../../`.
- No circular imports.

## Components (`components/`)
- Flat structure — no nested feature folders.
- Kebab-case filenames: `desktop-pet.tsx`, `contribution-graph.tsx`.
- Named exports only (no default exports).
- Accept `className` prop with `cn()` for style extension.
- Max recommended file size: ~300 lines. If larger, decompose.

## UI Primitives (`components/ui/`)
- shadcn/ui pattern (Radix UI + Tailwind).
- Must be domain-agnostic — no business logic.
- Don't modify existing primitives without checking all usage sites.

## Client vs Server Components
- Pages are server components by default (App Router).
- Add `"use client"` only when the component uses hooks, events, or browser APIs.
- Server components CANNOT import from client-only packages.
- Client components should not import server-only modules.

## Styling
- Tailwind CSS utility classes as primary styling.
- Use `cn()` from `lib/utils.ts` for conditional class merging.
- Inline `style={{}}` only for: runtime-calculated values, CSS variables, safe-area insets, Three.js/canvas.
- `lucide-react` is the primary icon library. `react-icons` as secondary.
- Promote repeated arbitrary values to `tailwind.config.ts` tokens.

## State Management
- Component-local state with `useState` / `useReducer`.
- No global state library — keep state close to where it's used.
- Forms: React Hook Form + Zod resolvers.
- Toast: Sonner (global `<Toaster>` in root layout — don't duplicate).

## Responsive Design
- All components must work at mobile (320px), tablet (768px), and desktop (1280px+).
- No horizontal page overflow.
- Use safe-area insets for notched devices.

## Accessibility
- Interactive elements must be keyboard accessible.
- Form inputs must have associated labels.
- Color must not be the sole state indicator.
- Focus states must be visible.
