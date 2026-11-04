import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteUrl, siteConfig } from "@/config/site";
import { getLandingPage, landingPages } from "@/content/landing";
import { industries } from "@/content/industries";
import { getProductsFor } from "@/content/products";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ServiceIcon } from "@/components/home/ServiceIcon";
import { CtaBand } from "@/components/home/CtaBand";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return landingPages.map((p) => ({ slug: p.slug }));
}

/**
 * Every landing page is prerendered from generateStaticParams. The slug is
 * read at the top so an unknown slug returns a true 404 (see blog/[slug]).
 */
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return { title: "Page not found" };
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: `${page.title} | ${siteConfig.brandName}`, description: page.description, url: `/${page.slug}` },
  };
}

function structuredData(slug: string) {
  const page = getLandingPage(slug);
  if (!page) return null;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${page.title} | ${siteConfig.brandName}`,
        description: page.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.h1,
        serviceType: page.serviceType,
        description: page.description,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "United States" },
        url,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: page.tilesTitle,
          itemListElement: page.tiles.map((t) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: t.name, description: t.summary },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: page.eyebrow, item: url },
        ],
      },
    ],
  };
}

export default async function LandingPageRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  const industry = page.industry ? industries.find((i) => i.id === page.industry) : undefined;
  const others = landingPages.filter((p) => p.slug !== page.slug);
  const productPages = getProductsFor(page.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(page.slug)) }} />

      <section className="relative overflow-hidden border-b border-line bg-white">
        <AnimatedGridPattern numSquares={20} maxOpacity={0.16} className="[mask-image:radial-gradient(700px_circle_at_85%_30%,white,transparent)]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" aria-hidden="true" />
        <div className="container-x relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-teal-700">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-navy">
                  {page.eyebrow}
                </li>
              </ol>
            </nav>
            <p className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">
              <span className="h-px w-6 bg-teal" aria-hidden="true" />
              {page.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-[2.1rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-navy sm:text-5xl lg:text-[3.3rem]">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <OpenOnboardingButton size="lg" className="justify-center">
                {siteConfig.cta.primary}
                <ArrowIcon className="h-5 w-5" />
              </OpenOnboardingButton>
              <ButtonLink href="/#contact" variant="secondary" size="lg" className="justify-center">
                {siteConfig.cta.contact}
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Campaign basics">
              {page.chips.map((c) => (
                <li key={c} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-navy-500 shadow-card">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-card p-6 shadow-card sm:p-8">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">{page.receiveTitle}</p>
              <ul className="mt-4 space-y-3.5">
                {page.receive.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-navy">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-50 text-teal-700" aria-hidden="true">
                      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none">
                        <path d="M4 10.5 8 14l8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-xs font-semibold text-ink-subtle">
                Campaigns run across the United States. Pricing is quoted per campaign after a short discussion of your criteria.
              </p>
              <BorderBeam size={140} duration={12} colorFrom="#008c82" colorTo="#e7ad52" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="landing-types">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
            <Reveal>
              <h2 id="landing-audience" className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">
                {page.audienceTitle}
              </h2>
              <ul className="mt-6 space-y-4">
                {page.audience.map((a) => (
                  <li key={a} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span className="mt-2.5 h-2 w-2 flex-none rounded-full bg-amber" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
              {industry ? (
                <p className="mt-6 rounded-xl border border-amber/40 bg-amber-50 px-4 py-3 text-sm text-navy">{industry.buyerNote}</p>
              ) : null}
            </Reveal>
            <div>
              <h2 id="landing-types" className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">
                {page.tilesTitle}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {productPages.length > 0
                  ? productPages.map((t, i) => (
                      <Reveal key={t.slug} as="li" delay={i * 80}>
                        <Link
                          href={`/${t.parent}/${t.slug}`}
                          className="card-sheen group block h-full rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-card-hover"
                        >
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                            <ServiceIcon name={t.icon} className="h-6 w-6" />
                          </span>
                          <h3 className="mt-4 font-extrabold text-navy">{t.name}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t.description.split(". ")[0]}.</p>
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700">
                            Details
                            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </Reveal>
                    ))
                  : page.tiles.map((t, i) => (
                      <Reveal key={t.name} as="li" delay={i * 80}>
                        <div className="card-sheen group h-full rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-card-hover">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                            <ServiceIcon name={t.icon} className="h-6 w-6" />
                          </span>
                          <h3 className="mt-4 font-extrabold text-navy">{t.name}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t.summary}</p>
                        </div>
                      </Reveal>
                    ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="landing-steps">
        <div className="container-x">
          <h2 id="landing-steps" className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">
            How a campaign gets scoped
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {page.steps.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 100}>
                <div className="h-full rounded-2xl border border-line bg-canvas p-6">
                  <span className="text-xs font-extrabold tracking-[0.2em] text-teal-700">0{i + 1}</span>
                  <h3 className="mt-3 text-lg font-extrabold tracking-tight text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OpenOnboardingButton className="justify-center">
              {siteConfig.cta.primary}
              <ArrowIcon className="h-4 w-4" />
            </OpenOnboardingButton>
            <ButtonLink href="/#how-it-works" variant="ghost" className="justify-center">
              See the full partnership process
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="landing-faq">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <h2 id="landing-faq" className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">
              Questions buyers ask first
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Straight answers, with no numbers we cannot stand behind. Anything specific to your territory is confirmed during the campaign discussion.
            </p>
            <h3 className="mt-8 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">Related</h3>
            <ul className="mt-3 space-y-2">
              {page.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="inline-flex items-center gap-2 font-bold text-teal-700 hover:underline">
                    {r.label}
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="divide-y divide-line rounded-card border border-line bg-card shadow-card">
            {page.faqs.map((f, i) => (
              <details key={f.question} className="group px-5 sm:px-6" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-bold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-line text-teal-700 transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-ink-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-6" aria-labelledby="landing-more">
        <h2 id="landing-more" className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">
          Other campaigns we run
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/${o.slug}`} className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal-700">
                {o.eyebrow.replace(" lead generation", "").replace(" campaigns", "")}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
