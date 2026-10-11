import { faqItems } from "@/content/faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-white py-20 sm:py-28" aria-labelledby="faq-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow="Questions buyers ask"
            title="Straight answers before you apply."
            description="If your question is not here, send it through the contact form and a partnerships specialist will answer it directly."
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="divide-y divide-line rounded-card border border-line bg-card shadow-card">
            {faqItems.map((item, i) => (
              <details key={item.question} className="group px-5 sm:px-6" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-bold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-line-strong text-teal-700 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
