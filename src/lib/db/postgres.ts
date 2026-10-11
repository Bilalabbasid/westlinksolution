import { Pool } from "pg";
import type { ContactRow, Database, DeliveryUpdate, OnboardingRow } from "./types";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  phone_e164 TEXT,
  message TEXT NOT NULL,
  source_path TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  notification_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  webhook_sent BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_error TEXT
);

CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  company TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_country TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_e164 TEXT,
  account_manager TEXT NOT NULL,
  agree_terms BOOLEAN NOT NULL,
  marketing_opt_in BOOLEAN NOT NULL,
  consent_version TEXT NOT NULL,
  consent_terms_text TEXT NOT NULL,
  consent_marketing_text TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  verticals JSONB NOT NULL,
  billing_contact_name TEXT,
  billing_contact_email TEXT,
  source_path TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  idempotency_key TEXT UNIQUE,
  response_json TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  notification_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  webhook_sent BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_created ON onboarding_submissions (created_at);
`;

export function createPostgresDatabase(url: string): Database {
  const pool = new Pool({
    connectionString: url,
    max: 5,
    ssl: process.env.DATABASE_SSL === "false" ? undefined : { rejectUnauthorized: false },
  });
  let initialized: Promise<void> | null = null;

  const ensure = () => {
    if (!initialized) {
      initialized = pool.query(SCHEMA).then(() => undefined);
    }
    return initialized;
  };

  return {
    async init() {
      await ensure();
    },

    async insertContact(row: ContactRow) {
      await ensure();
      await pool.query(
        `INSERT INTO contact_submissions
          (id, created_at, name, email, phone, phone_e164, message, source_path, ip_hash, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          row.id,
          row.createdAt,
          row.name,
          row.email,
          row.phone,
          row.phoneE164,
          row.message,
          row.sourcePath,
          row.ipHash,
          row.userAgent,
        ],
      );
    },

    async updateContactDelivery(id: string, u: DeliveryUpdate) {
      await ensure();
      await pool.query(
        `UPDATE contact_submissions
           SET status = $1, notification_email_sent = $2, confirmation_email_sent = $3, webhook_sent = $4, delivery_error = $5
         WHERE id = $6`,
        [u.status, u.notificationEmailSent, u.confirmationEmailSent, u.webhookSent, u.deliveryError, id],
      );
    },

    async insertOnboarding(row: OnboardingRow) {
      await ensure();
      await pool.query(
        `INSERT INTO onboarding_submissions
          (id, created_at, company, first_name, last_name, email, phone_country, phone, phone_e164,
           account_manager, agree_terms, marketing_opt_in, consent_version, consent_terms_text, consent_marketing_text,
           street, city, state, country, postal_code, verticals, billing_contact_name, billing_contact_email,
           source_path, ip_hash, user_agent, idempotency_key)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
        [
          row.id,
          row.createdAt,
          row.company,
          row.firstName,
          row.lastName,
          row.email,
          row.phoneCountry,
          row.phone,
          row.phoneE164,
          row.accountManager,
          row.agreeTerms,
          row.marketingOptIn,
          row.consentVersion,
          row.consentTermsText,
          row.consentMarketingText,
          row.street,
          row.city,
          row.state,
          row.country,
          row.postalCode,
          JSON.stringify(row.verticals),
          row.billingContactName,
          row.billingContactEmail,
          row.sourcePath,
          row.ipHash,
          row.userAgent,
          row.idempotencyKey,
        ],
      );
    },

    async updateOnboardingDelivery(id: string, u: DeliveryUpdate) {
      await ensure();
      await pool.query(
        `UPDATE onboarding_submissions
           SET status = $1, notification_email_sent = $2, confirmation_email_sent = $3, webhook_sent = $4, delivery_error = $5
         WHERE id = $6`,
        [u.status, u.notificationEmailSent, u.confirmationEmailSent, u.webhookSent, u.deliveryError, id],
      );
    },

    async findOnboardingByIdempotencyKey(key: string) {
      await ensure();
      const res = await pool.query<{ id: string; response_json: string | null }>(
        `SELECT id, response_json FROM onboarding_submissions WHERE idempotency_key = $1`,
        [key],
      );
      const row = res.rows[0];
      return row ? { id: row.id, response: row.response_json } : null;
    },

    async saveOnboardingResponse(id: string, response: string) {
      await ensure();
      await pool.query(`UPDATE onboarding_submissions SET response_json = $1 WHERE id = $2`, [response, id]);
    },

    async ping() {
      await ensure();
      await pool.query("SELECT 1");
    },

    async counts() {
      await ensure();
      const c = await pool.query<{ n: string }>("SELECT COUNT(*) AS n FROM contact_submissions");
      const o = await pool.query<{ n: string }>("SELECT COUNT(*) AS n FROM onboarding_submissions");
      return { contacts: Number(c.rows[0].n), onboarding: Number(o.rows[0].n) };
    },
  };
}
