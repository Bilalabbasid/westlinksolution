import "server-only";

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Suitable for a single server instance (the default Node deployment). For
 * multi-instance or serverless deployments where each instance has its own
 * memory, replace this with a shared store such as Upstash Redis; the call
 * sites only depend on `checkRateLimit`.
 */

interface Bucket {
  timestamps: number[];
}

declare global {
  var __westlinkRateBuckets: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> = globalThis.__westlinkRateBuckets ?? new Map();
globalThis.__westlinkRateBuckets = buckets;

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  // Opportunistic cleanup to keep memory bounded.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.timestamps.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return { allowed: true, remaining: limit - bucket.timestamps.length, retryAfterSeconds: 0 };
}
