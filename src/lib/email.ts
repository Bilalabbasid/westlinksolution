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

interface BrandedLayoutOptions {
  title: string;
  badge?: string;
  recipientName?: string;
  bodyHtml: string;
  details?: Array<[string, string]>;
  actionText?: string;
  actionUrl?: string;
}

/**
 * Renders a responsive, modern HTML email template with Westlink Solution branding.
 * Compatible with Gmail, Apple Mail, Outlook, and mobile clients.
 */
export function renderBrandedEmailHtml(opts: BrandedLayoutOptions): string {
  const brandName = "Westlink Solution";
  const siteUrl = "https://westlinksolution.com";
  const supportEmail = "info@westlinksolution.com";
  const phone = "+1 (650) 308-4707";
  const phoneHref = "tel:+16503084707";

  const detailsTable =
    opts.details && opts.details.length > 0
      ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#f8fafc">
      ${opts.details
        .map(
          ([label, val]) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;width:35%;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#14253d;font-size:13px;white-space:pre-wrap;vertical-align:top">${escapeHtml(val)}</td>
        </tr>`,
        )
        .join("")}
    </table>`
      : "";

  const actionButton =
    opts.actionText && opts.actionUrl
      ? `
    <div style="margin-top:24px;text-align:left">
      <a href="${escapeHtml(opts.actionUrl)}" style="display:inline-block;background-color:#008c82;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:6px">${escapeHtml(opts.actionText)}</a>
    </div>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#14253d;-webkit-font-smoothing:antialiased">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:32px 16px">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(20,37,61,0.06);overflow:hidden">
          
          <!-- Header Bar with Brand Identity -->
          <tr>
            <td style="background:#14253d;padding:24px 28px;border-bottom:3px solid #008c82">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:38px;height:38px;background-color:#008c82;border-radius:8px;text-align:center;vertical-align:middle">
                          <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;line-height:38px;display:inline-block">W</span>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle">
                          <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.2px;line-height:1.1">${brandName}</div>
                          <div style="font-size:10px;font-weight:700;color:#e7ad52;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px">High-Intent Lead Solutions</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  ${
                    opts.badge
                      ? `<td align="right" style="vertical-align:middle">
                    <span style="display:inline-block;background:rgba(255,255,255,0.12);color:#e2e8f0;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;letter-spacing:0.3px">${escapeHtml(opts.badge)}</span>
                  </td>`
                      : ""
                  }
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Body Content -->
          <tr>
            <td style="padding:32px 28px">
              ${
                opts.recipientName
                  ? `<div style="font-size:15px;color:#64748b;margin-bottom:12px">Hello ${escapeHtml(opts.recipientName)},</div>`
                  : ""
              }
              <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:700;color:#14253d;line-height:1.3">${escapeHtml(opts.title)}</h1>
              
              <div style="font-size:15px;line-height:1.6;color:#334155">
                ${opts.bodyHtml}
              </div>

              ${detailsTable}
              ${actionButton}

              <!-- Direct Contact Box -->
              <div style="margin-top:28px;padding:16px;background-color:#f8fafc;border-left:3px solid #008c82;border-radius:4px">
                <div style="font-size:13px;font-weight:700;color:#14253d;margin-bottom:4px">Need immediate assistance?</div>
                <div style="font-size:13px;color:#64748b;line-height:1.5">
                  Reach our team directly by replying to this email, writing to <a href="mailto:${supportEmail}" style="color:#008c82;text-decoration:none;font-weight:600">${supportEmail}</a>, or calling <a href="${phoneHref}" style="color:#008c82;text-decoration:none;font-weight:600">${phone}</a>.
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 28px;border-top:1px solid #e2e8f0;text-align:center">
              <div style="font-size:13px;font-weight:700;color:#14253d;margin-bottom:4px">${brandName}</div>
              <div style="font-size:12px;color:#64748b;line-height:1.6">
                44240 Fremont Blvd, Fremont, CA 94538<br>
                Westlink Solution is operated by TOPDEVELOPER INC.
              </div>
              <div style="margin-top:12px">
                <a href="${siteUrl}" style="font-size:12px;color:#008c82;text-decoration:none;font-weight:600">westlinksolution.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Renders key/value table used by internal team notification emails. */
export function renderKeyValueEmail(title: string, rows: Array<[string, string]>): { text: string; html: string } {
  const text = `${title}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n`;
  const html = renderBrandedEmailHtml({
    title,
    badge: "Internal Notification",
    bodyHtml: `<p style="margin:0 0 8px 0">A new submission was received on <strong>westlinksolution.com</strong>. The details are below:</p>`,
    details: rows,
  });
  return { text, html };
}

export interface ContactConfirmationData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/** Renders branded confirmation email sent to the user after filling out the contact form. */
export function renderContactConfirmationEmail(data: ContactConfirmationData): { text: string; html: string } {
  const firstName = data.name.trim().split(" ")[0] || "there";
  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for contacting Westlink Solution. We have received your request and our team is already reviewing your inquiry.",
    "",
    "A Westlink partnerships specialist typically follows up within one to two business days.",
    "",
    `Submission Reference: ${data.id}`,
    data.phone ? `Phone: ${data.phone}` : "",
    `Your Message: ${data.message}`,
    "",
    "If you have any urgent questions, feel free to reply directly to this email or call +1 (650) 308-4707.",
    "",
    "Best regards,",
    "The Westlink Solution Team",
    "https://westlinksolution.com",
    "Operated by TOPDEVELOPER INC.",
  ]
    .filter(Boolean)
    .join("\n");

  const bodyHtml = `
    <p style="margin:0 0 14px 0">
      Thank you for reaching out to <strong>Westlink Solution</strong>. We have received your request and our partnerships team is already reviewing your details.
    </p>
    <div style="background-color:#e6f6f4;border:1px solid #b3e5e0;border-radius:6px;padding:12px 16px;margin:16px 0">
      <span style="font-size:13px;font-weight:700;color:#008c82">What happens next?</span>
      <p style="margin:4px 0 0 0;font-size:13px;color:#134e48;line-height:1.5">
        A Westlink partnerships specialist typically follows up within one to two business days.
      </p>
    </div>
    <p style="margin:0;font-size:14px;color:#64748b">
      A summary of your submission is included below for your reference:
    </p>
  `;

  const details: Array<[string, string]> = [
    ["Reference ID", data.id],
    ["Name", data.name],
    ["Email", data.email],
  ];
  if (data.phone) details.push(["Phone", data.phone]);
  details.push(["Message", data.message]);

  const html = renderBrandedEmailHtml({
    title: "We have received your request",
    badge: "Request Received",
    recipientName: firstName,
    bodyHtml,
    details,
  });

  return { text, html };
}

export interface OnboardingConfirmationData {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  accountManagerName?: string;
  verticals?: string[];
}

/** Renders branded confirmation email sent to applicants after submitting the partner onboarding form. */
export function renderOnboardingConfirmationEmail(data: OnboardingConfirmationData): { text: string; html: string } {
  const text = [
    `Hi ${data.firstName},`,
    "",
    `Thank you for applying to partner with Westlink Solution. We have received your application for ${data.company}.`,
    "",
    "A Westlink partnerships specialist typically follows up within one to two business days.",
    "",
    `Application Reference: ${data.id}`,
    `Company: ${data.company}`,
    data.accountManagerName ? `Assigned Account Manager: ${data.accountManagerName}` : "",
    data.verticals && data.verticals.length > 0 ? `Selected Verticals: ${data.verticals.join(", ")}` : "",
    "",
    "If you have any questions in the meantime, reply directly to this email or call +1 (650) 308-4707.",
    "",
    "Best regards,",
    "The Westlink Solution Team",
    "https://westlinksolution.com",
    "Operated by TOPDEVELOPER INC.",
  ]
    .filter(Boolean)
    .join("\n");

  const bodyHtml = `
    <p style="margin:0 0 14px 0">
      Thank you for applying to partner with <strong>Westlink Solution</strong>. We have successfully received your partner application for <strong>${escapeHtml(data.company)}</strong>.
    </p>
    <div style="background-color:#e6f6f4;border:1px solid #b3e5e0;border-radius:6px;padding:12px 16px;margin:16px 0">
      <span style="font-size:13px;font-weight:700;color:#008c82">What to expect next:</span>
      <p style="margin:4px 0 0 0;font-size:13px;color:#134e48;line-height:1.5">
        A Westlink partnerships specialist typically follows up within one to two business days to discuss campaign volume, vertical matching, and onboarding timelines.
      </p>
    </div>
    <p style="margin:0;font-size:14px;color:#64748b">
      Here are the details we recorded for your application:
    </p>
  `;

  const details: Array<[string, string]> = [
    ["Reference ID", data.id],
    ["Company", data.company],
    ["Contact Person", `${data.firstName} ${data.lastName}`.trim()],
    ["Email", data.email],
  ];
  if (data.phone) details.push(["Phone", data.phone]);
  if (data.accountManagerName) details.push(["Account Manager", data.accountManagerName]);
  if (data.verticals && data.verticals.length > 0) details.push(["Verticals", data.verticals.join(", ")]);

  const html = renderBrandedEmailHtml({
    title: "We received your partner application",
    badge: "Application Received",
    recipientName: data.firstName,
    bodyHtml,
    details,
  });

  return { text, html };
}
