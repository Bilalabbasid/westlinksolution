import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { errorResponse, getClientIp, isAllowedOrigin, readJsonBody } from "@/lib/request";


interface AddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
}

/** Resolves a Google place ID into structured address fields (server-side key). */
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return errorResponse(403, "forbidden_origin", "This request is not allowed.");

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return NextResponse.json({ ok: true, enabled: false });

  const ip = getClientIp(request);
  const rate = checkRateLimit(`places-details:${ip ?? "unknown"}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rate.allowed) return errorResponse(429, "rate_limited", "Slow down a little.", {}, { "Retry-After": String(rate.retryAfterSeconds) });

  const parsed = await readJsonBody<{ placeId?: string; sessionToken?: string }>(request);
  if (!parsed.ok) return parsed.response;

  const placeId = String(parsed.body.placeId ?? "").slice(0, 300);
  const sessionToken = String(parsed.body.sessionToken ?? "").slice(0, 64);
  if (!/^[A-Za-z0-9_-]+$/.test(placeId)) return errorResponse(400, "invalid_place", "Invalid place.");

  try {
    const url = new URL(`https://places.googleapis.com/v1/places/${placeId}`);
    if (sessionToken) url.searchParams.set("sessionToken", sessionToken);
    const res = await fetch(url, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "addressComponents,formattedAddress" },
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) {
      console.error("[places] details failed", res.status);
      return NextResponse.json({ ok: false, enabled: true });
    }
    const data = (await res.json()) as { addressComponents?: AddressComponent[]; formattedAddress?: string };
    const comps = data.addressComponents ?? [];
    const pick = (type: string, short = false) => {
      const c = comps.find((x) => x.types?.includes(type));
      return (short ? c?.shortText : c?.longText) ?? "";
    };
    const streetNumber = pick("street_number");
    const route = pick("route");
    const street = [streetNumber, route].filter(Boolean).join(" ") || pick("premise");
    const city = pick("locality") || pick("postal_town") || pick("sublocality") || pick("administrative_area_level_2");
    const state = pick("administrative_area_level_1", true);
    const country = pick("country", true);
    const postalCode = pick("postal_code");

    return NextResponse.json({
      ok: true,
      enabled: true,
      address: { street, city, state, country, postalCode, formatted: data.formattedAddress ?? "" },
    });
  } catch (err) {
    console.error("[places] details error", err);
    return NextResponse.json({ ok: false, enabled: true });
  }
}
