import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteUrl, siteConfig } from "@/config/site";
import { formatPostDate, getPost, getPosts } from "@/content/blog";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { LegalToc } from "@/components/layout/LegalToc";
import { OpenOnboardingButton } from "@/components/forms/OpenOnboardingButton";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/home/CtaBand";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: metaDescription(post.description),
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: metaDescription(post.description),
      url: `/blog/${post.slug}`,
      publishedTime: `${post.publishedAt}T00:00:00Z`,
      modifiedTime: `${post.updatedAt}T00:00:00Z`,
      authors: [siteConfig.brandName],
    },
  };
}

/** First sentence of the card text, so search snippets are not cut mid-sentence. */
function metaDescription(text: string): string {
  if (text.length <= 160) return text;
  const first = text.split(/(?<=\.)\s/)[0];
  return first.length <= 160 ? first : text.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

function structuredData(slug: string) {
  const post = getPost(slug);
  if (!post) return null;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        keywords: post.keywords.join(", "),
        datePublished: `${post.publishedAt}T00:00:00Z`,
        dateModified: `${post.updatedAt}T00:00:00Z`,
        inLanguage: "en-US",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: `${siteUrl}/opengraph-image`,
        author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteConfig.brandName },
        publisher: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: siteConfig.brandName,
          logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
        },
        isPartOf: { "@type": "Blog", "@id": `${siteUrl}/blog#blog`, name: `${siteConfig.brandName} Blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

/**
 * Every real post is prerendered from generateStaticParams. The slug is read at
 * the top of the page (not inside Suspense) so an unknown slug returns a true
 * 404 status instead of a streamed not-found page with a 200, which search
 * engines would treat as a soft 404. `instant = false` is the documented
 * opt-out for that trade-off.
 */
export const instant = false;

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  const Body = post.body;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(post.slug)) }} />
      <article>
        <header className="relative overflow-hidden border-b border-line bg-white">
          <AnimatedGridPattern numSquares={18} maxOpacity={0.16} className="[mask-image:radial-gradient(600px_circle_at_80%_40%,white,transparent)]" />
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
          <div className="container-x relative py-12 sm:py-16">
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-teal-700">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="hover:text-teal-700">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-navy">
                  {post.category}
                </li>
              </ol>
            </nav>
            <h1 className="mt-6 max-w-4xl text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-navy sm:text-5xl lg:text-[3.4rem]">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">{post.description}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-ink-muted">
              <span className="text-navy">{siteConfig.brandName} team</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </p>
          </div>
        </header>

        <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            <aside className="rounded-2xl border border-teal/30 bg-teal-50 p-6" aria-labelledby="takeaways-title">
              <p id="takeaways-title" className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">
                Key takeaways
              </p>
              <ul className="mt-3 space-y-2.5">
                {post.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-navy">
                    <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-teal" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </aside>

            <div id="post-body" className="prose-post mt-10">
              <Body />
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-card p-6 shadow-card sm:p-8">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-700">Talk it through</p>
              <p className="mt-2 text-lg font-extrabold tracking-tight text-navy">Not sure which format fits your team?</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Tell us what you sell, which states you serve, and how your phones are staffed. We will say which format we
                would start with and why, with no obligation.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <OpenOnboardingButton className="justify-center">
                  {siteConfig.cta.primary}
                  <ArrowIcon className="h-4 w-4" />
                </OpenOnboardingButton>
                <ButtonLink href="/#contact" variant="secondary" className="justify-center">
                  {siteConfig.cta.contact}
                </ButtonLink>
              </div>
            </div>
          </div>

          <aside className="order-first lg:order-none">
            <div className="lg:sticky lg:top-24">
              <LegalToc containerId="post-body" />
            </div>
          </aside>
        </div>

        {others.length > 0 ? (
          <section className="container-x pb-12 sm:pb-16" aria-labelledby="more-posts">
            <h2 id="more-posts" className="text-xl font-extrabold tracking-tight text-navy">
              More guides
            </h2>
            <ul className="mt-5 grid gap-5 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="block h-full rounded-card border border-line bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-teal/40">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{p.category}</p>
                    <p className="mt-3 font-extrabold leading-snug text-navy">{p.title}</p>
                    <p className="mt-3 text-xs font-semibold text-ink-subtle">{formatPostDate(p.publishedAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
      <CtaBand />
    </>
  );
}
