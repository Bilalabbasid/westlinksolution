import "server-only";

export interface SpamCheckInput {
  website?: string;
  startedAt?: number;
  turnstileToken?: string;
  ip: string | null;
}

export interface SpamCheckResult {
  ok: boolean;
  reason?: string;
}

const MIN_FILL_MS = 2_500;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

/**
 * Layered spam checks: honeypot, fill-time window, and optional Cloudflare
 * Turnstile verification when configured. Never throws.
 */
export async function checkSpam(input: SpamCheckInput): Promise<SpamCheckResult> {
  if (input.website && input.website.length > 0) return { ok: false, reason: "honeypot" };

  if (typeof input.startedAt !== "number" || !Number.isFinite(input.startedAt)) {
    return { ok: false, reason: "missing_timing" };
  }
  const elapsed = Date.now() - input.startedAt;
  if (elapsed < MIN_FILL_MS) return { ok: false, reason: "too_fast" };
  if (elapsed > MAX_FILL_MS) return { ok: false, reason: "stale_form" };

  if (isTurnstileConfigured()) {
    if (!input.turnstileToken) return { ok: false, reason: "captcha_missing" };
    const verified = await verifyTurnstile(input.turnstileToken, input.ip);
    if (!verified) return { ok: false, reason: "captcha_failed" };
  }

  return { ok: true };
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  try {
    const form = new URLSearchParams();
    form.set("secret", process.env.TURNSTILE_SECRET_KEY ?? "");
    form.set("response", token);
    if (ip) form.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(8_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
