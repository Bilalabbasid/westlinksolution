# Westlink Solutions — Website Plan

Living document. Updated as work proceeds. Last update: 2026-10-11.

## 1. Brand and business requirements

| Item | Value |
| --- | --- |
| Public brand | Westlink Solutions |
| Legal operator | Top Developers Inc. (exact registered corporate name to be confirmed by owner) |
| Relationship wording | "Westlink Solutions is operated by Top Developers Inc." in footer; operator identified in legal pages. No claim of separate incorporation or completed DBA filing. |
| Positioning | B2B customer-acquisition partner: leads, inbound calls, and campaign support for buyers and service providers in insurance, home services, financial services, and legal. |
| Primary CTA | "Become a Partner" (opens onboarding modal). "Discuss Your Campaign" used as secondary phrasing in the contact area. |
| Secondary CTA | "Explore industries" → scrolls to `#industries`. |
| Voice | Plain American English, written for business buyers. Westlink does not issue policies, lend money, or represent legal clients. No "fully compliant", guaranteed conversion, exclusive-lead, nationwide, or volume claims. |
| Visual identity | Warm white `#F8FAFC` background, deep navy `#14253D` text, teal `#008C82` primary, muted amber `#E7AD52` secondary, white cards with subtle borders. Manrope typeface. Original wordmark + "link" symbol (two interlocking rounded links / nodes joined by a bridge). |
| Not permitted | Adzino artwork, logos, staff names, testimonials, partner logos, statistics, contact details, endpoints, analytics, or legal text. |

Central configuration: `src/config/site.ts` (contact details, address, account managers, legal names, response-time wording, consent version, feature flags). Placeholders are marked `TODO(owner)`.

## 2. Reference feature inventory (adzino.co, inspected 2026-10-11)

Inspected with the in-app browser (desktop 1024px and mobile 375px emulation), DOM extraction, and a Firecrawl full-page capture at 1366px. Nothing was submitted to the reference site.

### Observed structure (desktop)
- Dark theme, Raleway font, boxed header with logo left and three anchor links (About, Industries, Contact).
- Hero: large H1 ("Leads That Convert…"), subtitle, phone-mockup artwork, circular "LET'S TALK" CTA that opens the onboarding modal.
- About: H1 "Your Growth, Engineered by Our Expertise", paragraph, muted autoplay video with "Discover Adzino in 45 seconds" sound toggle.
- Industries: vertical icon tab list (4 tabs) on the left; each pane has heading, two paragraphs, 3–4 sub-service tiles with icons, and a stock photo.
  - Insurance: Final Expense, Auto Insurance, Medicare, Health.
  - Home Services: HVAC, Plumbing, Roofing, "And Many more".
  - "Finance Insurance": Debt Settlement, Student Loans, Mortgage.
  - "Legal Insurance": Torts, SSDI, MVA.
  - Reference copy is written as if addressing consumers ("Protect what matters most…"); Westlink rewrites for B2B buyers.
- "Business Problems We Solve": 4 columns (Customer Acquisition, Transparency, Compliance Assurance, Ethical Marketing). Contains compliance claims we will not repeat verbatim.
- "Our Solutions" gradient band: headline + paragraph.
- "Our Happy Clients": Bootstrap carousel, 3 slides with consumer-style testimonials (not reused).
- Contact: form with Full Name, Email, Phone (`type="number"` in reference — Westlink uses `type="tel"`), Message, Submit with loader. Posts to a Google Apps Script URL (not reused).
- Partners: row of insurer logos (not reused).
- Footer: logo, tagline, address, email, phone, links Home / About / Industries / Contact / Terms & Conditions / Privacy Policy / CCPA, copyright.

