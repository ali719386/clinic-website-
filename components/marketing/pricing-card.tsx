// One plan on /pricing (2026-10-27): a glass card whose name, price and
// button sit at the same height as its neighbours' (the price box has a fixed
// height), then its features. The popular plan gets a teal ring and a badge
// on its top edge. Its price is the only client part (billing-toggle.tsx).
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PlanPrice } from "@/components/marketing/billing-toggle";
import type { Plan } from "@/components/marketing/pricing-plans";

export function PricingCard({ plan }: { plan: Plan }) {
  const Icon = plan.icon;
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={`price-card glass-tile relative flex w-full flex-col p-7 lg:p-8 ${plan.popular ? "price-popular" : ""}`}
    >
      {plan.popular && <span className="price-badge">Most popular</span>}

      <div className="flex items-center gap-3">
        <span className="icon-tile" aria-hidden>
          <Icon className="size-5" />
        </span>
        <div>
          <h2 id={`plan-${plan.id}`} className="how-ink font-display text-[22px] font-medium leading-tight">
            {plan.name}
          </h2>
          <p className="spec-subtext mt-0.5 text-[14px]">{plan.subtitle}</p>
        </div>
      </div>

      <div className="mt-7">
        <PlanPrice id={plan.id} />
      </div>

      <Link
        href="/contact"
        className={`btn-premium group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold ${
          plan.popular
            ? "bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary-hover"
            : "border border-primary/25 text-primary hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        Book a free demo
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <ul className="price-features mt-7 space-y-3.5 pt-7">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15px] leading-[1.5]">
            <span aria-hidden className="price-tick">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="spec-subtext">{f}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
