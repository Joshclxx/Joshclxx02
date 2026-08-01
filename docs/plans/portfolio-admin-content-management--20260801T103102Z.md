# Portfolio admin content management

Format-Version: 4
Status: APPROVED
Created-At: 2026-08-01T10:31:02Z
Project: portfolio-joshclxx
Primary-Source: user-confirmed grilling session in the current Codex task

## Objective

Replace hard-coded profile, project, and achievement content with a secure Supabase-backed portfolio admin at `/admin`, while preserving the existing GitHub-inspired public presentation and existing testimonial moderation.

## Acceptance criteria

- **AC-1:** `/admin` requires the shared portfolio-admin password/session, opens Profile by default, provides keyboard-accessible navigation for Profile, Projects, Achievements & Certificates, and Testimonials, and `/testimonials/admin` redirects to `/admin/testimonials`.
- **AC-2:** Profile Admin can update the display name, one of three availability states, dark and light profile images, a distinct short bio, Markdown About introduction, ordered Markdown Quick Facts, and a numeric experience value; the rotating speech-bubble content and behavior remain unchanged.
- **AC-3:** The public profile renders the saved content safely, preserves the current About/Quick Facts visual treatment, formats experience as `[number]+ Years Exp.`, derives the availability highlight from profile status, and derives the project-count highlight from visible projects.
- **AC-4:** Projects Admin can add, edit, archive, unarchive, permanently delete with exact-title confirmation, and reorder projects with accessible Move Up/Move Down controls; new projects appear last and saves publish immediately unless archived.
- **AC-5:** Each visible project renders its uploaded image, title, description, ordered technology tags with automatic or custom colors, required Work Experience/Personal Project category badge, Public/Coming Soon badge, and optional Live/Code links; Coming Soon suppresses links and no duplicate In Development label appears; an empty state appears when no projects are visible.
- **AC-6:** Achievements Admin starts empty and can add, edit, archive, unarchive, title-confirm-delete, and reorder entries containing a required title, issuer, four-digit year, thumbnail image, and exactly one credential source (PDF/DOCX/JPEG/JPG/PNG upload or external URL); the public section preserves the current timeline design and has an empty state.
- **AC-7:** Admin media writes are server-authorized and validated by size, extension, MIME type, and ownership-safe storage paths; failed mutations remove newly uploaded files, replacements clean up superseded files, and row deletion attempts storage cleanup without exposing service credentials.
- **AC-8:** Missing Supabase configuration or read failures do not break the homepage: current profile defaults remain available as a fallback, project/achievement collections fail closed to their empty states, mutations revalidate `/`, and errors disclose no secrets or internal service details.
- **AC-9:** Existing testimonial submission, approval/hide, deletion, public display, and login throttling behavior continue to work inside the shared admin shell.

## Non-goals

- Migrating the eight hard-coded projects or five hard-coded certificates; both collections intentionally start empty.
- Editing the rotating profile speech-bubble messages, job/location/email/social/CV fields, navigation content, or other homepage sections.
- Draft scheduling, multi-user accounts/roles, audit history, bulk import, or drag-and-drop ordering.
- Arbitrary HTML or unrestricted Markdown; only the agreed safe Markdown presentation is supported.
- Changing testimonial content fields or public testimonial submission behavior.

## Evidence map

