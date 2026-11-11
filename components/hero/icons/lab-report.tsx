import { GlassIcon, GlassShape, shape, toneFill, type GlassIconProps } from "./glass"

const ROWS = [44, 58, 72, 86]

export function LabReportIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <GlassShape d={shape.rect(18, 18, 66, 92, 12)} tone="frost" spec={[30, 26, 9, 3]} />
      <GlassShape d={shape.rect(36, 10, 30, 16, 6)} tone="teal" />
      {ROWS.map((y, i) => (
        <g key={y}>
          <path d={shape.circle(31, y + 2.5, 3.5)} style={toneFill(i === 2 ? "green" : "teal", 0.8)} />
          <path d={shape.rect(39, y, i % 2 ? 26 : 34, 5, 2.5)} style={toneFill("teal", 0.35)} />
        </g>
      ))}
      {/* a test tube leaning on the report */}
      <g transform="rotate(14 92 72)">
        <GlassShape d="M85 40H99V92A7 7 0 0 1 85 92Z" tone="frost" />
        <GlassShape d="M85 70H99V92A7 7 0 0 1 85 92Z" tone="green" shadow={false} />
        <GlassShape d={shape.rect(82, 36, 20, 6, 3)} tone="teal" shadow={false} />
      </g>
    </GlassIcon>
  )
}
