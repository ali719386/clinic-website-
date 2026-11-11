import { GlassIcon, GlassShape, shape, type GlassIconProps } from "./glass"

const LEFT = "M60 39H40A21 21 0 0 0 40 81H60Z"
const RIGHT = "M60 39H80A21 21 0 0 1 80 81H60Z"

export function PillIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <g transform="rotate(-40 60 60)">
        <GlassShape d={LEFT} tone="teal" spec={[40, 47, 9, 3.5]} />
        <GlassShape d={RIGHT} tone="frost" />
      </g>
      <GlassShape d={shape.circle(26, 96, 10)} tone="green" spec={[23, 92, 3.5, 2]} />
    </GlassIcon>
  )
}
