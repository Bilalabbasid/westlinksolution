import { testimonials } from "@/content/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Renders verified partner testimonials. Hidden entirely while the content
 * list is empty so no placeholder or fabricated quotes reach the public site.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionHeading id="testimonials-title" eyebrow="From our partners" title="What partners say about working with Westlink." align="center" />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={`${t.name}-${t.company}`} as="li" delay={i * 90}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card">
                <blockquote className="flex-1 text-base leading-relaxed text-navy">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                  <span className="block font-extrabold text-navy">{t.name}</span>
                  <span className="text-ink-muted">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
