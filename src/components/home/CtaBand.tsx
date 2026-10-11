import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  return (
    <section className="py-10 sm:py-14" aria-labelledby="cta-band-title">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy px-6 py-10 text-white shadow-modal sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-teal/40 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-amber/30 blur-3xl" aria-hidden="true" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber">Ready when you are</p>
                <h2 id="cta-band-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Tell us what you sell. We will build the campaign that brings buyers to you.
                </h2>
                <p className="mt-4 max-w-xl text-white/75">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
