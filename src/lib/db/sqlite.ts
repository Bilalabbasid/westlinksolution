import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { ContactRow, Database, DeliveryUpdate, OnboardingRow } from "./types";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  phone_e164 TEXT,
  message TEXT NOT NULL,
  source_path TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  notification_email_sent INTEGER NOT NULL DEFAULT 0,
  confirmation_email_sent INTEGER NOT NULL DEFAULT 0,
  webhook_sent INTEGER NOT NULL DEFAULT 0,
  delivery_error TEXT
);

CREATE TABLE IF NOT EXISTS onboarding_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  company TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_country TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_e164 TEXT,
  account_manager TEXT NOT NULL,
  agree_terms INTEGER NOT NULL,
  marketing_opt_in INTEGER NOT NULL,
  consent_version TEXT NOT NULL,
  consent_terms_text TEXT NOT NULL,
  consent_marketing_text TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  verticals TEXT NOT NULL,
  billing_contact_name TEXT,
  billing_contact_email TEXT,
  source_path TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  idempotency_key TEXT UNIQUE,
  response_json TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  notification_email_sent INTEGER NOT NULL DEFAULT 0,
  confirmation_email_sent INTEGER NOT NULL DEFAULT 0,
  webhook_sent INTEGER NOT NULL DEFAULT 0,
  delivery_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_created ON onboarding_submissions (created_at);
`;

function resolveFilePath(url: string): string {
  const raw = url.replace(/^file:/, "");
  if (raw === ":memory:") return raw;
  // The file path comes from configuration, so static tracing cannot scope it.
  return path.isAbsolute(raw) ? raw : path.resolve(/* turbopackIgnore: true */ process.cwd(), raw);
}

export function createSqliteDatabase(url: string): Database {
  const file = resolveFilePath(url);
  let db: DatabaseSync | null = null;

  const open = () => {
    if (db) return db;
    if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });
    db = new DatabaseSync(file);
    // Rollback journal instead of WAL: no persistent -wal/-shm lock files, so
    // dev tooling that watches the project tree can read the directory safely.
    db.exec("PRAGMA journal_mode = DELETE;");
    db.exec("PRAGMA synchronous = FULL;");
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(SCHEMA);
    return db;
  };

  return {
    async init() {
      open();
    },

    async insertContact(row: ContactRow) {
      open()
        .prepare(
          `INSERT INTO contact_submissions
            (id, created_at, name, email, phone, phone_e164, message, source_path, ip_hash, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
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
        );
    },

    async updateContactDelivery(id: string, u: DeliveryUpdate) {
      open()
        .prepare(
          `UPDATE contact_submissions
             SET status = ?, notification_email_sent = ?, confirmation_email_sent = ?, webhook_sent = ?, delivery_error = ?
           WHERE id = ?`,
        )
        .run(
          u.status,
          u.notificationEmailSent ? 1 : 0,
          u.confirmationEmailSent ? 1 : 0,
          u.webhookSent ? 1 : 0,
          u.deliveryError,
          id,
        );
    },

    async insertOnboarding(row: OnboardingRow) {
      open()
        .prepare(
          `INSERT INTO onboarding_submissions
            (id, created_at, company, first_name, last_name, email, phone_country, phone, phone_e164,
             account_manager, agree_terms, marketing_opt_in, consent_version, consent_terms_text, consent_marketing_text,
             street, city, state, country, postal_code, verticals, billing_contact_name, billing_contact_email,
             source_path, ip_hash, user_agent, idempotency_key)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
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
          row.agreeTerms ? 1 : 0,
          row.marketingOptIn ? 1 : 0,
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
        );
    },

    async updateOnboardingDelivery(id: string, u: DeliveryUpdate) {
      open()
        .prepare(
          `UPDATE onboarding_submissions
             SET status = ?, notification_email_sent = ?, confirmation_email_sent = ?, webhook_sent = ?, delivery_error = ?
           WHERE id = ?`,
        )
        .run(
          u.status,
          u.notificationEmailSent ? 1 : 0,
          u.confirmationEmailSent ? 1 : 0,
          u.webhookSent ? 1 : 0,
          u.deliveryError,
          id,
        );
    },

    async findOnboardingByIdempotencyKey(key: string) {
      const row = open()
        .prepare(`SELECT id, response_json FROM onboarding_submissions WHERE idempotency_key = ?`)
        .get(key) as { id: string; response_json: string | null } | undefined;
      return row ? { id: row.id, response: row.response_json } : null;
    },

    async saveOnboardingResponse(id: string, response: string) {
      open().prepare(`UPDATE onboarding_submissions SET response_json = ? WHERE id = ?`).run(response, id);
    },

    async ping() {
      open().prepare("SELECT 1").get();
    },

    async counts() {
      const d = open();
      const c = d.prepare("SELECT COUNT(*) AS n FROM contact_submissions").get() as { n: number };
      const o = d.prepare("SELECT COUNT(*) AS n FROM onboarding_submissions").get() as { n: number };
      return { contacts: Number(c.n), onboarding: Number(o.n) };
    },
  };
}
