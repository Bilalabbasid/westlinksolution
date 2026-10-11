import { z } from "zod";
import { isValidPhoneNumber, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { siteConfig } from "@/config/site";
import { verticalValues } from "@/content/verticals";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, min === 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const emailField = (label = "Email") =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(254, `${label} is too long.`)
    .pipe(z.email({ error: `Enter a valid ${label.toLowerCase()} address.` }));

const countryCodeField = z
  .string({ error: "Select a country." })
  .trim()
  .regex(/^[A-Z]{2}$/, "Select a country.");

/** Anti-spam fields shared by every public form. */
const antiSpamFields = {
  /** Honeypot: real users never fill this. */
  website: z.string().max(0, "Invalid submission.").optional().default(""),
  /** Epoch ms when the form was first rendered. */
  startedAt: z.number().int().nonnegative(),
  turnstileToken: z.string().max(4096).optional(),
};

/** Normalizes a phone number to E.164 for the given country. Returns null when invalid. */
export function normalizePhone(phone: string, country?: string): string | null {
  const cc = (country && /^[A-Z]{2}$/.test(country) ? country : "US") as CountryCode;
  const parsed = parsePhoneNumberFromString(phone, cc);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number;
}

export function isPhoneValid(phone: string, country?: string): boolean {
  const cc = (country && /^[A-Z]{2}$/.test(country) ? country : "US") as CountryCode;
  try {
    return isValidPhoneNumber(phone, cc);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Contact form                                                        */
/* ------------------------------------------------------------------ */

export const contactFieldsSchema = z
  .object({
    name: trimmed(2, 120, "Full name"),
    email: emailField(),
    phone: z.string().trim().max(32, "Phone number is too long.").optional().default(""),
    message: trimmed(10, 4000, "Message"),
  })
  .superRefine((data, ctx) => {
    if (data.phone && !isPhoneValid(data.phone, "US")) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number, including the country code for numbers outside the US.",
      });
    }
  });

export const contactSubmissionSchema = z.object({
  ...contactFieldsSchema.shape,
  ...antiSpamFields,
  sourcePath: z.string().max(512).optional(),
});

export type ContactFields = z.infer<typeof contactFieldsSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

/* ------------------------------------------------------------------ */
/* Onboarding modal                                                    */
/* ------------------------------------------------------------------ */

const accountManagerIds: string[] = siteConfig.accountManagers.map((m) => m.id);

export const onboardingStep1Schema = z
  .object({
    company: trimmed(2, 160, "Company"),
    firstName: trimmed(1, 80, "First name"),
    lastName: trimmed(1, 80, "Last name"),
    email: emailField("Work email"),
    phoneCountry: countryCodeField,
    phone: trimmed(1, 32, "Phone number"),
    accountManager: z
      .string({ error: "Choose an account manager option." })
      .refine((v) => accountManagerIds.includes(v), "Choose an account manager option."),
    agreeTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms of Service to continue.",
    }),
    marketingOptIn: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.phone && !isPhoneValid(data.phone, data.phoneCountry)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number for the selected country.",
      });
    }
  });

export const onboardingStep2Schema = z.object({
  street: trimmed(3, 200, "Street address"),
  city: trimmed(1, 120, "City"),
  state: trimmed(1, 120, "State or province"),
  country: countryCodeField,
  postalCode: trimmed(2, 20, "Postal code"),
  verticals: z
    .array(z.string())
    .min(1, "Select at least one campaign vertical.")
    .max(verticalValues.length)
    .refine((list) => list.every((v) => verticalValues.includes(v)), "One or more verticals are not recognized."),
  billingContactName: z.string().trim().max(160, "Billing contact name is too long.").optional().default(""),
  billingContactEmail: z
    .string()
    .trim()
    .max(254, "Billing contact email is too long.")
    .optional()
    .default("")
    .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid billing contact email."),
});

export const onboardingSubmissionSchema = z
  .object({
    ...onboardingStep1Schema.shape,
    ...onboardingStep2Schema.shape,
    ...antiSpamFields,
    consentVersion: z.string().min(1).max(64),
    sourcePath: z.string().max(512).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.phone && !isPhoneValid(data.phone, data.phoneCountry)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number for the selected country.",
      });
    }
  });

export type OnboardingStep1 = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2 = z.infer<typeof onboardingStep2Schema>;
export type OnboardingSubmission = z.infer<typeof onboardingSubmissionSchema>;

/* ------------------------------------------------------------------ */
/* Error mapping                                                       */
/* ------------------------------------------------------------------ */

export type FieldErrors = Record<string, string>;

/** Converts a zod error into a `{ field: message }` map (first message per field). */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Validates data with a schema and returns either parsed data or field errors. */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): { success: true; data: z.infer<T> } | { success: false; errors: FieldErrors } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, errors: toFieldErrors(result.error) };
}
