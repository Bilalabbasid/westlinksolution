# Westlink Solutions — Website Plan

Living document. Last update: 2026-10-11 (implementation complete, verification done; see `VERIFICATION.md`).

## 1. Brand and business requirements

| Item | Value |
| --- | --- |
| Public brand | Westlink Solutions |
| Legal operator | TOPDEVELOPER INC (registered name as supplied by the owner on 2026-10-11; `operatorLegalName` in config) |
| Relationship wording | "Westlink Solutions is operated by TOPDEVELOPER INC." in footer; operator identified in legal pages. No claim of separate incorporation or completed DBA filing. |
| Positioning | B2B customer-acquisition partner: leads, inbound calls, and campaign support for buyers and service providers in insurance, home services, financial services, and legal. |
| Hero message | Reworded from the reference: "Leads that convert. Calls that connect. Growth that lasts." + "Westlink Solutions powers high-intent calls and leads for insurance, financial, and home-service businesses." Hero copy and illustration mention only these three categories. |
| Primary CTA | "Become a Partner" (opens onboarding modal). "Discuss Your Campaign" heads the contact section. |
| Secondary CTA | "Explore industries" → scrolls to `#industries`. |
| Voice | Plain American English, written for business buyers. Westlink does not issue policies, lend money, or represent legal clients. No "fully compliant", guaranteed conversion, exclusive-lead, nationwide, or volume claims. |
| Visual identity | Warm white `#F8FAFC` background, deep navy `#14253D` text, teal `#008C82` primary, muted amber `#E7AD52` secondary, white cards with subtle borders and restrained shadows. Manrope typeface. Original wordmark ("Westlink" + small-caps "Solutions") and a link symbol: a teal rounded square with a white linked-W path and an amber hand-off point. |
| Not permitted | Adzino artwork, logos, staff names, testimonials, partner logos, statistics, contact details, endpoints, analytics, or legal text. |

Central configuration: `src/config/site.ts` (contact details, address, account managers, legal names, response-time wording, consent version, navigation, CTAs). Placeholders are marked `TODO(owner)`.

## 2. Reference feature inventory (adzino.co, inspected 2026-10-11)

Inspected with the in-app browser (desktop 1024px and mobile 375px emulation), DOM extraction, and a Firecrawl full-page capture at 1366px. Nothing was submitted to the reference site.

### Observed structure (desktop)
- Dark theme, Raleway font, boxed header with logo left and three anchor links (About, Industries, Contact).
- Hero: large H1 ("Leads That Convert…"), subtitle, phone-mockup artwork, circular "LET'S TALK" CTA that opens the onboarding modal.
- About: H1 "Your Growth, Engineered by Our Expertise", paragraph, muted autoplay video with a sound toggle.
- Industries: vertical icon tab list (4 tabs) on the left; each pane has heading, two paragraphs, 3–4 sub-service tiles with icons, and a stock photo.
  - Insurance: Final Expense, Auto Insurance, Medicare, Health.
  - Home Services: HVAC, Plumbing, Roofing, "And Many more".
  - "Finance Insurance": Debt Settlement, Student Loans, Mortgage.
  - "Legal Insurance": Torts, SSDI, MVA.
  - Westlink (per owner, 2026-10-12): same tab and service names as the reference, summaries rephrased, Mortgage removed.
- "Business Problems We Solve": 4 columns (Customer Acquisition, Transparency, Compliance Assurance, Ethical Marketing). Contains compliance claims that are not repeated.
- "Our Solutions" gradient band: headline + paragraph.
- "Our Happy Clients": Bootstrap carousel, 3 consumer-style testimonials (not reused).
- Contact: Full Name, Email, Phone (`type="number"` in the reference; Westlink uses `type="tel"`), Message, Submit with loader. Posts to a Google Apps Script URL (not reused).
- Partners: row of insurer logos (not reused).
- Footer: logo, tagline, address, email, phone, links Home / About / Industries / Contact / Terms & Conditions / Privacy Policy / CCPA, copyright.

### Onboarding modal (observed)
- Trigger: hero button. Overlay modal, title "Adzino Marketing Group | Onboarding", close "×", numbered step indicator 1 — 2.
- Step 1: Company*, First Name*, Last Name*, Email*, Phone* (country-code `<select>` with ~50 countries + tel input), Account Manager* (4 radios with named staff, not reused), one checkbox combining terms agreement and SMS consent (Westlink separates these), NEXT.
- Step 2: hint about address autocomplete, Street Address*, City* (local sample-list autocomplete), State or Province* (same), Country* `<select>`, Postal Code*, vertical tag chips (Home Services, ACA, Auto Insurance, Debt, Final Expense, SEO, Solar, Medicare, USA Health, Other), Billing Contact Name, Billing Contact Email, PREV, SUBMIT.
- Loading step and confirmation step ("confirmation in your email … within 24-48 hours").
- Submission posts to `submit_form.php` on the reference host and mirrors to localStorage; IP-geolocation services pre-select the country. None of this is reused.
- Escape closes the modal. Focus did not move into the modal on open. Westlink implements full focus management.