| ID | Existing path | Symbol or search anchor | Why it matters |
|---|---|---|---|
| E1 | `components/projects-section.tsx` | `const projects`, `ProjectsSection`, `ProjectDetailModal` | Eight projects, status/stars, links, responsive carousel, and modal are currently coupled to one client component. |
| E2 | `components/certifications-section.tsx` | `const certifications`, `CertificationsSection` | Five certificates and the public timeline are currently hard-coded here. |
| E3 | `components/hero-section.tsx` | `BUBBLE_MESSAGES`, `HeroSection`, `Highlights` | Profile images, name, availability, bio, and three highlight badges are hard-coded; bubbles must remain unchanged. |
| E4 | `components/about-section.tsx` | `AboutSection`, `Quick Facts` | About copy and richly styled Quick Facts are hard-coded and currently overlap the profile bio. |
| E5 | `app/page.tsx` | `revalidate`, `Portfolio` | Homepage composition and five-minute ISR boundary are defined here; content reads must feed existing section components. |
| E6 | `lib/supabase.ts` | `getSupabaseAdmin` | Existing lazy, server-only service-role client is the approved persistence boundary. |
| E7 | `lib/types.ts` | `Testimonial`, `TestimonialSubmission` | Shared persisted row types already live here and should be extended for portfolio content. |
| E8 | `lib/testimonial-admin-auth.ts` | `isAdminRequest`, `isSameOriginRequest`, session helpers | Existing signed cookie, same-origin defense, and password validation should be generalized rather than duplicated. |
| E9 | `app/testimonials/admin/page.tsx` | `TestimonialAdminPage`, `getTestimonials` | Current admin entry point defaults directly to testimonials and must become a compatibility redirect. |
| E10 | `components/testimonial-admin-login.tsx` | `TestimonialAdminLogin` | Existing login UI calls testimonial-specific endpoints and must become shared admin UI. |
| E11 | `components/testimonial-admin-dashboard.tsx` | `TestimonialAdminDashboard`, `manage` | Existing moderation UI owns its page chrome/logout and uses `window.confirm`; it must become a content pane without regressing behavior. |
| E12 | `app/api/testimonials/admin/login/route.ts` | `POST`, `loginSchema` | Existing same-origin check, five-attempt/15-minute throttle, session creation, and safe errors define the auth behavior to preserve. |
| E13 | `app/api/testimonials/admin/manage/route.ts` | `POST`, `manageSchema` | Existing testimonial mutation authorization and `revalidatePath("/")` must move to shared auth. |
| E14 | `components/testimonials-section.tsx` | `getApprovedTestimonials`, `TestimonialsSection` | Demonstrates safe server-side Supabase reads and an established public empty-state pattern. |
| E15 | `supabase/migrations/20260727000000_create_testimonials.sql` | `public.testimonials`, RLS | Establishes migration naming, constraints, indexing, and RLS conventions. |
| E16 | `next.config.mjs` | `images.remotePatterns` | Supabase-hosted images need an environment-derived allowed remote hostname for `next/image`. |
| E17 | `package.json` | `scripts`, `react-markdown`, `zod`, `react-hook-form`, `sonner` | Required form, validation, Markdown, notification, lint, and build capabilities already exist; no new runtime dependency is required. |

## Decisions and constraints

