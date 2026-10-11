import { capabilities, type Capability } from "@/content/capabilities";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<Capability["id"], React.ReactNode> = {
  leads: (
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11ZM8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  calls: (
    <path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.5 1.5C9.6 20.5 3.5 14.4 3.5 5.5A1.5 1.5 0 0 1 5 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  ),
  support: (
    <path d="M12 3a9 9 0 0 1 9 9v3.5a2.5 2.5 0 0 1-2.5 2.5H17v-6h4M3 15.5V12a9 9 0 0 1 9-9M3 12h4v6H5.5A2.5 2.5 0 0 1 3 15.5M12 21h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

export function Capabilities() {
  return (
    <section className="relative -mt-4 pb-6 sm:-mt-6" aria-labelledby="capabilities-title">
      <div className="container-x">
        <h2 id="capabilities-title" className="sr-only">
          What Westlink delivers
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.id} as="li" delay={i * 90}>
              <article className="group relative h-full overflow-hidden rounded-card border border-line bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-50 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-amber">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                    {icons[c.id]}
                  </svg>
                </div>
                <h3 className="relative mt-4 text-lg font-extrabold tracking-tight text-navy">{c.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">{c.description}</p>
                <ul className="relative mt-4 space-y-1.5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm font-semibold text-navy-500">
                      <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-teal" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
