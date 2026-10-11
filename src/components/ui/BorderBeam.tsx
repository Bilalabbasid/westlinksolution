"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  reverse?: boolean;
}

/**
 * Magic UI style border beam: a short gradient segment travels around the
 * rounded border of its (relatively positioned, overflow-hidden) parent.
 */
export function BorderBeam({ size = 90, duration = 8, delay = 0, colorFrom = "#008c82", colorTo = "#e7ad52", className, reverse = false }: BorderBeamProps) {
  const reduce = useReducedMotionSafe();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        initial={{ offsetDistance: reverse ? "100%" : "0%" }}
        animate={{ offsetDistance: reverse ? "0%" : "100%" }}
        transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay }}
      />
    </div>
  );
}
