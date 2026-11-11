// The plans and prices shown on the website. The real app reads the same
// values (its admin panel uses them for each clinic), so keep these names.
// Monthly prices in whole PKR. Yearly is 10 months' price (2 months free).
// Receptionists: null = unlimited. Enterprise is priced by hand.

export type Tier = 'starter' | 'clinic' | 'enterprise'
export type Cycle = 'monthly' | 'yearly'

export const PLANS: Record<Tier, { label: string; monthly: number | null; maxDoctors: number | null; maxReceptionists: number | null }> = {
  starter: { label: 'Starter', monthly: 2999, maxDoctors: 1, maxReceptionists: 1 },
  clinic: { label: 'Clinic', monthly: 9999, maxDoctors: 10, maxReceptionists: null },
  enterprise: { label: 'Enterprise', monthly: null, maxDoctors: null, maxReceptionists: null },
}

export const YEARLY_MONTHS = 10

/** The plan's default price for a cycle (null: priced by hand). */
export function defaultPrice(tier: Tier, cycle: Cycle): number | null {
  const m = PLANS[tier].monthly
  if (m === null) return null
  return cycle === 'yearly' ? m * YEARLY_MONTHS : m
}
