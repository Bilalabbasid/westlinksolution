import type { Metadata } from "next";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <AnimatedGridPattern numSquares={24} maxOpacity={0.2} className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]" />
      <div className="container-x relative text-center">
        <p className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">
          <span className="h-px w-6 bg-teal" aria-hidden="true" />
          404
        </p>
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.035em] text-navy sm:text-6xl">That page is not here.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-muted">The link may be out of date. The home page has everything, including the partner application and contact form.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Go to the home page
          </ButtonLink>
          <ButtonLink href="/#contact" variant="secondary" size="lg">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
