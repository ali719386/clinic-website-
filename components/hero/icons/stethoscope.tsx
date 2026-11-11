import { GlassIcon, GlassLine, GlassShape, shape, type GlassIconProps } from "./glass"

export function StethoscopeIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <GlassLine d="M38 16V40C38 57 48 66 60 66C72 66 82 57 82 40V16" tone="deep" width={7} />
      <GlassLine d="M60 66V82C60 98 72 104 83 98C87 96 88 93 88 91" tone="teal" width={7} />
      <GlassShape d={shape.circle(38, 15, 6)} tone="frost" />
      <GlassShape d={shape.circle(82, 15, 6)} tone="frost" />
      <GlassShape d={shape.circle(88, 77, 16)} tone="teal" spec={[82, 69, 5, 3]} />
      <GlassShape d={shape.circle(88, 77, 8)} tone="frost" shadow={false} />
    </GlassIcon>
  )
}
