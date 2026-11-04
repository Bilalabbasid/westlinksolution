import { connection, NextResponse } from "next/server";
import { describeDatabase, getStore } from "../../../lib/db";
import { isConfirmationEmailEnabled, isNotificationEmailConfigured } from "../../../lib/email";
import { isTurnstileConfigured } from "../../../lib/spam";
import { isWebhookConfigured } from "../../../lib/webhook";


/**
 * Operational health check. Reports which integrations are configured
 * (never their values) and whether the database responds.
 */
export async function GET() {
  await connection();
  const store = await getStore();
  let database: "ok" | "error" = store.error ? "error" : "ok";
  if (database === "ok") {
    try {
      await store.db.ping();
    } catch (err) {
      console.error("[health] database check failed", err);
      database = "error";
    }
  }

  // Submissions are deliverable when a database is reachable or email is configured.
  // A configured-but-unreachable database is reported, and email keeps forms working.
  const emailReady = isNotificationEmailConfigured();
  const ok = (store.persistent && database === "ok") || emailReady;

  return NextResponse.json(
    {
      ok,
      delivery: store.persistent && database === "ok" ? "database" : "email-only",
      database: {
        driver: describeDatabase(),
        status: database,
        ...(store.error ? { fallback: "email-only", error: store.error } : {}),
      },
      integrations: {
        notificationEmail: isNotificationEmailConfigured(),
        confirmationEmail: isConfirmationEmailEnabled(),
        crmWebhook: isWebhookConfigured(),
        addressAutocomplete: Boolean(process.env.GOOGLE_PLACES_API_KEY),
        turnstile: isTurnstileConfigured(),
      },
      indexing: process.env.ALLOW_INDEXING === "true" && process.env.NODE_ENV === "production",
    },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
