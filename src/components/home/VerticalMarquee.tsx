import { verticalOptions } from "@/content/verticals";
import { Marquee } from "@/components/ui/Marquee";

/** Scrolling strip of every campaign vertical Westlink runs. Decorative; the list is also in the industry tabs and FAQ. */
export function VerticalMarquee() {
  const items = verticalOptions.filter((v) => v.value !== "Other");
  return (
    <div className="relative border-y border-line bg-white/70 py-3 backdrop-blur [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" aria-hidden="true">
      <Marquee className="[--duration:55s] [--gap:0.75rem] p-0">
        {items.map((v) => (
          <span key={v.value} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy">
            <span className={`h-1.5 w-1.5 rounded-full ${v.group === "Insurance" ? "bg-teal" : v.group === "Home Services" ? "bg-amber" : v.group === "Finance Insurance" ? "bg-navy" : "bg-teal-700"}`} />
            {v.value}
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-subtle">{v.group}</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
