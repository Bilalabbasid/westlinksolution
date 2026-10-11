export type SubmissionStatus = "received" | "notified" | "notification_failed";

export interface ContactRow {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  phoneE164: string | null;
  message: string;
  sourcePath: string | null;
  ipHash: string | null;
  userAgent: string | null;
}

export interface OnboardingRow {
  id: string;
  createdAt: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  phoneE164: string | null;
  accountManager: string;
  agreeTerms: boolean;
  marketingOptIn: boolean;
  consentVersion: string;
  consentTermsText: string;
  consentMarketingText: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  verticals: string[];
  billingContactName: string | null;
  billingContactEmail: string | null;
  sourcePath: string | null;
  ipHash: string | null;
  userAgent: string | null;
  idempotencyKey: string | null;
}

export interface DeliveryUpdate {
  status: SubmissionStatus;
  notificationEmailSent: boolean;
  confirmationEmailSent: boolean;
  webhookSent: boolean;
  deliveryError: string | null;
}

export interface Database {
  init(): Promise<void>;
  insertContact(row: ContactRow): Promise<void>;
  updateContactDelivery(id: string, update: DeliveryUpdate): Promise<void>;
  insertOnboarding(row: OnboardingRow): Promise<void>;
  updateOnboardingDelivery(id: string, update: DeliveryUpdate): Promise<void>;
  findOnboardingByIdempotencyKey(key: string): Promise<{ id: string; response: string | null } | null>;
  saveOnboardingResponse(id: string, response: string): Promise<void>;
  /** Lightweight connectivity check used by the health endpoint. */
  ping(): Promise<void>;
  /** Counts used by the verification report; not exposed publicly. */
  counts(): Promise<{ contacts: number; onboarding: number }>;
}
