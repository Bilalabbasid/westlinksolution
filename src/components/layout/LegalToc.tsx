"use client";

import { useEffect, useState } from "react";

interface Item {
  id: string;
  text: string;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Builds an "On this page" list from the h2 headings of the legal article,
 * assigning ids so the links are deep-linkable. Highlights the section in view.
 */
export function LegalToc({ containerId }: { containerId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2"));
    const list = headings.map((h) => {
      if (!h.id) h.id = slug(h.textContent ?? "");
      h.classList.add("scroll-mt-28");
      return { id: h.id, text: (h.textContent ?? "").replace(/^\d+\.\s*/, "") };
    });
    const frame = requestAnimationFrame(() => setItems(list));
    if (typeof IntersectionObserver === "undefined") return () => cancelAnimationFrame(frame);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerId]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="rounded-card border border-line bg-card p-5 shadow-card">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">On this page</p>
      <ol className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`flex gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700 ${active === it.id ? "bg-teal-50 font-bold text-teal-700" : "text-ink-muted"}`}
            >
              <span className="w-5 flex-none text-xs font-extrabold text-ink-subtle">{i + 1}.</span>
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
