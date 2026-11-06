/**
 * Slugs of published blog posts, kept free of JSX so `src/proxy.ts` can import
 * it without bundling page code. `src/content/blog.tsx` checks at build time
 * that this list matches its posts, so a missing entry fails the build.
 */
export const blogSlugs = [
  "how-to-vet-a-lead-generation-company",
  "how-much-can-you-pay-per-lead",
  "tcpa-consent-for-lead-buyers-2026",
  "pay-per-call-vs-live-transfers-vs-web-leads",
  "exclusive-vs-shared-leads",
  "speed-to-lead-first-five-minutes",
] as const;
