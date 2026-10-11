/**
 * Original hero illustration: prospects on the left, the Westlink hub in the
 * middle, and partner intake teams on the right, joined by flowing links.
 * Labels are HTML inside <foreignObject> so they wrap/clip inside their
 * shapes no matter which font is available. Animation is disabled under
 * reduced motion.
 */
const PROSPECTS = [
  { y: 70, label: "Comparing quotes", tone: "teal" },
  { y: 150, label: "Needs a roof repair", tone: "amber" },
  { y: 230, label: "Asking about debt relief", tone: "teal" },
  { y: 310, label: "Looking for a lawyer", tone: "amber" },
] as const;

const PARTNERS = [
  { y: 96, label: "Licensed agency", sub: "Insurance" },
  { y: 190, label: "Contractor intake", sub: "Home services" },
  { y: 284, label: "Firm intake desk", sub: "Legal and finance" },
] as const;

const HUB = { x: 332, y: 190 };
const HUB_R = 60;
const PILL = { x: 20, w: 204, h: 46 };
const CARD = { x: 440, w: 180, h: 62 };
const FONT = "Manrope, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";

export function HeroIllustration({ animated = false }: { animated?: boolean }) {
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
            d={`M${PILL.x + PILL.w} ${p.y} C ${PILL.x + PILL.w + 50} ${p.y}, ${HUB.x - 120} ${HUB.y}, ${HUB.x - HUB_R - 4} ${HUB.y}`}
            stroke="#008c82"
            strokeOpacity="0.55"
            className="link-flow"
          />
        ))}
        {PARTNERS.map((p) => (
          <path
            key={p.label}
            d={`M${HUB.x + HUB_R + 4} ${HUB.y} C ${HUB.x + 120} ${HUB.y}, ${CARD.x - 60} ${p.y}, ${CARD.x} ${p.y}`}
            stroke="#e7ad52"
            strokeOpacity="0.9"
            className="link-flow"
          />
        ))}
      </g>

      {/* Travelling signals (SMIL, only when motion is allowed) */}
      {animated ? (
        <g>
          {PROSPECTS.map((p, i) => (
            <circle key={`in-${p.label}`} r="4" fill="#008c82">
              <animateMotion
                dur="3.6s"
                begin={`${i * 0.9}s`}
                repeatCount="indefinite"
                path={`M${PILL.x + PILL.w} ${p.y} C ${PILL.x + PILL.w + 50} ${p.y}, ${HUB.x - 120} ${HUB.y}, ${HUB.x - HUB_R - 4} ${HUB.y}`}
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
                keyTimes="0;1"
              />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.6s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {PARTNERS.map((p, i) => (
            <circle key={`out-${p.label}`} r="4" fill="#e7ad52">
              <animateMotion
                dur="3.2s"
                begin={`${1.2 + i * 1.1}s`}
                repeatCount="indefinite"
                path={`M${HUB.x + HUB_R + 4} ${HUB.y} C ${HUB.x + 120} ${HUB.y}, ${CARD.x - 60} ${p.y}, ${CARD.x} ${p.y}`}
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
                keyTimes="0;1"
              />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.2s" begin={`${1.2 + i * 1.1}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ) : null}

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
                  fontSize: 12.5,
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
        <circle r={HUB_R + 22} fill="#008c82" opacity="0.07" className="node-pulse" />
        <circle r={HUB_R} fill="url(#hub-grad)" filter="url(#soft)" />
        <path d="M-20 2 -12 -18 0 2 12 -18 20 2" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="28" cy="-26" r="6" fill="#e7ad52" />
        <text y="26" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff" letterSpacing="2.5" fontFamily={FONT}>
          WESTLINK
        </text>
        {/* Opaque chip so the subtitle never collides with connector lines */}
        <g transform={`translate(0 ${HUB_R + 14})`}>
          <rect x="-70" y="0" width="140" height="26" rx="13" fill="#ffffff" stroke="#e2e8f0" />
          <text y="17" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#52637a" fontFamily={FONT}>
            matching and routing
          </text>
        </g>
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
              <div style={{ fontSize: 12.5, fontWeight: 800 }}>{p.label}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "#52637a" }}>{p.sub}</div>
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
            style={{ height: "100%", display: "flex", alignItems: "center", fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#52637a", overflow: "hidden" }}
          >
            Prospects routed by the criteria you set
          </div>
        </foreignObject>
      </g>
      <g transform="translate(440 368)">
        <rect width="180" height="32" rx="16" fill="#14253d" />
        <circle cx="17" cy="16" r="4.5" fill="#e7ad52" />
        <foreignObject x="28" y="0" width="146" height="32">
          <div
            // @ts-expect-error xmlns is required for HTML inside SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ height: "100%", display: "flex", alignItems: "center", fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#ffffff", overflow: "hidden" }}
          >
            Delivered to your team
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}
