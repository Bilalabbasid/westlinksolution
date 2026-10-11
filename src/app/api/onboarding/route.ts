import { NextResponse } from "next/server";
import { siteConfig } from "../../../config/site";
import { getDb } from "../../../lib/db";
import {
  getNotificationRecipients,
  isConfirmationEmailEnabled,
  isNotificationEmailConfigured,
  renderKeyValueEmail,
  renderOnboardingConfirmationEmail,
  sendEmail,
} from "../../../lib/email";
import { checkRateLimit } from "../../../lib/rate-limit";
import { errorResponse, getClientIp, hashIp, isAllowedOrigin, readJsonBody } from "../../../lib/request";
import { checkSpam } from "../../../lib/spam";
import { normalizePhone, onboardingSubmissionSchema, validate } from "../../../lib/validation";
import { isWebhookConfigured, sendWebhook } from "../../../lib/webhook";


const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const IDEMPOTENCY_RE = /^[A-Za-z0-9_-]{16,128}$/;

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return errorResponse(403, "forbidden_origin", "This request is not allowed.");
    }

    const ip = getClientIp(request);
    const db = await getDb();

    // Duplicate protection: replay the stored response for a known key.
    const rawKey = request.headers.get("idempotency-key")?.trim() ?? "";
    const idempotencyKey = IDEMPOTENCY_RE.test(rawKey) ? rawKey : null;
    if (idempotencyKey) {
      const existing = await db.findOnboardingByIdempotencyKey(idempotencyKey);
      if (existing) {
        if (existing.response) {
          return new NextResponse(existing.response, {
            status: 200,
            headers: { "Content-Type": "application/json", "X-Idempotent-Replay": "true" },
          });
        }
        return NextResponse.json({ ok: true, id: existing.id, replayed: true }, { headers: { "X-Idempotent-Replay": "true" } });
      }
    }

    const rate = checkRateLimit(`onboarding:${ip ?? "unknown"}`, RATE_LIMIT);
    if (!rate.allowed) {
      return errorResponse(
        429,
        "rate_limited",
        "Too many applications were sent from this connection. Please try again in a few minutes.",
        { retryAfterSeconds: rate.retryAfterSeconds },
        { "Retry-After": String(rate.retryAfterSeconds) },
      );
    }

    const parsed = await readJsonBody(request);
    if (!parsed.ok) return parsed.response;

    const validated = validate(onboardingSubmissionSchema, parsed.body);
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
      console.warn("[onboarding] spam check failed", { reason: spam.reason });
      return errorResponse(400, "rejected", "We could not accept this submission. Please refresh the page and try again.");
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const phoneE164 = normalizePhone(data.phone, data.phoneCountry);
    const marketingText = siteConfig.consent.smsMessagingEnabled
      ? siteConfig.consent.marketingTextWithSms
      : siteConfig.consent.marketingText;
    const accountManagerName =
      siteConfig.accountManagers.find((m) => m.id === data.accountManager)?.name ?? data.accountManager;

    try {
      await db.insertOnboarding({
        id,
        createdAt,
        company: data.company,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneCountry: data.phoneCountry,
        phone: data.phone,
        phoneE164,
        accountManager: data.accountManager,
        agreeTerms: data.agreeTerms,
        marketingOptIn: data.marketingOptIn,
        consentVersion: data.consentVersion,
        consentTermsText: siteConfig.consent.termsText,
        consentMarketingText: marketingText,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        verticals: data.verticals,
        billingContactName: data.billingContactName || null,
        billingContactEmail: data.billingContactEmail || null,
        sourcePath: data.sourcePath ?? null,
        ipHash: hashIp(ip),
        userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
        idempotencyKey,
      });
    } catch (err) {
      // A concurrent duplicate may have won the unique-key race.
      if (idempotencyKey) {
        const existing = await db.findOnboardingByIdempotencyKey(idempotencyKey);
        if (existing) {
          return NextResponse.json({ ok: true, id: existing.id, replayed: true }, { headers: { "X-Idempotent-Replay": "true" } });
        }
      }
      throw err;
    }

    const errors: string[] = [];
    let notificationEmailSent = false;
    let confirmationEmailSent = false;
    let webhookSent = false;

    const summaryRows: Array<[string, string]> = [
      ["Submission ID", id],
      ["Received", createdAt],
      ["Company", data.company],
      ["Contact", `${data.firstName} ${data.lastName}`],
      ["Email", data.email],
      ["Phone", `${data.phoneCountry} ${data.phone}${phoneE164 ? ` (${phoneE164})` : ""}`],
      ["Account manager", accountManagerName],
      ["Address", `${data.street}, ${data.city}, ${data.state} ${data.postalCode}, ${data.country}`],
      ["Verticals", data.verticals.join(", ")],
      ["Billing contact", data.billingContactName || "(not provided)"],
      ["Billing email", data.billingContactEmail || "(not provided)"],
      ["Agreed to terms", data.agreeTerms ? "Yes" : "No"],
      ["Marketing opt-in", data.marketingOptIn ? "Yes" : "No"],
      ["Consent version", data.consentVersion],
      ["Source page", data.sourcePath ?? "(unknown)"],
    ];

    if (isNotificationEmailConfigured()) {
      const { text, html } = renderKeyValueEmail(`New partner application for ${siteConfig.brandName}`, summaryRows);
      const result = await sendEmail({
        to: getNotificationRecipients(),
        subject: `[${siteConfig.shortName}] Partner application: ${data.company}`,
        text,
        html,
        replyTo: data.email,
      });
      notificationEmailSent = result.sent;
      if (!result.sent && result.error) errors.push(`email: ${result.error}`);
    }

    if (isConfirmationEmailEnabled()) {
      const { text, html } = renderOnboardingConfirmationEmail({
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        phone: data.phone || undefined,
        accountManagerName,
        verticals: data.verticals,
      });
      const result = await sendEmail({
        to: data.email,
        subject: `We received your ${siteConfig.brandName} partner application`,
        text,
        html,
        replyTo: siteConfig.contact.email,
      });
      confirmationEmailSent = result.sent;
      if (!result.sent && result.error) errors.push(`confirmation: ${result.error}`);
    }

    if (isWebhookConfigured()) {
      const result = await sendWebhook("onboarding.submitted", {
        id,
        createdAt,
        company: data.company,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneCountry: data.phoneCountry,
        phone: data.phone,
        phoneE164,
        accountManager: data.accountManager,
        accountManagerName,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
        },
        verticals: data.verticals,
        billingContactName: data.billingContactName || null,
        billingContactEmail: data.billingContactEmail || null,
        consent: {
          version: data.consentVersion,
          agreeTerms: data.agreeTerms,
          marketingOptIn: data.marketingOptIn,
        },
        sourcePath: data.sourcePath ?? null,
      });
      webhookSent = result.sent;
      if (!result.sent && result.error) errors.push(`webhook: ${result.error}`);
    }

    await db.updateOnboardingDelivery(id, {
      status: errors.length > 0 ? "notification_failed" : "notified",
      notificationEmailSent,
      confirmationEmailSent,
      webhookSent,
      deliveryError: errors.length > 0 ? errors.join("; ").slice(0, 1000) : null,
    });

    if (errors.length > 0) console.error("[onboarding] delivery issues", { id, errors });

    const responseBody = {
      ok: true as const,
      id,
      notificationEmailSent,
      confirmationEmailSent,
      webhookSent,
      responseTimeText: siteConfig.responseTimeText,
    };
    const serialized = JSON.stringify(responseBody);
    if (idempotencyKey) await db.saveOnboardingResponse(id, serialized);

    return new NextResponse(serialized, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[onboarding] unexpected error", err);
    return errorResponse(500, "server_error", "Something went wrong on our side. Please try again.");
  }
}

export function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST.");
}
