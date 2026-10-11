-- Westlink Solutions — PostgreSQL schema
-- The application creates these tables automatically on first use when
-- DATABASE_URL points at Postgres. This file is provided for teams that
-- prefer to provision the schema manually or restrict the app's DDL rights.

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
