import { siteConfig } from "@/config/site";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";

interface InlineCtaProps {
  title: string;
  body: string;
}

/** Mid-article call to action. Rendered inside blog bodies so readers can apply without scrolling to the end. */
export function InlineCta({ title, body }: InlineCtaProps) {
  return (
    <aside className="not-prose my-10 overflow-hidden rounded-2xl border border-teal/30 bg-gradient-to-br from-teal-50 via-white to-amber-50 p-6 shadow-card sm:p-7">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">Westlink Solution</p>
      <p className="mt-2 text-lg font-extrabold tracking-tight text-navy">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <OpenOnboardingButton className="justify-center">
          {siteConfig.cta.primary}
          <ArrowIcon className="h-4 w-4" />
        </OpenOnboardingButton>
        <ButtonLink href="/#contact" variant="secondary" className="justify-center">
          {siteConfig.cta.contact}
        </ButtonLink>
      </div>
    </aside>
  );
}
