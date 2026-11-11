// The pricing page (2026-10-27 redesign, in the glass mint-teal style of the
// home page). A server component: every price and feature is visible without
// JavaScript. The billing switch and the prices it changes are the only
// client parts (components/marketing/billing-toggle.tsx); the plans are one
// typed list (components/marketing/pricing-plans.ts). Each section is
// revealed once by the home page's lazy wrapper.
import { CalendarCheck, CreditCard, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { LazySection } from "@/components/marketing/lazy-section";
import { BillingProvider, BillingToggle } from "@/components/marketing/billing-toggle";
import { PricingCard } from "@/components/marketing/pricing-card";
import { FREE_MONTHS, PLANS } from "@/components/marketing/pricing-plans";

const POINTS = [
  { icon: ShieldCheck, text: "Each clinic's data kept separate" },
  { icon: Wrench, text: "We set up your clinic for you" },
  { icon: CalendarCheck, text: "30‑day free trial" }, // a non-breaking hyphen
  { icon: CreditCard, text: "Simple monthly price" },
];

export default function PricingPage() {
  return (
    <div>
      <Navbar />
      <main>
        <BillingProvider>
          <LazySection estimate={1500} rise={16} duration={0.9} stagger={0.09}>
            <section aria-labelledby="pricing-title" className="sec-calm relative overflow-clip pt-[142px] pb-[60px] min-[621px]:pt-[182px] min-[621px]:pb-[80px]">
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center">
                  <p
                    data-card
                    className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground backdrop-blur-md"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    Pricing
                  </p>
                  <h1
                    id="pricing-title"
                    data-card
                    className="how-ink mt-6 font-display text-[clamp(2.3rem,5.4vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance"
                  >
                    The right plan.
                    <br />
                    <span className="font-light text-primary">For the way you practise.</span>
                  </h1>
                  <p data-card className="spec-subtext mx-auto mt-6 max-w-[560px] text-base leading-relaxed lg:text-lg">
                    Simple monthly price
                  </p>
                </div>

                {/* Billing switch */}
                <div data-card className="mt-10">
                  <BillingToggle />
                </div>

                {/* Plans: 3 equal columns from 1024px, one under another below
                    (top padding: room for the popular plan's badge) */}
                <ul className="mx-auto mt-14 grid max-w-[1100px] gap-x-6 gap-y-10 pt-3 lg:grid-cols-3">
                  {PLANS.map((plan) => (
                    <li key={plan.id} data-card className="flex">
                      <PricingCard plan={plan} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </LazySection>
        </BillingProvider>

        <LazySection estimate={420} rise={16} duration={0.9} stagger={0.09}>
          <section aria-label="Annual offer and what every plan includes" className="sec-calm relative overflow-clip pb-[90px] min-[621px]:pb-[130px]">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Annual offer */}
              <div data-card className="text-center">
                <p className="glass-tile glass-static price-offer inline-flex items-center gap-3 px-6 py-3.5 text-[15px]">
                  <Sparkles aria-hidden className="size-5 shrink-0 text-primary" />
                  <span className="spec-subtext text-pretty">
                    Pay annually and get <span className="font-semibold text-primary">{FREE_MONTHS} months free</span> on any plan
                  </span>
                </p>
              </div>

              {/* Supporting points */}
              <ul className="mx-auto mt-10 grid max-w-[1100px] grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {POINTS.map(({ icon: Icon, text }) => (
                  <li key={text} data-card className="flex items-center gap-3 p-2 sm:justify-center">
                    <span className="icon-tile price-point-icon" aria-hidden>
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="how-ink text-[15px] font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </LazySection>
      </main>
      <LazySection estimate={420} rise={16} duration={0.8} stagger={0.08}>
        <Footer />
      </LazySection>
    </div>
  );
}
