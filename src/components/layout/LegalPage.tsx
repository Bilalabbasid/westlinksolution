import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  children: ReactNode;
  draft?: boolean;
}

export function LegalPage({ title, lastUpdated, intro, children, draft = true }: LegalPageProps) {
  return (
    <article className="container-x py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">{siteConfig.brandName}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
        <div className="mt-6 text-base leading-relaxed text-ink-muted">{intro}</div>
        {draft ? (
          <p className="mt-6 rounded-xl border border-amber/50 bg-amber-50 px-4 py-3 text-sm text-navy" role="note">
            This document is a working draft prepared for review by {siteConfig.operatorLegalName} and its counsel. Items
            marked for review will be finalized before this page is treated as the governing version.
          </p>
        ) : null}
      </header>
      <div className="prose-legal mt-4 max-w-3xl">{children}</div>
    </article>
  );
}

/** Inline marker for details that still need confirmation. */
export function ReviewNote({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700">[For review: {children}]</span>
  );
}
