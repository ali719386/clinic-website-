import { GlassIcon, GlassLine, GlassShape, shape, toneFill, type GlassIconProps } from "./glass"

const HEADER = "M32 26H88Q102 26 102 40V50H18V40Q18 26 32 26Z"
// a 3×2 grid of days; the last one is marked
const DAYS = [62, 80].flatMap((y) => [32, 54, 76].map((x) => [x, y] as const))

export function CalendarIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <GlassShape d={shape.rect(18, 26, 84, 80, 14)} tone="frost" />
      <GlassShape d={HEADER} tone="teal" shadow={false} spec={[34, 32, 9, 3]} />
      {DAYS.slice(0, -1).map(([x, y]) => (
        <path key={`${x}-${y}`} d={shape.rect(x, y, 12, 11, 3)} style={toneFill("teal", 0.28)} />
      ))}
      <GlassShape d={shape.rect(74, 78, 16, 15, 4)} tone="green" />
      <GlassLine d="M41 14V34" tone="deep" width={6} />
      <GlassLine d="M79 14V34" tone="deep" width={6} />
    </GlassIcon>
  )
}
