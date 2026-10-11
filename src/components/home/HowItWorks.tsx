import { partnershipSteps } from "@/content/steps";
import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="dot-grid scroll-mt-24 py-16 sm:py-20" aria-labelledby="how-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="how-title"
            eyebrow="How partnership works"
            title="Four steps from first conversation to a running campaign."
            description="No surprises. Each step ends with something written down that both teams have agreed to."
          />
          <div className="md:pb-1">
            <OpenOnboardingButton variant="secondary">
              {siteConfig.cta.primary}
              <ArrowIcon />
            </OpenOnboardingButton>
          </div>
        </div>

        <ol className="relative mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {partnershipSteps.map((step, i) => (
            <Reveal key={step.number} as="li" delay={i * 100} className="h-full">
              <div className="relative flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card">
                <span className="text-xs font-extrabold tracking-[0.2em] text-amber-700">STEP {step.number}</span>
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-navy">{step.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{step.description}</p>
                <p className="mt-5 border-t border-line pt-4 text-sm font-semibold text-teal-700">
                  <span className="text-ink-subtle">Outcome: </span>
                  {step.outcome}
                </p>
                {i < partnershipSteps.length - 1 ? (
                  <span
                    className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-teal xl:flex"
                    aria-hidden="true"
                  >
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
