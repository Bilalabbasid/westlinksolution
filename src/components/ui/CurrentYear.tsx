"use client";

import { useSyncExternalStore } from "react";

/**
 * Static year used in the prerendered HTML. The browser replaces it with the
 * real current year after hydration, so the markup never depends on the
 * build-time clock. Update when the legal pages are next reviewed.
 */
const PRERENDER_YEAR = 2026;

const subscribe = () => () => {};
const getClientYear = () => new Date().getFullYear();
const getServerYear = () => PRERENDER_YEAR;

export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getClientYear, getServerYear);
  return <>{year}</>;
}
