# Westlink Solution — website

Marketing website and partner-application backend for **Westlink Solution**, a brand operated by **TOPDEVELOPER INC**

- Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4
- Server-side form endpoints that email every submission through Resend (email-only by default; optional Postgres, SQLite, or Supabase storage)
- Configurable notification email (Resend), CRM/webhook delivery, Google Places address autocomplete, and Cloudflare Turnstile
- No client-side analytics or third-party scripts by default

See `plan.md` for the reference inventory, architecture, and open items, and `VERIFICATION.md` for the test report.

## Quick start

```bash
npm install
cp .env.example .env.local   # edit values
npm run dev                  # http://localhost:3000
```

By default nothing is stored: each submission is emailed to `NOTIFY_EMAIL_TO` through Resend, so set `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, and `NOTIFY_EMAIL_TO` in `.env.local` before testing the forms. Set `DATABASE_URL=file:./data/westlink.db` to also keep a local SQLite copy.

## Central configuration

All business details live in [`src/config/site.ts`](src/config/site.ts):

| Setting | Purpose |
| --- | --- |
| `brandName`, `operatorLegalName`, `operatorDisclosure` | Brand and legal operator wording (footer and legal pages) |
| `contact.*` | Email, phone, privacy email, address, hours. Empty values are hidden from the site. |
| `accountManagers` | Options shown in the onboarding modal. Replace the placeholder with Westlink's team. |
| `responseTimeText` | Follow-up promise shown after submissions and in confirmation emails |
| `consent.*` | Consent wording and version. Bump `version` whenever the wording changes. Set `smsMessagingEnabled` only if Westlink sends text messages. |
| `legal.*` | Last-updated dates and governing state for the Terms |
| `nav`, `footerLinks`, `cta` | Navigation and call-to-action labels |

Content lives in `src/content/` (industries, challenges, partnership steps, verticals, testimonials, partners). The testimonial and partner sections stay hidden until their arrays contain approved entries.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical origin, e.g. `https://westlinksolution.com`. Used for canonical links, sitemap, robots, Open Graph. |
| `ALLOW_INDEXING` | Prod only | Must be `true` **and** `NODE_ENV=production` for search engines to be allowed. Leave unset on previews. |
| `DATABASE_URL` | Optional | `none` (default): email-only, nothing stored. `postgres://…` for any Postgres or `file:./data/westlink.db` for local SQLite to also keep a copy. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase REST storage (server-only key). Apply `db/supabase.sql` once. Takes priority over `DATABASE_URL`. |
| `DATABASE_SSL` | No | Set `false` to disable TLS for a local Postgres |
| `RESEND_API_KEY` | For email | Resend API key (server-side only) |
| `NOTIFY_EMAIL_TO` | For email | Comma-separated recipients for new-submission notifications |
| `NOTIFY_EMAIL_FROM` | For email | Verified sender, e.g. `Westlink Solution <no-reply@yourdomain>` |
| `SEND_CONFIRMATION_EMAILS` | No | `true` to email applicants a receipt. The UI mentions the email only when it was actually sent. |
| `CRM_WEBHOOK_URL` | For CRM | Endpoint that receives a JSON POST per submission |
| `CRM_WEBHOOK_SECRET` | No | When set, requests carry `X-Westlink-Signature: sha256=<HMAC-SHA256 of body>` |
| `GOOGLE_PLACES_API_KEY` | For autocomplete | Google Places API (New) key, used only on the server through `/api/places/*` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile; both required to enable |
| `IP_HASH_SALT` | Recommended | Salt for the one-way IP hash stored with submissions |

Check what is active at any time with `GET /api/health` (reports booleans only, never values).

## Data flow

- `POST /api/contact` → origin check → rate limit (10 per 10 min per IP) → JSON size/type check → zod validation → honeypot, fill-time, optional Turnstile → insert `contact_submissions` → notification email → webhook → record delivery flags → `{ ok, id, notificationEmailSent, webhookSent }`.
- `POST /api/onboarding` → same pipeline with an `Idempotency-Key` header: a replayed key returns the original response (`X-Idempotent-Replay: true`) instead of creating a duplicate. Stores the consent version, the exact consent texts shown, both consent selections, and the selected verticals in `onboarding_submissions`.
- Success states in the UI render only after the server responds `ok: true`. If email or webhook delivery fails, the submission is still stored with `status = notification_failed` and the error text, and the server logs it.

