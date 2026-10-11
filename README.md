# Westlink Solutions — website

Marketing website and partner-application backend for **Westlink Solutions**, a brand operated by **TOPDEVELOPER INC**

- Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4
- Server-side form endpoints with durable storage (Supabase in production, SQLite for local development, plain Postgres also supported)
- Configurable notification email (Resend), CRM/webhook delivery, Google Places address autocomplete, and Cloudflare Turnstile
- No client-side analytics or third-party scripts by default

See `plan.md` for the reference inventory, architecture, and open items, and `VERIFICATION.md` for the test report.

## Quick start

```bash
npm install
cp .env.example .env.local   # edit values
npm run dev                  # http://localhost:3000
```

The SQLite database is created automatically at `data/westlink.db`. No external services are required to run locally; integrations switch on when their environment variables are set.

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
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Prod (recommended) | Supabase project URL and service-role key (server-only). Apply `db/supabase.sql` once. Takes priority over `DATABASE_URL`. |
| `DATABASE_URL` | Alternative | `postgres://…` for any Postgres (including the Supabase connection string) or `file:./data/westlink.db` for local SQLite |
| `DATABASE_SSL` | No | Set `false` to disable TLS for a local Postgres |
| `RESEND_API_KEY` | For email | Resend API key (server-side only) |
| `NOTIFY_EMAIL_TO` | For email | Comma-separated recipients for new-submission notifications |
| `NOTIFY_EMAIL_FROM` | For email | Verified sender, e.g. `Westlink Solutions <no-reply@yourdomain>` |
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
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # type check
```

## Deployment

1. Create a Supabase project, run `db/supabase.sql` in the SQL editor, and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. (Alternatively set `DATABASE_URL` to a Postgres connection string; tables are then created on first request, see `db/postgres.sql`.)
2. Set `NEXT_PUBLIC_SITE_URL` to the final domain and, for the production deployment only, `ALLOW_INDEXING=true`. Preview deployments must not set it; they serve `noindex` and a disallow-all `robots.txt`.
3. Configure Resend (verify the sending domain), the CRM webhook, Google Places, and Turnstile as needed. Each integration is optional and independent.
4. Set a long random `IP_HASH_SALT`.
5. Deploy with `npm run build` and `npm run start` (Node 20+; Node 24 was used for development), or on Vercel/another Next.js host. The in-memory rate limiter is per instance; for multi-instance or serverless deployments, replace `src/lib/rate-limit.ts` with a shared store (for example Upstash Redis) or add a rate limit at the edge.
6. After deployment, open `/api/health` and confirm `database.status = ok` and the expected integrations read `true`.

## Deploying on Hostinger

This is a Node.js application (not static HTML), so it needs Hostinger's **Node.js hosting** (VPS or a plan that runs Node apps), not plain shared hosting.

1. In hPanel create a Node.js application pointing at this repository (branch `main`), Node 20 or newer. Build command `npm ci && npm run build`, start command `npm run start`. Hostinger passes the port through `PORT`; Next.js honors it.
2. Add the environment variables from the table above. Minimum for production: `NEXT_PUBLIC_SITE_URL=https://westlinksolution.com`, `ALLOW_INDEXING=true`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `IP_HASH_SALT`, plus Resend variables if you want email notifications.
3. Run `db/supabase.sql` once in the Supabase SQL editor before the first request.
4. Point the domain at the app and enable HTTPS. Then open `https://westlinksolution.com/api/health` and confirm `database.driver` is `supabase`, `status` is `ok`, and `indexing` is `true`.
5. If you ever must deploy on a plan that cannot run Node, the forms will not work; the site relies on its API routes for submissions.
6. The build has no outbound network dependencies: the Manrope font is self-hosted in `src/app/fonts/`, so builds succeed even when the build container cannot reach Google Fonts.

On a VPS without hPanel's Node runner, the equivalent is:

```bash
npm ci && npm run build && PORT=3000 npm run start
```

behind Nginx or Caddy as a reverse proxy, kept alive with pm2 or a systemd unit.

## Replacing placeholders before launch

Search the code for `TODO(owner)` and the `[For review: …]` markers on the legal pages. The handover list in `plan.md` section 7 enumerates every open business detail (operator legal name, contact details, account managers, domain, credentials, legal review, testimonials, partners, response-time commitment).
