import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatPostDate, getPosts } from "@/content/blog";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { CtaBand } from "@/components/home/CtaBand";

export const metadata: Metadata = {
  title: "Blog: Lead Generation Guides for Insurance, Home Services, Debt & Legal Teams",
  description:
    "Practical guides on buying leads and calls: pay-per-call versus live transfers versus web leads, writing a campaign specification, and running campaigns for insurance, home services, debt relief, and legal intake.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${siteConfig.brandName}`,
    description: "Practical guides on buying leads and calls for insurance, home services, debt relief, and legal intake teams.",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const list = getPosts();
  const [featured, ...rest] = list;

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-white">
        <AnimatedGridPattern numSquares={18} maxOpacity={0.16} className="[mask-image:radial-gradient(600px_circle_at_80%_40%,white,transparent)]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
        <div className="container-x relative py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">
            <span className="h-px w-6 bg-teal" aria-hidden="true" />
            {siteConfig.brandName} · Blog
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-navy sm:text-5xl lg:text-6xl">
            Guides for teams that buy leads and calls.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Plain-language writing on choosing a lead format, writing a campaign specification, and running campaigns in
            insurance, home services, debt relief, and legal intake. No hype and no invented numbers.
          </p>
        </div>
      </header>

      <section className="container-x py-12 sm:py-16" aria-labelledby="posts-title">
        <h2 id="posts-title" className="sr-only">
          Articles
        </h2>
        {featured ? (
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="card-sheen group relative block overflow-hidden rounded-[2rem] border border-line bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-card-hover sm:p-10"
            >
              <span className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-teal/15 to-transparent transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <div>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                    <span>{featured.category}</span>
                    <span className="text-ink-subtle" aria-hidden="true">
                      ·
                    </span>
                    <span className="normal-case tracking-normal text-ink-subtle">
                      {formatPostDate(featured.publishedAt)} · {featured.readingMinutes} min read
                    </span>
                  </p>
                  <h3 className="mt-4 text-balance text-2xl font-extrabold leading-[1.12] tracking-[-0.03em] text-navy sm:text-[2.1rem]">
                    {featured.title}
                  </h3>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">{featured.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-teal-700">
                    Read the guide
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="rounded-2xl border border-line bg-canvas p-5">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-subtle">In this guide</p>
                  <ul className="mt-3 space-y-2.5">
                    {featured.takeaways.slice(0, 3).map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-navy-500">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-teal" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          </Reveal>
        ) : null}

        {rest.length > 0 ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} as="li" delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-sheen group block h-full rounded-card border border-line bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-card-hover"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{post.category}</p>
                  <h3 className="mt-3 text-lg font-extrabold leading-snug tracking-tight text-navy">{post.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{post.description}</p>
                  <p className="mt-4 text-xs font-semibold text-ink-subtle">
                    {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </section>

      <CtaBand />
    </>
  );
}
