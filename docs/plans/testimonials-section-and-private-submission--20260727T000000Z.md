# Testimonials section and private submission route

Format-Version: 4
Status: IMPLEMENTED
Created-At: 2026-07-27T00:00:00Z
Project: portfolio-joshclxx
Primary-Source: user request: add a testimonials section between Packages and Contact, plus an unnavigated client testimonial-input page.

## Objective

Add an approved-testimonials section immediately after Packages & Services and before Get In Touch on the portfolio homepage. Add a shareable but deliberately unlinked `/testimonial` route where clients can submit feedback. Submissions must remain pending until manually approved, and only approved entries may be rendered publicly.

## Acceptance criteria

- **AC-1:** The homepage renders a GitHub-themed Testimonials section between the existing `#services` and `#contact` sections, displaying only approved testimonial records.
- **AC-2:** `/testimonial` renders a direct-share client feedback form and is not added to desktop navigation, mobile navigation, mobile tabs, or any other discoverable portfolio navigation.
- **AC-3:** The feedback form validates name, role/company, rating, and testimonial content on the client and server; successful submissions create a pending record and show an accessible success state.
- **AC-4:** Public rendering and submission handling fail safely: unconfigured/unavailable Supabase does not expose internals or publish unapproved content, malformed/spammy requests are rejected, and no service-role secret reaches browser code.
- **AC-5:** Existing section focus/navigation behavior continues to show the new section with the packages view and preserves contact behavior.

## Non-goals

- A public link, navigation item, sitemap promotion, or SEO campaign for `/testimonial`.
- A browser-based moderation dashboard; approval will be performed in Supabase for this first delivery.
- Migrating or changing the existing contact-email workflow.
- Testimonials with avatars, attachments, or client login/authentication.

## Evidence map

| ID | Existing path | Symbol or search anchor | Why it matters |
|---|---|---|---|
| E1 | `app/page.tsx` | `ServicesSection` followed by `ContactSection` | Exact homepage insertion point for the new section. |
| E2 | `components/services-section.tsx` | `ServicesSection` | Existing visual/component pattern to match for the preceding section. |
| E3 | `components/contact-section.tsx` | `ContactSection`, `handleSubmit` | Existing client form, Sonner feedback, and GitHub-card conventions. |
| E4 | `components/navigation.tsx` | `navItems`, `sectionMap`, scroll `sections` | The section list and focus ownership require an explicit testimonial decision. |
| E5 | `components/section-focus-context.tsx` | `SECTION_GROUPS` | Must mirror `sectionMap` so focused packages navigation does not hide testimonials. |
| E6 | `app/api/send-email/route.ts` | `contactSchema`, `POST` | Existing Zod, rate-limit, and non-disclosing API-error pattern to reuse. |
| E7 | `utils/cacheUtils.ts` | `isWithinSlidingWindowLog` | Existing shared in-memory sliding-window limiter. |
| E8 | `utils/clientCredentials.ts` | `getClientIp`, `hashDeviceFingerprint` | Existing request fingerprint helpers for form abuse controls. |
| E9 | `utils/sanitizer.ts` | `sanitizeContactInput`, `escapeHtml` | Existing input normalization and safe HTML-output utilities; testimonial-specific limits should not overload contact semantics. |
| E10 | `lib/supabase.ts` | `getSupabaseAdmin` | Server-only lazy Supabase service-role client for writes and protected reads. |
| E11 | `lib/types.ts` | `BlogPost` | Established home for cross-boundary data shapes. |
| E12 | `app/layout.tsx` | root `Toaster` | Global toast host available to the new client form. |
| E13 | `PROJECT_RULES.md` | API Routes, Components, TypeScript, Environment Variables | Zod validation, strict TypeScript, accessible interactions, dark-theme consistency, and secret-handling constraints. |

## Decisions and constraints

- **D1:** Use the direct route `/testimonial`. It will be omitted from `navItems`, mobile sheet items, mobile tabs, and homepage links; the owner can share this URL manually.
- **D2:** Persist feedback to a new Supabase `testimonials` table with an `approved` boolean defaulting to `false`. The homepage server query filters `approved = true`; inserting a row never causes immediate public publication.
- **D3:** Add Testimonials as its own `#testimonials` navigation target in the desktop navbar, mobile sheet, and mobile tabs. The private `/testimonial` submission route remains unlinked.
- **D4:** Form fields will be `name`, optional `role_or_company`, required `rating` (1–5), and required `message`; email is intentionally not collected because no confirmation or owner reply flow is in scope.
- **D5:** The route handler returns generic user-facing failures and logs only safe diagnostic context server-side, following the contact endpoint's approach.
- **C1:** All interactive controls must be keyboard accessible; Tailwind and existing GitHub-inspired tokens/components remain the styling baseline.
- **C2:** Server-only Supabase credentials must be accessed only by server modules or route handlers. No `SUPABASE_SERVICE_ROLE_KEY` can be imported by a client component.
- **C3:** The existing `components/about-section.tsx` worktree change is unrelated and must be preserved untouched.

