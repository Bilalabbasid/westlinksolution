"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getCountryOptions } from "@/lib/countries";
import { describedBy, FieldShell, SelectField, TextField } from "./fields";

export interface AddressValues {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface AddressFieldsProps {
  values: AddressValues;
  errors: Record<string, string | undefined>;
  onChange: (patch: Partial<AddressValues>) => void;
  sessionToken: string;
  disabled?: boolean;
}

interface Suggestion {
  placeId: string;
  description: string;
}

/**
 * Address entry with optional server-proxied autocomplete. When no Places key
 * is configured the street field behaves as a normal input. Manual entry is
 * always available for every field.
 */
export function AddressFields({ values, errors, onChange, sessionToken, disabled }: AddressFieldsProps) {
  const countries = useMemo(() => getCountryOptions(), []);
  const listId = useId();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [resolving, setResolving] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  // Probe once whether autocomplete is available.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/places/autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "" }),
    })
      .then((r) => r.json())
      .then((data: { enabled?: boolean }) => {
        if (!cancelled) setEnabled(Boolean(data.enabled));
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Cancel any pending lookup on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const lookup = (rawInput: string) => {
    if (!enabled) return;
    const input = rawInput.trim();
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (input.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timerRef.current = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/places/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, sessionToken, country: values.country }),
          signal: controller.signal,
        });
        const data = (await res.json()) as { suggestions?: Suggestion[] };
        const list = data.suggestions ?? [];
        setSuggestions(list);
        setOpen(list.length > 0);
        setActive(-1);
      } catch {
        /* ignore aborted or failed lookups; manual entry continues to work */
      }
    }, 300);
  };

  const choose = async (s: Suggestion) => {
    setOpen(false);
    setSuggestions([]);
    setResolving(true);
    try {
      const res = await fetch("/api/places/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: s.placeId, sessionToken }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        address?: { street: string; city: string; state: string; country: string; postalCode: string };
      };
      if (data.ok && data.address) {
        onChange({
          street: data.address.street || s.description,
          city: data.address.city || values.city,
          state: data.address.state || values.state,
          country: data.address.country || values.country,
          postalCode: data.address.postalCode || values.postalCode,
        });
      } else {
        onChange({ street: s.description });
      }
    } catch {
      onChange({ street: s.description });
    } finally {
      setResolving(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      void choose(suggestions[active]);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
    }
  };

  const streetHint = enabled
    ? "Start typing to search for your address, or enter it manually."
    : "Enter the address where your company receives mail.";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldShell id="street" label="Street address" required error={errors.street} hint={streetHint} className="sm:col-span-2">
        <div className="relative">
          <input
            id="street"
            name="street"
            type="text"
            autoComplete={enabled ? "off" : "street-address"}
            className="field-input"
            value={values.street}
            onChange={(e) => {
              onChange({ street: e.target.value });
              lookup(e.target.value);
            }}
            onKeyDown={onKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            aria-invalid={errors.street ? "true" : undefined}
            aria-describedby={describedBy("street", errors.street, streetHint)}
            aria-required="true"
            role={enabled ? "combobox" : undefined}
            aria-expanded={enabled ? open : undefined}
            aria-controls={enabled ? listId : undefined}
            aria-autocomplete={enabled ? "list" : undefined}
            aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
            disabled={disabled || resolving}
          />
          {enabled && open ? (
            <ul
              id={listId}
              role="listbox"
              aria-label="Address suggestions"
              className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-card-hover"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.placeId}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={`cursor-pointer px-3 py-2 text-sm ${i === active ? "bg-teal-50 text-teal-700" : "text-navy hover:bg-canvas"}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => void choose(s)}
                  onMouseEnter={() => setActive(i)}
                >
                  {s.description}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </FieldShell>

      <TextField id="city" label="City" required value={values.city} onChange={(e) => onChange({ city: e.target.value })} error={errors.city} autoComplete="address-level2" disabled={disabled} />
      <TextField id="state" label="State or province" required value={values.state} onChange={(e) => onChange({ state: e.target.value })} error={errors.state} autoComplete="address-level1" disabled={disabled} />
      <SelectField id="country" label="Country" required value={values.country} onChange={(e) => onChange({ country: e.target.value })} error={errors.country} autoComplete="country" disabled={disabled}>
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </SelectField>
      <TextField id="postalCode" label="Postal code" required value={values.postalCode} onChange={(e) => onChange({ postalCode: e.target.value })} error={errors.postalCode} autoComplete="postal-code" disabled={disabled} />
    </div>
  );
}
