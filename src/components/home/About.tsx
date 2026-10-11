import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    title: "Scoped to what you can serve",
    body: "Every campaign begins with your products, licenses, service area, and hours. We do not send what your team cannot handle.",
  },
  {
    title: "Documented sourcing",
    body: "We keep records of where prospects come from and what they were told, and we share that documentation with your compliance contact when asked.",
  },
  {
    title: "A standing review",
    body: "A named account manager meets with you on a regular cadence to look at volume, contact quality, and your feedback, then adjusts the campaign.",
  },
];

export function About() {
  return (
    <section id="about" className="dot-grid scroll-mt-24 py-20 sm:py-28" aria-labelledby="about-title">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            id="about-title"
            eyebrow="About Westlink"
            title="A customer-acquisition partner, not another lead list."
            description={
              <>
                {siteConfig.brandName} works with businesses that sell to consumers in regulated and high-consideration
                categories. We plan campaigns around how your team actually works, deliver prospects in the form you
                can act on, and keep improving the campaign with you after launch.
              </>
            }
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted">
            We do not issue insurance policies, make loans, or represent legal clients. Our job is to connect people who
            have a real need with the licensed and qualified businesses that can help them.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Industries we serve">
            {[
              ["Insurance", "insurance"],
              ["Home services", "home-services"],
              ["Finance insurance", "finance-insurance"],
              ["Legal insurance", "legal-insurance"],
            ].map(([label, id]) => (
              <li key={id}>
                <a
                  href={`#industries-${id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="grid gap-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} as="li" delay={i * 90}>
              <div className="card-sheen group flex gap-4 rounded-card border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-card-hover sm:p-6">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-navy text-sm font-extrabold text-amber" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-navy">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