### Onboarding modal (observed)
- Trigger: hero button. Overlay modal, title "Adzino Marketing Group | Onboarding", close "×", numbered step indicator 1 — 2.
- Step 1: Company*, First Name*, Last Name*, Email*, Phone* (country-code `<select>` with ~50 countries + tel input), Account Manager* (4 radio buttons with named staff — not reused), single checkbox combining terms agreement and SMS consent (Westlink separates these), NEXT.
- Step 2: hint "Use the search bar to auto complete your address", Street Address*, City* (local sample-list autocomplete), State or Province* (local sample-list autocomplete), Country* (`<select>`), Postal Code*, "What Verticals Would You Like To Run?*" tag chips (Home Services, ACA, Auto Insurance, Debt, Final Expense, SEO, Solar, Medicare, USA Health, Other), Billing Contact Name, Billing Contact Email, PREV, SUBMIT.
- Loading step ("Processing your information…"), confirmation step ("Form completed! … confirmation in your email … within 24-48 hours").
- Submission posts to `submit_form.php` on the reference host and mirrors to localStorage; IP geolocation services pre-select the country. None of this is reused.
- Escape closes the modal. Focus was not moved into the modal on open (focus stayed on the trigger). Westlink implements full focus management.

### Mobile (375px)
- Header shows logo + "Menu" button. Menu opens a full-screen dark overlay with About / Industries / Contact, phone and email, and a "Close" button.
- Hero stacks artwork above headline.

### Legal pages
- `/terms`: "Terms of Use" with ~20 sections (arbitration, disclaimers, IP, voice recording consent, health information, third-party products, trademarks).
- `/privacy-policy`: information collected, how collected, use and sharing, children's privacy, state consumer rights, contact.
- `/ccpa`: "CCPA Request Webform" page; text references a webform but no form element was present in the rendered DOM when inspected. Requests are directed to an email address.
- Westlink drafts its own versions; no reference text is copied.

### Inspection limitations
- Screenshots of the reference below the hero rendered black in the in-app browser (the page uses transform-based scrolling/compositing). Layout below the fold was reviewed from the Firecrawl full-page capture and DOM text, not from live interaction screenshots.
- The reference's server-side handling (`submit_form.php`, Apps Script), confirmation-email behavior, and any CRM were not inspected and are not reproduced. Westlink implements its own backend.
- The CCPA webform could not be found in the DOM; behavior unknown and not invented.

## 3. Page and component structure

Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, no client-side analytics.

```
src/
  app/
    layout.tsx                 Root layout, Manrope font, metadata defaults, skip link
    page.tsx                   Home: Hero, About, Industries, HowItWorks, Challenges, Testimonials*, Partners*, Contact
    terms/page.tsx             Terms of Service (draft)
    privacy/page.tsx           Privacy Policy (draft)
    california-privacy/page.tsx  California privacy notice + request channel (draft)
    sitemap.ts, robots.ts      Generated from config; indexing gated by env
    opengraph-image.tsx        Original generated share artwork
    not-found.tsx
    api/contact/route.ts       POST contact submissions
    api/onboarding/route.ts    POST onboarding submissions
    api/places/autocomplete/route.ts, api/places/details/route.ts  Server-side proxy (only when configured)
  components/
    layout/Header.tsx, MobileMenu.tsx, Footer.tsx, Logo.tsx
    home/Hero.tsx, HeroIllustration.tsx, About.tsx, Industries.tsx, HowItWorks.tsx, Challenges.tsx,
         Testimonials.tsx, Partners.tsx, ContactSection.tsx
    forms/ContactForm.tsx, OnboardingModal.tsx, OnboardingProvider.tsx, PhoneField.tsx, AddressFields.tsx, fields.tsx
    ui/Button.tsx, Reveal.tsx (entrance animation, reduced-motion aware), Container.tsx, SectionHeading.tsx
  config/site.ts               Central business configuration
  content/industries.ts, challenges.ts, steps.ts, testimonials.ts, partners.ts, legal/*
  lib/validation.ts (zod schemas shared by client and server), db/*, email.ts, webhook.ts, rate-limit.ts, spam.ts, phone.ts, countries.ts
```

* Testimonials and Partners render nothing while their content arrays are empty.

## 4. Form fields and data flow

