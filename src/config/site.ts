/**
 * Central business configuration for Westlink Solutions.
 *
 * Everything that identifies the business (names, contact details, account
 * managers, legal wording, response-time promises) lives here so it can be
 * reviewed and changed in one place. Values marked TODO(owner) are
 * placeholders that must be confirmed before launch.
 */

export const siteConfig = {
  /** Public brand name used across marketing content. */
  brandName: "Westlink Solutions",
  shortName: "Westlink",

  /**
   * Legal operator. Use the exact registered corporate name once supplied.
   * Do not describe Westlink as a separately incorporated company.
   */
  operatorLegalName: "TOPDEVELOPER INC", // registered corporate name as supplied by the owner (2026-10-11)
  operatorDisclosure: "Westlink Solutions is operated by TOPDEVELOPER INC.",

  /** Production domain. Overridden by NEXT_PUBLIC_SITE_URL at build time. */
  defaultSiteUrl: "https://westlinksolution.com",

  tagline: "High-intent calls and leads for insurance, financial, home-service, and legal-protection businesses.",
  description:
    "Westlink Solutions powers high-intent calls and leads for insurance, financial, and home-service businesses, with campaign support from a named account manager.",

  contact: {
    // Leave a value empty ("") to hide it from the site.
    email: "info@westlinksolution.com",
    phone: "+1 (650) 308-4707",
    phoneHref: "tel:+16503084707",
    /** WhatsApp number in international digits (no +). Empty disables WhatsApp-first phone links. */
    whatsapp: "16503084707",
    privacyEmail: "", // falls back to `email` when empty
    address: {
      line1: "44240 Fremont Blvd",
      line2: "",
      city: "Fremont",
      region: "CA",
      postalCode: "94538",
      country: "US",
    },
    hours: "Monday to Friday, 9:00 a.m. to 6:00 p.m. Pacific", // TODO(owner): confirm
  },

  /**
   * Account managers shown in the onboarding modal. Replace with Westlink's
   * team. `id` is stored with the submission, `name` is displayed.
   */
  accountManagers: [
    { id: "unassigned", name: "No preference, assign for me" },
    // TODO(owner): add named Westlink account managers, e.g.
    // { id: "jordan-lee", name: "Jordan Lee" },
  ],

  /**
   * Wording for what happens after a submission. Keep it honest: only commit
   * to what the team actually does.
   */
  responseTimeText: "A Westlink partnerships specialist typically follows up within two business days.", // TODO(owner): confirm

  /**
   * Consent configuration. Bump `version` whenever the displayed wording
   * changes; the version and the exact text are stored with every submission.
   */
  consent: {
    version: "2026-10-11.v1",
    termsText:
      "I agree to the Westlink Solutions Terms of Service and acknowledge the Privacy Policy. I confirm that I am authorized to submit this request on behalf of my company.",
    marketingText:
      "Optional: Westlink may contact me by email and phone about partnership opportunities, campaign updates, and service announcements. I can withdraw this permission at any time.",
    /**
     * Set to true only if Westlink actually sends SMS/text messages. When
     * enabled, the marketing wording below is shown instead and submissions
     * record it under the same `marketingOptIn` flag.
     */
    smsMessagingEnabled: false, // TODO(owner): confirm messaging practices
    marketingTextWithSms:
      "Optional: Westlink may contact me by email, phone, and text message about partnership opportunities, campaign updates, and service announcements. Message and data rates may apply. I can withdraw this permission at any time by replying STOP or contacting Westlink.",
  },

  /** Primary navigation. Hash links scroll on the home page. */
  nav: [
    { label: "About", href: "/#about" },
    { label: "Industries", href: "/#industries" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],

  footerLinks: {
    company: [
      { label: "Home", href: "/" },
      { label: "About Westlink", href: "/#about" },
      { label: "Industries", href: "/#industries" },
      { label: "How partnership works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "California Privacy Notice", href: "/california-privacy" },
    ],
  },

  /** Social profiles. Leave empty until confirmed; empty entries are hidden. */
  social: {
    linkedin: "",
  },

  legal: {
    termsLastUpdated: "October 11, 2026",
    privacyLastUpdated: "October 11, 2026",
    californiaLastUpdated: "October 11, 2026",
    /** Governing law for the Terms draft. TODO(owner): confirm with counsel. */
    governingState: "the State of Delaware", // follows the reference document; confirm with counsel
  },

  cta: {
    primary: "Become a Partner",
    secondary: "Explore industries",
    contact: "Discuss Your Campaign",
  },
} as const;

export type AccountManager = (typeof siteConfig.accountManagers)[number];

/** Resolves the canonical site URL from the environment with a safe fallback. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = raw && raw.length > 0 ? raw : siteConfig.defaultSiteUrl;
  return url.replace(/\/+$/, "");
}

/** Production indexing must be enabled explicitly. */
export function isIndexingAllowed(): boolean {
  return process.env.ALLOW_INDEXING === "true" && process.env.NODE_ENV === "production";
}

export function hasContactEmail(): boolean {
  return siteConfig.contact.email.length > 0;
}

export function hasContactPhone(): boolean {
  return siteConfig.contact.phone.length > 0 && siteConfig.contact.phoneHref.length > 0;
}

export function hasAddress(): boolean {
  return siteConfig.contact.address.line1.length > 0 && siteConfig.contact.address.city.length > 0;
}

export function formatAddress(): string {
  const a = siteConfig.contact.address;
  return [a.line1, a.line2, [a.city, a.region].filter(Boolean).join(", "), a.postalCode]
    .filter((part) => part && part.length > 0)
    .join(", ");
}
