---
name: new-feature
argument: $ARG "Name of the feature to scaffold (e.g., attendance-tracking)"
---

# Scaffold New Feature

Create all files for a new feature end-to-end.

## Steps

1. **Identify the domain:**
   - Determine which system domain this feature belongs to (auth, academic, facilities, scheduling, etc.)
   - Check `docs/TECHNICAL_DOCUMENTATION.md` for the domain map
   - Check if an existing feature doc covers this area in `docs/features/`

2. **Define the API contract:**
   - Create shared Zod schemas in `src/schemas/$ARG.ts` (if cross-layer) or `src/lib/zod/schema/${ARG}Schema.ts` (if backend-only)
   - Create TypeScript types in `src/types/$ARG.ts`
   - Define request/response shapes

3. **Scaffold backend:**

   a. **Service layer** — `src/services/${ARG}Service.ts`:
      - Business logic, validation, DB calls, cache integration
      - Export named functions (no default exports)
      - Use parameterized queries

   b. **Database queries** — `src/database/queries/${ARG}Queries.ts`:
      - SQL query composition functions
      - Use prepared statements for frequent queries

   c. **API route handlers** — `src/app/api/v1/${ARG}/route.ts`:
      - Use `withAuth` or `withPermission` from `src/lib/auth/`
      - Validate with Zod at boundary
      - Keep handler thin — delegate to service
      - Template:
        ```typescript
        import { withPermission } from "@/lib/auth/withPermission";
        import { someSchema } from "@/lib/zod/schema/${ARG}Schema";

        export const GET = withPermission("${ARG}:read", async (req, user, context) => {
          // delegate to service
        });

        export const POST = withPermission("${ARG}:create", { bodySchema: someSchema }, async (req, user, context, body) => {
          // delegate to service
        });
        ```

4. **Scaffold frontend:**

   a. **API client** — `src/lib/client/${ARG}Api.ts`:
      - Typed fetch wrappers for each endpoint
      - Return typed responses

   b. **Zustand store** (if needed) — `src/hooks/use${PascalCase}Store.ts`:
      - Client-only state that doesn't duplicate server data

   c. **Feature workspace** — `src/components/features/${ARG}/${PascalCase}Workspace.tsx`:
      - Composite component using TanStack Query for data
      - React Hook Form + Zod for forms
      - Loading, error, empty states

   d. **Page route** — `src/app/admin/${ARG}/page.tsx`:
      - Server component with `requirePageAccess()`
      - Renders the workspace component
      ```typescript
      import { requirePageAccess } from "@/lib/auth/requirePageAccess";
      import ${PascalCase}Workspace from "@/components/features/${ARG}/${PascalCase}Workspace";

      export default async function ${PascalCase}Page() {
        await requirePageAccess("/admin/${ARG}");
        return <${PascalCase}Workspace />;
      }
      ```

5. **Register navigation:**
   - Add route to `src/constants/index.tsx` navigation config
   - Add page access policy to `src/lib/auth/pageAccess.ts`

6. **Create feature documentation:**
   - Create `docs/features/${ARG}.md` using the template:
     - Overview, Entry Points, UI Behavior, Component Logic, UX Flows, Edge Cases, Temporary Restrictions, Dependencies

7. **Update system documentation:**
   - Add feature to `docs/TECHNICAL_DOCUMENTATION.md` capability table
   - Update `docs/openapi.yaml` with new endpoints

8. **Verify:**
   ```bash
   yarn typecheck
   yarn lint
   ```
