import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-x py-24 text-center sm:py-32">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">That page is not here.</h1>
      <p className="mx-auto mt-4 max-w-md text-ink-muted">The link may be out of date. The home page has everything, including the partner application and contact form.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/#contact" variant="secondary">
          Contact us
        </ButtonLink>
      </div>
    </section>
  );
}
