import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.brandName}: lead generation, pay-per-call and live-transfer campaigns for insurance, home services, debt and legal`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Original share artwork generated from brand tokens; no external assets. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #f8fafc 0%, #ecf7f6 60%, #fcf6ea 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#14253d",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "#008c82",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: -160,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: "#e7ad52",
            opacity: 0.18,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#008c82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
              <path d="M11.5 24.5 15 15.5l4 9 4-9 3.5 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="29.5" cy="16.5" r="3" fill="#e7ad52" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>Westlink</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 6, color: "#52637a" }}>SOLUTION</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Put your sales team in front of buyers who are ready to talk.
          </div>
          <div style={{ fontSize: 26, color: "#52637a", lineHeight: 1.35 }}>
            Leads, inbound calls, and campaign support for insurance, home-services, financial, and legal teams.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Insurance", "Home Services", "Financial Services", "Legal"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "2px solid #14253d",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
