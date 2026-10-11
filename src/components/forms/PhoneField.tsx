"use client";

import { useMemo } from "react";
import { getCountryOptions } from "@/lib/countries";
import { describedBy, FieldShell } from "./fields";

interface PhoneFieldProps {
  id: string;
  country: string;
  phone: string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (value: string) => void;
  error?: string;
  countryError?: string;
  disabled?: boolean;
}

export function PhoneField({ id, country, phone, onCountryChange, onPhoneChange, error, countryError, disabled }: PhoneFieldProps) {
  const countries = useMemo(() => getCountryOptions(), []);
  const combinedError = countryError ?? error;
  const selected = countries.find((c) => c.code === country);

  return (
    <FieldShell id={id} label="Phone" required error={combinedError} hint="Include the area code. We use this to schedule your campaign discussion.">
      <div className="flex gap-2">
        <div className="w-[9.5rem] flex-none">
          <label htmlFor={`${id}-country`} className="sr-only">
            Phone country
          </label>
          <select
            id={`${id}-country`}
            name={`${id}Country`}
            className="field-input field-select"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-invalid={countryError ? "true" : undefined}
            disabled={disabled}
          >
            <option value="">Country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} {c.dialCode}
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className="field-input"
          placeholder={selected ? `${selected.dialCode} …` : "Phone number"}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          aria-invalid={combinedError ? "true" : undefined}
          aria-describedby={describedBy(id, combinedError, "hint")}
          aria-required="true"
          disabled={disabled}
        />
      </div>
      {selected ? (
        <p className="mt-1 text-xs text-ink-subtle" aria-live="polite">
          {selected.name} ({selected.dialCode})
        </p>
      ) : null}
    </FieldShell>
  );
}
