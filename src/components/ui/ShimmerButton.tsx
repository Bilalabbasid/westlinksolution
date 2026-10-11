"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  children: ReactNode;
}

/**
 * Magic UI style shimmer button: a conic highlight sweeps around the edge of
 * the button on a loop. Keyframes live in globals.css and are disabled under
 * reduced motion.
 */
export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.08em",
  shimmerDuration = "3s",
  borderRadius = "0.9rem",
  background = "#008c82",
  className,
  children,
  type = "button",
  ...props
}: ShimmerButtonProps) {
  const style = {
    "--spread": "90deg",
    "--shimmer-color": shimmerColor,
    "--radius": borderRadius,
    "--speed": shimmerDuration,
    "--cut": shimmerSize,
    "--bg": background,
  } as CSSProperties;

  return (
    <button
      type={type}
      style={style}
      className={cn(
        "group relative z-0 inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3.5 text-base font-bold tracking-tight text-white [background:var(--bg)] [border-radius:var(--radius)]",
        "shadow-[0_12px_30px_-12px_rgba(0,140,130,0.8)] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {/* spark container */}
      <div className={cn("-z-30 blur-[2px]", "absolute inset-0 overflow-visible [container-type:size]")}>
        <div className="shimmer-spin absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]">
          <div className="absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* highlight */}
      <div className="absolute inset-0 -z-10 rounded-[inherit] shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
      {/* backdrop */}
      <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
    </button>
  );
}
