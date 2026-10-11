# Verification report — Westlink Solution website

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
- Footer contains “Westlink Solution is operated by TOPDEVELOPER INC.” Testimonial and partner sections are absent while their content lists are empty.
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

## Update: illustration labels and WhatsApp-first phone links (2026-10-11, night)
- Hero illustration labels are now HTML inside SVG `<foreignObject>` with overflow clipping, so text stays inside the pills and cards on every device and font. Labels shortened for balance.
- Phone links open WhatsApp first (`siteConfig.contact.whatsapp`): on touch devices the app link is tried and the dialer (`tel:`) is used if nothing takes over within 1.5 s; on desktop WhatsApp Web opens in a new tab, the number is copied, and the toast offers "Call with your phone app instead". Email links keep the copy-and-open behavior.
- Hostinger deployment notes added to README; `engines.node >= 20` and `.nvmrc` added.
- Toast suite: 14 / 14 pass (including the WhatsApp popup). Full browser suite: 54 / 54 pass. Production build: pass.

## Update: premium redesign with animated components (2026-10-12)
Implemented with the `animated-component-libraries` skill pattern: Magic UI / React Bits style primitives rebuilt in-house on `motion` (no external component downloads): `AnimatedGridPattern`, `BlurText`, `ShimmerButton`, `BorderBeam`, `Marquee`, plus `useReducedMotionSafe` (hydration-safe reduced-motion hook) and the `cn()` utility.
- Hero: animated grid background, word-by-word blur-in headline with gradient highlight, shimmer primary CTA, border-beam illustration card, floating industry badges, trust chips. Stronger type scale (up to 4.35rem display) and eyebrow rules throughout.
- Sections: capability cards with sheen and accent orbs, a scrolling vertical marquee, animated industry panel transitions, a self-drawing step connector, grid-pattern backgrounds on the challenges band and CTA band with beam, polished contact card and footer. Legal pages gained a hero header and a sticky "On this page" table of contents (auto-generated from headings, deep-linkable). 404 page restyled. Modal has an entrance animation and gradient accent.
- All services, copy, forms, integrations, consent recording, and the TOPDEVELOPER INC disclosures are unchanged.
- Verification: type-check, lint, production build pass; browser suite 55 / 55 (new check: no element extends past the 375px viewport outside scroll containers); toast suite 14 / 14; zero console or hydration errors on `/` and `/terms` in both normal and `prefers-reduced-motion: reduce` browsers.
- Before/after screenshots: `docs/screenshots/before/` and `docs/screenshots/after/` (desktop 1440, mobile 375, menu, legal pages).
- Hero second pass with the `motion-framer` skill patterns: staggered variant choreography for the copy column (spring transitions), a rotating headline phrase using `AnimatePresence mode="wait"` with the full sentence kept static for assistive tech, pointer-driven 3D tilt on the illustration card via `useMotionValue` + `useSpring` + `useTransform` (disabled for touch and reduced motion), live routing dots travelling along the illustration links (SMIL `animateMotion`, omitted under reduced motion), scroll-linked parallax orbs via `useScroll`, hover/tap spring gestures on the CTAs, and a non-overlapping industry signal strip under the visual.

## Update: hero layout and responsiveness (2026-10-12, later)
- Hero row widened at xl/2xl (90rem/96rem container) with the visual taking the larger share; illustration labels enlarged; hub rebuilt with the wordmark inside and an opaque "matching and routing" chip so no connector crosses text; connectors start at the hub edge.
- Rotating headline phrase no longer reserves the widest phrase (no wrapped-reserve gap) and wraps on narrow screens; headline scales with the viewport on phones.
- New responsiveness sweep (`docs/responsive.playwright.js`): 320, 375, 414, 768, 1024, 1280, 1440, 1920 px. Checks no horizontal overflow, no element past the viewport outside scroll containers, headline and phrase inside their column, and no console errors. 8 / 8 pass; captures in `docs/screenshots/responsive/`.
- Browser suite 55 / 55, toast suite 14 / 14, production build pass.

## Update: legal pages rewritten from the reference, hero wording, industry tiles (2026-10-12, later)
- Terms of Use and Privacy Policy rewritten to follow the reference documents section by section (acceptance, matching tools and services, proprietary rights, disclaimers, indemnity, arbitration with class-action waiver, US-only provision, DMCA, call recording, health information, user content, third-party products, state availability, trademarks; privacy: categories collected, collection methods, cookies and ad networks, uses, service providers, sales/shares, email marketing, security, children, state consumer rights incl. Nevada and Do Not Track). Wording is Westlink's own; names, addresses, and contacts are Westlink's; review markers remain on items counsel must confirm (consent partner count, governing law, analytics tools, sale/share disclosures).
- Hero headline reworded again with the same intent: "Leads worth calling. Calls worth taking. Growth worth keeping." The hidden duplicate used for screen readers was removed, so selecting or copying the headline no longer repeats each line.
- Industry panel follows the reference layout: name, description, closing tagline, and a 2×2 grid of icon tiles (Final Expense, Auto Insurance, Medicare, Health, etc.) that spring in with a stagger when a tab is chosen. "Industries" in the navigation scrolls to this section.
- Responsive sweep 8 / 8, browser suite 55 / 55, toast suite 14 / 14, production build pass, no console errors.

## Update: search-intent SEO pass and Search Console verification (2026-10-12, later)
- Search-intent research (web search on how insurance, home-services, debt-relief, and legal buyers look for lead vendors) informed the home page title "Lead Generation Company for Insurance, Home Services, Debt & Legal", the meta description, the keyword list (lead generation company, insurance lead generation, live transfer leads, pay per call leads), and the OpenGraph alt text.
- Visible copy carries the same intent: Capabilities heading and intro (lead generation, live-transfer calls, campaign support), Industries heading ("Lead generation for insurance, home services, finance, and legal."), industry tile summaries naming the lead or call type, and five new FAQ entries (what pay-per-call is, live transfers vs inbound calls vs web leads, exclusivity, pricing after discussion, state coverage). No prices, volumes, or performance guarantees were added.
- JSON-LD graph extended with a WebPage node, an Organization contactPoint (sales, US, English), Service areaServed United States, and the FAQPage reflects the 12 questions.
- Google Search Console HTML verification file `public/google4e3facc496f919cf.html` is served at the site root with the exact token (200, text/html).
- Production build with `ALLOW_INDEXING=true` and the production site URL: robots.txt allows crawling, disallows /api/, and points to the sitemap; sitemap lists /, /terms, /privacy, /california-privacy; browser suite 55 / 55, responsive sweep 8 / 8, one h1 per page.

## Known limitations
- Rate limiting is in-memory per server instance. Multi-instance or serverless deployments need a shared store.
- SQLite is for local use; production should use PostgreSQL (`DATABASE_URL=postgres://…`), which is implemented but untested here.
- Node's `node:sqlite` module prints an experimental warning on Node 22/24; it is only used in the SQLite path.
