"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { BlurText } from "@/components/ui/BlurText";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroCta } from "./HeroCta";
import { HeroVisual } from "./HeroVisual";

const LINES = ["Leads worth calling.", "Calls worth taking.", "Growth worth keeping."];

const column = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 220, damping: 26 } },
};

export function Hero() {
  const reduce = useReducedMotionSafe();

  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20" aria-labelledby="hero-title">
      <HeroBackdrop />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-10 xl:max-w-[90rem] xl:gap-14 2xl:max-w-[96rem]">
        <motion.div variants={column} initial={reduce ? false : "hidden"} animate="visible">
          <Reveal>
            <motion.p
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-white/80 px-3.5 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-teal-700 shadow-card backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
              </span>
              B2B customer acquisition
            </motion.p>
          </Reveal>

          <h1 id="hero-title" className="mt-6 max-w-[16ch] break-words text-[clamp(2.1rem,9.4vw,2.9rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-navy sm:text-6xl lg:text-[3.5rem] xl:text-[4rem] 2xl:text-[4.3rem]">
            {LINES.map((line, i) => (
              <span key={line} className="block">
                <BlurText text={line} delay={70} startDelay={i * 240} highlightFrom={i === LINES.length - 1 ? 0 : undefined} highlightClassName="gradient-text" />
              </span>
            ))}
          </h1>

          <motion.p variants={item} className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            {siteConfig.brandName} powers high-intent calls and leads for insurance, financial, and home-service
            businesses. You define who you can serve. We build the campaign that brings them to you.
          </motion.p>

          <motion.div variants={item} className="mt-9">
            <HeroCta />
          </motion.div>

          <motion.ul variants={item} className="mt-9 grid max-w-xl grid-cols-1 gap-3 text-sm font-semibold text-navy-500 sm:grid-cols-3">
            {["Leads and inbound calls", "Criteria you approve", "A named account manager"].map((t) => (
              <li key={t} className="flex items-center gap-2.5 rounded-xl border border-line bg-white/70 px-3 py-2.5 backdrop-blur">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-100 text-teal-700" aria-hidden="true">
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none">
                    <path d="m5 10 3.5 3.5L15 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="relative min-w-0">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
