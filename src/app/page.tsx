import type { Metadata } from "next";
import { getSiteUrl, hasAddress, hasContactEmail, hasContactPhone, siteConfig } from "@/config/site";
import { faqItems } from "@/content/faq";
import { industries } from "@/content/industries";
import { About } from "@/components/home/About";
import { Capabilities } from "@/components/home/Capabilities";
import { Challenges } from "@/components/home/Challenges";
import { ContactSection } from "@/components/home/ContactSection";
import { CtaBand } from "@/components/home/CtaBand";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Industries } from "@/components/home/Industries";
import { Partners } from "@/components/home/Partners";
import { Testimonials } from "@/components/home/Testimonials";
import { VerticalMarquee } from "@/components/home/VerticalMarquee";

export const metadata: Metadata = {
  title: `Lead Generation Company for Insurance, Home Services, Debt & Legal | ${siteConfig.brandName}`,
  description:
    "High-intent insurance leads, live-transfer and pay-per-call campaigns, home services leads, debt settlement and student loan leads, and SSDI, torts and MVA intake calls. Campaigns built to the criteria you approve. Apply to become a partner.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `Lead Generation Company for Insurance, Home Services, Debt & Legal | ${siteConfig.brandName}`,
    description:
      "Insurance leads, pay-per-call and live-transfer campaigns, home services leads, debt and student loan leads, and legal intake calls, built to your criteria.",
    url: "/",
  },
};

/** Structured data built only from confirmed configuration and on-page content. */
function structuredData() {
  const siteUrl = getSiteUrl();
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.brandName,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: siteConfig.description,
    parentOrganization: { "@type": "Organization", name: siteConfig.operatorLegalName },
  };
  if (hasContactEmail()) organization.email = siteConfig.contact.email;
  if (hasContactPhone()) organization.telephone = siteConfig.contact.phone;
  if (hasAddress()) {
    const a = siteConfig.contact.address;
    organization.address = {
      "@type": "PostalAddress",
      streetAddress: [a.line1, a.line2].filter(Boolean).join(", "),
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    };
  }
  if (siteConfig.social.linkedin) organization.sameAs = [siteConfig.social.linkedin];
  if (hasContactPhone() || hasContactEmail()) {
    organization.contactPoint = [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        ...(hasContactPhone() ? { telephone: siteConfig.contact.phone } : {}),
        ...(hasContactEmail() ? { email: siteConfig.contact.email } : {}),
        areaServed: "US",
        availableLanguage: ["en"],
      },
    ];
  }

  const webpage = {
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: `Lead Generation Company for Insurance, Home Services, Debt & Legal | ${siteConfig.brandName}`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.brandName,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };

  const services = {
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    name: "B2B customer acquisition: leads, inbound calls, and campaign support",
    provider: { "@id": `${siteUrl}/#organization` },
    serviceType: "Lead generation, pay-per-call, and live-transfer campaigns",
    areaServed: { "@type": "Country", name: "United States" },
    audience: { "@type": "BusinessAudience", audienceType: "Insurance, home-services, financial-services, and legal businesses" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Campaign verticals",
      itemListElement: industries.map((ind) => ({
        "@type": "OfferCatalog",
        name: ind.label,
        itemListElement: ind.subServices.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `${s.name} campaigns`, description: s.summary },
        })),
      })),
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return { "@context": "https://schema.org", "@graph": [organization, website, webpage, services, faq] };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Generated from static configuration and content only; no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Capabilities />
      <VerticalMarquee />
      <About />
      <Industries />
      <HowItWorks />
      <Challenges />
      <Testimonials />
      <Partners />
      <Faq />
      <ContactSection />
      <CtaBand />
    </>
  );
}