- **D1:** One shared admin shell and signed session protect all four admin areas; Profile is the default route and existing testimonial credentials are reused.
- **D2:** Introduce `PORTFOLIO_ADMIN_PASSWORD` and `PORTFOLIO_ADMIN_SESSION_SECRET` names with temporary fallback to the existing `TESTIMONIAL_ADMIN_*` variables; use a generic cookie and document that deploying the cookie rename causes a one-time sign-in.
- **D3:** Profile is a singleton seeded with the current public content/image paths; application defaults mirror that seed so missing Supabase configuration still preserves the current profile.
- **D4:** Quick Facts are an ordered array of limited-Markdown strings; the About introduction is limited Markdown rendered without raw HTML. `**text**` maps to bold and inline code maps to the existing technology-chip style.
- **D5:** Availability is constrained to `available`, `open_to_work`, or `unavailable`, with fixed labels/colors. Experience stores a non-negative integer and presentation supplies `+ Years Exp.`.
- **D6:** Projects and achievements start with no rows. `archived_at` controls public visibility; Coming Soon remains publicly visible but suppresses Live/Code links.
- **D7:** Project technologies persist as an ordered JSON array of `{ name, color }`; the server validates unique, non-empty names and normalized `#RRGGBB` colors. The form assigns a deterministic default from a palette and permits overrides.
- **D8:** Collection order is an integer `position`; create uses `max(position) + 1`, and Move Up/Down submits the complete ordered ID list for one server-side batch upsert after validating it matches the current collection.
- **D9:** Permanent project/achievement deletion requires a modal and exact case-sensitive title input in both the client UI and server request.
- **D10:** Use public-read `portfolio-images` and `portfolio-credentials` Supabase Storage buckets because homepage media and downloadable credentials are public artifacts; no anonymous insert/update/delete policies are added, and every write goes through authenticated service-role routes.
- **D11:** Store bucket-relative object paths, never user-supplied deletion URLs. Use generated UUID object names and known extensions. Image uploads allow JPEG, PNG, and WebP up to 5 MB; credential uploads allow PDF, DOCX, JPEG, and PNG up to 10 MB. These limits are implementation defaults and can be adjusted before approval.
- **D12:** Achievement thumbnail and credential are separate fields. Thumbnail is always required; credential must be either one validated upload or one valid `http`/`https` URL, never both.
- **D13:** Media mutation order is upload, database mutation, then old-file cleanup. A database failure removes the new upload; cleanup failure is logged without undoing valid content and leaves a recoverable orphan for manual bucket cleanup.
- **D14:** Preserve the current responsive project carousel/modal, certificate timeline, profile bubbles, Quick Fact bullets, GitHub dark theme, animations, and keyboard behavior while replacing their data sources.
- **C1:** Follow strict TypeScript, `unknown` catches, Zod request validation, server-only secret handling, flat `components/` conventions, kebab-case filenames, Tailwind styling, Lucide icons, `cn()`, and keyboard-accessible interactions from `PROJECT_RULES.md`.
- **C2:** Do not expose Supabase service-role credentials to client components; client components receive serialized content props or call protected API routes.
- **C3:** All successful content mutations call `revalidatePath("/")`; the public homepage retains `revalidate = 300` for read caching outside explicit mutation revalidation.
- **C4:** Repository has no configured automated test runner. Verification therefore uses strict lint/build plus focused browser/API checks against a Supabase environment with the migration applied.

## Assumptions and blockers

- **A1:** The deployed Supabase project permits migrations to create the two Storage bucket records and uses the existing service-role key for all admin object operations.
- **A2:** Public credential downloads are intended; uploaded DOCX/images contain no private information beyond what the portfolio owner chooses to publish.
- **A3:** One administrator edits collections at a time; the server still rejects stale/malformed reorder ID sets and the UI refetches after mutation errors.
- **A4:** Existing `TESTIMONIAL_ADMIN_PASSWORD` and `TESTIMONIAL_ADMIN_SESSION_SECRET` remain configured during the generic environment-variable transition.
- **BLOCKER-1:** None.

## Delivery map

Strategy: Slices
Phase-Rationale: None

### S1. Durable portfolio content and safe public reads

- **Acceptance criteria:** AC-8
- **Depends on:** None
- **Execution skills:** `codebase-design`, `domain-modeling`
- **Outcome:** Supabase has constrained profile/project/achievement schemas and storage buckets, while the application has typed, server-only read/media boundaries with safe public fallbacks.
- **Where:**
  - `supabase/migrations/20260801000000_create_portfolio_content.sql` *(new)* — create singleton `portfolio_profile`, empty `projects` and `achievements` tables, checks/indexes/RLS, seed only the current profile, and create public-read `portfolio-images`/`portfolio-credentials` buckets with allowed MIME/size metadata.
  - `lib/types.ts` — add `PortfolioProfile`, `AvailabilityStatus`, `Project`, `ProjectTechnology`, `ProjectCategory`, and `Achievement` row/view models.
  - `lib/portfolio-content.ts` *(new)* — own current-profile defaults, storage-path-to-public-URL mapping, `getPortfolioProfile`, `getVisibleProjects`, `getVisibleAchievements`, and admin list reads; return defaults/empty arrays on missing configuration or safe read failure.
  - `lib/admin-media.ts` *(new)* — centralize allowlists, size/MIME/extension checks, generated object paths, upload/removal, and ownership-safe bucket/path validation.
  - `next.config.mjs` — add the hostname derived from `NEXT_PUBLIC_SUPABASE_URL` to `images.remotePatterns` without failing when the variable is absent.
