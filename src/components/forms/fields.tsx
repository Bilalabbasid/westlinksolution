"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldShellProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ id, label, required, error, hint, children, className = "" }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-navy">
        {label}
        {required ? (
          <span className="ml-1 text-teal-700" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-semibold text-ink-subtle">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1 text-sm font-semibold text-danger" role="alert">
          <svg className="mt-0.5 h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 7.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  const ids: string[] = [];
  if (error) ids.push(`${id}-error`);
  else if (hint) ids.push(`${id}-hint`);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextField({ id, label, error, hint, required, wrapperClassName, className = "", ...rest }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint} className={wrapperClassName}>
      <input
        id={id}
        name={id}
        className={`field-input ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required || undefined}
        {...rest}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextAreaField({ id, label, error, hint, required, wrapperClassName, className = "", ...rest }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint} className={wrapperClassName}>
      <textarea
        id={id}
        name={id}
        className={`field-input min-h-32 resize-y ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required || undefined}
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

export function SelectField({ id, label, error, hint, required, wrapperClassName, className = "", children, ...rest }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint} className={wrapperClassName}>
      <select
        id={id}
        name={id}
        className={`field-input field-select ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required || undefined}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CheckboxField({ id, checked, onChange, label, error, required, disabled }: CheckboxFieldProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          className="check-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          disabled={disabled}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink-muted">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden honeypot field; bots fill it, people never see it. */
export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function FormStatusMessage({
  tone,
  title,
  children,
  actions,
}: {
  tone: "error" | "success" | "info";
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const styles = {
    error: "border-danger/30 bg-danger-50 text-danger",
    success: "border-success/30 bg-success-50 text-success",
    info: "border-teal/30 bg-teal-50 text-teal-700",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${styles}`} role={tone === "error" ? "alert" : "status"}>
      <p className="font-bold">{title}</p>
      {children ? <div className="mt-1 text-sm text-navy">{children}</div> : null}
      {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
