"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useMemo, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  /** Delay between segments in ms. */
  delay?: number;
  /** Delay before the first segment in ms. */
  startDelay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  className?: string;
  /** Wrapper element; defaults to a span so it can live inside headings. */
  as?: ElementType;
  /** Word index from which the highlight classes apply. */
  highlightFrom?: number;
  highlightClassName?: string;
}

/**
 * React Bits style blur-in text reveal. Each word (or character) animates
 * from blurred and offset to crisp and in place. The segments are the real
 * text (no hidden duplicate), so selection, copy, and screen readers see it
 * once. Under reduced motion the text renders immediately.
 */
export function BlurText({
  text,
  delay = 70,
  startDelay = 0,
  animateBy = "words",
  direction = "top",
  className,
  as: Tag = "span",
  highlightFrom,
  highlightClassName,
}: BlurTextProps) {
  const reduce = useReducedMotionSafe();
  const segments = useMemo(() => (animateBy === "words" ? text.split(" ") : text.split("")), [text, animateBy]);
  const fromY = direction === "top" ? -14 : 14;

  return (
    <Tag className={cn("inline", className)}>
      <span>
        {segments.map((seg, i) => {
          const highlighted = highlightFrom !== undefined && i >= highlightFrom;
          const inner = (
            <span className={cn("inline-block", highlighted && highlightClassName)}>
              {seg}
              {animateBy === "words" && i < segments.length - 1 ? " " : ""}
            </span>
          );
          if (reduce) return <span key={i}>{inner}</span>;
          return (
            <motion.span
              key={i}
              className="inline-block will-change-transform"
              initial={{ filter: "blur(12px)", opacity: 0, y: fromY }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: (startDelay + i * delay) / 1000, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {inner}
            </motion.span>
          );
        })}
      </span>
    </Tag>
  );
}
