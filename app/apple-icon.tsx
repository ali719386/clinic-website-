// The home-screen icon (Apple touch icon), drawn from the brand mark at build
// time. The teal is the light-mode primary token (docs/design-tokens.md); an
// image cannot read CSS variables.
import { ImageResponse } from "next/og"
import { STETHOSCOPE_CIRCLE, STETHOSCOPE_PATHS } from "@/components/brand/mark"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#00717f" }}>
        <svg width="112" height="112" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {STETHOSCOPE_PATHS.map((d) => <path key={d} d={d} />)}
          <circle cx={STETHOSCOPE_CIRCLE.cx} cy={STETHOSCOPE_CIRCLE.cy} r={STETHOSCOPE_CIRCLE.r} />
        </svg>
      </div>
    ),
    size,
  )
}
