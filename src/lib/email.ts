import "server-only";

export interface EmailResult {
  sent: boolean;
  id?: string;
  error?: string;
}

interface SendArgs {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/** True when the Resend notification channel has everything it needs. */
export function isNotificationEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_TO && process.env.NOTIFY_EMAIL_FROM);
}

/** True when applicant confirmation emails are enabled and sendable. */
export function isConfirmationEmailEnabled(): boolean {
  return process.env.SEND_CONFIRMATION_EMAILS === "true" && Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_FROM);
}

export function getNotificationRecipients(): string[] {
  return (process.env.NOTIFY_EMAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Sends an email through Resend's HTTP API. Never throws: failures are
 * returned so callers can record them and keep the submission intact.
 */
export async function sendEmail(args: SendArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!apiKey || !from) return { sent: false, error: "email_not_configured" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(args.to) ? args.to : [args.to],
        subject: args.subject,
        text: args.text,
        html: args.html,
        reply_to: args.replyTo,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { sent: false, error: `resend_${res.status}: ${body.slice(0, 200)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { sent: true, id: data.id };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "email_send_failed" };
  } finally {
    clearTimeout(timer);
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Renders a simple key/value table used by notification emails. */
export function renderKeyValueEmail(title: string, rows: Array<[string, string]>): { text: string; html: string } {
  const text = `${title}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n`;
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#14253d;line-height:1.5">
<h2 style="margin:0 0 16px">${escapeHtml(title)}</h2>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
</body></html>`;
  return { text, html };
}
