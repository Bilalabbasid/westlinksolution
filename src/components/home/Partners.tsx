import Image from "next/image";
import { partners } from "@/content/partners";

/**
 * Logo strip for approved partners. Hidden entirely while the list is empty.
 */
export function Partners() {
  if (partners.length === 0) return null;

  return (
    <section id="partners" className="scroll-mt-24 border-y border-line bg-white py-12" aria-labelledby="partners-title">
      <div className="container-x">
        <h2 id="partners-title" className="text-center text-xs font-extrabold uppercase tracking-[0.18em] text-ink-subtle">
          Organizations we work with
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {partners.map((p) => (
            <li key={p.name} className="opacity-80 transition-opacity hover:opacity-100">
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                  <Image src={p.logoSrc} alt={p.name} width={p.width} height={p.height} loading="lazy" />
                </a>
              ) : (
                <Image src={p.logoSrc} alt={p.name} width={p.width} height={p.height} loading="lazy" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