## Assumptions and blockers

- **A1:** The existing Supabase project can receive a manually applied table migration and the owner can set `approved = true` after reviewing submissions.
- **A2:** A testimonials section with no approved records should show a concise, non-fabricated empty state rather than placeholder client endorsements.
- **A3:** The existing process-local sliding-window limiter is adequate for this first version, with the same deployment caveat as the contact form; it is not a distributed rate limiter.
- **BLOCKER-1:** None for implementation, provided the owner can apply the supplied Supabase SQL migration. If Supabase schema changes cannot be applied, the form cannot safely persist or moderate submissions and this design must switch to an email-only workflow.

## Delivery map

Strategy: Slices
Phase-Rationale: None

### S1. Moderated testimonial data contract and submission endpoint

- **Acceptance criteria:** AC-3, AC-4.
- **Depends on:** None.
- **Execution skills:** `tdd`.
- **Outcome:** The application accepts only valid testimonial payloads, stores each as pending, and safely rejects malformed, rate-limited, or unavailable-service requests.
- **Where:**
  - `lib/types.ts` — add `Testimonial` and input/data shapes needed by the homepage and endpoint.
  - `utils/sanitizer.ts` — add a testimonial-specific normalization function and field-length limits without altering `sanitizeContactInput` behavior.
  - `app/api/testimonials/route.ts` *(new)* — Zod schema, request parsing, device/IP/global rate limits, server-only Supabase insert, generic JSON errors.
  - `supabase/migrations/<timestamp>_create_testimonials.sql` *(new)* — create the `testimonials` table with UUID primary key, name, nullable role/company, 1–5 rating constraint, message, `approved boolean not null default false`, and created timestamp; document that only the backend service role writes/reads this table.
  - `.env.example` — document required Supabase variables already used by `lib/supabase.ts`, without adding real values.
- **Behavior and data flow:** The client sends JSON to `POST /api/testimonials`; the handler limits requests before parsing, validates the exact primitive fields, strips/limits content, inserts an `approved: false` row through `getSupabaseAdmin`, and returns `{ success: true }`. The API never accepts an approval value from the client.
- **Correctness constraints:** Reject non-JSON requests, missing/invalid fields, out-of-range/non-integer ratings, excessive content, and rate-limit breaches with controlled 4xx responses. Treat database/configuration failures as generic 5xx/503-style user errors without returning Supabase details. Ensure special characters are stored as text, not interpolated as HTML. The migration must support manual row approval and must not create public anonymous write access.
- **Verification:** Add focused endpoint tests if the repository test harness is introduced/available; otherwise run `yarn lint`, use a local authenticated Supabase environment to submit valid, invalid, and repeated requests, and inspect the resulting row to confirm `approved` is `false`.
- **Complete when:** A valid request creates one pending record; invalid/rate-limited requests create none and return safe errors.

### S2. Private client submission page

- **Acceptance criteria:** AC-2, AC-3, AC-4.
- **Depends on:** S1.
- **Execution skills:** `tdd`.
- **Outcome:** A client can use the shared `/testimonial` URL to submit feedback with understandable validation, submission state, and confirmation, without creating any site navigation path to that page.
- **Where:**
  - `app/testimonial/page.tsx` *(new)* — route-level metadata and page shell for the direct URL.
  - `components/testimonial-form.tsx` *(new)* — client form state, accessible labels/errors, rating control, POST call, disabled pending state, Sonner/error handling, and reset-on-success behavior.
  - `components/navigation.tsx` — confirm no `/testimonial` link is added to `navItems`, the sheet, bottom tabs, or supplemental links.
- **Behavior and data flow:** The form performs native plus client-side constraints, posts sanitized field values to S1, then gives a success message explaining that feedback is reviewed before being displayed. Failed responses retain the entered data and surface only the API's safe message.
- **Correctness constraints:** Use semantic labels and a keyboard-operable 1–5 rating input; do not expose client-side Supabase access or use a `NEXT_PUBLIC` write key. Do not use `noindex` as a substitute for navigation absence; set route metadata to discourage indexing as an additional defense if aligned with Next.js metadata conventions.
- **Verification:** Start `yarn dev`; load `/testimonial` directly in desktop and mobile viewports; complete the form with keyboard-only controls; confirm client and server validation, in-progress disabling, success reset, and safe error behavior. Search the source/build navigation output to confirm `/testimonial` is absent outside the route itself.
- **Complete when:** The form can be used via the direct URL only, submits a pending row through S1, and no portfolio navigation item exposes it.

### S3. Public approved-testimonials section and packages focus integration

