import { siteConfig } from "@/config/site";

interface LogoProps {
  variant?: "default" | "inverse";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Westlink symbol: two rounded nodes joined by a bridging link, with an amber
 * point marking the hand-off. Drawn once here and reused by the favicon and
 * social image.
 */
export function LogoMark({ className = "h-8 w-8", inverse = false }: { className?: string; inverse?: boolean }) {
  const bg = inverse ? "#ffffff" : "#008c82";
  const fg = inverse ? "#14253d" : "#ffffff";
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="11" fill={bg} />
      <path
        d="M11.5 24.5 15 15.5l4 9 4-9 3.5 9"
        stroke={fg}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29.5" cy="16.5" r="2.6" fill="#e7ad52" />
    </svg>
  );
}

export function Logo({ variant = "default", size = "md", className = "" }: LogoProps) {
  const inverse = variant === "inverse";
  const text = inverse ? "text-white" : "text-navy";
  const sub = inverse ? "text-white/70" : "text-ink-muted";
  const mark = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const name = size === "sm" ? "text-[1.05rem]" : "text-[1.2rem]";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={mark} inverse={inverse} />
      <span className="flex flex-col leading-none">
        <span className={`${name} font-extrabold tracking-[-0.02em] ${text}`}>{siteConfig.shortName}</span>
        <span className={`mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] ${sub}`}>Solution</span>
      </span>
    </span>
  );
}
