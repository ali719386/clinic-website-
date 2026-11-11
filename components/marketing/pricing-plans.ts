// The plans on /pricing (2026-10-27), as the owner supplied them. Prices
// come from lib/billing.ts (shared with the real app and the FAQ).
// Yearly: 12 months for the price of 10 (YEARLY_MONTHS in lib/billing.ts).
import { Building2, Stethoscope, Users, type LucideIcon } from "lucide-react";
import { PLANS as BILLING, YEARLY_MONTHS } from "@/lib/billing";

export type PlanId = "starter" | "clinic" | "enterprise";
export type Billing = "monthly" | "annually";

export interface Plan {
  id: PlanId;
  name: string;
  subtitle: string;
  /** whole PKR a month; null: a custom quote */
  monthly: number | null;
  icon: LucideIcon;
  popular?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "For solo practitioners",
    monthly: BILLING.starter.monthly,
    icon: Stethoscope,
    features: [
      "1 doctor",
      "1 receptionist",
      "Prescriptions with Urdu instructions",
      "6 prescription print designs",
      "Patient records & visit history",
      "Token queue for walk-in patients",
      "WhatsApp support",
    ],
  },
  {
    id: "clinic",
    name: "Clinic",
    subtitle: "For clinics with a team",
    monthly: BILLING.clinic.monthly,
    icon: Building2,
    popular: true,
    features: [
      `Up to ${BILLING.clinic.maxDoctors} doctors`,
      "Unlimited receptionists",
      "Everything in Starter",
      "Saved prescription templates",
      "Daily dashboard & visit trends",
      "Your clinic's details on every prescription",
      "Priority WhatsApp support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For hospitals & chains",
    monthly: null,
    icon: Users,
    features: [
      "Unlimited doctors",
      "Unlimited staff",
      "Everything in Clinic",
      "Several clinics, each with its own workspace",
      "A dedicated account manager",
      "Custom integrations",
      "On-site training",
      "SLA and uptime guarantee",
    ],
  },
];

export { YEARLY_MONTHS };
export const FREE_MONTHS = 12 - YEARLY_MONTHS;

/** the plan's price for a billing period (null: custom) */
export function planPrice(plan: Plan, billing: Billing): number | null {
  if (plan.monthly === null) return null;
  return billing === "annually" ? plan.monthly * YEARLY_MONTHS : plan.monthly;
}

export const pkr = (n: number) => n.toLocaleString("en-PK");
