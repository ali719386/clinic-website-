"use client"

import { useId } from "react"

const LIGHT = "var(--brand-deep-foreground)"
const SKIN = `color-mix(in oklab, var(--chart-3) 26%, ${LIGHT})`
const SKIN_SHADE = `color-mix(in oklab, var(--chart-3) 40%, ${LIGHT})`

/** A drawn doctor in a white coat, in a round glass frame (no photo) */
export function DoctorAvatar({ size = 88, className }: { size?: number; className?: string }) {
  const id = "d" + useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden focusable="false" className={className}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: `color-mix(in oklab, var(--primary) 22%, ${LIGHT})` }} />
          <stop offset="1" style={{ stopColor: `color-mix(in oklab, var(--primary) 55%, ${LIGHT})` }} />
        </linearGradient>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: LIGHT }} />
          <stop offset="1" style={{ stopColor: `color-mix(in oklab, var(--primary) 16%, ${LIGHT})` }} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: LIGHT, stopOpacity: 0.55 }} />
          <stop offset="0.45" style={{ stopColor: LIGHT, stopOpacity: 0 }} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="60" cy="60" r="56" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="56" fill={`url(#${id}-bg)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* coat, scrubs and neck */}
        <path d="M14 124C16 94 36 80 60 80C84 80 104 94 106 124Z" fill={`url(#${id}-coat)`} />
        <path d="M49 81L60 100L71 81Z" style={{ fill: "var(--primary)" }} />
        <path d="M52 64H68V84Q60 90 52 84Z" style={{ fill: SKIN_SHADE }} />
        <path d="M49 81L60 100L54 104L44 85Z" fill={`url(#${id}-coat)`} />
        <path d="M71 81L60 100L66 104L76 85Z" fill={`url(#${id}-coat)`} />
        {/* the head and hair */}
        <ellipse cx="60" cy="51" rx="17.5" ry="20" style={{ fill: SKIN }} />
        <path d="M41.5 52C40 33 50 27 61 27C73 27 81.5 35 78.5 52C76 43 70 39 60 39C51 39 45 43 41.5 52Z" style={{ fill: "var(--brand-deep)" }} />
        <circle cx="53.5" cy="53" r="1.8" style={{ fill: "var(--brand-deep)" }} />
        <circle cx="66.5" cy="53" r="1.8" style={{ fill: "var(--brand-deep)" }} />
        <path d="M55 61Q60 65 65 61" fill="none" strokeWidth="1.8" strokeLinecap="round" style={{ stroke: "var(--brand-deep)" }} />
        {/* stethoscope round the neck */}
        <path d="M46 84C45 98 50 104 57 104" fill="none" strokeWidth="2.6" strokeLinecap="round" style={{ stroke: "var(--brand-deep)" }} />
        <path d="M74 84C76 92 76 96 74 100" fill="none" strokeWidth="2.6" strokeLinecap="round" style={{ stroke: "var(--brand-deep)" }} />
        <circle cx="73" cy="103" r="4.5" style={{ fill: "var(--secondary)" }} />
      </g>
      <circle cx="60" cy="60" r="56" fill={`url(#${id}-shine)`} />
      <circle cx="60" cy="60" r="55.4" fill="none" strokeWidth="1.2" strokeOpacity="0.9" style={{ stroke: LIGHT }} />
    </svg>
  )
}
