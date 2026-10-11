/**
 * Original hero illustration: prospects on the left, the Westlink hub in the
 * middle, and partner intake teams on the right, joined by flowing links.
 * Labels are HTML inside <foreignObject> so they wrap/clip inside their
 * shapes no matter which font is available. Animation is disabled under
 * reduced motion.
 */
const PROSPECTS = [
  { y: 72, label: "Comparing quotes", tone: "teal" },
  { y: 154, label: "Needs a roof repair", tone: "amber" },
  { y: 236, label: "Asking about debt relief", tone: "teal" },
  { y: 318, label: "Looking for a lawyer", tone: "amber" },
] as const;

const PARTNERS = [
  { y: 100, label: "Licensed agency", sub: "Insurance" },
  { y: 195, label: "Contractor intake", sub: "Home services" },
  { y: 290, label: "Firm intake desk", sub: "Legal and finance" },
] as const;

const HUB = { x: 330, y: 195 };
const PILL = { x: 22, w: 196, h: 44 };
const CARD = { x: 446, w: 172, h: 60 };
const FONT = "Manrope, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";

export function HeroIllustration() {
  return (
    <svg viewBox="0 0 640 420" className="h-auto w-full" role="img" aria-labelledby="hero-illustration-title hero-illustration-desc">
      <title id="hero-illustration-title">How Westlink connects prospects with partners</title>
      <desc id="hero-illustration-desc">
        People with a specific need on the left flow through the Westlink hub in the middle to the intake teams of
        insurance, home-service, financial, and legal partners on the right.
      </desc>
      <defs>
        <linearGradient id="hub-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0aa394" />
          <stop offset="1" stopColor="#006e66" />
        </linearGradient>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1f8f7" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#14253d" floodOpacity="0.10" />
        </filter>
        <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="#14253d" opacity="0.07" />
        </pattern>
      </defs>

      <rect width="640" height="420" rx="28" fill="url(#bg-grad)" />
      <rect width="640" height="420" rx="28" fill="url(#dots)" />

      {/* Links */}
      <g fill="none" strokeWidth="2.5" strokeLinecap="round">
        {PROSPECTS.map((p) => (
          <path
            key={p.label}
            d={`M${PILL.x + PILL.w} ${p.y} C ${PILL.x + PILL.w + 50} ${p.y}, ${HUB.x - 110} ${HUB.y}, ${HUB.x - 52} ${HUB.y}`}
            stroke="#008c82"
            strokeOpacity="0.55"
            className="link-flow"
          />
        ))}
        {PARTNERS.map((p) => (
          <path
            key={p.label}
            d={`M${HUB.x + 52} ${HUB.y} C ${HUB.x + 110} ${HUB.y}, ${CARD.x - 60} ${p.y}, ${CARD.x} ${p.y}`}
            stroke="#e7ad52"
            strokeOpacity="0.9"
            className="link-flow"
          />
        ))}
      </g>

      {/* Prospect pills */}
      {PROSPECTS.map((p) => {
        const accent = p.tone === "teal" ? "#008c82" : "#b9842f";
        const tint = p.tone === "teal" ? "#d7efec" : "#f9ecd5";
        return (
          <g key={p.label} transform={`translate(${PILL.x} ${p.y - PILL.h / 2})`} filter="url(#soft)">
            <rect width={PILL.w} height={PILL.h} rx={PILL.h / 2} fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="22" cy="22" r="11" fill={tint} />
            <circle cx="22" cy="18.5" r="3.4" fill={accent} />
            <path d="M15.5 28c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
            <foreignObject x="40" y="0" width={PILL.w - 52} height={PILL.h}>
              <div
                // @ts-expect-error xmlns is required for HTML inside SVG
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: FONT,
                  fontSize: 11.5,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "#14253d",
                  overflow: "hidden",
                }}
              >
                {p.label}
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Hub */}
      <g transform={`translate(${HUB.x} ${HUB.y})`}>
        <circle r="70" fill="#008c82" opacity="0.07" className="node-pulse" />
        <circle r="50" fill="url(#hub-grad)" filter="url(#soft)" />
        <path d="M-19 10 -11 -10 0 10 11 -10 19 10" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="27" cy="-18" r="6" fill="#e7ad52" />
        <foreignObject x="-70" y="60" width="140" height="40">
          <div
            // @ts-expect-error xmlns is required for HTML inside SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ textAlign: "center", fontFamily: FONT, color: "#14253d", lineHeight: 1.25 }}
          >
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 2 }}>WESTLINK</div>
            <div style={{ fontSize: 9.5, fontWeight: 600, color: "#52637a" }}>matching and routing</div>
          </div>
        </foreignObject>
      </g>

      {/* Partner cards */}
      {PARTNERS.map((p) => (
        <g key={p.label} transform={`translate(${CARD.x} ${p.y - CARD.h / 2})`} filter="url(#soft)">
          <rect width={CARD.w} height={CARD.h} rx="14" fill="#ffffff" stroke="#e2e8f0" />
          <rect x="0" y="12" width="4" height={CARD.h - 24} rx="2" fill="#e7ad52" />
          <rect x="16" y="17" width="26" height="26" rx="8" fill="#14253d" />
          <path d="M23 30h12M29 24v12" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          <foreignObject x="52" y="0" width={CARD.w - 60} height={CARD.h}>
            <div
              // @ts-expect-error xmlns is required for HTML inside SVG
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontFamily: FONT,
                color: "#14253d",
                lineHeight: 1.2,
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 800 }}>{p.label}</div>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "#52637a" }}>{p.sub}</div>
            </div>
          </foreignObject>
        </g>
      ))}

      {/* Caption chips */}
      <g transform="translate(22 368)">
        <rect width="250" height="32" rx="16" fill="#ffffff" stroke="#e2e8f0" />
        <circle cx="17" cy="16" r="4.5" fill="#008c82" />
        <foreignObject x="28" y="0" width="214" height="32">
          <div
            // @ts-expect-error xmlns is required for HTML inside SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ height: "100%", display: "flex", alignItems: "center", fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#52637a", overflow: "hidden" }}
          >
            Prospects routed by the criteria you set
          </div>
        </foreignObject>
      </g>
      <g transform="translate(446 368)">
        <rect width="172" height="32" rx="16" fill="#14253d" />
        <circle cx="17" cy="16" r="4.5" fill="#e7ad52" />
        <foreignObject x="28" y="0" width="138" height="32">
          <div
            // @ts-expect-error xmlns is required for HTML inside SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ height: "100%", display: "flex", alignItems: "center", fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#ffffff", overflow: "hidden" }}
          >
            Delivered to your team
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}
