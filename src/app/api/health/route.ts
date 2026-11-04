import { connection, NextResponse } from "next/server";
import { describeDatabase, getDb, isPersistentStore } from "../../../lib/db";
import { isConfirmationEmailEnabled, isNotificationEmailConfigured } from "../../../lib/email";
import { isTurnstileConfigured } from "../../../lib/spam";
import { isWebhookConfigured } from "../../../lib/webhook";


/**
 * Operational health check. Reports which integrations are configured
 * (never their values) and whether the database responds.
 */
export async function GET() {
  await connection();
  let database: "ok" | "error" = "ok";
  try {
    const db = await getDb();
    await db.ping();
  } catch (err) {
    console.error("[health] database check failed", err);
    database = "error";
  }

  // Email-only mode has no database to fail, but it needs the notification email.
  const deliverable = isPersistentStore() || isNotificationEmailConfigured();
  const ok = database === "ok" && deliverable;

  return NextResponse.json(
    {
      ok,
      delivery: isPersistentStore() ? "database" : "email-only",
      database: { driver: describeDatabase(), status: database },
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
