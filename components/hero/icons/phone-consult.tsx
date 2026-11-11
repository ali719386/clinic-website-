import { GlassIcon, GlassShape, shape, toneFill, type GlassIconProps } from "./glass"

export function PhoneConsultIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <GlassShape d={shape.rect(32, 8, 56, 104, 14)} tone="deep" spec={[44, 16, 8, 3]} />
      <GlassShape d={shape.rect(37, 20, 46, 82, 8)} tone="frost" shadow={false} />
      <path d={shape.rect(52, 13, 16, 3, 1.5)} style={toneFill("frost", 0.6)} />
      {/* a consultation: the doctor's picture and two messages */}
      <GlassShape d={shape.circle(60, 40, 10)} tone="teal" shadow={false} />
      <path d={shape.circle(60, 37, 3.6)} style={toneFill("frost", 0.9)} />
      <GlassShape d={shape.rect(42, 58, 28, 11, 5.5)} tone="teal" shadow={false} />
      <GlassShape d={shape.rect(50, 74, 28, 11, 5.5)} tone="green" shadow={false} />
      <path d={shape.rect(47, 92, 26, 4, 2)} style={toneFill("teal", 0.3)} />
    </GlassIcon>
  )
}
