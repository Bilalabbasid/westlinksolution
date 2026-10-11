import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", id, className = "" }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow ? <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p> : null}
      <h2 id={id} className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{description}</p> : null}
    </div>
  );
}
