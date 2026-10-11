import "server-only";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const MAX_BODY_BYTES = 64 * 1024;

/** Best-effort client IP from common proxy headers. */
export function getClientIp(request: Request): string | null {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? null;
}

/** One-way hash of the IP so submissions can be correlated without storing raw addresses. */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? "westlink-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export type ParsedBody<T> = { ok: true; body: T } | { ok: false; response: NextResponse };

/** Reads and parses a JSON body with a size limit and safe error responses. */
export async function readJsonBody<T = unknown>(request: Request): Promise<ParsedBody<T>> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse(413, "payload_too_large", "The request is too large.") };
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false, response: errorResponse(415, "unsupported_media_type", "Send JSON.") };
  }
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return { ok: false, response: errorResponse(413, "payload_too_large", "The request is too large.") };
    }
    return { ok: true, body: JSON.parse(text) as T };
  } catch {
    return { ok: false, response: errorResponse(400, "invalid_json", "The request body could not be read.") };
  }
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message, ...extra } }, { status, headers });
}

/** Basic same-origin check: blocks cross-site posts when an Origin header is present. */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    const url = new URL(origin);
    if (host && url.host === host) return true;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (site) {
      const siteHost = new URL(site).host;
      if (url.host === siteHost) return true;
    }
    return false;
  } catch {
    return false;
  }
}
