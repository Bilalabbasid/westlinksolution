import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children: ReactNode;
}

/**
 * Magic UI style marquee driven purely by CSS. Content is duplicated for a
 * seamless loop; duplicates are hidden from assistive technology. Under
 * reduced motion the track stops and simply wraps.
 */
export function Marquee({ className, reverse = false, pauseOnHover = true, vertical = false, repeat = 3, children, ...props }: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? "true" : undefined}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "marquee-vertical flex-col" : "marquee-horizontal flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
