import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight transition-[background-color,color,box-shadow,transform] duration-200 ease-out select-none disabled:cursor-not-allowed disabled:opacity-60 motion-safe:active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-white shadow-[0_8px_20px_-10px_rgba(0,140,130,0.7)] hover:bg-teal-700 focus-visible:outline-amber",
  secondary: "bg-white text-navy border border-line-strong hover:border-navy hover:bg-canvas",
  ghost: "bg-transparent text-navy hover:bg-teal-50 hover:text-teal-700",
  inverse: "bg-white text-navy hover:bg-amber-50",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = "primary", size = "md", className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

export function ButtonLink({ href, variant = "primary", size = "md", className = "", children, ariaLabel }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`spinner ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
