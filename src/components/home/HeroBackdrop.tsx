"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/** Scroll-linked parallax orbs and the animated grid behind the hero. */
export function HeroBackdrop() {
  const reduce = useReducedMotionSafe();
  const { scrollY } = useScroll();
  const orbA = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const orbB = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -80]);
  const gridOpacity = useTransform(scrollY, [0, 500], [1, 0.35]);

  return (
    <>
      <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0" aria-hidden="true">
        <AnimatedGridPattern
          numSquares={34}
          maxOpacity={0.22}
          duration={3.5}
          className="[mask-image:radial-gradient(720px_circle_at_75%_30%,white,transparent)] fill-teal/25 stroke-navy/[0.08]"
        />
      </motion.div>
      <motion.div style={{ y: orbA }} className="pointer-events-none absolute -right-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
      <motion.div style={{ y: orbB }} className="pointer-events-none absolute -left-40 top-[26rem] h-[26rem] w-[26rem] rounded-full bg-amber-100/80 blur-3xl" aria-hidden="true" />
    </>
  );
}
