-- Westlink Solutions — Supabase schema
-- Run once in the Supabase SQL editor (Dashboard → SQL) or with `supabase db push`.
-- The site writes through the service-role key on the server only. Row Level
-- Security is enabled with no policies, so the anon/public keys cannot read or
-- write these tables.

create table if not exists public.contact_submissions (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  phone_e164 text,
  message text not null,
  source_path text,
  ip_hash text,
  user_agent text,
  status text not null default 'received',
  notification_email_sent boolean not null default false,
  confirmation_email_sent boolean not null default false,
  webhook_sent boolean not null default false,
  delivery_error text
);

create table if not exists public.onboarding_submissions (
  id text primary key,
  created_at timestamptz not null default now(),
  company text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_country text not null,
  phone text not null,
  phone_e164 text,
  account_manager text not null,
  agree_terms boolean not null,
  marketing_opt_in boolean not null,
  consent_version text not null,
  consent_terms_text text not null,
  consent_marketing_text text not null,
  street text not null,
  city text not null,
  state text not null,
  country text not null,
  postal_code text not null,
  verticals jsonb not null,
  billing_contact_name text,
  billing_contact_email text,
  source_path text,
  ip_hash text,
  user_agent text,
  idempotency_key text unique,
  response_json text,
  status text not null default 'received',
  notification_email_sent boolean not null default false,
  confirmation_email_sent boolean not null default false,
  webhook_sent boolean not null default false,
  delivery_error text
);

create index if not exists idx_contact_created on public.contact_submissions (created_at desc);
create index if not exists idx_onboarding_created on public.onboarding_submissions (created_at desc);
create index if not exists idx_onboarding_email on public.onboarding_submissions (email);

alter table public.contact_submissions enable row level security;
alter table public.onboarding_submissions enable row level security;

-- No policies are created on purpose: only the service-role key (server) can
-- access these tables. Add read policies later if you build an internal
-- dashboard with authenticated users.
