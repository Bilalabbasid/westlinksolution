import { connection, NextResponse } from "next/server";
import { describeDatabase, getDb } from "../../../lib/db";
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

  return NextResponse.json(
    {
      ok: database === "ok",
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
    { status: database === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
