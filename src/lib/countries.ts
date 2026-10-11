import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";

export interface CountryOption {
  code: CountryCode;
  name: string;
  dialCode: string;
}

const PRIORITY: CountryCode[] = ["US", "CA", "GB", "AU"];

let cache: CountryOption[] | null = null;

/**
 * Full list of countries with calling codes, English display names, and the
 * most common Westlink markets pinned to the top. Computed lazily so it only
 * runs where it is rendered (inside client-only form components).
 */
export function getCountryOptions(): CountryOption[] {
  if (cache) return cache;

  let display: Intl.DisplayNames | null = null;
  try {
    display = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    display = null;
  }

  const all = getCountries()
    .map((code) => ({
      code,
      name: display?.of(code) ?? code,
      dialCode: `+${getCountryCallingCode(code)}`,
    }))
    .filter((c) => c.name && c.name !== c.code)
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  const pinned = PRIORITY.map((code) => all.find((c) => c.code === code)).filter(
    (c): c is CountryOption => Boolean(c),
  );
  const rest = all.filter((c) => !PRIORITY.includes(c.code));
  cache = [...pinned, ...rest];
  return cache;
}

export function getCountryName(code: string): string {
  return getCountryOptions().find((c) => c.code === code)?.name ?? code;
}
