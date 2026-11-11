"use client"

// The glass look shared by the hero's icons: every shape gets a tinted body,
// a glossy top, a bright rim and a soft drop shadow. Colours come from the
// design tokens only (README rule 1), so they follow the theme.

import { createContext, useContext, useId, type CSSProperties, type ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type GlassTone = "teal" | "green" | "frost" | "white" | "deep"

const LIGHT = "var(--brand-deep-foreground)" // near white in both themes

const TONES: Record<GlassTone, [string, string]> = {
  teal: [`color-mix(in oklab, var(--primary), ${LIGHT} 42%)`, "color-mix(in oklab, var(--primary) 78%, var(--brand-deep))"],
  green: [`color-mix(in oklab, var(--secondary), ${LIGHT} 38%)`, "color-mix(in oklab, var(--secondary) 82%, var(--brand-deep))"],
  frost: [LIGHT, `color-mix(in oklab, var(--primary) 24%, ${LIGHT})`],
  white: [LIGHT, `color-mix(in oklab, var(--primary) 7%, ${LIGHT})`],
  deep: ["color-mix(in oklab, var(--primary) 60%, var(--brand-deep))", "var(--brand-deep)"],
}

const GlassContext = createContext("glass")

/** The gradient or filter `url()` of this icon's defs */
function useGlass() {
  const id = useContext(GlassContext)
  return {
    fill: (tone: GlassTone) => `url(#${id}-${tone})`,
    line: (tone: GlassTone) => `url(#${id}-${tone}-u)`,
    shine: `url(#${id}-shine)`,
    rim: `url(#${id}-rim)`,
    shadow: `url(#${id}-shadow)`,
    soft: `url(#${id}-soft)`,
  }
}

export type GlassIconProps = {
  size?: number
  className?: string
  style?: CSSProperties
  /** float gently (y ±10px, a slow tilt); the delay keeps neighbours out of step */
  float?: boolean
  floatDelay?: number
  /** seconds per float cycle, so icons side by side drift at their own pace */
  floatDuration?: number
}

/** The 120×120 canvas of a glass icon, with its gradients and filters */
export function GlassIcon({
  size = 96,
  className,
  style,
  float = true,
  floatDelay = 0,
  floatDuration = 7,
  children,
}: GlassIconProps & { children: ReactNode }) {
  const id = "g" + useId().replace(/[^a-zA-Z0-9]/g, "")
  const floatVars = { "--float-delay": `${-floatDelay}s`, "--float-dur": `${floatDuration}s` } as CSSProperties
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden
      focusable="false"
      className={cn("overflow-visible", float && "glass-float", className)}
      style={{ ...style, ...(float ? floatVars : {}) }}
    >
      <defs>
        {(Object.keys(TONES) as GlassTone[]).map((tone) => (
          <g key={tone}>
            <linearGradient id={`${id}-${tone}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style={{ stopColor: TONES[tone][0] }} />
              <stop offset="1" style={{ stopColor: TONES[tone][1] }} />
            </linearGradient>
            {/* for strokes: a straight line has no box to stretch a gradient over */}
            <linearGradient id={`${id}-${tone}-u`} gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="110" y2="110">
              <stop offset="0" style={{ stopColor: TONES[tone][0] }} />
              <stop offset="1" style={{ stopColor: TONES[tone][1] }} />
            </linearGradient>
          </g>
        ))}
        {/* the gloss: bright on top, clear in the middle, a faint bounce at the foot */}
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: LIGHT, stopOpacity: 0.75 }} />
          <stop offset="0.36" style={{ stopColor: LIGHT, stopOpacity: 0.16 }} />
          <stop offset="0.5" style={{ stopColor: LIGHT, stopOpacity: 0 }} />
          <stop offset="0.86" style={{ stopColor: LIGHT, stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: LIGHT, stopOpacity: 0.28 }} />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: LIGHT, stopOpacity: 0.95 }} />
          <stop offset="0.5" style={{ stopColor: LIGHT, stopOpacity: 0.15 }} />
          <stop offset="1" style={{ stopColor: LIGHT, stopOpacity: 0.55 }} />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" style={{ floodColor: "var(--brand-deep)", floodOpacity: 0.22 }} />
        </filter>
        <filter id={`${id}-soft`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      {/* the shadow on the ground, under the floating icon */}
      <ellipse cx="60" cy="116" rx="30" ry="4.5" style={{ fill: "var(--brand-deep)" }} opacity="0.14" filter={`url(#${id}-soft)`} />
      <GlassContext.Provider value={id}>{children}</GlassContext.Provider>
    </svg>
  )
}

/** A filled glass shape: body, gloss, rim and (optionally) a specular spot */
export function GlassShape({
  d,
  tone = "teal",
  shadow = true,
  spec,
  transform,
  opacity = 1,
  border,
}: {
  d: string
  tone?: GlassTone
  shadow?: boolean
  /** a blurred highlight: [cx, cy, rx, ry] */
  spec?: [number, number, number, number]
  transform?: string
  /** the body's opacity: below 1 it is see-through, like frosted glass */
  opacity?: number
  /** a thin teal edge, at this opacity */
  border?: number
}) {
  const g = useGlass()
  return (
    <g transform={transform}>
      <path d={d} fill={g.fill(tone)} fillOpacity={opacity} filter={shadow ? g.shadow : undefined} />
      <path d={d} fill={g.shine} />
      <path d={d} fill="none" stroke={g.rim} strokeWidth={1.2} />
      {border !== undefined && (
        <path d={d} fill="none" strokeWidth={1.6} strokeOpacity={border} style={{ stroke: "var(--primary)" }} />
      )}
      {spec && (
        <ellipse cx={spec[0]} cy={spec[1]} rx={spec[2]} ry={spec[3]} style={{ fill: LIGHT }} opacity={0.7} filter={g.soft} />
      )}
    </g>
  )
}

/** A glass tube: a tinted stroke with a thin highlight running along its top */
export function GlassLine({ d, tone = "teal", width = 7, shadow = true }: { d: string; tone?: GlassTone; width?: number; shadow?: boolean }) {
  const g = useGlass()
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={g.line(tone)} strokeWidth={width} filter={shadow ? g.shadow : undefined} />
      <path d={d} stroke={LIGHT} strokeOpacity={0.5} strokeWidth={width * 0.28} transform="translate(-0.8 -1)" />
    </g>
  )
}

/** A plain (non-glass) fill in a tone, for small details */
export function toneFill(tone: GlassTone, opacity = 1): CSSProperties {
  return { fill: TONES[tone][1], fillOpacity: opacity }
}

export const shape = {
  circle: (cx: number, cy: number, r: number) =>
    `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`,
  rect: (x: number, y: number, w: number, h: number, r: number) =>
    `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`,
}
