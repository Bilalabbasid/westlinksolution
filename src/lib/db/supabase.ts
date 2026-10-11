import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ContactRow, Database, DeliveryUpdate, OnboardingRow } from "./types";

/**
 * Supabase adapter using the service-role key over the REST API. The key is
 * only ever read on the server. Tables must exist beforehand: apply
 * `db/supabase.sql` in the Supabase SQL editor (or with the CLI).
 */
export function createSupabaseDatabase(url: string, serviceRoleKey: string): Database {
  const client: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "westlink-site" } },
  });

  const fail = (op: string, error: { message: string; code?: string } | null) => {
    if (error) throw new Error(`[supabase] ${op} failed: ${error.message}${error.code ? ` (${error.code})` : ""}`);
  };

  return {
    async init() {
      // Verify the schema exists so misconfiguration surfaces at startup.
      const { error } = await client.from("contact_submissions").select("id", { head: true, count: "exact" }).limit(1);
      if (error) {
        throw new Error(
          `[supabase] cannot reach contact_submissions: ${error.message}. Apply db/supabase.sql to the project first.`,
        );
      }
    },

    async insertContact(row: ContactRow) {
      const { error } = await client.from("contact_submissions").insert({
        id: row.id,
        created_at: row.createdAt,
        name: row.name,
        email: row.email,
        phone: row.phone,
        phone_e164: row.phoneE164,
        message: row.message,
        source_path: row.sourcePath,
        ip_hash: row.ipHash,
        user_agent: row.userAgent,
      });
      fail("insertContact", error);
    },

    async updateContactDelivery(id: string, u: DeliveryUpdate) {
      const { error } = await client
        .from("contact_submissions")
        .update({
          status: u.status,
          notification_email_sent: u.notificationEmailSent,
          confirmation_email_sent: u.confirmationEmailSent,
          webhook_sent: u.webhookSent,
          delivery_error: u.deliveryError,
        })
        .eq("id", id);
      fail("updateContactDelivery", error);
    },

    async insertOnboarding(row: OnboardingRow) {
      const { error } = await client.from("onboarding_submissions").insert({
        id: row.id,
        created_at: row.createdAt,
        company: row.company,
        first_name: row.firstName,
        last_name: row.lastName,
        email: row.email,
        phone_country: row.phoneCountry,
        phone: row.phone,
        phone_e164: row.phoneE164,
        account_manager: row.accountManager,
        agree_terms: row.agreeTerms,
        marketing_opt_in: row.marketingOptIn,
        consent_version: row.consentVersion,
        consent_terms_text: row.consentTermsText,
        consent_marketing_text: row.consentMarketingText,
        street: row.street,
        city: row.city,
        state: row.state,
        country: row.country,
        postal_code: row.postalCode,
        verticals: row.verticals,
        billing_contact_name: row.billingContactName,
        billing_contact_email: row.billingContactEmail,
        source_path: row.sourcePath,
        ip_hash: row.ipHash,
        user_agent: row.userAgent,
        idempotency_key: row.idempotencyKey,
      });
      fail("insertOnboarding", error);
    },

    async updateOnboardingDelivery(id: string, u: DeliveryUpdate) {
      const { error } = await client
        .from("onboarding_submissions")
        .update({
          status: u.status,
          notification_email_sent: u.notificationEmailSent,
          confirmation_email_sent: u.confirmationEmailSent,
          webhook_sent: u.webhookSent,
          delivery_error: u.deliveryError,
        })
        .eq("id", id);
      fail("updateOnboardingDelivery", error);
    },

    async findOnboardingByIdempotencyKey(key: string) {
      const { data, error } = await client
        .from("onboarding_submissions")
        .select("id, response_json")
        .eq("idempotency_key", key)
        .maybeSingle();
      fail("findOnboardingByIdempotencyKey", error);
      return data ? { id: data.id as string, response: (data.response_json as string | null) ?? null } : null;
    },

    async saveOnboardingResponse(id: string, response: string) {
      const { error } = await client.from("onboarding_submissions").update({ response_json: response }).eq("id", id);
      fail("saveOnboardingResponse", error);
    },

    async ping() {
      const { error } = await client.from("contact_submissions").select("id", { head: true, count: "exact" }).limit(1);
      fail("ping", error);
    },

    async counts() {
      const c = await client.from("contact_submissions").select("id", { head: true, count: "exact" });
      const o = await client.from("onboarding_submissions").select("id", { head: true, count: "exact" });
      fail("counts", c.error ?? o.error);
      return { contacts: c.count ?? 0, onboarding: o.count ?? 0 };
    },
  };
}