- **Acceptance criteria:** AC-1, AC-4, AC-5.
- **Depends on:** S1.
- **Execution skills:** None.
- **Outcome:** The homepage visibly places Testimonials between Packages and Contact, rendering approved Supabase records in the portfolio visual language while safely handling zero records or query failures.
- **Where:**
  - `components/testimonials-section.tsx` *(new)* — server-rendered query for approved testimonials and responsive GitHub-style testimonial cards/empty state.
  - `app/page.tsx` — import and render `TestimonialsSection` between `ServicesSection` and `ContactSection`, wrapped with `sectionId="testimonials"`.
  - `components/navigation.tsx` — add `testimonials` to the `#services` ownership list and scroll-observer list; maintain existing five visible nav choices and make `#contact` active at page end.
  - `components/section-focus-context.tsx` — add `testimonials` to `#services` `SECTION_GROUPS`, keeping it synchronized with navigation.
  - `lib/types.ts` — consume the S1 `Testimonial` shape for typed Supabase results.
- **Behavior and data flow:** On each configured revalidation strategy, the section reads only rows where `approved = true`, ordered newest-first. It presents reviewer name, optional role/company, rating, and text; no pending fields or personal email are queried/rendered. Empty/error state remains visually intentional and contains no fabricated testimonials.
- **Correctness constraints:** Avoid a build-time crash when Supabase variables are missing, matching the blog's configuration-fallback pattern. Keep data fetching server-side and never pull unapproved rows into page props. Preserve contact's position immediately after testimonials and make the packages focus view include both services and testimonials.
- **Verification:** With seeded one approved and one pending row, load `/` and verify only the approved card appears between services and contact. Set no approved rows and verify the empty state. Temporarily simulate missing/unavailable Supabase configuration and verify the page continues rendering safely. Exercise Packages and Contact in desktop navigation, mobile sheet, and bottom tabs to verify focus/active-state behavior.
- **Complete when:** The homepage placement, approval filter, fallback, and all existing navigation modes behave as specified.

## Acceptance coverage

| Acceptance criterion | Delivery slices | Verification |
|---|---|---|
| AC-1 | S3 | Seed approved/pending rows and verify placement/filtering on `/`. |
| AC-2 | S2 | Direct-load `/testimonial`; inspect all navigation lists and route references. |
| AC-3 | S1, S2 | Submit valid/invalid payloads and inspect stored `approved = false` record. |
| AC-4 | S1, S2, S3 | Exercise malformed, rate-limited, unavailable-Supabase, and no-approved-data cases. |
| AC-5 | S3 | Manually exercise Packages/Contact focus and active states across desktop and mobile navigation. |

## Verification strategy

| Scope | Command or procedure | Expected evidence |
|---|---|---|
| Focused | `yarn lint` | TypeScript/ESLint validation has zero errors. |
| Focused | `yarn dev` with configured Supabase | Direct-route form submission, moderation state, approved-only homepage card, and navigation behaviors work in a browser. |
| Full | `yarn build` | Production compilation and server rendering complete without Supabase configuration/build-time errors. |
| Manual data safety | Query the Supabase `testimonials` table after valid, invalid, and rate-limited requests | Only valid requests create records, and every client-created record starts unapproved. |

No automated test runner is configured in `package.json`; endpoint coverage remains a recommended addition if a test harness is authorized later. The Supabase migration application cannot be run from this repository alone and must be executed in the target Supabase project by an authorized operator.

## Risks and recovery

| Risk | Prevention or detection | Recovery or rollback |
|---|---|---|
| A client testimonial is publicly visible before review | Default `approved = false`; endpoint does not accept approval; public query filters `approved = true`. | Set the record to unapproved/delete it in Supabase and revalidate/redeploy the site. |
| Form spam or automated abuse | Validate server-side and reuse IP/device/global sliding-window controls. | Tighten limits or add a durable distributed limiter/CAPTCHA in a separately approved follow-up. |
| Missing/outage Supabase degrades the homepage | Server-side guarded query and intentional empty/error fallback. | Restore configuration/service; no user-generated fallback content is published. |
| Section focus hides or mislabels testimonials | Update both duplicated ownership maps and test every nav surface. | Revert the group mapping; homepage still retains source order. |
| Migration is not applied before release | Treat migration application as release prerequisite and verify table existence before enabling submission. | Do not deploy endpoint/route, or temporarily disable the form until the table is present. |

## Execution handoff

- **Start with:** S1.
- **Prerequisites:** Authorized Supabase schema migration execution; `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` configured only in the deployment environment; clear approval to implement this DRAFT plan.
- **Stop conditions:** Migration cannot be applied, the existing unrelated `components/about-section.tsx` change conflicts with required edits, `yarn lint` or `yarn build` fails, or a verification exposes pending testimonial data publicly.
