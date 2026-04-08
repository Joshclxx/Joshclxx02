---
name: backend
description: Handles API route handlers, service layer logic, database queries, cache integration, session validation, and security enforcement for NFSMIS.
tools: THINK, TASK, GREP, BASH, READ, WRITE
model: sonnet
memory: inject
---

# Backend Agent — NFSMIS

## Ownership
- `src/app/api/v1/` — All API route handlers
- `src/services/` — Business logic, orchestration, audit coordination
- `src/database/queries/` — SQL query composition
- `src/database/prepared_statements/` — Prepared statement definitions
- `src/lib/auth/` — Auth wrappers, session validation, page access policies
- `src/lib/redis/` — Redis session store, cache helpers
- `src/lib/http/` — Request validation utilities
- `configs/` — Database, Redis, environment, security, API response configs
- `migrations/` — Schema change files (node-pg-migrate)
- `scripts/` — Admin and utility scripts

## Route Handler Conventions

### Auth Wrappers
Every protected route MUST use one of:
- `withAuth(handler)` — session-only protection (resolves `AuthenticatedUser`)
- `withAuth({ bodySchema, securityScope }, handler)` — session + body validation
- `withPermission(permission, handler)` — session + permission check
- `withPermission(permission, { bodySchema }, handler)` — session + permission + body validation

These wrappers live in `src/lib/auth/withAuth.ts` and `src/lib/auth/withPermission.ts`.

### Handler Shape
```typescript
import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/auth/withPermission";
import { someSchema } from "@/lib/zod/schema/someSchema";

export const POST = withPermission(
  "domain:action",
  { bodySchema: someSchema },
  async (req, user, context, body) => {
    const result = await someService.doWork(body, user.userId);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  },
);
```

### Validation
- Use Zod schemas at every route boundary — never skip.
- Shared cross-layer schemas → `src/schemas/`
- Route-specific schemas → `src/lib/zod/schema/`
- Body parsing order: `parseJsonRequestBody()` → `validateParsedBody()` or use `bodySchema` option in `withAuth`/`withPermission`.

### Session Flow (order matters)
1. Middleware validates cookie shape and maintenance state
2. `withAuth` calls `resolveProtectedSession()` → Redis-first, PostgreSQL-fallback
3. `enforceAuthenticatedSecurity()` checks inactivity, lockout, trusted-IP
4. `withPermission` additionally checks `getPermissionsForRole()` — `system_admin` bypasses

### Database
- Use parameterized queries and prepared statements only.
- Query files live in `src/database/queries/`.
- Prepared statements live in `src/database/prepared_statements/`.
- Connection config: `configs/pgConn.ts`.

### Error Responses
- Use `ERROR_RESPONSES` from `configs/apiResponses.ts` for standardized error codes.
- Response shape: `{ success: false, error: string, message: string }`
- Never expose stack traces, SQL errors, or internal details to clients.

### Audit and Logging
- Use `loggerService.ts` for operational logging.
- Use `iamAuditService.ts` for IAM security events.
- Audit-sensitive mutations must write before/after snapshots.

## Hard Rules
1. Validation is NEVER skipped — every mutating route uses Zod.
2. Session resolution order is ALWAYS Redis-first → PostgreSQL-fallback.
3. No secrets, tokens, or raw error internals in API responses.
4. Route handlers stay thin — business logic belongs in services.
5. Side effects (DB writes, cache refreshes, audit writes, notifications) must be explicit in the service layer.
6. `system_admin` bypasses permission checks but NOT auth/session checks.
7. `catch (err: unknown)` on every async boundary — never `catch (err)`.
