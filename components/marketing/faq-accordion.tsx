"use client";

// The home page's FAQ as a glass accordion (2026-10-24): one answer open at a
// time, the first open to begin with; each answer slides open (its row grows
// from 0fr to 1fr). A real <button> per question, with aria-expanded and
// aria-controls, so Enter, Space and screen readers work as expected.
// With Urdu (2026-10-27), as on /faq: the Urdu question under the English,
// and an open answer in two columns, English left and Urdu right (one under
// the other on phones). The .faqp-* styles are the FAQ page's.

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Urdu } from "@/components/urdu";
import type { FaqItem } from "@/components/marketing/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <ul className="mx-auto mt-14 max-w-[820px] space-y-4">
      {items.map(({ q, a, qUr, aUr }, i) => {
        const isOpen = open === i;
        const qId = `${base}-q${i}`;
        const aId = `${base}-a${i}`;
        return (
          <li key={q} data-card className="glass-tile faq-item faqp-item relative" data-open={isOpen}>
            <h3>
              <button
                id={qId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={aId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="faq-q flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="how-ink block text-[18px] font-medium">{q}</span>
                  {qUr && <Urdu className="faqp-q-ur mt-1 block">{qUr}</Urdu>}
                </span>
                <span className="faq-icon" data-open={isOpen} aria-hidden>
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div id={aId} role="region" aria-labelledby={qId} className="faq-panel" data-open={isOpen} inert={!isOpen}>
              <div className="overflow-hidden">
                {aUr ? (
                  <div className="faqp-bi px-6 pb-6">
                    <div lang="en" className="faqp-col">
                      <p className="faqp-lang">English</p>
                      <p className="spec-subtext mt-2 text-[15px] leading-[1.75] text-pretty">{a}</p>
                    </div>
                    <Urdu as="div" className="faqp-col faqp-ur">
                      <p className="faqp-lang">اردو</p>
                      <p className="faqp-ur-text mt-1">{aUr}</p>
                    </Urdu>
                  </div>
                ) : (
                  <p className="spec-subtext px-6 pb-6 text-[15px] leading-[1.75] text-pretty">{a}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
