# Skill: Scaffold API Route

## Trigger
When creating a new API endpoint in `app/api/`.

## Instructions

1. **Create the route file** at `app/api/<name>/route.ts`

### Template: Standard API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  // Define request body shape
  name: z.string().min(1).max(255),
});

export async function GET(req: NextRequest) {
  try {
    // Fetch or compute data...
    const data = {};
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: unknown) {
    console.error("[api-name] GET failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = requestSchema.parse(body);
    // Process validated data...
    const result = {};
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request body", details: err.errors },
        { status: 400 }
      );
    }
    console.error("[api-name] POST failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
```

### Template: Dynamic Route with Params

```typescript
// File: app/api/<name>/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    // Fetch item by id...
    const item = null;
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (err: unknown) {
    console.error("[api-name] GET by ID failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}
```

### Template: External Service Integration

```typescript
// For routes that call external APIs (Gemini, GitHub, Supabase, Resend)
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Call external service using server-only env var
    const apiKey = process.env.SERVICE_API_KEY;
    if (!apiKey) {
      console.error("[api-name] Missing API key");
      return NextResponse.json(
        { success: false, error: "Service unavailable" },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.service.com/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Service responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("[api-name] External service error:", err);
    return NextResponse.json(
      { success: false, error: "Service request failed" },
      { status: 500 }
    );
  }
}
```

2. **Verify:** `yarn lint`
