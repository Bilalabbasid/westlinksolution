import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  return (
    <section className="py-12 sm:py-20" aria-labelledby="cta-band-title">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-12 text-white shadow-modal sm:px-14 sm:py-16">
            <AnimatedGridPattern numSquares={24} maxOpacity={0.18} className="fill-white/20 stroke-white/[0.06] [mask-image:radial-gradient(600px_circle_at_20%_50%,white,transparent)]" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal/40 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-amber/30 blur-3xl" aria-hidden="true" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-amber">
                  <span className="h-px w-6 bg-amber" aria-hidden="true" />
                  Ready when you are
                </p>
                <h2 id="cta-band-title" className="mt-4 text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]">
                  Tell us what you sell. We will build the campaign that brings buyers to you.
                </h2>
                <p className="mt-5 max-w-xl text-white/75 sm:text-lg">
                  Start with a short application or a message. Either way, the first conversation is about your criteria, not a sales pitch.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <OpenOnboardingButton variant="inverse" size="lg" className="justify-center">
                  {siteConfig.cta.primary}
                  <ArrowIcon className="h-5 w-5" />
                </OpenOnboardingButton>
                <ButtonLink href="/#contact" variant="ghost" size="lg" className="justify-center border border-white/25 text-white hover:bg-white/10 hover:text-white">
                  {siteConfig.cta.contact}
                </ButtonLink>
              </div>
            </div>
            <BorderBeam size={160} duration={10} colorFrom="#e7ad52" colorTo="#0aa394" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
