"use client";

import { verticalGroups, verticalOptions } from "@/content/verticals";

interface VerticalPickerProps {
  selected: string[];
  onChange: (next: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function VerticalPicker({ selected, onChange, error, disabled }: VerticalPickerProps) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <fieldset aria-describedby={error ? "verticals-error" : "verticals-hint"} aria-invalid={error ? "true" : undefined}>
      <legend className="mb-1.5 text-sm font-bold text-navy">
        Campaign verticals
        <span className="ml-1 text-teal-700" aria-hidden="true">
          *
        </span>
      </legend>
      <p id="verticals-hint" className="mb-3 text-xs text-ink-muted">
        Choose every vertical you want to discuss. You can refine this later with your account manager.
      </p>
      <div className="space-y-3">
        {verticalGroups.map((group) => (
          <div key={group}>
            <p className="mb-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-ink-subtle">{group}</p>
            <div className="flex flex-wrap gap-2">
              {verticalOptions
                .filter((o) => o.group === group)
                .map((o) => {
                  const id = `vertical-${o.value.replace(/\s+/g, "-").toLowerCase()}`;
                  const checked = selected.includes(o.value);
                  return (
                    <label
                      key={o.value}
                      htmlFor={id}
                      className={`relative inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal ${
                        checked ? "border-teal bg-teal text-white" : "border-line-strong bg-white text-navy hover:border-teal hover:text-teal-700"
                      } ${disabled ? "opacity-60" : ""}`}
                    >
                      <input
                        id={id}
                        type="checkbox"
                        className="sr-only"
                        name="verticals"
                        value={o.value}
                        checked={checked}
                        onChange={() => toggle(o.value)}
                        disabled={disabled}
                      />
                      {checked ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="m5 10 3.5 3.5L15 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                      {o.value}
                    </label>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      {error ? (
        <p id="verticals-error" className="mt-2 text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
