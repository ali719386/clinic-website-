"use client";

// The size picker on /products (2026-10-27): "How many doctors?" with three
// options. The choice is only this page's state (nothing is sent or stored);
// it sets data-pick on the wrapper, and styles/marketing.css lifts the
// matching card and tints its column in the table. Arrow keys move the choice.

import { createContext, useContext, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { PRODUCTS, type ProductId } from "@/components/marketing/products-data";

const PickContext = createContext<{ pick: ProductId | null; setPick: (id: ProductId) => void } | null>(null);

export function ProductPicker({ children }: { children: ReactNode }) {
  const [pick, setPick] = useState<ProductId | null>(null);
  return (
    <PickContext.Provider value={{ pick, setPick }}>
      <div data-pick={pick ?? undefined}>{children}</div>
    </PickContext.Provider>
  );
}

export function SizeSelector() {
  const ctx = useContext(PickContext);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const index = PRODUCTS.findIndex((p) => p.id === ctx?.pick);
  const chosen = index >= 0 ? PRODUCTS[index] : null;

  const choose = (i: number) => {
    ctx?.setPick(PRODUCTS[i]!.id);
    options.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    choose((i + step + PRODUCTS.length) % PRODUCTS.length);
  };

  return (
    <div className="glass-tile glass-static p-5 text-center sm:p-7">
      <p id="size-question" className="how-ink text-[16px] font-medium sm:text-[18px]">
        How many doctors work at your clinic?
      </p>
      <div role="radiogroup" aria-labelledby="size-question" className="prod-track mt-5">
        <span
          aria-hidden
          className="prod-thumb"
          data-on={chosen ? "true" : "false"}
          style={{ transform: `translateX(${Math.max(index, 0) * 100}%)` }}
        />
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              options.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={p.id === ctx?.pick}
            // one stop in the tab order: the chosen option, or the first
            tabIndex={(chosen ? p.id === chosen.id : i === 0) ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="prod-opt"
          >
            {p.size}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="spec-subtext mt-5 min-h-[5em] text-[15px] leading-relaxed text-pretty sm:min-h-[3.3em]">
        {chosen ? (
          <>
            Best fit: <span className="font-semibold text-primary">{chosen.name}</span>. {chosen.fit}
          </>
        ) : (
          "Pick one to see the product that fits."
        )}
      </p>
    </div>
  );
}
