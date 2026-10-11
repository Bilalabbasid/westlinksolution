"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { contactFieldsSchema, validate, type FieldErrors } from "@/lib/validation";
import { ArrowIcon, Button, Spinner } from "@/components/ui/Button";
import { FormStatusMessage, HoneypotField, TextAreaField, TextField } from "./fields";
import { Turnstile, TURNSTILE_SITE_KEY } from "./Turnstile";

interface Values {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type Phase = "idle" | "submitting" | "error" | "success";

const empty: Values = { name: "", email: "", phone: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [lastId, setLastId] = useState<string | null>(null);
  const startedAt = useRef(0);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update = (patch: Partial<Values>) => {
    setValues((v) => ({ ...v, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  };

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const key = Object.keys(fieldErrors)[0];
    if (!key) return;
    formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(key)}`)?.focus();
  };

  const submit = async () => {
    if (inFlight.current) return;
    const result = validate(contactFieldsSchema, values);
    if (!result.success) {
      setErrors(result.errors);
      focusFirstError(result.errors);
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          startedAt: startedAt.current,
          turnstileToken: turnstileToken || undefined,
          sourcePath: window.location.pathname,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; id: string }
        | { ok: false; error?: { message?: string; fields?: FieldErrors } }
        | null;
      if (res.ok && data && data.ok) {
        setLastId(data.id);
        setPhase("success");
        return;
      }
      if (data && !data.ok && data.error?.fields) {
        setErrors(data.error.fields);
        setPhase("idle");
        focusFirstError(data.error.fields);
        return;
      }
      setServerMessage((data && !data.ok && data.error?.message) || "We could not send your message. Please try again.");
      setPhase("error");
    } catch {
      setServerMessage("We could not reach the server. Please check your connection and try again.");
      setPhase("error");
    } finally {
      inFlight.current = false;
    }
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setPhase("idle");
    setLastId(null);
    startedAt.current = Date.now();
  };

  if (phase === "success") {
    return (
      <FormStatusMessage
        tone="success"
        title="Message sent"
        actions={
          <Button variant="secondary" onClick={reset}>
            Send another message
          </Button>
        }
      >
        <p>Thanks, {values.name.split(" ")[0]}. We have your message and will reply to {values.email}.</p>
        <p className="mt-1">{siteConfig.responseTimeText}</p>
        {lastId ? <p className="mt-2 text-xs text-ink-subtle">Reference: {lastId}</p> : null}
      </FormStatusMessage>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-4"
      aria-busy={phase === "submitting"}
    >
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <TextField id="name" label="Full name" required value={values.name} onChange={(e) => update({ name: e.target.value })} error={errors.name} autoComplete="name" disabled={phase === "submitting"} />
      <TextField id="email" label="Work email" type="email" inputMode="email" required value={values.email} onChange={(e) => update({ email: e.target.value })} error={errors.email} autoComplete="email" disabled={phase === "submitting"} />
      <TextField
        id="phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        value={values.phone}
        onChange={(e) => update({ phone: e.target.value })}
        error={errors.phone}
        hint="US numbers can be entered as-is. For other countries include the country code, for example +44."
        autoComplete="tel"
        disabled={phase === "submitting"}
      />
      <TextAreaField
        id="message"
        label="How can we help?"
        required
        value={values.message}
        onChange={(e) => update({ message: e.target.value })}
        error={errors.message}
        hint="Tell us what you sell, where you operate, and the kind of prospects you want to reach."
        disabled={phase === "submitting"}
      />
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

      {phase === "error" ? (
        <FormStatusMessage tone="error" title="Your message was not sent">
          {serverMessage} Your text is still in the form.
        </FormStatusMessage>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-subtle">
          By sending this message you agree to our{" "}
          <a href="/privacy" className="font-semibold text-teal-700 underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
        <Button type="submit" variant="primary" disabled={phase === "submitting"}>
          {phase === "submitting" ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : phase === "error" ? (
            <>
              Try again
              <ArrowIcon />
            </>
          ) : (
            <>
              Send message
              <ArrowIcon />
            </>
          )}
        </Button>
      </div>
      {phase === "submitting" ? (
        <p className="sr-only" role="status">
          Sending your message. Please wait.
        </p>
      ) : null}
    </form>
  );
}