### Contact form (`/api/contact`)
Fields: name (2–120), email, phone (optional, E.164 validated with libphonenumber), message (10–4000), honeypot `website`, `startedAt` timestamp, optional Turnstile token.
Flow: client zod validation → POST JSON → server: rate limit (IP) → honeypot/timing/Turnstile → zod → insert `contact_submissions` (status `received`) → notification email (if configured) → webhook (if configured) → update delivery flags → respond `{ ok, id, emailSent }`. Client shows success only on `ok: true`; otherwise shows failure with Retry.

### Onboarding modal (`/api/onboarding`)
Step 1: company, firstName, lastName, email, phoneCountry (ISO), phone, accountManager (from config list), agreeTerms (required), marketingOptIn (optional, separate checkbox).
Step 2: street, city, state, country, postalCode, verticals[] (≥1 of: Insurance, Final Expense, Auto Insurance, Medicare, Health, ACA, USA Health, Home Services, Financial Services, Debt Settlement, Student Loans, Mortgage, Legal, Torts, SSDI, MVA, SEO, Solar, Other), billingContactName, billingContactEmail (optional, validated if present).
Recorded with submission: consentVersion (from config), agreeTerms, marketingOptIn, consent text shown, submittedAt, user agent, IP (hashed), source page.
Flow mirrors contact. Success screen only after server `ok: true`; "confirmation email" sentence only if `confirmationEmailSent` is true. Response-time wording from config.
Duplicate protection: client idempotency key per modal session sent as `Idempotency-Key`; server stores key with a unique index and returns the original result on replay; submit button disabled while pending.

### Storage
`DATABASE_URL` selects the driver: `file:./data/westlink.db` (SQLite via `node:sqlite`, default for local) or `postgres://…` (via `pg`). Tables: `contact_submissions`, `onboarding_submissions` (separate), plus `idempotency_keys`. Schema auto-created on first use; SQL in `src/lib/db/schema.ts`; `db/postgres.sql` provided for manual provisioning.

## 5. Integration requirements

| Integration | Env vars | Status |
| --- | --- | --- |
| Database (SQLite local / Postgres prod) | `DATABASE_URL` | Implemented; SQLite tested locally. Postgres path written but untested without a database. |
| Notification email (Resend) | `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Implemented; untested without a key (failure path tested). |
| Confirmation email to applicant | `SEND_CONFIRMATION_EMAILS=true` + Resend vars | Implemented; only promised in UI when actually sent. |
| CRM / webhook | `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` (HMAC-SHA256 `X-Westlink-Signature`) | Implemented; tested against a local test receiver. |
| Address autocomplete (Google Places API (New), server-proxied) | `GOOGLE_PLACES_API_KEY` | Implemented; untested without a key. Manual entry always available. |
| Spam protection (Cloudflare Turnstile, optional) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Implemented; untested without keys. Honeypot + timing always on. |
| Indexing | `NEXT_PUBLIC_SITE_URL`, `ALLOW_INDEXING=true` | Only production with explicit flag is indexable. |

## 6. Implementation progress

- [x] Reference inspection (desktop, mobile, modal, forms, legal pages)
- [ ] Project scaffold and design tokens
- [ ] Config, content, validation schemas
- [ ] Layout: header, mobile menu, footer, logo
- [ ] Home sections
- [ ] Onboarding modal
- [ ] Contact form
- [ ] API routes, storage, email, webhook, rate limit, spam
- [ ] Legal pages
- [ ] SEO: metadata, sitemap, robots, OG image, JSON-LD
- [ ] Verification pass
- [ ] README / handover

## 7. Unresolved items (for owner)

- Exact registered corporate name of the operator (currently "Top Developers Inc.").
- Westlink business address, phone number, and email (placeholders in `site.ts`).
- Account manager names (placeholder list in `site.ts`).
- Production domain (`NEXT_PUBLIC_SITE_URL`).
- Credentials: Resend, Postgres, CRM webhook, Google Places, Turnstile.
- Legal review of Terms, Privacy, and California notice drafts; confirm whether SMS messaging is actually used before enabling the SMS consent wording.
- Verified testimonials and partner logos (components are ready, hidden while empty).
- State the actual response-time commitment (`responseTimeText` in config).
