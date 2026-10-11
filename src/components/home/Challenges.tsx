import { challenges } from "@/content/challenges";
import { AnimatedGridPattern } from "@/components/ui/AnimatedGridPattern";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Challenges() {
  return (
    <section id="challenges" className="relative scroll-mt-24 overflow-hidden bg-navy py-20 text-white sm:py-28" aria-labelledby="challenges-title">
      <AnimatedGridPattern numSquares={30} maxOpacity={0.14} className="fill-white/20 stroke-white/[0.05] [mask-image:radial-gradient(800px_circle_at_80%_20%,white,transparent)]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-teal/25 blur-3xl" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading
          id="challenges-title"
          tone="dark"
          eyebrow="Challenges we help with"
          title="The problems buyers bring us, and how we approach them."
          description="We would rather describe the work than promise outcomes. Here is what a campaign with Westlink is designed to fix."
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {challenges.map((c, i) => (
            <Reveal key={c.id} as="li" delay={i * 100}>
              <div className="group h-full rounded-card border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber/50 hover:bg-white/[0.08] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-amber">Challenge</p>
                  <span className="text-xs font-extrabold tracking-[0.2em] text-white/40">0{i + 1}</span>
                </div>
                <h3 className="mt-2 text-xl font-extrabold tracking-tight">{c.challenge}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{c.detail}</p>
                <div className="mt-5 rounded-xl border border-white/10 bg-navy/60 p-4 transition-colors group-hover:border-teal/50">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-teal-100">Our approach</p>
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
