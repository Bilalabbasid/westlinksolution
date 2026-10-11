import { challenges } from "@/content/challenges";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Challenges() {
  return (
    <section id="challenges" className="scroll-mt-24 bg-navy py-16 text-white sm:py-20" aria-labelledby="challenges-title">
      <div className="container-x">
        <SectionHeading
          id="challenges-title"
          eyebrow="Challenges we help with"
          title={<span className="text-white">The problems buyers bring us, and how we approach them.</span>}
          description={<span className="text-white/70">We would rather describe the work than promise outcomes. Here is what a campaign with Westlink is designed to fix.</span>}
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {challenges.map((c, i) => (
            <Reveal key={c.id} as="li" delay={i * 90}>
              <div className="h-full rounded-card border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.07] sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber">Challenge</p>
                <h3 className="mt-2 text-xl font-extrabold tracking-tight">{c.challenge}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{c.detail}</p>
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-100">Our approach</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{c.approach}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