- **Behavior and data flow:** Server reads retrieve the singleton profile and ordered, non-archived collections. Stored object paths resolve to public URLs only in the server content mapper. Profile failure returns current hard-coded defaults; collection failure returns empty arrays and logs only safe context/error codes.
- **Correctness constraints:** Database checks enforce singleton identity, enum/category/year/range constraints, exclusive credential source, non-negative positions, and required content. RLS stays enabled with no anonymous table writes. Storage helpers accept only known bucket-relative paths and never delete based on submitted URLs.
- **Verification:** Apply the migration to a test Supabase project; query the profile seed and confirm both collections are empty; run `yarn lint`; temporarily omit Supabase environment values and verify server reads return the profile fallback and empty collections without throwing.
- **Complete when:** Typed reads return seeded/default profile data, empty ordered collections, and valid public media URLs through the server boundary under both configured and missing-service conditions.

### S2. Shared authenticated admin shell with testimonial compatibility

- **Acceptance criteria:** AC-1, AC-9
- **Depends on:** S1
- **Execution skills:** `codebase-design`
- **Outcome:** A single rate-limited login protects a responsive, keyboard-accessible `/admin` shell and existing testimonial moderation runs as one navigation destination.
- **Where:**
  - `lib/admin-auth.ts` *(new)* — generalize signed-cookie, password, same-origin, and request-auth helpers with new environment names plus testimonial-name fallback.
  - `lib/testimonial-admin-auth.ts` — remove after all imports migrate to `lib/admin-auth.ts`.
  - `app/api/admin/login/route.ts` *(new)* — preserve Zod validation, same-origin enforcement, and five-attempt/15-minute IP throttling using a generic throttle key.
  - `app/api/admin/logout/route.ts` *(new)* — clear the generic HttpOnly strict-same-site cookie.
  - `components/admin-login.tsx` *(new)* — generic sign-in UI posting to the shared endpoint.
  - `components/admin-shell.tsx` *(new)* — shared header, sign-out, and responsive semantic navigation for Profile, Projects, Achievements & Certificates, and Testimonials.
  - `app/admin/layout.tsx` *(new)* — force dynamic rendering, validate the cookie once, and render either `AdminLogin` or authenticated shell content.
  - `app/admin/page.tsx` *(new)* — redirect authenticated/default admin visits to `/admin/profile`.
  - `app/admin/testimonials/page.tsx` *(new)* — move server testimonial loading into the shared route.
  - `app/testimonials/admin/page.tsx` — replace current manager rendering with a redirect to `/admin/testimonials`.
  - `components/testimonial-admin-dashboard.tsx` — remove page-level shell/logout ownership while preserving approve, hide, delete, busy, and toast behavior.
  - `components/testimonial-admin-login.tsx`, `app/api/testimonials/admin/login/route.ts`, `app/api/testimonials/admin/logout/route.ts` — remove after generic consumers/routes replace them.
  - `app/api/testimonials/admin/manage/route.ts` — import generic authorization helpers; preserve schema, safe errors, and homepage revalidation.
- **Behavior and data flow:** Login creates one generic signed session. The server layout gates every admin child route; navigation changes route without weakening the guard. Testimonial moderation continues to call its existing manage endpoint, now authorized by the generic session.
- **Correctness constraints:** Cookie stays HttpOnly, Secure in production, strict same-site, 12-hour max age, and timing-safe signed/password comparisons remain. A cookie-name change invalidates old sessions once. Navigation includes current-page semantics and visible keyboard focus. Unauthorized API calls return 401; cross-origin calls return 403.
- **Verification:** Manually test wrong password, throttling, successful login, all four navigation links, sign-out, direct unauthenticated child-route access, and `/testimonials/admin` redirect; approve/hide/delete a fixture testimonial and confirm public visibility/revalidation remains correct.
- **Complete when:** One login reaches every admin destination, Profile is the default, legacy testimonial navigation resolves correctly, and testimonial moderation passes its existing full flow.

