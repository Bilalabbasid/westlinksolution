# Verification report — Westlink Solutions website

Date: 2026-10-11 · Environment: Windows 11, Node 24.12, Next.js 16.4 (Turbopack), local SQLite database.
All test submissions were isolated to the local build. Nothing was sent to the reference company's endpoints.

## Automated checks

| Area | Result |
| --- | --- |
| Type check (`tsc --noEmit`) | Pass |
| Lint (`eslint src`, React Compiler rules) | Pass, 0 warnings |
| Production build (`next build`) | Pass; all routes compile (static pages, dynamic API routes) |
| Browser suite (Playwright, Chromium) | 54 / 54 checks pass (see list below) |

### Browser suite (desktop 1366px, 1920px; mobile 375px and 320px; reduced motion)
- Exactly one `h1` on home and on each legal page; unique titles; canonical link; `og:image`; Organization JSON-LD naming TOPDEVELOPER INC with the configured email, phone, and Fremont address
- Preview mode renders `noindex, nofollow` and a disallow-all `robots.txt`; production build with `ALLOW_INDEXING=true` serves allow rules and a sitemap with the configured domain.
- No reference branding, staff names, phone/email, partner logos, testimonials, or submission endpoints appear in the HTML. No third-party scripts load.
- Footer contains “Westlink Solutions is operated by TOPDEVELOPER INC.” Testimonial and partner sections are absent while their content lists are empty.
- Every header and footer link resolves (200) and every hash target exists.
- Industry tabs: click, ArrowRight/ArrowLeft/Home/End keyboard navigation, correct panels (HVAC, SSDI, etc.).
- Secondary hero CTA scrolls to the industries section.
- Onboarding modal: opens from hero CTA via keyboard; focus moves inside; Tab/Shift+Tab stay trapped over 45 presses; progress indicator for step 1 and step 2; step-1 validation (7 field errors, focus on first invalid field); email and phone errors; terms consent required and separate from the marketing opt-in (unchecked by default); values preserved across Previous/Next; step-2 validation (6 errors); billing email validated only when present; Escape closes and focus returns to the opener; UI submission accepted by the backend; success state shown only after `ok: true`; no confirmation-email sentence when none was sent; configurable response-time wording shown.
- Contact form: validation errors, `type="tel"` phone input, UI submission accepted, success state.
- Mobile: no horizontal overflow at 375px or 320px; menu button toggles `aria-expanded`; Escape closes the menu; the menu CTA opens the modal.
- Reduced motion: every section is visible with no entrance animation.
- No console errors or hydration warnings during a normal load.

### API checks (curl)
- `GET /api/health` reports database status and integration booleans.
- Method, JSON, content-type and size guards return structured errors (405/400/415/413).
- Validation returns per-field messages (422). Unknown verticals and bad account-manager ids are rejected.
- Honeypot and too-fast submissions are rejected; cross-origin POSTs are rejected (403).
- Rate limiting returns 429 with `Retry-After` (contact: 10 per 10 min per IP; onboarding: 5 per 10 min).
- Onboarding `Idempotency-Key` replay returns the original response with `X-Idempotent-Replay: true` and creates no second row.
- Places proxy returns `enabled: false` without a key so the client stays in manual-entry mode.

### Persistence (SQLite inspected directly)
- `contact_submissions` rows include E.164-normalized phone, source path, hashed IP, user agent, delivery flags.
- `onboarding_submissions` rows include consent version, the exact consent texts displayed, both consent selections, verticals as JSON, billing contact, idempotency key, and the stored response.
- Contact and onboarding submissions are in separate tables.

### Integration delivery (local webhook receiver + invalid Resend key)
- Webhook: both event types delivered; HMAC-SHA256 signature verified by the receiver; payload includes consent details.
- Webhook failure (HTTP 500 and unreachable host): submission still succeeds (`ok: true`), row stored with `status = notification_failed` and the error text; response reports `webhookSent: false`.
- Email with an invalid API key: Resend returned 401; recorded as `delivery_error`, submission still succeeds; UI does not claim an email was sent.
- Not tested (credentials not available): successful Resend delivery, applicant confirmation email, Google Places autocomplete, Cloudflare Turnstile, PostgreSQL driver. Code paths exist and are documented; they must be tested once credentials are supplied.

## Reference inspection limitations
- Screenshots of adzino.co below the hero rendered black in the in-app browser; layout was reviewed from a full-page capture and DOM extraction instead.
- The reference's server-side handlers, confirmation-email behavior, and CRM were not inspected and are not reproduced.
- The reference CCPA page mentions a webform but none was present in the rendered DOM; Westlink's California page uses an email/contact-form request channel instead.

## Update after business details were supplied (2026-10-11, later the same day)
- Config now carries the operator name TOPDEVELOPER INC, info@westlinksolution.com, +1 (650) 308-4707, 44240 Fremont Blvd, Fremont, CA 94538, and the domain westlinksolution.com. Footer, contact section, Organization JSON-LD, and the contact paragraphs of all three legal pages render these values; the related review markers were removed automatically.
- SQLite now uses the rollback journal instead of WAL. The persistent WAL lock files made Turbopack's Tailwind source scan crash on Windows; `data/` and `db/` are also excluded from the scan in `globals.css`. Existing rows were preserved through the change.
- Browser suite re-run: 54 / 54 pass. Production build re-run: pass.

## Update: redesign pass and Supabase support (2026-10-11, evening)
- Hero illustration rebuilt with wider label pills (the earlier version clipped long labels), new section rhythm (tighter paddings, dot-grid backgrounds), a capabilities strip under the hero, industry chips in About, a FAQ section with FAQPage structured data, and a closing CTA band. Nav and footer gained a FAQ link.
- Structured data now emits an `@graph` with Organization, WebSite, Service (offer catalog of all campaign verticals), and FAQPage. Keywords, category, and format-detection metadata added. `manifest.webmanifest` added. `robots.txt` and `sitemap.xml` are generated routes (verified in the production build).
- Supabase adapter added (`src/lib/db/supabase.ts`) and selected automatically when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set; schema in `db/supabase.sql`. Not yet tested: no Supabase credentials were present in the environment at the time of this report.
- Browser suite re-run after the redesign: 54 / 54 pass. Production build: pass.

## Update: toast notifications (2026-10-11, late evening)
- Added a dependency-free toast system (`src/components/ui/Toaster.tsx`): bottom-right stack (bottom-center on phones), `role="status"` for success/info and `role="alert"` for errors, auto-dismiss with hover pause, dismiss button, optional action, reduced-motion aware.
- Contact form and onboarding modal now raise toasts for validation problems, backend failures, and backend-confirmed success, alongside the existing inline states.
- Phone and email links (`src/components/ui/ContactLink.tsx`) copy the value and show a toast with an "Open in calling/mail app" action on desktop, avoiding the operating system "Pick an app" prompt; on touch devices they dial or open mail natively.
- Toast suite (`docs/verify-toast.playwright.js`): 13 / 13 pass. Full browser suite re-run: 54 / 54 pass.

## Known limitations
- Rate limiting is in-memory per server instance. Multi-instance or serverless deployments need a shared store.
- SQLite is for local use; production should use PostgreSQL (`DATABASE_URL=postgres://…`), which is implemented but untested here.
- Node's `node:sqlite` module prints an experimental warning on Node 22/24; it is only used in the SQLite path.
