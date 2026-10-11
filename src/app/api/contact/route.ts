import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getDb } from "@/lib/db";
import {
  getNotificationRecipients,
  isNotificationEmailConfigured,
  renderKeyValueEmail,
  sendEmail,
} from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { errorResponse, getClientIp, hashIp, isAllowedOrigin, readJsonBody } from "@/lib/request";
import { checkSpam } from "@/lib/spam";
import { contactSubmissionSchema, normalizePhone, validate } from "@/lib/validation";
import { isWebhookConfigured, sendWebhook } from "@/lib/webhook";


const RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return errorResponse(403, "forbidden_origin", "This request is not allowed.");
    }

    const ip = getClientIp(request);
    const rate = checkRateLimit(`contact:${ip ?? "unknown"}`, RATE_LIMIT);
    if (!rate.allowed) {
      return errorResponse(
        429,
        "rate_limited",
        "Too many messages were sent from this connection. Please try again in a few minutes.",
        { retryAfterSeconds: rate.retryAfterSeconds },
        { "Retry-After": String(rate.retryAfterSeconds) },
      );
    }

    const parsed = await readJsonBody(request);
    if (!parsed.ok) return parsed.response;

    const validated = validate(contactSubmissionSchema, parsed.body);
    if (!validated.success) {
      return errorResponse(422, "validation_failed", "Please correct the highlighted fields.", {
        fields: validated.errors,
      });
    }
    const data = validated.data;

    const spam = await checkSpam({
      website: data.website,
      startedAt: data.startedAt,
      turnstileToken: data.turnstileToken,
      ip,
    });
    if (!spam.ok) {
      // Respond with a generic validation-style error so bots learn nothing useful.
      console.warn("[contact] spam check failed", { reason: spam.reason });
      return errorResponse(400, "rejected", "We could not accept this submission. Please refresh the page and try again.");
    }

    const db = await getDb();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const phoneE164 = data.phone ? normalizePhone(data.phone, "US") : null;

    await db.insertContact({
      id,
      createdAt,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      phoneE164,
      message: data.message,
      sourcePath: data.sourcePath ?? null,
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
    });

    // Downstream delivery: never fail the request because of these.
    const errors: string[] = [];
    let notificationEmailSent = false;
    let webhookSent = false;

    if (isNotificationEmailConfigured()) {
      const { text, html } = renderKeyValueEmail(`New contact message for ${siteConfig.brandName}`, [
        ["Submission ID", id],
        ["Received", createdAt],
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.phone || "(not provided)"],
        ["Message", data.message],
        ["Source page", data.sourcePath ?? "(unknown)"],
      ]);
      const result = await sendEmail({
        to: getNotificationRecipients(),
        subject: `[${siteConfig.shortName}] Contact message from ${data.name}`,
        text,
        html,
        replyTo: data.email,
      });
      notificationEmailSent = result.sent;
      if (!result.sent && result.error) errors.push(`email: ${result.error}`);
    }

    if (isWebhookConfigured()) {
      const result = await sendWebhook("contact.submitted", {
        id,
        createdAt,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        phoneE164,
        message: data.message,
        sourcePath: data.sourcePath ?? null,
      });
      webhookSent = result.sent;
      if (!result.sent && result.error) errors.push(`webhook: ${result.error}`);
    }

    await db.updateContactDelivery(id, {
      status: errors.length > 0 ? "notification_failed" : "notified",
      notificationEmailSent,
      confirmationEmailSent: false,
      webhookSent,
      deliveryError: errors.length > 0 ? errors.join("; ").slice(0, 1000) : null,
    });

    if (errors.length > 0) console.error("[contact] delivery issues", { id, errors });

    return NextResponse.json({ ok: true, id, notificationEmailSent, webhookSent });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return errorResponse(500, "server_error", "Something went wrong on our side. Please try again.");
  }
}

export function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST.");
}
