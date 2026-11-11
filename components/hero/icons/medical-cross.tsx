import { GlassIcon, GlassShape, type GlassIconProps } from "./glass"

const CROSS =
  "M51 16H69Q75 16 75 22V45H98Q104 45 104 51V69Q104 75 98 75H75V98Q75 104 69 104H51Q45 104 45 98V75H22Q16 75 16 69V51Q16 45 22 45H45V22Q45 16 51 16Z"
const CORE = "M54 30H66V54H90V66H66V90H54V66H30V54H54Z"

export function MedicalCrossIcon(props: GlassIconProps) {
  return (
    <GlassIcon {...props}>
      <GlassShape d={CROSS} tone="teal" spec={[56, 26, 6, 4]} />
      <GlassShape d={CORE} tone="frost" shadow={false} />
    </GlassIcon>
  )
}
