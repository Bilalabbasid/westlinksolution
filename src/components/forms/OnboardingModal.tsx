"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { onboardingStep1Schema, onboardingStep2Schema, validate, type FieldErrors } from "@/lib/validation";
import { ArrowIcon, Button, Spinner } from "@/components/ui/Button";
import { LogoMark } from "@/components/layout/Logo";
import { AddressFields } from "./AddressFields";
import { CheckboxField, FormStatusMessage, HoneypotField, TextField } from "./fields";
import { PhoneField } from "./PhoneField";
import { Turnstile, TURNSTILE_SITE_KEY } from "./Turnstile";
import { VerticalPicker } from "./VerticalPicker";
import { useToast } from "@/components/ui/Toaster";

interface OnboardingModalProps {
  onClose: () => void;
}

interface FormValues {
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string;
  phone: string;
  accountManager: string;
  agreeTerms: boolean;
  marketingOptIn: boolean;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  verticals: string[];
  billingContactName: string;
  billingContactEmail: string;
}

type Phase = "form" | "submitting" | "error" | "success";

interface SuccessInfo {
  id: string;
  confirmationEmailSent: boolean;
  responseTimeText: string;
}

const initialValues: FormValues = {
  company: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneCountry: "US",
  phone: "",
  accountManager: siteConfig.accountManagers.length === 1 ? siteConfig.accountManagers[0].id : "",
  agreeTerms: false,
  marketingOptIn: false,
  street: "",
  city: "",
  state: "",
  country: "US",
  postalCode: "",
  verticals: [],
  billingContactName: "",
  billingContactEmail: "",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function randomKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().replace(/-/g, "");
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const { toast } = useToast();
  const reduce = useReducedMotionSafe();
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>("form");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [success, setSuccess] = useState<SuccessInfo | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const startedAt = useRef<number>(0);
  const idempotencyKey = useRef<string>("");
  const [sessionToken] = useState<string>(randomKey);
  const inFlight = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    idempotencyKey.current = randomKey();
  }, []);

  const marketingText = siteConfig.consent.smsMessagingEnabled
    ? siteConfig.consent.marketingTextWithSms
    : siteConfig.consent.marketingText;

  const update = useCallback((patch: Partial<FormValues>) => {
    setValues((v) => ({ ...v, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }, []);

  /* ---------------- Focus management ---------------- */

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>("input, select, textarea, button");
    first?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    // Move focus to the start of each step and state change.
    const heading = dialogRef.current?.querySelector<HTMLElement>("[data-step-focus]");
    heading?.focus();
  }, [step, phase]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      if (phase === "submitting") return;
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const firstKey = Object.keys(fieldErrors)[0];
    if (!firstKey) return;
    const find = () =>
      dialogRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"], #${CSS.escape(firstKey)}`) ??
      (firstKey === "verticals" ? dialogRef.current?.querySelector<HTMLElement>(`[id^="vertical-"]`) : null);
    const immediate = find();
    if (immediate) {
      immediate.focus();
      return;
    }
    // The field may belong to a step that is about to render.
    requestAnimationFrame(() => find()?.focus());
  };

  /* ---------------- Step navigation ---------------- */

  const goNext = () => {
    const result = validate(onboardingStep1Schema, {
      company: values.company,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneCountry: values.phoneCountry,
      phone: values.phone,
      accountManager: values.accountManager,
      agreeTerms: values.agreeTerms,
      marketingOptIn: values.marketingOptIn,
    });
    if (!result.success) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      const n = Object.keys(result.errors).length;
      toast({ tone: "error", title: n === 1 ? "One field needs attention" : `${n} fields need attention`, description: "Complete the highlighted fields to continue.", duration: 4000 });
      return;
    }
    setErrors({});
    setStep(2);
    toast({ tone: "info", title: "Step 1 saved", description: "Now add your address and the campaign verticals you want to run.", duration: 3500 });
  };

  const goBack = () => {
    setErrors({});
    setStep(1);
  };

  /* ---------------- Submission ---------------- */

  const submit = async () => {
    if (inFlight.current) return;
    const result = validate(onboardingStep2Schema, {
      street: values.street,
      city: values.city,
      state: values.state,
      country: values.country,
      postalCode: values.postalCode,
      verticals: values.verticals,
      billingContactName: values.billingContactName,
      billingContactEmail: values.billingContactEmail,
    });
    if (!result.success) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      const n = Object.keys(result.errors).length;
      toast({ tone: "error", title: n === 1 ? "One field needs attention" : `${n} fields need attention`, description: "Complete the highlighted fields to submit.", duration: 4000 });
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrors({ turnstile: "Please complete the verification challenge." });
      return;
    }

    inFlight.current = true;
    setPhase("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          startedAt: startedAt.current,
          turnstileToken: turnstileToken || undefined,
          consentVersion: siteConfig.consent.version,
          sourcePath: window.location.pathname,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; id: string; confirmationEmailSent?: boolean; responseTimeText?: string }
        | { ok: false; error?: { code?: string; message?: string; fields?: FieldErrors } }
        | null;

      if (res.ok && data && data.ok) {
        setSuccess({
          id: data.id,
          confirmationEmailSent: Boolean(data.confirmationEmailSent),
          responseTimeText: data.responseTimeText ?? siteConfig.responseTimeText,
        });
        setPhase("success");
        toast({ tone: "success", title: "Application received", description: data.responseTimeText ?? siteConfig.responseTimeText });
        return;
      }

      if (data && !data.ok && data.error?.fields) {
        const fields = data.error.fields;
        setErrors(fields);
        const step1Keys = ["company", "firstName", "lastName", "email", "phoneCountry", "phone", "accountManager", "agreeTerms"];
        setStep(Object.keys(fields).some((k) => step1Keys.includes(k)) ? 1 : 2);
        setPhase("form");
        focusFirstError(fields);
        return;
      }

      const message =
        (data && !data.ok && data.error?.message) ||
        "We could not send your application. Please check your connection and try again.";
      setServerMessage(message);
      setPhase("error");
      toast({ tone: "error", title: "Application not sent", description: message });
    } catch {
      setServerMessage("We could not reach the server. Please check your connection and try again.");
      setPhase("error");
      toast({ tone: "error", title: "Application not sent", description: "We could not reach the server. Your answers are saved in the form." });
    } finally {
      inFlight.current = false;
    }
  };

  const stepTitles = useMemo(() => ["Your company and contact", "Address and campaign details"], []);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && phase !== "submitting") onClose();
  };

  /* ---------------- Render ---------------- */

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-navy/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={onBackdropClick}
      onKeyDown={onKeyDown}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative flex max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.5rem] bg-white shadow-modal sm:max-h-[92dvh] sm:rounded-[1.5rem]"
      >
        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-teal to-amber" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <div>
              <h2 id={titleId} className="text-lg font-extrabold tracking-tight text-navy">
                Become a {siteConfig.shortName} partner
              </h2>
              <p id={descId} className="text-xs text-ink-muted">
                Tell us about your company and the campaigns you want to run.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={phase === "submitting"}
            className="-mr-1 rounded-lg p-2 text-ink-muted transition hover:bg-canvas hover:text-navy disabled:opacity-50"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        {phase !== "success" ? (
          <div className="border-b border-line bg-canvas px-5 py-3 sm:px-7">
            <ol className="flex items-center gap-3" aria-label="Application progress">
              {stepTitles.map((title, i) => {
                const n = (i + 1) as 1 | 2;
                const state = n < step ? "done" : n === step ? "current" : "todo";
                return (
                  <li key={title} className="flex flex-1 items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-extrabold ${
                        state === "done" ? "bg-teal text-white" : state === "current" ? "bg-navy text-white" : "border border-line-strong bg-white text-ink-subtle"
                      }`}
                      aria-hidden="true"
                    >
                      {state === "done" ? "✓" : n}
                    </span>
                    <span className={`hidden text-xs font-bold sm:block ${state === "todo" ? "text-ink-subtle" : "text-navy"}`}>{title}</span>
                    <span className="sr-only">
                      Step {n} of 2: {title}
                      {state === "done" ? " (completed)" : state === "current" ? " (current)" : ""}
                    </span>
                    <span className={`ml-auto h-1 flex-1 rounded-full ${state === "todo" ? "bg-line" : "bg-teal"}`} aria-hidden="true" />
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-xs font-semibold text-ink-muted sm:hidden">
              Step {step} of 2: {stepTitles[step - 1]}
            </p>
          </div>
        ) : null}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {phase === "success" && success ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-navy" tabIndex={-1} data-step-focus>
                Application received
              </h3>
              <p className="mx-auto mt-3 max-w-md text-ink-muted">
                Thanks, {values.firstName}. We have recorded your application for {values.company}. {success.responseTimeText}
              </p>
              {success.confirmationEmailSent ? (
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
                  A confirmation email is on its way to {values.email}. If you do not see it, check your spam folder.
                </p>
              ) : null}
              <p className="mt-4 text-xs text-ink-subtle">Reference: {success.id}</p>
              <div className="mt-6">
                <Button onClick={onClose} variant="primary">
                  Done
                </Button>
              </div>
            </div>
          ) : phase === "error" ? (
            <div className="py-4">
              <h3 className="sr-only" tabIndex={-1} data-step-focus>
                Submission failed
              </h3>
              <FormStatusMessage
                tone="error"
                title="Your application was not sent"
                actions={
                  <>
                    <Button onClick={() => void submit()} variant="primary">
                      Try again
                    </Button>
                    <Button onClick={() => setPhase("form")} variant="secondary">
                      Review my answers
                    </Button>
                  </>
                }
              >
                {serverMessage} Your answers are still here, so nothing needs to be re-entered.
              </FormStatusMessage>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 1) goNext();
                else void submit();
              }}
              aria-busy={phase === "submitting"}
            >
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <h3 className="mb-4 text-base font-extrabold text-navy outline-none" tabIndex={-1} data-step-focus>
                {step === 1 ? "Step 1: Your company and contact" : "Step 2: Address and campaign details"}
              </h3>

              {Object.keys(errors).length > 0 ? (
                <p className="sr-only" role="alert">
                  There are {Object.keys(errors).length} fields that need attention.
                </p>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField id="company" label="Company" required value={values.company} onChange={(e) => update({ company: e.target.value })} error={errors.company} autoComplete="organization" wrapperClassName="sm:col-span-2" disabled={phase === "submitting"} />
                  <TextField id="firstName" label="First name" required value={values.firstName} onChange={(e) => update({ firstName: e.target.value })} error={errors.firstName} autoComplete="given-name" disabled={phase === "submitting"} />
                  <TextField id="lastName" label="Last name" required value={values.lastName} onChange={(e) => update({ lastName: e.target.value })} error={errors.lastName} autoComplete="family-name" disabled={phase === "submitting"} />
                  <TextField id="email" label="Work email" type="email" inputMode="email" required value={values.email} onChange={(e) => update({ email: e.target.value })} error={errors.email} autoComplete="email" wrapperClassName="sm:col-span-2" disabled={phase === "submitting"} />
                  <div className="sm:col-span-2">
                    <PhoneField
                      id="phone"
                      country={values.phoneCountry}
                      phone={values.phone}
                      onCountryChange={(code) => update({ phoneCountry: code })}
                      onPhoneChange={(v) => update({ phone: v })}
                      error={errors.phone}
                      countryError={errors.phoneCountry}
                      disabled={phase === "submitting"}
                    />
                  </div>

                  <fieldset className="sm:col-span-2" aria-describedby={errors.accountManager ? "accountManager-error" : undefined}>
                    <legend className="mb-1.5 text-sm font-bold text-navy">
                      Account manager
                      <span className="ml-1 text-teal-700" aria-hidden="true">
                        *
                      </span>
                    </legend>
                    <p className="mb-2 text-xs text-ink-muted">If someone at Westlink has already been in touch, choose them here.</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {siteConfig.accountManagers.map((m) => (
                        <label
                          key={m.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal ${
                            values.accountManager === m.id ? "border-teal bg-teal-50 text-teal-700" : "border-line-strong bg-white text-navy hover:border-teal"
                          }`}
                        >
                          <input
                            type="radio"
                            name="accountManager"
                            value={m.id}
                            checked={values.accountManager === m.id}
                            onChange={() => update({ accountManager: m.id })}
                            className="h-4 w-4 accent-teal"
                            disabled={phase === "submitting"}
                          />
                          {m.name}
                        </label>
                      ))}
                    </div>
                    {errors.accountManager ? (
                      <p id="accountManager-error" className="mt-1.5 text-sm font-semibold text-danger" role="alert">
                        {errors.accountManager}
                      </p>
                    ) : null}
                  </fieldset>

                  <div className="space-y-3 rounded-xl border border-line bg-canvas p-4 sm:col-span-2">
                    <CheckboxField
                      id="agreeTerms"
                      required
                      checked={values.agreeTerms}
                      onChange={(c) => update({ agreeTerms: c })}
                      error={errors.agreeTerms}
                      disabled={phase === "submitting"}
                      label={
                        <>
                          {siteConfig.consent.termsText.split("Terms of Service")[0]}
                          <Link href="/terms" target="_blank" rel="noopener" className="font-semibold text-teal-700 underline underline-offset-2">
                            Terms of Service
                          </Link>
                          {" and acknowledge the "}
                          <Link href="/privacy" target="_blank" rel="noopener" className="font-semibold text-teal-700 underline underline-offset-2">
                            Privacy Policy
                          </Link>
                          . I confirm that I am authorized to submit this request on behalf of my company.
                          <span className="ml-1 text-teal-700" aria-hidden="true">
                            *
                          </span>
                        </>
                      }
                    />
                    <CheckboxField
                      id="marketingOptIn"
                      checked={values.marketingOptIn}
                      onChange={(c) => update({ marketingOptIn: c })}
                      disabled={phase === "submitting"}
                      label={marketingText}
                    />
                    <p className="text-[0.7rem] text-ink-subtle">Consent version {siteConfig.consent.version} is recorded with your application.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <AddressFields
                    values={{ street: values.street, city: values.city, state: values.state, country: values.country, postalCode: values.postalCode }}
                    errors={errors}
                    onChange={(patch) => update(patch)}
                    sessionToken={sessionToken}
                    disabled={phase === "submitting"}
                  />
                  <VerticalPicker selected={values.verticals} onChange={(v) => update({ verticals: v })} error={errors.verticals} disabled={phase === "submitting"} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField id="billingContactName" label="Billing contact name" value={values.billingContactName} onChange={(e) => update({ billingContactName: e.target.value })} error={errors.billingContactName} autoComplete="off" disabled={phase === "submitting"} />
                    <TextField id="billingContactEmail" label="Billing contact email" type="email" inputMode="email" value={values.billingContactEmail} onChange={(e) => update({ billingContactEmail: e.target.value })} error={errors.billingContactEmail} autoComplete="off" disabled={phase === "submitting"} />
                  </div>
                  {TURNSTILE_SITE_KEY ? (
                    <div>
                      <Turnstile onToken={setTurnstileToken} />
                      {errors.turnstile ? (
                        <p className="mt-1.5 text-sm font-semibold text-danger" role="alert">
                          {errors.turnstile}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Footer actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                {step === 2 ? (
                  <Button variant="secondary" onClick={goBack} disabled={phase === "submitting"}>
                    <ArrowIcon className="h-4 w-4 rotate-180" />
                    Previous
                  </Button>
                ) : (
                  <p className="text-xs text-ink-subtle">
                    <span className="text-teal-700" aria-hidden="true">
                      *
                    </span>{" "}
                    Required field
                  </p>
                )}
                {step === 1 ? (
                  <Button type="submit" variant="primary">
                    Next: address and campaigns
                    <ArrowIcon />
                  </Button>
                ) : (
                  <Button type="submit" variant="primary" disabled={phase === "submitting"} aria-disabled={phase === "submitting"}>
                    {phase === "submitting" ? (
                      <>
                        <Spinner />
                        Sending application…
                      </>
                    ) : (
                      <>
                        Submit application
                        <ArrowIcon />
                      </>
                    )}
                  </Button>
                )}
              </div>
              {phase === "submitting" ? (
                <p className="sr-only" role="status">
                  Sending your application. Please wait.
                </p>
              ) : null}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