### Mobile (375px)
- Header shows logo + "Menu" button. Menu opens a full-screen dark overlay with About / Industries / Contact, phone and email, and a "Close" button. Hero stacks artwork above headline.

### Legal pages
- `/terms`: "Terms of Use" with ~20 sections (arbitration, disclaimers, IP, voice recording consent, health information, third-party products, trademarks).
- `/privacy-policy`: information collected, how collected, use and sharing, children's privacy, state consumer rights, contact.
- `/ccpa`: "CCPA Request Webform" page; the text references a webform but no form element was present in the rendered DOM. Requests are directed to an email address.
- Westlink drafts its own versions; no reference text is copied.

### Inspection limitations
- Screenshots of the reference below the hero rendered black in the in-app browser (transform-based scrolling/compositing). Layout below the fold was reviewed from the Firecrawl full-page capture and DOM text.
- The reference's server-side handling, confirmation-email behavior, and any CRM were not inspected and are not reproduced.
- The CCPA webform could not be found in the DOM; its behavior is unknown and was not invented.

## 3. Page and component structure (as built)

Stack: Next.js 16.4 (App Router, Cache Components) + React 19 + TypeScript + Tailwind CSS v4. No client analytics.

```
src/
  app/
    layout.tsx                  Manrope font, metadata defaults, skip link, header/footer, onboarding provider
    page.tsx                    Home: Hero, About, Industries, HowItWorks, Challenges, Testimonials*, Partners*, ContactSection + Organization JSON-LD
    terms/, privacy/, california-privacy/   Legal drafts with review markers
    not-found.tsx, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
    api/contact, api/onboarding, api/health, api/places/autocomplete, api/places/details
  components/
    layout/Header.tsx (sticky, mobile panel), Footer.tsx, Logo.tsx, LegalPage.tsx
    home/Hero.tsx, HeroIllustration.tsx (original SVG), Capabilities.tsx, About.tsx, Industries.tsx (tablist), HowItWorks.tsx, Challenges.tsx, Testimonials.tsx, Partners.tsx, Faq.tsx, ContactSection.tsx, CtaBand.tsx
    forms/OnboardingProvider.tsx, OnboardingModal.tsx, OpenOnboardingButton.tsx, ContactForm.tsx, PhoneField.tsx, AddressFields.tsx, VerticalPicker.tsx, Turnstile.tsx, fields.tsx
    ui/Button.tsx, Reveal.tsx, SectionHeading.tsx, CurrentYear.tsx, Toaster.tsx, ContactLink.tsx,
       AnimatedGridPattern.tsx, BlurText.tsx, ShimmerButton.tsx, BorderBeam.tsx, Marquee.tsx (skill-pattern animated primitives on `motion`)
  config/site.ts                Central business configuration
  content/industries.ts, capabilities.ts, challenges.ts, steps.ts, faq.ts, verticals.ts, testimonials.ts, partners.ts
  lib/validation.ts (zod, shared), countries.ts, db/{index,supabase,sqlite,postgres,types}.ts, email.ts, webhook.ts, rate-limit.ts, spam.ts, request.ts
db/postgres.sql                 Manual schema for Postgres
```

* Testimonials and Partners render nothing while their content arrays are empty.

Design differences from the reference: light theme; compact translucent sticky header with inline CTA and a slide-down mobile panel; typographic hero with amber highlight and an original SVG "prospects → hub → partner intake" illustration; horizontal pill tabs with cards instead of a vertical icon rail and stock photo; four-step partnership timeline (new); challenge/approach paired cards on navy; split contact section; navy footer with the operator disclosure. Entrance reveals use IntersectionObserver and are disabled under `prefers-reduced-motion`.

## 4. Form fields and data flow

### Contact form (`POST /api/contact`)
Fields: name (2–120), email, phone (optional, `type="tel"`, validated with libphonenumber, US default), message (10–4000), honeypot `website`, `startedAt`, optional Turnstile token, `sourcePath`.
Flow: client zod validation → POST → origin check → rate limit (10 / 10 min / IP) → body guards → zod → honeypot + timing (+ Turnstile if configured) → insert `contact_submissions` → notification email (if configured) → webhook (if configured) → update delivery flags → `{ ok, id, notificationEmailSent, webhookSent }`. The client shows success only on `ok: true`; otherwise a failure message with retry and the text preserved.

