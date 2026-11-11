// The "Clinics" logo (design tokens step 3, 2026-10-22): one
// component for the marketing navbar and footer, the sign-in pages and the app
// sidebar. Colours come from the tokens (docs/design-tokens.md).
import { cn } from "@workspace/ui/lib/utils"
import { STETHOSCOPE_CIRCLE, STETHOSCOPE_PATHS } from "./mark"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {STETHOSCOPE_PATHS.map((d) => <path key={d} d={d} />)}
      <circle {...STETHOSCOPE_CIRCLE} />
    </svg>
  )
}

const SIZES = {
  sm: { tile: "size-8 rounded-lg", mark: "size-4", word: "text-sm", sub: "text-xs" },
  md: { tile: "size-10 rounded-xl", mark: "size-5", word: "text-[20px]", sub: "text-[11px]" },
  lg: { tile: "size-12 rounded-xl", mark: "size-6", word: "text-[22px]", sub: "text-xs" },
} as const

export function Logo({
  variant = "full",
  tone = "default",
  size = "md",
  subtitle,
  className,
}: {
  /** full: the tile with "Clinics" and the subtitle; mark: the tile only */
  variant?: "full" | "mark"
  /** onDark: text for the brand bands (footer); onLight: dark teal in both
   *  themes, for the home hero's light photo */
  tone?: "default" | "onDark" | "onLight"
  size?: keyof typeof SIZES
  subtitle?: React.ReactNode
  className?: string
}) {
  const s = SIZES[size]
  const tile = (
    <span className={cn("flex shrink-0 items-center justify-center bg-primary text-primary-foreground", s.tile)}>
      <LogoMark className={s.mark} />
    </span>
  )
  if (variant === "mark") return <span className={className}>{tile}</span>
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {tile}
      <span className="flex min-w-0 flex-col leading-none">
        <span className={cn("truncate font-heading font-extrabold tracking-tight transition-colors duration-500", s.word, tone === "onDark" ? "text-brand-deep-foreground" : tone === "onLight" ? "text-brand-deep" : "text-primary")}>
          Clinics
        </span>
        {subtitle && (
          <span className={cn("mt-1 truncate font-medium transition-colors duration-500", s.sub, tone === "onDark" ? "text-brand-deep-foreground/70" : tone === "onLight" ? "text-brand-deep/70" : "text-muted-foreground")}>
            {subtitle}
          </span>
        )}
      </span>
    </span>
  )
}
