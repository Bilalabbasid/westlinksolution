import { partnershipSteps } from "@/content/steps";
import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StepConnector } from "./StepConnector";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="dot-grid scroll-mt-24 py-20 sm:py-28" aria-labelledby="how-title">
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

        <div className="relative mt-14">
          <StepConnector />
          <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {partnershipSteps.map((step, i) => (
              <Reveal key={step.number} as="li" delay={i * 120} className="h-full">
                <div className="card-sheen group relative flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-card-hover">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal bg-white text-sm font-extrabold text-teal-700 transition-colors group-hover:bg-teal group-hover:text-white" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">Step {step.number}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-navy">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{step.description}</p>
                  <p className="mt-5 rounded-xl bg-teal-50 px-3.5 py-2.5 text-sm font-semibold text-teal-700">
                    <span className="text-ink-subtle">Outcome: </span>
                    {step.outcome}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
