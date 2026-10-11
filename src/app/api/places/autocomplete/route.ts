import { NextResponse } from "next/server";
import { checkRateLimit } from "../../../../lib/rate-limit";
import { errorResponse, getClientIp, isAllowedOrigin, readJsonBody } from "../../../../lib/request";


/**
 * Server-side proxy for Google Places API (New) autocomplete. The API key
 * never reaches the browser. Returns `{ ok: true, enabled: false }` when no
 * key is configured so the client falls back to manual entry.
 */
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return errorResponse(403, "forbidden_origin", "This request is not allowed.");

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return NextResponse.json({ ok: true, enabled: false, suggestions: [] });

  const ip = getClientIp(request);
  const rate = checkRateLimit(`places:${ip ?? "unknown"}`, { limit: 60, windowMs: 60 * 1000 });
  if (!rate.allowed) return errorResponse(429, "rate_limited", "Slow down a little.", {}, { "Retry-After": String(rate.retryAfterSeconds) });

  const parsed = await readJsonBody<{ input?: string; sessionToken?: string; country?: string }>(request);
  if (!parsed.ok) return parsed.response;

  const input = String(parsed.body.input ?? "").trim().slice(0, 200);
  const sessionToken = String(parsed.body.sessionToken ?? "").slice(0, 64);
  const country = String(parsed.body.country ?? "").toUpperCase();
  if (input.length < 3) return NextResponse.json({ ok: true, enabled: true, suggestions: [] });

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
      body: JSON.stringify({
        input,
        sessionToken: sessionToken || undefined,
        includedPrimaryTypes: ["street_address", "premise", "subpremise", "route"],
        includedRegionCodes: /^[A-Z]{2}$/.test(country) ? [country] : undefined,
      }),
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) {
      console.error("[places] autocomplete failed", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: true, enabled: true, suggestions: [], degraded: true });
    }
    const data = (await res.json()) as {
      suggestions?: Array<{ placePrediction?: { placeId: string; text?: { text: string } } }>;
    };
    const suggestions = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is { placeId: string; text?: { text: string } } => Boolean(p?.placeId))
      .slice(0, 6)
      .map((p) => ({ placeId: p.placeId, description: p.text?.text ?? "" }));
    return NextResponse.json({ ok: true, enabled: true, suggestions });
  } catch (err) {
    console.error("[places] autocomplete error", err);
    return NextResponse.json({ ok: true, enabled: true, suggestions: [], degraded: true });
  }
}
