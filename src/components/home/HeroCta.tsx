"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { useOnboarding } from "@/components/forms/OnboardingProvider";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export function HeroCta() {
  const { open } = useOnboarding();
  const reduce = useReducedMotionSafe();
  const gesture = reduce ? {} : { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <motion.div {...gesture} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="w-full sm:w-auto">
        <ShimmerButton onClick={open} aria-haspopup="dialog" className="w-full sm:w-auto">
          {siteConfig.cta.primary}
          <ArrowIcon className="h-5 w-5" />
        </ShimmerButton>
      </motion.div>
      <motion.div {...gesture} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="w-full sm:w-auto">
        <ButtonLink href="#industries" variant="secondary" size="lg" className="w-full sm:w-auto">
          {siteConfig.cta.secondary}
        </ButtonLink>
      </motion.div>
    </div>
  );
}
