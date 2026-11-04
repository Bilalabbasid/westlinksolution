import type { Database, OnboardingRow } from "./types";

/**
 * Email-only mode: nothing is persisted. Submissions are delivered by the
 * notification email (and optional webhook) and are not stored anywhere on
 * the server. A small in-process map keeps idempotency keys so a double-click
 * on the onboarding form does not send two emails while the process lives.
 */
export function createMemoryDatabase(): Database {
  const onboarding = new Map<string, { id: string; response: string | null; idempotencyKey: string | null }>();
  const MAX_ENTRIES = 500;

  function remember(row: { id: string; response: string | null; idempotencyKey: string | null }) {
    if (onboarding.size >= MAX_ENTRIES) {
      const oldest = onboarding.keys().next().value;
      if (oldest) onboarding.delete(oldest);
    }
    onboarding.set(row.id, row);
  }

  return {
    async init() {},
    async insertContact() {},
    async updateContactDelivery() {},
    async insertOnboarding(row: OnboardingRow) {
      if (row.idempotencyKey) {
        for (const r of onboarding.values()) {
          if (r.idempotencyKey === row.idempotencyKey) throw new Error("duplicate idempotency key");
        }
      }
      remember({ id: row.id, response: null, idempotencyKey: row.idempotencyKey });
    },
    async updateOnboardingDelivery() {},
    async findOnboardingByIdempotencyKey(key: string) {
      for (const r of onboarding.values()) {
        if (r.idempotencyKey === key) return { id: r.id, response: r.response };
      }
      return null;
    },
    async saveOnboardingResponse(id: string, response: string) {
      const r = onboarding.get(id);
      if (r) r.response = response;
    },
    async ping() {},
    async counts() {
      return { contacts: 0, onboarding: onboarding.size };
    },
  };
}
