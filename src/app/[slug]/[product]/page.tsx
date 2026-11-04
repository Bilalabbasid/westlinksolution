import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteUrl, siteConfig } from "@/config/site";
import { getLandingPage } from "@/content/landing";
import { getProduct, getProductsFor, products } from "@/content/products";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ServiceIcon } from "@/components/home/ServiceIcon";
import { CtaBand } from "@/components/home/CtaBand";

interface Params {
  slug: string;
  product: string;
}

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.parent, product: p.slug }));
}

/** Prerendered from generateStaticParams; slug read at the top so unknown paths return a real 404. */
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, product } = await params;
  const page = getProduct(slug, product);
  if (!page) return { title: "Page not found" };
  const path = `/${page.parent}/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: path },
    openGraph: { title: `${page.title} | ${siteConfig.brandName}`, description: page.description, url: path },
  };
}

function structuredData(parent: string, slug: string) {
  const page = getProduct(parent, slug);
  const landing = getLandingPage(parent);
  if (!page || !landing) return null;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/${page.parent}/${page.slug}`;
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
        name: page.name,
        serviceType: `${page.name} (${landing.serviceType})`,
        description: page.description,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "United States" },
        url,
        isRelatedTo: { "@id": `${siteUrl}/${page.parent}#service` },
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
          { "@type": "ListItem", position: 2, name: landing.eyebrow, item: `${siteUrl}/${page.parent}` },
          { "@type": "ListItem", position: 3, name: page.name, item: url },
        ],
      },
    ],
  };
}

export default async function ProductPageRoute({ params }: { params: Promise<Params> }) {
  const { slug, product } = await params;
  const page = getProduct(slug, product);
  const landing = getLandingPage(slug);
  if (!page || !landing) notFound();

  const siblings = getProductsFor(page.parent).filter((p) => p.slug !== page.slug);
  const related = page.related.map((r) => products.find((p) => p.slug === r)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(page.parent, page.slug)) }} />

      <section className="relative overflow-hidden border-b border-line bg-white">
        <AnimatedGridPattern numSquares={20} maxOpacity={0.16} className="[mask-image:radial-gradient(700px_circle_at_85%_30%,white,transparent)]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
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
                <li>
                  <Link href={`/${page.parent}`} className="hover:text-teal-700">
                    {landing.eyebrow}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-navy">
                  {page.name}
                </li>
              </ol>
            </nav>
            <p className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">
              <span className="h-px w-6 bg-teal" aria-hidden="true" />
              {page.name}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-[2.1rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-navy sm:text-5xl lg:text-[3.2rem]">
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
          </div>

          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-card p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <ServiceIcon name={page.icon} className="h-6 w-6" />
                </span>
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">Recommended format</p>
              </div>
              <p className="mt-4 text-lg font-extrabold tracking-tight text-navy">{page.format.recommended}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{page.format.why}</p>
              <p className="mt-5 border-t border-line pt-4 text-xs font-semibold text-ink-subtle">
                Timing: <span className="font-normal text-ink-muted">{page.timing}</span>
              </p>
              <BorderBeam size={140} duration={12} colorFrom="#008c82" colorTo="#e7ad52" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="product-screening">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 id="product-screening" className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">
              Screening questions written into the specification
            </h2>
            <p className="mt-3 leading-relaxed text-ink-muted">
              These are the questions partners usually approve for {page.name.toLowerCase()}. Yours can add, remove, or reword any of them before launch.
            </p>
            <ol className="mt-6 space-y-3">
              {page.screening.map((q, i) => (
                <li key={q} className="flex gap-4 rounded-2xl border border-line bg-card p-4 shadow-card">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal text-xs font-extrabold text-white">{i + 1}</span>
                  <span className="leading-relaxed text-navy">{q}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">Who buys {page.name.toLowerCase()}</h2>
              <ul className="mt-6 space-y-4">
                {page.buyers.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span className="mt-2.5 h-2 w-2 flex-none rounded-full bg-amber" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 rounded-2xl border border-amber/40 bg-amber-50 p-5">
                <h3 className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-amber-700">Confirm with your counsel</h3>
                <ul className="mt-3 space-y-2">
                  {page.compliance.map((c) => (
                    <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-navy">
                      <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-amber-700" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink-muted">We follow the rules you set. Legal responsibility for the sale or the case stays with your licensed team.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="product-faq">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <h2 id="product-faq" className="text-balance text-2xl font-extrabold tracking-[-0.02em] text-navy sm:text-[2rem]">
              Questions about {page.name.toLowerCase()}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">Pricing is quoted per campaign after a short discussion of your criteria and territory.</p>
            {related.length > 0 ? (
              <>
                <h3 className="mt-8 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">Related</h3>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/${r.parent}/${r.slug}`} className="inline-flex items-center gap-2 font-bold text-teal-700 hover:underline">
                        {r.name}
                        <ArrowIcon className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={`/${page.parent}`} className="inline-flex items-center gap-2 font-bold text-teal-700 hover:underline">
                      All {landing.eyebrow.toLowerCase()}
                      <ArrowIcon className="h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </>
            ) : null}
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

      {siblings.length > 0 ? (
        <section className="container-x py-10" aria-labelledby="product-siblings">
          <h2 id="product-siblings" className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">
            Other {landing.eyebrow.toLowerCase()} campaigns
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.parent}/${s.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal-700">
                  <ServiceIcon name={s.icon} className="h-4 w-4 text-teal-700" />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
