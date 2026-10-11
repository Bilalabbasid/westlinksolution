import "server-only";
import { createHmac } from "node:crypto";

export interface WebhookResult {
  sent: boolean;
  status?: number;
  error?: string;
}

export function isWebhookConfigured(): boolean {
  return Boolean(process.env.CRM_WEBHOOK_URL);
}

/**
 * Delivers a JSON event to the configured CRM/webhook endpoint.
 * When CRM_WEBHOOK_SECRET is set, the body is signed with HMAC-SHA256 and
 * sent in `X-Westlink-Signature: sha256=<hex>`.
 * Never throws.
 */
export async function sendWebhook(event: string, payload: unknown): Promise<WebhookResult> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return { sent: false, error: "webhook_not_configured" };

  const body = JSON.stringify({ event, sentAt: new Date().toISOString(), data: payload });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Westlink-Webhook/1.0",
    "X-Westlink-Event": event,
  };
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (secret) {
    headers["X-Westlink-Signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: controller.signal });
    if (!res.ok) return { sent: false, status: res.status, error: `webhook_${res.status}` };
    return { sent: true, status: res.status };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "webhook_failed" };
  } finally {
    clearTimeout(timer);
  }
}
