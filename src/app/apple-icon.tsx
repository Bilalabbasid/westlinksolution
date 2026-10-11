import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: solid teal tile (iOS does not support transparency here). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#008c82", borderRadius: 40 }}>
        <svg width="132" height="132" viewBox="0 0 40 40" fill="none">
          <path d="M8 29 15 11l5 12 5-12 7 18" stroke="#ffffff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="33" cy="10.5" r="3.4" fill="#e7ad52" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
