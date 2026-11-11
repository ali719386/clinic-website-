import { GlassIcon, GlassLine, GlassShape, shape, type GlassIconProps } from "./glass"

// rungs where the two strands pass the quarter points of each curve
const RUNGS: [number, number, number][] = [
  [26, 47.6, 72.4],
  [46, 47.6, 72.4],
  [74, 47.6, 72.4],
  [94, 47.6, 72.4],
]

export function DnaStrandIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      {RUNGS.map(([y, a, b]) => (
        <GlassLine key={y} d={`M${a} ${y}L${b} ${y}`} tone="frost" width={4} shadow={false} />
      ))}
      <GlassLine d="M42 12C42 36 78 36 78 60C78 84 42 84 42 108" tone="teal" width={7} />
      <GlassLine d="M78 12C78 36 42 36 42 60C42 84 78 84 78 108" tone="deep" width={7} />
      {RUNGS.map(([y, a, b]) => (
        <g key={y}>
          <GlassShape d={shape.circle(a, y, 3.4)} tone="frost" shadow={false} />
          <GlassShape d={shape.circle(b, y, 3.4)} tone="frost" shadow={false} />
        </g>
      ))}
    </GlassIcon>
  )
}
