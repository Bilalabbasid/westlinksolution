import "server-only";
import type { Database } from "./types";

export type { ContactRow, Database, DeliveryUpdate, OnboardingRow, SubmissionStatus } from "./types";

const DEFAULT_URL = "none";

declare global {
  var __westlinkDb: Database | undefined;
}

type Driver = "none" | "supabase" | "postgres" | "sqlite" | "unknown";

function resolveDriver(): { driver: Driver; url: string } {
  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (supabaseUrl && serviceKey) return { driver: "supabase", url: supabaseUrl };

  const url = (process.env.DATABASE_URL ?? "").trim() || DEFAULT_URL;
  if (url === "none" || url === "email") return { driver: "none", url };
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return { driver: "postgres", url };
  if (url.startsWith("file:")) return { driver: "sqlite", url };
  return { driver: "unknown", url };
}

/**
 * Returns the configured store. Driver selection, in priority order:
 *  1. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`  → Supabase REST
 *  2. `DATABASE_URL=postgres://…`                   → PostgreSQL via `pg`
 *  3. `DATABASE_URL=file:…`                         → SQLite (local development only)
 *  4. `DATABASE_URL=none` or unset                  → email-only, nothing persisted (default)
 *
 * In email-only mode the notification email is the delivery channel, so the
 * form routes fail the request when that email cannot be sent.
 */
export async function getDb(): Promise<Database> {
  if (globalThis.__westlinkDb) return globalThis.__westlinkDb;

  const { driver, url } = resolveDriver();
  let db: Database;

  if (driver === "none") {
    const { createMemoryDatabase } = await import("./memory");
    db = createMemoryDatabase();
  } else if (driver === "supabase") {
    const { createSupabaseDatabase } = await import("./supabase");
    db = createSupabaseDatabase(url, (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim());
  } else if (driver === "postgres") {
    const { createPostgresDatabase } = await import("./postgres");
    db = createPostgresDatabase(url);
  } else if (driver === "sqlite") {
    const { createSqliteDatabase } = await import("./sqlite");
    db = createSqliteDatabase(url);
  } else {
    throw new Error("DATABASE_URL must be none, file:…, or postgres://…, or set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  await db.init();
  globalThis.__westlinkDb = db;
  return db;
}

export function describeDatabase(): Driver {
  return resolveDriver().driver;
}

/** True when submissions are written to a real database rather than only emailed. */
export function isPersistentStore(): boolean {
  return resolveDriver().driver !== "none";
}