### S3. Editable profile and distinct About content

- **Acceptance criteria:** AC-2, AC-3, AC-7, AC-8
- **Depends on:** S1, S2
- **Execution skills:** `tdd`, `codebase-design`
- **Outcome:** The owner can safely edit every agreed profile field and the public sidebar/About render distinct saved content with automatic highlights and unchanged decorative behavior.
- **Where:**
  - `app/admin/profile/page.tsx` *(new)* — load the singleton profile through the authenticated admin route.
  - `components/profile-admin-form.tsx` *(new)* — React Hook Form/Zod UI for display name, availability selector, dark/light image preview/replacement, short bio, Markdown About introduction, ordered Quick Facts, and numeric experience.
  - `components/markdown-editor.tsx` *(new)* — accessible text/preview tabs for limited Markdown.
  - `components/safe-markdown.tsx` *(new)* — central `react-markdown` renderer with no raw HTML/plugins and custom paragraph/strong/inline-code styling.
  - `components/media-upload-field.tsx` *(new)* — reusable image selection, preview, validation feedback, replacement, and accessible removal/change controls.
  - `app/api/admin/profile/route.ts` *(new)* — authenticated multipart update, Zod field validation, dual-image upload handling, database update, compensating cleanup, and homepage revalidation.
  - `app/page.tsx` — make `Portfolio` async, load profile and visible-project count with other homepage content, and pass serialized props to consumers.
  - `components/hero-section.tsx` — accept profile/count props; render saved name/images/bio/status, derive availability/project highlights, format numeric experience, and leave `BUBBLE_MESSAGES`/timers/visuals unchanged.
  - `components/about-section.tsx` — accept profile props, render saved About and ordered Quick Facts through `SafeMarkdown`, and preserve the README heading, green bullet, hover, spacing, bold, and code-chip styles.
- **Behavior and data flow:** The form previews local image selection and submits multipart content to a protected route. The route uploads changed images, updates the singleton row, cleans replaced objects after success, compensates new objects on failure, and revalidates `/`. Public rendering receives one consistent profile model; bio and About are separate values.
- **Correctness constraints:** Display name/bio/About/Quick Fact length limits are enforced client and server; availability is enum-only; experience is an integer within a documented sane range; at least one Quick Fact is not required. Existing local seeded image paths are never passed to Storage deletion. Markdown cannot render raw HTML, links, images, headings, or scripts beyond the agreed strong/inline-code/plain-text presentation.
- **Verification:** Update each field independently and together; replace each theme image and toggle theme; verify validation errors, Markdown bold/chips, Quick Fact add/remove/reorder, all three availability labels/colors, automatic visible-project count, exact experience formatting, distinct bio/About copy, unchanged bubbles, rollback after forced database failure, and homepage update after save. Run `yarn lint`.
- **Complete when:** A save round-trip updates the live homepage exactly once with distinct, safely rendered profile/About content and no regression to theme images, bubbles, highlights, or keyboard behavior.

### S4. Project collection management and public carousel

- **Acceptance criteria:** AC-4, AC-5, AC-7, AC-8
- **Depends on:** S1, S2
- **Execution skills:** `tdd`, `codebase-design`, `domain-modeling`
- **Outcome:** Projects are created and fully managed without code edits, and the existing responsive showcase renders only current Supabase content.
- **Where:**
  - `app/admin/projects/page.tsx` *(new)* — load all ordered projects, including archived rows.
  - `components/projects-admin-dashboard.tsx` *(new)* — active/archived list, create/edit entry points, archive/restore, Move Up/Down, mutation busy/error states, and title-confirmation delete dialog.
  - `components/project-admin-form.tsx` *(new)* — validated image, title, description, category, Coming Soon, technology tag/color, Live URL, and Code URL editor.
  - `components/delete-confirmation-dialog.tsx` *(new)* — shared accessible modal requiring exact title before enabling permanent deletion.
  - `app/api/admin/projects/route.ts` *(new)* — authenticated project create using multipart upload and `max(position) + 1`.
  - `app/api/admin/projects/[id]/route.ts` *(new)* — authenticated multipart update, archive/unarchive, and exact-title-confirmed delete with media compensation/cleanup.
  - `app/api/admin/projects/reorder/route.ts` *(new)* — validate complete UUID ordering and batch-upsert positions in one statement.
  - `app/page.tsx` — load visible projects through `lib/portfolio-content.ts` and pass them into the client section.
  - `components/projects-section.tsx` — delete `const projects`, consume typed props, reset/clamp active selection when data changes, replace star UI with category, remove the bottom development label, suppress Coming Soon links, retain carousel/modal/keyboard/mobile behavior, and render an empty state.
