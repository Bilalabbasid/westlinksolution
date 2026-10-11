"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { OnboardingModal } from "./OnboardingModal";

interface OnboardingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    openerRef.current = (document.activeElement as HTMLElement | null) ?? null;
    setSessionKey((k) => k + 1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    const opener = openerRef.current;
    // Restore focus to the element that opened the modal.
    requestAnimationFrame(() => {
      if (opener && document.contains(opener)) opener.focus();
    });
  }, []);

  // Allow deep links like /#partner to open the modal.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#partner") {
        setSessionKey((k) => k + 1);
        setIsOpen(true);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {isOpen ? <OnboardingModal key={sessionKey} onClose={close} /> : null}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
