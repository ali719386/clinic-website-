"use client";

// The billing switch on /pricing (2026-10-27): Monthly (the default) or
// Annually. Only the prices and the line under them change; the features,
// limits and buttons stay as they are. The new prices are announced politely
// and change in place (no fade: it read as a blink), in a box of fixed
// height, so nothing moves.

import { createContext, useContext, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FREE_MONTHS, PLANS, YEARLY_MONTHS, pkr, planPrice, type Billing, type PlanId } from "@/components/marketing/pricing-plans";

const BillingContext = createContext<{ billing: Billing; set: (b: Billing) => void }>({
  billing: "monthly",
  set: () => {},
});

export function BillingProvider({ children }: { children: ReactNode }) {
  const [billing, set] = useState<Billing>("monthly");
  return <BillingContext.Provider value={{ billing, set }}>{children}</BillingContext.Provider>;
}

const OPTIONS: { value: Billing; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
];

export function BillingToggle() {
  const { billing, set } = useContext(BillingContext);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = OPTIONS.findIndex((o) => o.value === billing);

  const choose = (i: number) => {
    set(OPTIONS[i]!.value);
    refs.current[i]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    choose(index === 0 ? 1 : 0);
  };

  const announce =
    billing === "annually"
      ? `Annual prices shown. ${PLANS.filter((p) => p.monthly !== null)
          .map((p) => `${p.name}: PKR ${pkr(planPrice(p, "annually")!)} a year`)
          .join(". ")}. Enterprise: custom.`
      : `Monthly prices shown. ${PLANS.filter((p) => p.monthly !== null)
          .map((p) => `${p.name}: PKR ${pkr(p.monthly!)} a month`)
          .join(". ")}. Enterprise: custom.`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div role="radiogroup" aria-label="Billing period" className="price-track">
        <span aria-hidden className="price-thumb" style={{ transform: `translateX(${index * 100}%)` }} />
        {OPTIONS.map((o, i) => (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={o.value === billing}
            tabIndex={o.value === billing ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={onKeyDown}
            className="price-opt"
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="spec-subtext text-[14px]">
        Pay annually. Get <span className="font-semibold text-primary">{FREE_MONTHS} months free</span>.
      </p>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

/** a card's price and the line under it, for the chosen billing period */
export function PlanPrice({ id }: { id: PlanId }) {
  const { billing } = useContext(BillingContext);
  const plan = PLANS.find((p) => p.id === id)!;
  const price = planPrice(plan, billing);
  const note =
    billing === "annually"
      ? price === null
        ? "Annual pricing confirmed in your custom quote"
        : `Billed annually · 12 months for the price of ${YEARLY_MONTHS}`
      : null;

  return (
    <div className="price-box">
      <div>
        {price === null ? (
          <p className="how-ink font-display text-[2.6rem] leading-none font-medium tracking-[-0.03em]">Custom</p>
        ) : (
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="spec-subtext text-[14px] font-medium">PKR</span>
            <span className="how-ink font-display text-[2.6rem] leading-none font-medium tracking-[-0.03em] tabular-nums">
              {pkr(price)}
            </span>
            <span className="spec-subtext text-[14px]">{billing === "annually" ? "/year" : "/month"}</span>
          </p>
        )}
        {note && <p className="spec-subtext mt-2 text-[13px] leading-snug">{note}</p>}
      </div>
    </div>
  );
}