- **Behavior and data flow:** Admin mutations validate and normalize multipart fields, own project images under generated paths, persist content/status/order, return the canonical row, update client state or refetch on error, and revalidate `/`. Public reads filter `archived_at is null` and sort by `position`; the same visible array controls the counter and carousel bounds.
- **Correctness constraints:** Title/description/technology limits, unique tech names, hex colors, enum category, boolean status, `http`/`https` URLs, and image allowlist are enforced twice. Archived rows never render or count. Coming Soon rows render but expose no links even if URLs are stored. Delete validates row title server-side before removing it. Zero/one-project carousel and active-index changes remain safe.
- **Verification:** From empty state, create both categories; test automatic/custom tech colors, omitted/one/both links, Coming Soon/Public rendering, image replacement, edit, archive/count decrement, restore/count increment, up/down boundaries and persistence, mobile/desktop/keyboard/modal flows, wrong and correct delete titles, upload/database failure compensation, unauthorized/cross-origin rejection, and homepage revalidation. Run `yarn lint`.
- **Complete when:** Every project lifecycle operation is reflected in correct public order/status/count without a code edit, and the responsive showcase passes focused accessibility and failure-path checks.

### S5. Achievement management and public timeline

- **Acceptance criteria:** AC-6, AC-7, AC-8
- **Depends on:** S1, S2
- **Execution skills:** `tdd`, `codebase-design`, `domain-modeling`
- **Outcome:** Achievements and downloadable/hosted credentials are managed securely from Admin and rendered through the existing public timeline design.
- **Where:**
  - `app/admin/achievements/page.tsx` *(new)* — load all ordered achievements including archived rows.
  - `components/achievements-admin-dashboard.tsx` *(new)* — active/archived management, create/edit, archive/restore, Move Up/Down, and title-confirm deletion.
  - `components/achievement-admin-form.tsx` *(new)* — validated title, issuer, four-digit year, required thumbnail, and mutually exclusive upload/external credential controls with previews/filenames.
  - `app/api/admin/achievements/route.ts` *(new)* — authenticated multipart create with separate image/credential uploads and final-row compensation.
  - `app/api/admin/achievements/[id]/route.ts` *(new)* — authenticated update/archive/restore/title-confirm-delete with ownership-safe cleanup for both objects.
  - `app/api/admin/achievements/reorder/route.ts` *(new)* — validate the full ordered ID set and batch-upsert positions.
  - `app/page.tsx` — load visible achievements and pass them into the public section.
  - `components/certifications-section.tsx` — remove `const certifications`, accept typed props, preserve ScrollReveal/timeline/badge/link visuals, resolve uploaded credentials versus external URLs, provide correct download/open semantics, and add a matching empty state.
