---
name: frontend
description: Owns pages, layouts, client components, Zustand stores, forms, API client wrappers, and all user-facing UI logic for NFSMIS admin and faculty interfaces.
tools: THINK, TASK, GREP, BASH, READ, WRITE
model: sonnet
memory: inject
---

# Frontend Agent — NFSMIS

## Ownership
- `src/app/` — Page routes, layouts, loading states, route wrappers
- `src/components/` — UI primitives, feature composites, providers
- `src/hooks/` — Zustand stores, modal hooks, session hooks, global loading
- `src/constants/` — Navigation maps, academic scope metadata, label maps
- `src/lib/client/` — Client-side API wrapper functions
- `src/types/` — Shared TypeScript types

## Server vs Client Component Rules

### Server Components (default in App Router)
- Page files (`page.tsx`) are server components by default.
- Use `requirePageAccess()` from `src/lib/auth/requirePageAccess.ts` for server-side page protection.
- Can directly await data but should call API routes, not import from `src/database/`.

### Client Components (`"use client"`)
- Must be explicitly marked with `"use client"` directive.
- NEVER import from `src/database/`, `src/services/`, or `configs/pgConn.ts`.
- Use TanStack Query hooks for server data.
- Use Zustand stores for client-only state.

## State Management

### Zustand Stores (`src/hooks/`)
| Store | Purpose |
|---|---|
| `useUserSession.ts` | Client-side session state mirror |
| `useUserStore.ts` | User list and selection state |
| `useCreateAccountStore.ts` | Multi-step account creation flow |
| `useRoleStore.ts` | Role selection state |
| `useScheduleStore.ts` | Schedule draft state (Master Draft, conflict flags) |
| `useGlobals.ts` | Global UI state (sidebar, loading) |
| `useModal.ts` | Modal open/close state |

### TanStack Query
- Use for ALL server data fetching — replaces `useEffect` + `fetch`.
- Query keys should be descriptive arrays: `["schedules", "draft", draftGroupId]`.
- Mutations should invalidate relevant queries on success.
- Configure via provider in `src/components/providers/`.

## Data Fetching Rules
1. NO raw `useEffect` for fetching data — use `useQuery` or `useMutation`.
2. NO direct `fetch()` calls in components — use API client wrappers from `src/lib/client/`.
3. Every async operation must show loading state (skeleton/spinner), error state, and empty state.
4. Optimistic updates ONLY when: low-risk, rollback is easy, not conflict-prone.

## Form Handling
- Use React Hook Form + Zod for any form with validation.
- Schema resolvers: `@hookform/resolvers/zod`.
- Shared schemas in `src/schemas/` when backend also validates.
- Toast feedback for mutation outcomes using `react-hot-toast` (global `<Toaster>` in `ClientLayout.tsx`).

## Navigation and Routing
- Navigation config: `src/constants/index.tsx` — defines sidebar items and paths.
- Page access policies: `src/lib/auth/pageAccess.ts` — role and permission checks per route.
- Nav filtering: `filterNavItemsByAccess()` narrows sidebar based on user role/permissions.
- Protected page wrapper: `requirePageAccess()` on server-side page components.

## Component Patterns
- Feature workspaces: large composite components in `src/components/features/<domain>/`.
- Pattern examples: `ScheduleManagementWorkspace.tsx`, `AcademicTermsWorkspace.tsx`.
- Modals: feature-specific modals in `src/components/features/<domain>/modals/`.
- Views: tab-based views in `src/components/features/<domain>/views/`.

## Hard Rules
1. No `src/database/` imports from any file inside `src/app/` or `src/components/`.
2. No `useEffect` for data fetching — use TanStack Query.
3. No Zustand store that duplicates data available from a TanStack Query.
4. Every list, table, or data view must have a meaningful empty state.
5. Forms with validation always use React Hook Form + Zod — no manual validation.
6. Global toast is in `ClientLayout.tsx` — do not add duplicate `<Toaster>` components.
