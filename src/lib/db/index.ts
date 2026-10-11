import "server-only";
import type { Database } from "./types";

export type { ContactRow, Database, DeliveryUpdate, OnboardingRow, SubmissionStatus } from "./types";

const DEFAULT_URL = "file:./data/westlink.db";

declare global {
  var __westlinkDb: Database | undefined;
}

type Driver = "supabase" | "postgres" | "sqlite" | "unknown";

function resolveDriver(): { driver: Driver; url: string } {
  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (supabaseUrl && serviceKey) return { driver: "supabase", url: supabaseUrl };

  const url = (process.env.DATABASE_URL ?? DEFAULT_URL).trim();
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return { driver: "postgres", url };
  if (url.startsWith("file:")) return { driver: "sqlite", url };
  return { driver: "unknown", url };
}

/**
 * Returns the configured database. Driver selection, in priority order:
 *  1. `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`  → Supabase REST (recommended)
 *  2. `DATABASE_URL=postgres://…`                   → PostgreSQL via `pg`
 *  3. `DATABASE_URL=file:…` or unset                → SQLite (local development only)
 */
export async function getDb(): Promise<Database> {
  if (globalThis.__westlinkDb) return globalThis.__westlinkDb;

  const { driver, url } = resolveDriver();
  let db: Database;

  if (driver === "supabase") {
    const { createSupabaseDatabase } = await import("./supabase");
    db = createSupabaseDatabase(url, (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim());
  } else if (driver === "postgres") {
    const { createPostgresDatabase } = await import("./postgres");
    db = createPostgresDatabase(url);
  } else if (driver === "sqlite") {
    const { createSqliteDatabase } = await import("./sqlite");
    db = createSqliteDatabase(url);
  } else {
    throw new Error("DATABASE_URL must start with file: or postgres://, or set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  await db.init();
  globalThis.__westlinkDb = db;
  return db;
}

export function describeDatabase(): Driver {
  return resolveDriver().driver;
}
