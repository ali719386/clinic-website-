"use client";

// A soft light that follows the mouse over a card (2026-10-24): the card under
// the pointer ([data-spot]) gets --mx / --my, and its ::after draws the glow
// there (styles/marketing.css, .spot; mouse and desktop only).

import type { PointerEvent, ReactNode } from "react";

export function Spotlight({ className, children }: { className?: string; children: ReactNode }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={className} onPointerMove={onMove}>
      {children}
    </div>
  );
}
