"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on viewport growth and Escape; links close it on click.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      mq.removeEventListener("change", onChange);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled || menuOpen ? "border-line bg-white/90 shadow-[0_4px_24px_-16px_rgba(20,37,61,0.3)] backdrop-blur-md" : "border-transparent bg-canvas/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-lg" aria-label={`${siteConfig.brandName} home`}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-lg px-3 py-2 text-sm font-semibold text-navy-500 transition-colors hover:text-teal-700"
            >
              {item.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-teal transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <OpenOnboardingButton variant="primary">{siteConfig.cta.primary}</OpenOnboardingButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-navy md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id={menuId}
        ref={panelRef}
        hidden={!menuOpen}
        className="border-t border-line bg-white md:hidden"
      >
        <nav className="container-x flex flex-col py-3" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-navy transition-colors hover:bg-teal-50 hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-line pt-3">
            <OpenOnboardingButton variant="primary" className="w-full">
              {siteConfig.cta.primary}
            </OpenOnboardingButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
