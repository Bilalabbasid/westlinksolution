import Link from "next/link";
import { formatAddress, hasAddress, hasContactEmail, hasContactPhone, siteConfig } from "@/config/site";
import { ContactLink } from "@/components/ui/ContactLink";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { Logo } from "./Logo";

export function Footer() {
  const showContact = hasContactEmail() || hasContactPhone() || hasAddress();

  return (
    <footer className="mt-6 bg-navy text-white">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-block rounded-lg" aria-label={`${siteConfig.brandName} home`}>
              <Logo variant="inverse" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{siteConfig.tagline}</p>
          </div>

          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/80 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber">
              Legal
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/80 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber">Contact</h2>
            {showContact ? (
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {hasContactEmail() ? (
                  <li>
                    <ContactLink kind="email" value={siteConfig.contact.email} className="transition-colors hover:text-white" />
                  </li>
                ) : null}
                {hasContactPhone() ? (
                  <li>
                    <ContactLink kind="phone" value={siteConfig.contact.phone} href={siteConfig.contact.phoneHref} className="transition-colors hover:text-white" />
                  </li>
                ) : null}
                {hasAddress() ? <li className="leading-relaxed">{formatAddress()}</li> : null}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Use the{" "}
                <Link href="/#contact" className="font-semibold text-white underline underline-offset-2">
                  contact form
                </Link>{" "}
                to reach the partnerships team.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.operatorDisclosure}</p>
          <p>
            © <CurrentYear /> {siteConfig.operatorLegalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
