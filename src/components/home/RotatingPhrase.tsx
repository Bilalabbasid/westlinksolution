"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

interface RotatingPhraseProps {
  phrases: string[];
  interval?: number;
  className?: string;
}

/**
 * Cycles through short phrases with a vertical slide (AnimatePresence
 * mode="wait"). It sits on its own line, so the box sizes to the current
 * phrase and wraps on narrow screens. Decorative: the parent exposes the full
 * static sentence to assistive technology. Static under reduced motion.
 */
export function RotatingPhrase({ phrases, interval = 2600, className }: RotatingPhraseProps) {
  const reduce = useReducedMotionSafe();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || phrases.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, phrases.length, interval]);

  const current = reduce ? phrases[0] : phrases[index];

  return (
    <span className={`relative inline-grid max-w-full overflow-hidden align-bottom ${className ?? ""}`} aria-hidden="true" style={{ overflowWrap: "anywhere" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          className="col-start-1 row-start-1 gradient-text"
          initial={reduce ? false : { y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduce ? undefined : { y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.8 }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
