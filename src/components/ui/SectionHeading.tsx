import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
  tone?: "light" | "dark";
}

export function SectionHeading({ eyebrow, title, description, align = "left", id, className = "", tone = "light" }: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  const titleColor = tone === "dark" ? "text-white" : "text-navy";
  const descColor = tone === "dark" ? "text-white/70" : "text-ink-muted";
  const eyebrowColor = tone === "dark" ? "text-amber" : "text-teal-700";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow ? (
        <p className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] ${eyebrowColor}`}>
          <span className={`h-px w-6 ${tone === "dark" ? "bg-amber" : "bg-teal"}`} aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className={`text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem] ${titleColor}`}>
        {title}
      </h2>
      {description ? <p className={`mt-5 text-base leading-relaxed sm:text-lg ${descColor}`}>{description}</p> : null}
    </div>
  );
}
