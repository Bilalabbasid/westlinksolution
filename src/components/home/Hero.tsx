import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroIllustration } from "./HeroIllustration";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-16" aria-labelledby="hero-title">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 top-80 h-[22rem] w-[22rem] rounded-full bg-amber-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
              B2B customer acquisition
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="mt-5 max-w-[14ch] text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-navy sm:text-5xl lg:text-[3.4rem]">
              Put your sales team in front of buyers who are{" "}
              <span className="relative inline-block">
                <span className="relative z-10">ready to talk.</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-amber/50" aria-hidden="true" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {siteConfig.brandName} delivers leads, inbound calls, and campaign support for insurance, home-services,
              financial-services, and legal teams. You define who you can serve. We build the campaign that brings them
              to you.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <OpenOnboardingButton size="lg">
                {siteConfig.cta.primary}
                <ArrowIcon className="h-5 w-5" />
              </OpenOnboardingButton>
              <ButtonLink href="#industries" variant="secondary" size="lg">
                {siteConfig.cta.secondary}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-navy-500">
              <li className="flex items-center gap-2">
                <CheckDot /> Leads and inbound calls
              </li>
              <li className="flex items-center gap-2">
                <CheckDot /> Criteria you approve
              </li>
              <li className="flex items-center gap-2">
                <CheckDot /> A named account manager
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="rounded-[1.75rem] border border-line bg-white/70 p-1.5 shadow-card-hover sm:p-2">
            <HeroIllustration />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CheckDot() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700" aria-hidden="true">
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none">
        <path d="m5 10 3.5 3.5L15 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