Webhook payload shape:

```json
{ "event": "onboarding.submitted", "sentAt": "2026-10-11T12:00:00.000Z", "data": { "id": "…", "company": "…", "verticals": ["Medicare"], "consent": { "version": "2026-10-11.v1", "agreeTerms": true, "marketingOptIn": false } } }
```

## Scripts

```bash
npm run dev      # development server
npm run build    # production build (webpack; `npm run build:turbopack` for the Turbopack bundler)
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # type check
```

## Deployment

1. Set `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM` (a sender on a domain verified in Resend), and `NOTIFY_EMAIL_TO`. Every submission is emailed there; no database is needed. To also store submissions, set `DATABASE_URL` to a Postgres connection string (tables are created on first request, see `db/postgres.sql`) or configure Supabase with `db/supabase.sql`.
2. Set `NEXT_PUBLIC_SITE_URL` to the final domain and, for the production deployment only, `ALLOW_INDEXING=true`. Preview deployments must not set it; they serve `noindex` and a disallow-all `robots.txt`.
3. Configure Resend (verify the sending domain), the CRM webhook, Google Places, and Turnstile as needed. Each integration is optional and independent.
4. Set a long random `IP_HASH_SALT`.
5. Deploy with `npm run build` and `npm run start` (Node 20+; Node 24 was used for development), or on Vercel/another Next.js host. The in-memory rate limiter is per instance; for multi-instance or serverless deployments, replace `src/lib/rate-limit.ts` with a shared store (for example Upstash Redis) or add a rate limit at the edge.
6. After deployment, open `/api/health` and confirm `database.status = ok` and the expected integrations read `true`.

## Deploying on Hostinger (Node.js web app)

Per Hostinger's Node.js documentation, the site deploys as a **Node.js web app** on Business or Cloud plans (hPanel → Websites → Add Website → Node.js web app → Import Git repository). Hostinger auto-detects Next.js and pre-fills the settings; use these values:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Branch | `main` |
| Node.js version | 22 (20 and 24 also work) |
| Package manager | npm (detected from `package-lock.json`) |
| Build command | `npm run build` (runs `next build --webpack`) |
| Output directory | `.next` |
| Entry file | leave empty (Hostinger starts Next.js with `npm start`) |

Environment variables (hPanel → the app → Environment Variables), minimum for production:

```
NEXT_PUBLIC_SITE_URL=https://westlinksolution.com
ALLOW_INDEXING=true
DATABASE_URL=none
RESEND_API_KEY=<Resend API key>
NOTIFY_EMAIL_FROM=Westlink Solution <info@westlinksolution.com>
NOTIFY_EMAIL_TO=abbasi.bilal2000@gmail.com
IP_HASH_SALT=<long random string>
```

Add `SEND_CONFIRMATION_EMAILS=true` if applicants should get a confirmation, and the optional CRM, Places, and Turnstile variables as needed. No database is required: forms are delivered by email, and the form shows an error if Resend rejects the send (for example when `NOTIFY_EMAIL_FROM` uses a domain that is not verified in Resend).

After the build turns green, open `https://westlinksolution.com/api/health` and confirm `ok` is `true`, `delivery` is `email-only`, `integrations.notificationEmail` is `true`, and `indexing` is `true`. Pushes to `main` redeploy automatically. If a build fails, open the deployment in hPanel for the full log; the build has no outbound network dependencies (fonts are self-hosted) and uses webpack, which is the more robust bundler in Hostinger's build containers.

## Replacing placeholders before launch

Search the code for `TODO(owner)` and the `[For review: …]` markers on the legal pages. The handover list in `plan.md` section 7 enumerates every open business detail (operator legal name, contact details, account managers, domain, credentials, legal review, testimonials, partners, response-time commitment).
