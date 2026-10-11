"use client";

import type { ReactNode } from "react";
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

/**
 * Phone and email link that behaves sensibly on every device. On touch
 * devices it dials or opens mail directly. On desktop it copies the value to
 * the clipboard and shows a toast with an "Open anyway" action, which avoids
 * the operating system's "pick an app" prompt.
 */
export function ContactLink({ kind, value, href, className = "", children }: ContactLinkProps) {
  const { toast } = useToast();
  const target = href ?? (kind === "phone" ? `tel:${value.replace(/[^+\d]/g, "")}` : `mailto:${value}`);

  const onClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (coarse) return; // let phones dial / open mail natively
    e.preventDefault();
    let copied = false;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      copied = false;
    }
    toast({
      tone: copied ? "success" : "info",
      title: copied ? (kind === "phone" ? "Phone number copied" : "Email address copied") : value,
      description: copied ? value : "Copy it from here or open it in your default app.",
      action: { label: kind === "phone" ? "Open in calling app" : "Open in mail app", onClick: () => window.open(target, "_self") },
    });
  };

  return (
    <a href={target} onClick={onClick} className={className}>
      {children ?? value}
    </a>
  );
}
