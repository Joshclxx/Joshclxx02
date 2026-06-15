---
path: "app/api/"
---

# API Rules — Joshclxx Portfolio

## Route Handler Conventions
- Use Next.js App Router route handlers (`route.ts` files).
- Export named HTTP method functions: `GET`, `POST`, `PUT`, `DELETE`.
- Use Zod for request body validation at every mutating boundary.

## Request Validation
```typescript
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

// Validate in handler:
const body = await req.json();
const validated = requestSchema.parse(body);
```

## Response Conventions
- Success: `{ success: true, data: T }` with appropriate status code.
- Error: `{ success: false, error: string }` with appropriate status code.
- NEVER expose raw stack traces, API keys, or internal error details.

## Error Handling
- Every handler wraps logic in `try/catch`.
- Catch blocks: `catch (err: unknown)`.
- Log errors server-side, return safe messages to client.

```typescript
export async function POST(req: NextRequest) {
  try {
    // ... process request
    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    console.error("[route-name] Error:", err);
    return NextResponse.json(
      { success: false, error: "Request failed" },
      { status: 500 }
    );
  }
}
```

## Environment Variables
- Server-only secrets accessed via `process.env.SECRET_NAME`.
- NEVER import server-only env vars in client components.
- NEVER include env var values in API responses.

## Existing Routes
| Route | Method | Purpose |
|---|---|---|
| `/api/contributions` | GET | Fetch GitHub contribution data |
| `/api/generate-blog` | POST | Generate blog content via Gemini AI |
| `/api/send-email` | POST | Send contact form email |
