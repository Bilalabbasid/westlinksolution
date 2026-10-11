"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { HeroIllustration } from "./HeroIllustration";

const signals = [
  { label: "Insurance", sub: "Final expense, auto, Medicare, health", tone: "bg-teal" },
  { label: "Home services", sub: "HVAC, plumbing, roofing, solar", tone: "bg-amber" },
  { label: "Financial", sub: "Debt settlement, student loans", tone: "bg-navy" },
];

const strip = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.9 } },
};
const chip = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

/**
 * Illustration card with pointer-driven 3D tilt (spring-smoothed motion
 * values), a travelling border beam, live routing dots, and a row of
 * industry signal chips beneath it.
 */
export function HeroVisual() {
  const reduce = useReducedMotionSafe();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 20 });
  const glowX = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(py, [-0.5, 0.5], ["20%", "80%"]);
  const glow = useTransform([glowX, glowY], ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgba(0,140,130,0.10), transparent 60%)`);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className="relative [perspective:1400px]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.35 }}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative overflow-hidden rounded-[1.9rem] border border-line bg-white/85 p-2 shadow-card-hover backdrop-blur sm:p-2.5"
      >
        {!reduce ? (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-70"
            style={{ background: glow }}
            aria-hidden="true"
          />
        ) : null}
        <div className="relative">
          <HeroIllustration animated={!reduce} />
        </div>
        <BorderBeam size={130} duration={9} />
      </motion.div>

      <motion.ul variants={strip} initial="hidden" animate="visible" className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Industries Westlink serves">
        {signals.map((s) => (
          <motion.li key={s.label} variants={chip} className="flex items-start gap-2.5 rounded-2xl border border-line bg-white/90 px-3.5 py-3 shadow-card backdrop-blur">
            <span className="relative mt-1 flex h-2.5 w-2.5 flex-none">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.tone} opacity-50 motion-reduce:hidden`} />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${s.tone}`} />
            </span>
            <span>
              <span className="block text-xs font-extrabold text-navy">{s.label}</span>
              <span className="block text-[0.68rem] font-semibold leading-snug text-ink-muted">{s.sub}</span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
