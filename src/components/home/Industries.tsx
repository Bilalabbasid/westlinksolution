"use client";

import { useEffect, useId, useRef, useState } from "react";
import { industries, type IndustryId } from "@/content/industries";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons: Record<IndustryId, React.ReactNode> = {
  insurance: (
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  "home-services": (
    <path d="M4 11 12 4l8 7M6 10v9h12v-9M10 19v-5h4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  "financial-services": (
    <path d="M4 19h16M6 16V9M10 16V6M14 16v-4M18 16V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  ),
  legal: (
    <path d="M12 4v16M5 8h14M7 8l-3 6c1 1.5 2.5 2 3.5 2s2.5-.5 3.5-2L8 8M17 8l-3 6c1 1.5 2.5 2 3.5 2s2.5-.5 3.5-2L18 8M8 20h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

export function Industries() {
  const [active, setActive] = useState<IndustryId>("insurance");
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Support deep links like /#industries-legal.
  useEffect(() => {
    const apply = () => {
      const match = window.location.hash.match(/^#industries-([a-z-]+)$/);
      if (match && industries.some((i) => i.id === match[1])) setActive(match[1] as IndustryId);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % industries.length;
    if (e.key === "ArrowLeft") next = (index - 1 + industries.length) % industries.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = industries.length - 1;
    const id = industries[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section id="industries" className="scroll-mt-24 bg-white py-16 sm:py-20" aria-labelledby="industries-title">
      <div className="container-x">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries and services"
          title="Campaigns built for the categories you sell in."
          description="Pick an industry to see the campaign types we run and what you receive as a partner."
          align="center"
        />

        <div role="tablist" aria-label="Industries" className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:justify-center">
          {industries.map((ind, i) => {
            const selected = ind.id === active;
            return (
              <button
                key={ind.id}
                ref={(el) => {
                  tabRefs.current[ind.id] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${ind.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${ind.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(ind.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex flex-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
                  selected ? "border-navy bg-navy text-white" : "border-line-strong bg-white text-navy hover:border-teal hover:text-teal-700"
                }`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  {icons[ind.id]}
                </svg>
                {ind.label}
              </button>
            );
          })}
        </div>

        {industries.map((ind) => {
          const selected = ind.id === active;
          return (
            <div
              key={ind.id}
              role="tabpanel"
              id={`${baseId}-panel-${ind.id}`}
              aria-labelledby={`${baseId}-tab-${ind.id}`}
              hidden={!selected}
              tabIndex={0}
              className="mt-6 rounded-[1.75rem] border border-line bg-canvas p-6 sm:p-8 lg:p-10"
            >
              {selected ? (
                <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">{ind.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{ind.headline}</h3>
                    <p className="mt-4 leading-relaxed text-ink-muted">{ind.description}</p>
                    <p className="mt-4 rounded-xl border border-amber/40 bg-amber-50 px-4 py-3 text-sm text-navy">{ind.buyerNote}</p>
                    <div className="mt-6">
                      <OpenOnboardingButton variant="primary">
                        Discuss a {ind.label.toLowerCase()} campaign
                        <ArrowIcon />
                      </OpenOnboardingButton>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-ink-subtle">Campaign types</h4>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {ind.subServices.map((s) => (
                        <li key={s.name} className="rounded-2xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
                          <p className="font-extrabold text-navy">{s.name}</p>
                          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.summary}</p>
                        </li>
                      ))}
                    </ul>
                    <h4 className="mt-7 text-sm font-extrabold uppercase tracking-[0.14em] text-ink-subtle">What partners receive</h4>
                    <ul className="mt-3 space-y-2">
                      {ind.deliverables.map((d) => (
                        <li key={d} className="flex gap-3 text-sm text-navy">
                          <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber" aria-hidden="true" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
