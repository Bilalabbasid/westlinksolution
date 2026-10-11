"use client";

import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { useToast } from "./Toaster";

interface ContactLinkProps {
  kind: "phone" | "email";
  /** Display value, e.g. "+1 (650) 308-4707" or "info@example.com". */
  value: string;
  /** Explicit href; defaults to tel:/mailto: built from `value`. */
  href?: string;
  className?: string;
  children?: ReactNode;
}

function isTouchDevice(): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(pointer: coarse)").matches);
}

/**
 * Phone and email links that behave sensibly on every device.
 *
 * Phone: opens WhatsApp first (configured in `siteConfig.contact.whatsapp`).
 *  - Touch devices: tries the WhatsApp app; if the app does not take over
 *    within ~1.5 s, falls back to the phone's dialer (`tel:`).
 *  - Desktop: opens WhatsApp Web/Desktop in a new tab and shows a toast with
 *    "Call instead" and the number already copied to the clipboard.
 * Email: touch devices open the mail app; desktop copies the address and
 * offers "Open in mail app", avoiding the operating system's "Pick an app"
 * prompt.
 */
export function ContactLink({ kind, value, href, className = "", children }: ContactLinkProps) {
  const { toast } = useToast();
  const telHref = href ?? `tel:${value.replace(/[^+\d]/g, "")}`;
  const mailHref = href ?? `mailto:${value}`;
  const wa = siteConfig.contact.whatsapp;
  const waWeb = wa ? `https://wa.me/${wa}` : "";
  const waApp = wa ? `whatsapp://send?phone=${wa}` : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  };

  const onPhoneClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!wa) {
      if (isTouchDevice()) return; // plain tel: link
      e.preventDefault();
      const copied = await copy();
      toast({
        tone: copied ? "success" : "info",
        title: copied ? "Phone number copied" : value,
        description: copied ? value : undefined,
        action: { label: "Open in calling app", onClick: () => window.open(telHref, "_self") },
      });
      return;
    }

    e.preventDefault();
    if (isTouchDevice()) {
      // Try the WhatsApp app; fall back to the dialer if nothing took over.
      const started = Date.now();
      const timer = window.setTimeout(() => {
        if (document.visibilityState === "visible" && Date.now() - started < 2500) {
          window.location.href = telHref;
        }
      }, 1500);
      const onHide = () => {
        window.clearTimeout(timer);
        document.removeEventListener("visibilitychange", onHide);
      };
      document.addEventListener("visibilitychange", onHide);
      window.location.href = waApp;
      return;
    }

    const copied = await copy();
    window.open(waWeb, "_blank", "noopener");
    toast({
      tone: "info",
      title: "Opening WhatsApp",
      description: copied ? `${value} was also copied to your clipboard.` : value,
      action: { label: "Call with your phone app instead", onClick: () => window.open(telHref, "_self") },
    });
  };

  const onEmailClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouchDevice()) return;
    e.preventDefault();
    const copied = await copy();
    toast({
      tone: copied ? "success" : "info",
      title: copied ? "Email address copied" : value,
      description: copied ? value : "Copy it from here or open it in your mail app.",
      action: { label: "Open in mail app", onClick: () => window.open(mailHref, "_self") },
    });
  };

  if (kind === "phone") {
    return (
      <a href={wa ? waWeb : telHref} onClick={onPhoneClick} className={className} rel={wa ? "noopener" : undefined}>
        {children ?? value}
      </a>
    );
  }
  return (
    <a href={mailHref} onClick={onEmailClick} className={className}>
      {children ?? value}
    </a>
  );
}