- **Behavior and data flow:** Admin uploads a required thumbnail and either a credential file or external URL. The protected route validates the exclusive source, writes objects and row, compensates failures, and revalidates `/`. Public reads filter archived items, sort positions, and link each timeline row to the resolved credential target.
- **Correctness constraints:** Year is a four-digit integer in an agreed range; URL is `http`/`https`; thumbnail uses the image allowlist; credential uses only PDF/DOCX/JPEG/PNG extension+MIME pairs. Switching credential source removes the superseded stored credential only after database success. Archived entries neither render nor count. Delete title is rechecked server-side.
- **Verification:** Verify initial empty state; create one entry for every upload type and an external URL; reject mismatched/oversized/dual/missing credentials and invalid years; replace thumbnail/credential/source; archive/restore/reorder; confirm wrong/correct delete title; open/download every public credential target; force upload/database/cleanup errors; test unauthorized/cross-origin calls; run `yarn lint`.
- **Complete when:** Every supported credential source completes its admin-to-public flow in saved order with current timeline styling and secure lifecycle cleanup.

### S6. Integrated regression and production-readiness audit

- **Acceptance criteria:** AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9
- **Depends on:** S3, S4, S5
- **Execution skills:** `code-review`
- **Outcome:** The complete CMS works as one coherent portfolio flow and is ready for an approved migration/deployment handoff.
- **Where:**
  - `README.md` — document generic admin environment variables with backward-compatible aliases, Supabase migration/storage prerequisites, `/admin` navigation, supported media types/limits, and the intentional empty project/achievement launch state.
  - `docs/plans/portfolio-admin-content-management--20260801T103102Z.md` — change Status to `IMPLEMENTED` only after all required verification passes; otherwise leave `APPROVED` and record failures during implementation handoff.
  - All paths in S1-S5 — inspect the final diff for hard-coded collection remnants, client secret exposure, stale auth imports/endpoints, object cleanup gaps, inaccessible controls, and acceptance-criteria coverage.
- **Behavior and data flow:** Exercise login, all four admin destinations, all content mutations, public ISR revalidation, theme switching, responsive layouts, and credential access as one story rather than isolated components.
- **Correctness constraints:** No `.env`/`.env.local` is added or staged; no old hard-coded project/certificate is rendered; current profile remains the initial/fallback profile; no mutation bypasses shared auth/same-origin/Zod/file validation; build output contains no service-role key.
- **Verification:** Run `yarn lint`, `yarn build`, inspect `git diff --check`, perform the end-to-end browser matrix at mobile and desktop widths against a migrated test Supabase project, inspect network responses for safe errors, and verify no environment files are tracked/staged.
- **Complete when:** All focused and full checks pass, every acceptance criterion has observable evidence, and any deployment-only migration/environment steps are documented without being executed absent explicit authorization.

## Acceptance coverage

| Acceptance criterion | Delivery slices | Verification |
|---|---|---|
| AC-1 | S2, S6 | Auth failure/success/throttle/sign-out, default Profile route, four navigation destinations, legacy redirect, and full browser regression. |
| AC-2 | S3, S6 | Profile form round-trip, dual image/theme check, safe Markdown preview/render, ordered facts, unchanged bubbles, and integrated browser regression. |
| AC-3 | S3, S6 | Public status/name/bio/About/Quick Fact rendering plus automatic highlights and exact experience-format checks. |
| AC-4 | S4, S6 | Project create/edit/archive/restore/reorder/title-confirm-delete lifecycle and persistence after reload. |
| AC-5 | S4, S6 | Empty state, both categories/statuses, tech colors, links, responsive carousel/modal, and Coming Soon suppression checks. |
| AC-6 | S5, S6 | Empty state and complete achievement lifecycle for every credential source, timeline order, and open/download behavior. |
| AC-7 | S3, S4, S5, S6 | MIME/extension/size/auth/origin rejection plus replacement, failure-compensation, owned-path cleanup, and secret-exposure audit. |
| AC-8 | S1, S3, S4, S5, S6 | Missing-config/read-failure fallbacks, safe error responses/logs, mutation-triggered homepage refresh, lint, and build. |
| AC-9 | S2, S6 | Existing testimonial submit/moderate/public-display flows and login throttling in the shared shell. |

## Verification strategy

