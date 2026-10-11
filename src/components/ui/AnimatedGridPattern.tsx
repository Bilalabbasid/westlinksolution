"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

/**
 * Magic UI style animated grid: a faint grid with squares that fade in and
 * out at random positions. Renders a static grid under reduced motion or
 * before the container has been measured.
 */
export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  numSquares = 40,
  maxOpacity = 0.35,
  duration = 4,
  repeatDelay = 0.5,
  className,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const reduce = useReducedMotionSafe();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Array<{ id: number; pos: [number, number] }>>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const next = { width: entry.contentRect.width, height: entry.contentRect.height };
        setDimensions(next);
        if (next.width === 0 || next.height === 0) continue;
        const cols = Math.max(1, Math.ceil(next.width / width));
        const rows = Math.max(1, Math.ceil(next.height / height));
        setSquares(
          Array.from({ length: numSquares }, (_, i) => ({
            id: i,
            pos: [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)] as [number, number],
          })),
        );
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [numSquares, width, height]);

  const reposition = (sqId: number) => {
    const cols = Math.max(1, Math.ceil(dimensions.width / width));
    const rows = Math.max(1, Math.ceil(dimensions.height / height));
    setSquares((list) => list.map((s) => (s.id === sqId ? { ...s, pos: [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)] } : s)));
  };

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full fill-teal/20 stroke-navy/10", className)}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {/* Always rendered so server and client markup match; squares only exist after measurement. */}
      <svg x={x} y={y} className="overflow-visible">
        {(reduce ? [] : squares).map(({ pos: [px, py], id: sqId }, index) => (
            <motion.rect
              key={`${sqId}-${px}-${py}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{ duration, repeat: 1, delay: index * 0.1, repeatType: "reverse", repeatDelay }}
              onAnimationComplete={() => reposition(sqId)}
              width={width - 1}
              height={height - 1}
              x={px * width + 1}
              y={py * height + 1}
              strokeWidth="0"
            />
        ))}
      </svg>
    </svg>
  );
}
