---
path: "src/app/api/"
---

# API Rules — NFSMIS

## Authentication & Authorization
- Every protected route MUST use `withAuth` or `withPermission` from `src/lib/auth/`.
- NEVER hand-roll auth checks — use the established wrappers.
- `withAuth` resolves an `AuthenticatedUser` with `userId`, `userRole`, `sessionId`.
- `withPermission` composes `withAuth` and additionally checks permissions via `getPermissionsForRole()`.
- `system_admin` bypasses permission checks but NOT auth/session checks.
- Security scope defaults to `"admin"` for `withPermission`, `"default"` for `withAuth`.

## Request Validation
- Zod validation at EVERY mutating boundary (POST, PUT, PATCH, DELETE).
- Body validation options:
  1. Pass `bodySchema` option to `withAuth`/`withPermission` — validates before handler runs.
  2. Manual: `parseJsonRequestBody(req)` → `validateParsedBody(raw, schema)`.
- Query parameter validation: parse `searchParams` through a Zod schema.
- 2MB request body size limit enforced by `requestValidation.ts`.

## Response Conventions
- Success: `{ success: true, data: T }` with appropriate status code.
- Error: `{ success: false, error: string, message: string }` with appropriate status code.
- Use `ERROR_RESPONSES` from `configs/apiResponses.ts` for standardized error codes.
- NEVER expose raw stack traces, SQL errors, internal paths, or internal error details.
- NEVER include secrets, tokens, or plaintext credentials in responses.

## Route Handler Structure
- Handlers MUST be thin — delegate to service layer in `src/services/`.
- Service functions handle: business logic, DB writes, cache updates, audit writes, notification triggers.
- Handlers handle: request parsing, auth, response formatting.

## Session Flow (middleware → handler)
1. `middleware.ts` validates cookie shape, maintenance state, content-type for mutating requests.
2. `withAuth` calls `resolveProtectedSession()` — Redis-first, PostgreSQL-fallback.
3. `enforceAuthenticatedSecurity()` checks: inactivity expiry, locked account, trusted-IP.
4. `withPermission` checks `getPermissionsForRole(userRole)` — `system_admin` bypasses.

## Database Access
- API routes NEVER import from `src/database/` directly.
- All DB access goes through `src/services/` → `src/database/queries/`.
- Use parameterized queries — NEVER string-interpolate SQL.

## Error Handling
- Every handler wraps logic in `try/catch`.
- Catch blocks: `catch (err: unknown)`.
- Known error types → map to `ERROR_RESPONSES`.
- Unknown errors → log and return `internalServerError`.

## Audit Logging
- Sensitive mutations (IAM, roles, approvals, schedule state changes) must create audit entries.
- Use `loggerService.ts` for operational logs.
- Use `iamAuditService.ts` for IAM-specific security events.
- Audit entries include before/after snapshots where applicable.

## Rate Limiting and Security
- Login, password reset, and abuse-prone endpoints should have rate limiting.
- Secure cookie: httpOnly, secure (in prod), sameSite=strict.
- Object-level access checks — not just route-level.
