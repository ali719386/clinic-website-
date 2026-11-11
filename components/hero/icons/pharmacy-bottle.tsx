import { GlassIcon, GlassShape, shape, toneFill, type GlassIconProps } from "./glass"

const BODY = "M34 48Q34 38 44 38H76Q86 38 86 48V100Q86 110 76 110H44Q34 110 34 100Z"
const PLUS = "M57 64H63V72H71V78H63V86H57V78H49V72H57Z"

export function PharmacyBottleIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <GlassShape d={BODY} tone="teal" spec={[44, 50, 4, 9]} />
      <GlassShape d={shape.rect(42, 30, 36, 10, 3)} tone="deep" shadow={false} />
      <GlassShape d={shape.rect(38, 10, 44, 22, 7)} tone="frost" />
      {[48, 56, 64, 72].map((x) => (
        <path key={x} d={shape.rect(x, 14, 2, 14, 1)} style={toneFill("teal", 0.25)} />
      ))}
      <GlassShape d={shape.rect(41, 58, 38, 36, 7)} tone="frost" shadow={false} />
      <path d={PLUS} style={toneFill("green")} />
    </GlassIcon>
  )
}
