import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { LegalToc } from "./LegalToc";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  children: ReactNode;
  draft?: boolean;
}

export function LegalPage({ title, lastUpdated, intro, children, draft = true }: LegalPageProps) {
  return (
    <article>
      <header className="relative overflow-hidden border-b border-line bg-white">
        <AnimatedGridPattern numSquares={18} maxOpacity={0.16} className="[mask-image:radial-gradient(600px_circle_at_80%_40%,white,transparent)]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
        <div className="container-x relative py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">
            <span className="h-px w-6 bg-teal" aria-hidden="true" />
            {siteConfig.brandName} · Legal
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-navy sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 text-sm font-semibold text-ink-muted">Last updated: {lastUpdated}</p>
          <div className="mt-6 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">{intro}</div>
          {draft ? (
            <p className="mt-6 max-w-3xl rounded-xl border border-amber/50 bg-amber-50 px-4 py-3 text-sm text-navy" role="note">
              This document is a working draft prepared for review by {siteConfig.operatorLegalName} and its counsel. Items marked
              for review will be finalized before this page is treated as the governing version.
            </p>
          ) : null}
        </div>
      </header>

      <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <div id="legal-body" className="prose-legal max-w-3xl">
          {children}
        </div>
        <aside className="order-first lg:order-none">
          <div className="lg:sticky lg:top-24">
            <LegalToc containerId="legal-body" />
          </div>
        </aside>
      </div>
    </article>
  );
}

/** Inline marker for details that still need confirmation. */
export function ReviewNote({ children }: { children: ReactNode }) {
  return <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700">[For review: {children}]</span>;
}