| Scope | Command or procedure | Expected evidence |
|---|---|---|
| Schema/storage | Apply `supabase/migrations/20260801000000_create_portfolio_content.sql` to a disposable/test Supabase project and inspect tables, constraints, indexes, RLS, buckets, and profile seed. | Profile has one seeded row; projects/achievements have zero rows; anonymous writes fail; public artifact reads and service-role writes work. |
| Focused static | `yarn lint` after each slice. | Zero ESLint errors, including hooks/accessibility rules exercised by changed files. |
| Focused integrity | `git diff --check` and searches for old `const projects`, `const certifications`, testimonial-auth imports, and service-role use in client files. | No whitespace errors, stale hard-coded collections/auth callers, or secret-bearing client import paths. |
| Focused manual | Run `yarn dev` with migrated test Supabase configuration and execute each slice's browser/API cases. | Canonical saved state survives reload; public view, error, accessibility, media, and cleanup behaviors match each slice. |
| Full | `yarn build`. | Next.js production compilation and strict TypeScript checks succeed for all routes/components. |
| Full story | Desktop and mobile browser pass: login -> edit profile -> create/order/archive/restore/delete projects and achievements -> moderate testimonial -> sign out -> inspect public theme/status/empty/content states. | All AC-1 through AC-9 have end-to-end observable evidence with no console/network errors or broken media. |

Checks requiring an actual Supabase project, configured environment variables, Storage access, and browser interaction cannot run in a configuration-free environment; the implementing agent must run them against an authorized test/development Supabase instance. Applying the migration or deploying remains separately authorized external impact.

## Risks and recovery

| Risk | Prevention or detection | Recovery or rollback |
|---|---|---|
| Migration leaves public Projects/Achievements empty by design. | Admin empty states and README call out the intentional fresh start before rollout. | Add entries through Admin before deployment or revert application reads to the pre-change code until content is ready. |
| Public Storage exposes a credential the owner did not intend to publish. | Form labels explicitly state uploads are public; only allowed credential types are accepted. | Archive/delete the entry and remove the owned credential object through Admin or Supabase Storage. |
| Upload succeeds but database write fails. | Route tracks new object paths and performs compensating deletes; forced-failure verification checks the path. | Remove any logged orphan from the known bucket/prefix and retry the mutation. |
| Database mutation succeeds but old-object cleanup fails. | Cleanup happens after the canonical row commit and logs bucket/path-safe diagnostics. | Remove the orphan from Supabase Storage; current content remains valid and is not rolled back. |
| Concurrent/stale reorder corrupts order. | API validates the submitted ID set and writes all positions in one batch; UI serializes requests/refetches on failure. | Reload canonical order and retry; normalize positions through the same reorder endpoint. |
| Auth generalization locks out the owner or breaks testimonial moderation. | Generic variables fall back to existing testimonial values; S2 validates all auth/moderation paths before old modules/routes are removed. | Restore old auth imports/routes or configure the generic variables, then issue a fresh login cookie. |
| Supabase-hosted images fail Next image optimization. | Add the environment-derived Supabase hostname and verify both themes/project thumbnails in production build/dev. | Temporarily render known Supabase URLs unoptimized while correcting the hostname configuration. |
| Markdown changes the intended GitHub layout or permits unsafe content. | No raw-HTML plugin; a centralized renderer allowlists only agreed node presentations and length limits. | Fall back to plain text rendering for the affected field and correct stored Markdown in Admin. |
| Homepage cache serves stale content after a save. | Every successful mutation calls `revalidatePath("/")` and browser verification reloads the public route. | Trigger another authenticated save or redeploy/revalidate after correcting the affected route. |

## Execution handoff

- **Start with:** S1
- **Prerequisites:** User approval changing this plan from `DRAFT` to `APPROVED`; access to an authorized test/development Supabase project for migration/storage verification; existing Supabase and testimonial-admin environment values. No deployment, commit, or external migration is authorized by plan approval alone.
- **Stop conditions:** Any conflict with uncommitted user changes; inability to create/verify required Supabase tables or buckets; uncertainty that credential files may be public; missing admin credentials; failed lint/build/security checks; or any requested deployment/migration against a non-test external environment without explicit authorization.
