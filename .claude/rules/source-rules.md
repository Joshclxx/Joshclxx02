---
path: "src/"
---

# Source Rules — NFSMIS

## TypeScript
- No `any` — use generics, `unknown`, or type narrowing.
- All `catch` blocks use `(err: unknown)`.
- Shared cross-layer types in `src/types/`, shared cross-layer schemas in `src/schemas/`.
- Layer-specific schemas are allowed near their owning layer (e.g., `src/lib/zod/schema/`).
- No circular imports between layers.

## Components (`src/components/`)
- No imports from `src/database/`, `src/services/`, `configs/pgConn.ts`, or `configs/redisConn.ts`.
- UI primitives (`src/components/ui/`) must be domain-agnostic — no business logic.
- Feature composites (`src/components/features/`) may contain query hooks, form handling, and local state.
- Max recommended file size: ~200 lines for primitives, ~400 lines for workspaces.
- Every list/table/data view must have a meaningful empty state.
- Loading and error states are required for all async operations.

## Data Fetching
- Use TanStack Query (`useQuery`, `useMutation`) for all server data.
- No raw `useEffect` + `fetch` for data fetching.
- API client wrappers live in `src/lib/client/` — components call these, not raw `fetch`.
- Mutations invalidate relevant query keys on success.

## Forms
- Use React Hook Form + Zod for any form with validation.
- Shared schemas in `src/schemas/` when backend also validates the same shape.
- Toast feedback via `react-hot-toast` — global `<Toaster>` in `ClientLayout.tsx`.

## State Management
- Server state → TanStack Query.
- Client-only state → Zustand stores in `src/hooks/`.
- No Zustand store should duplicate data that a TanStack Query provides.

## Styling
- Tailwind CSS utility classes as the primary styling approach.
- Inline `style={{}}` only for runtime-calculated values, CSS variables, Framer Motion, canvas/SVG, and third-party widget overrides.
- Promote repeated arbitrary values to design tokens or shared classes.
- `lucide-react` is the primary icon library.

## Responsive Design
- All pages must work at mobile (320px), tablet (768px), and desktop (1280px+).
- No horizontal page overflow unless content is in a local scroll container.

## Accessibility
- All interactive elements must be keyboard accessible.
- Modals must trap focus and close on Escape.
- Form inputs must have associated labels.
- Color must not be the sole state indicator.