### Onboarding modal (`POST /api/onboarding`)
Step 1: company, firstName, lastName, email, phoneCountry (ISO, full country list with dial codes), phone, accountManager (from config), agreeTerms (required), marketingOptIn (optional, separate).
Step 2: street (server-proxied Google Places autocomplete when configured; manual always), city, state, country (ISO), postalCode, verticals[] (≥1 from the configured list, grouped: Insurance incl. ACA and USA Health; Home Services incl. Solar; Financial; Legal; SEO; Other), billingContactName, billingContactEmail (validated if present).
Recorded: consentVersion, exact terms and marketing texts displayed, both selections, created time, source page, user agent, hashed IP, idempotency key, stored response.
Behavior: progress indicator, Next/Previous, per-step validation with focus on the first invalid field, values preserved across steps, focus trap, Escape to close (blocked while submitting), focus restoration, loading state, failure state with Retry and "Review my answers", success only after the server confirms, confirmation-email sentence only when `confirmationEmailSent` is true, response-time wording from config/server, duplicate protection via per-session `Idempotency-Key` plus disabled submit while pending.

### Storage
Driver priority: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → Supabase REST (production, apply `db/supabase.sql` once, RLS on with no policies); `DATABASE_URL=postgres://…` → PostgreSQL via `pg` (schema auto-created); `file:…` or unset → SQLite for local development. Separate tables `contact_submissions` and `onboarding_submissions`.

## 5. Integration requirements and status

| Integration | Env vars | Status |
| --- | --- | --- |
| Database | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (preferred), or `DATABASE_URL` | SQLite tested end to end. Supabase adapter implemented against `db/supabase.sql`; untested until the owner adds the project credentials. Postgres driver implemented, untested. |
| Notification email (Resend) | `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Implemented. Failure path tested with an invalid key (401 recorded, submission kept). Successful send untested (no key). |
| Applicant confirmation email | `SEND_CONFIRMATION_EMAILS=true` + Resend vars | Implemented; UI only promises it when sent. Untested (no key). |
| CRM / webhook | `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | Implemented and tested against a local receiver: delivery, HMAC signature, HTTP 500 and unreachable failure handling. Real CRM endpoint not supplied. |
| Address autocomplete (Google Places API (New), server proxy) | `GOOGLE_PLACES_API_KEY` | Implemented; untested (no key). Manual entry verified. |
| Spam protection | honeypot + timing always on; `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` optional | Honeypot/timing tested. Turnstile untested (no keys). |
| Rate limiting | none | In-memory per instance; tested. Shared store needed for multi-instance deployments. |
| Indexing | `NEXT_PUBLIC_SITE_URL`, `ALLOW_INDEXING=true` | Tested: preview = noindex + disallow; production flag = index + sitemap. |

## 5b. Redesign pass (2026-10-12)

Built with the `animated-component-libraries` and `motion-framer` skill patterns on `motion` v14: `AnimatedGridPattern`, `BlurText`, `ShimmerButton`, `BorderBeam`, `Marquee`, `useReducedMotionSafe` (hydration-safe), `cn()`. Hero: staggered variant choreography, rotating headline phrase (AnimatePresence), pointer-tilt illustration card with spring motion values, live SMIL routing dots, scroll-parallax backdrop, gesture CTAs, industry signal strip. Sections, legal pages (hero header + sticky TOC), modal, header, footer and 404 restyled. Before/after captures in `docs/screenshots/before` and `docs/screenshots/after`.

## 6. Implementation progress

- [x] Reference inspection (desktop, mobile, modal, forms, legal pages)
- [x] Project scaffold and design tokens
- [x] Config, content, validation schemas
- [x] Layout: header, mobile menu, footer, logo
- [x] Home sections (hero, about, industries, how it works, challenges, testimonials*, partners*, contact)
- [x] Onboarding modal
- [x] Contact form
- [x] API routes, storage, email, webhook, rate limit, spam
- [x] Legal pages (drafts with review markers)
- [x] SEO: metadata, sitemap, robots, OG image, JSON-LD, icon
- [x] Verification pass (`VERIFICATION.md`)
- [x] README / handover

## 7. Unresolved items (for owner)

1. ~~Operator legal name~~ supplied: TOPDEVELOPER INC (used verbatim; adjust capitalization in `site.ts` if the state registry differs).
2. ~~Address, phone, email~~ supplied: info@westlinksolution.com, +1 (650) 308-4707, 44240 Fremont Blvd, Fremont, CA 94538. A dedicated privacy email is optional (`contact.privacyEmail`, falls back to the main email).
3. Named Westlink account managers (placeholder "No preference, assign for me" only).
4. ~~Production domain~~ supplied: westlinksolution.com (`https://westlinksolution.com` set as default; set `NEXT_PUBLIC_SITE_URL` to match, including `www` if the live site uses it).
5. Credentials: Supabase project URL + service-role key (owner said these will be added to the env; run `db/supabase.sql` in that project first), Resend API key + verified sender, CRM webhook URL/secret, Google Places API key, Turnstile keys.
6. ~~Legal review~~ Owner reviewed and approved the Terms, Privacy Policy, and California notice on 2026-10-12; draft notices and review markers removed.
7. Confirm whether Westlink sends SMS/text messages; set `consent.smsMessagingEnabled` accordingly.
8. Approved testimonials and partner logos (components ready, hidden while empty).
9. Confirm the response-time commitment (`responseTimeText`).
10. Choose a hosting platform and, if multi-instance, a shared rate-limit store.
