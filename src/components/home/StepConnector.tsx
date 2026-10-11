"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/** Gradient line that draws itself across the step grid when it scrolls into view. */
export function StepConnector() {
  const reduce = useReducedMotionSafe();
  return (
    <div className="pointer-events-none absolute inset-x-6 top-[3.1rem] hidden h-0.5 xl:block" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-line" />
      <motion.div
        className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-teal via-teal to-amber"
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
