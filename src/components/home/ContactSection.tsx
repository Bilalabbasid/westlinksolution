import { formatAddress, hasAddress, hasContactEmail, hasContactPhone, siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon } from "@/components/ui/Button";
import { ContactLink } from "@/components/ui/ContactLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactSection() {
  const showDetails = hasContactEmail() || hasContactPhone() || hasAddress();

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="contact-title">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title={siteConfig.cta.contact}
            description="Tell us what you sell and where. We will come back with questions, not a pitch deck."
          />
          <div className="mt-8 rounded-card border border-line bg-card p-6 shadow-card">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-ink-subtle">Ready to apply now?</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              The partner application takes a few minutes and gives your account manager everything needed to prepare
              for the first call.
            </p>
            <div className="mt-4">
              <OpenOnboardingButton variant="primary">
                {siteConfig.cta.primary}
                <ArrowIcon />
              </OpenOnboardingButton>
            </div>
          </div>

          {showDetails ? (
            <dl className="mt-8 space-y-4 text-sm">
              {hasContactEmail() ? (
                <div>
                  <dt className="font-extrabold text-navy">Email</dt>
                  <dd>
                    <ContactLink kind="email" value={siteConfig.contact.email} className="text-teal-700 underline underline-offset-2" />
                  </dd>
                </div>
              ) : null}
              {hasContactPhone() ? (
                <div>
                  <dt className="font-extrabold text-navy">Phone</dt>
                  <dd>
                    <ContactLink kind="phone" value={siteConfig.contact.phone} href={siteConfig.contact.phoneHref} className="text-teal-700 underline underline-offset-2" />
                    <span className="block text-ink-muted">{siteConfig.contact.hours}</span>
                  </dd>
                </div>
              ) : null}
              {hasAddress() ? (
                <div>
                  <dt className="font-extrabold text-navy">Mailing address</dt>
                  <dd className="text-ink-muted">{formatAddress()}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </Reveal>

        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-card border border-line bg-card p-6 shadow-card-hover sm:p-8">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-teal to-amber" aria-hidden="true" />
            <h3 className="text-xl font-extrabold tracking-tight text-navy">Send us a message</h3>
            <p className="mt-1 text-sm text-ink-muted">{siteConfig.responseTimeText}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
