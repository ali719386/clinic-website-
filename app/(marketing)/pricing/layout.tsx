import type { Metadata } from "next"

// the pricing page is a client component, so its title lives here
export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple monthly pricing for Clinics, with a free 30-day trial.",
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
