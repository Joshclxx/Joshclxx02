# Skill: Scaffold API Route

## Trigger
When creating a new API endpoint in `src/app/api/v1/`.

## Instructions

1. **Determine the protection level:**
   - Public route (login, password reset) → no wrapper needed
   - Auth-only route → use `withAuth`
   - Permission-gated route → use `withPermission`

2. **Create the route file** at `src/app/api/v1/<domain>/route.ts`

### Template: Permission-Protected Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/auth/withPermission";
import { z } from "zod";

const createItemSchema = z.object({
  name: z.string().min(1).max(255),
});

export const GET = withPermission(
  "domain:read",
  async (req, user, context) => {
    try {
      const result = await someService.getItems();
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (err: unknown) {
      console.error("[domain] GET failed:", err);
      return NextResponse.json(
        { success: false, error: "INTERNAL_ERROR", message: "Failed to fetch items." },
        { status: 500 },
      );
    }
  },
);

export const POST = withPermission(
  "domain:create",
  { bodySchema: createItemSchema },
  async (req, user, context, body) => {
    try {
      const result = await someService.createItem(body, user.userId);
      return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (err: unknown) {
      console.error("[domain] POST failed:", err);
      return NextResponse.json(
        { success: false, error: "INTERNAL_ERROR", message: "Failed to create item." },
        { status: 500 },
      );
    }
  },
);
```

### Template: Auth-Only Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req, user, context) => {
  try {
    const result = await someService.getUserData(user.userId);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err: unknown) {
    console.error("[domain] GET failed:", err);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to fetch data." },
      { status: 500 },
    );
  }
});
```

### Template: Dynamic Route with Params

```typescript
// File: src/app/api/v1/domain/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/auth/withPermission";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withPermission(
  "domain:read",
  async (req: NextRequest, user, context: RouteContext) => {
    const { id } = await context.params;
    try {
      const result = await someService.getItemById(id);
      if (!result) {
        return NextResponse.json(
          { success: false, error: "NOT_FOUND", message: "Item not found." },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (err: unknown) {
      console.error("[domain] GET by ID failed:", err);
      return NextResponse.json(
        { success: false, error: "INTERNAL_ERROR", message: "Failed to fetch item." },
        { status: 500 },
      );
    }
  },
);
```

3. **Create or update the service** in `src/services/<domain>Service.ts`.
4. **Create or update queries** in `src/database/queries/<domain>Queries.ts`.
5. **Update documentation:** Add endpoint to `docs/openapi.yaml`, update `docs/TECHNICAL_DOCUMENTATION.md` if new domain.
6. **Verify:** `yarn typecheck`
