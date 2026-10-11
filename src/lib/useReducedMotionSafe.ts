"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const getSnapshot = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(QUERY).matches : false);
const getServerSnapshot = () => false;

/**
 * Hydration-safe reduced-motion preference. The server and the hydration
 * render both assume motion is allowed; the real preference applies right
 * after hydration, so users who prefer reduced motion never see a markup
 * mismatch, only a settled, motion-free state.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
