// The sample interfaces on /success-stories (2026-10-27): small, front-facing
// HTML mock-ups (never rotated or tilted), every one tagged as a sample and
// with invented, generic data. The featured one is hidden from screen readers;
// a card's is one labelled picture ("Sample … mockup"), since each story says
// the same in words.
import type { ReactNode } from "react";
import { Urdu } from "@/components/urdu";
import type { StoryMockup } from "@/components/marketing/stories-data";

function Tag({ children = "Sample interface" }: { children?: string }) {
  return <span className="how-tag">{children}</span>;
}

/** the featured story: today's queue, with the Urdu chip floating over it */
export function QueueMockup() {
  const waiting = [
    { token: "015", name: "Sample patient A" },
    { token: "016", name: "Sample patient B" },
    { token: "017", name: "Sample patient C" },
  ];
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[440px] pb-8 pt-2">
      <div className="story-screen p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="how-ink font-display text-[18px] font-medium">Today&rsquo;s queue</p>
          <Tag />
        </div>
        <div className="story-current mt-5 flex items-center gap-4 p-4">
          <span className="story-token-lg">014</span>
          <div className="min-w-0">
            <p className="spec-subtext text-[12px]">Now</p>
            <p className="how-ink mt-0.5 inline-flex items-center gap-2 text-[15px] font-medium">
              <span className="size-2 rounded-full bg-success" />
              In consultation
            </p>
          </div>
        </div>
        <ul className="mt-4">
          {waiting.map((w) => (
            <li key={w.token} className="how-mock-row flex items-center gap-3 py-2.5">
              <span className="how-token w-11">{w.token}</span>
              <span className="how-ink min-w-0 flex-1 truncate text-[14px] font-medium">{w.name}</span>
              <span className="how-status">Waiting</span>
            </li>
          ))}
        </ul>
      </div>
      <Urdu className="story-chip story-float absolute bottom-0 right-2 text-[15px] sm:-right-4">ہر مریض کی باری، واضح</Urdu>
    </div>
  );
}

/** a card mock-up's frame: one height for all three, a title and a quiet "Sample" */
function MockFrame({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="story-mock">
      <div className="flex items-center justify-between gap-3">
        {title}
        <span className="story-mock-sample">Sample</span>
      </div>
      {children}
    </div>
  );
}

/** DMS card: a consultation note and prescription */
function RxMockup() {
  const rows = [
    { k: "Medicine 1", v: "Dosage · Sample" },
    { k: "Medicine 2", v: "Dosage · Sample" },
    { k: "Follow-up", v: "Note · Sample" },
  ];
  return (
    <MockFrame title={<span className="font-display text-[22px] leading-none font-medium text-primary">Rx</span>}>
      <p className="spec-subtext mt-2 text-[12px]">Sample patient · Visit notes</p>
      <ul className="mt-2">
        {rows.map((r) => (
          <li key={r.k} className="story-mock-row flex items-center justify-between gap-3 py-2.5 text-[13px]">
            <span className="how-ink font-medium">{r.k}</span>
            <span className="spec-subtext text-[12px]">{r.v}</span>
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}

/** CMS card: one reception, a lane for each doctor (current token, then the next) */
function TeamMockup() {
  const doctors = [
    { short: "D1", name: "Doctor 1", now: "04", next: "05" },
    { short: "D2", name: "Doctor 2", now: "11", next: null },
    { short: "D3", name: "Doctor 3", now: "21", next: "22" },
  ];
  return (
    <MockFrame title={<span className="how-ink text-[14px] font-medium">Reception</span>}>
      <ul className="mt-3 flex flex-1 flex-col gap-1.5">
        {doctors.map((d) => (
          <li key={d.name} className="story-lane flex flex-1 items-center gap-2.5 px-2.5">
            <span className="story-avatar">{d.short}</span>
            <div className="min-w-0 flex-1">
              <p className="how-ink truncate text-[13px] leading-tight font-medium">{d.name}</p>
              <p className="spec-subtext mt-0.5 flex items-center gap-1.5 truncate text-[11px] leading-tight">
                <span className="size-1.5 shrink-0 rounded-full bg-success" />
                In consultation
              </p>
            </div>
            <span className="story-tok story-tok-now">{d.now}</span>
            {d.next ? <span className="story-tok">{d.next}</span> : <span className="story-tok story-tok-empty">-</span>}
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}

/** ECMS card: the confirmed limits, as a planning sheet */
function PlanMockup() {
  const rows = [
    { k: "Receptionists", v: "Unlimited" },
    { k: "Quote", v: "Custom" },
  ];
  return (
    <MockFrame title={<span className="how-ink text-[14px] font-medium">Planning</span>}>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-[48px] leading-none font-medium tracking-[-0.03em] text-primary tabular-nums">10+</span>
        <span className="spec-subtext text-[14px]">doctors</span>
      </p>
      <ul className="mt-auto">
        {rows.map((r) => (
          <li key={r.k} className="story-mock-row flex items-center justify-between py-2.5 text-[13px]">
            <span className="spec-subtext">{r.k}</span>
            <span className="how-ink font-medium">{r.v}</span>
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}

const MOCK_LABEL: Record<StoryMockup, string> = {
  rx: "Sample prescription mockup",
  team: "Sample reception mockup with three doctor queues",
  plan: "Sample planning mockup for 10+ doctors",
  queue: "Sample queue mockup",
};

/** a card's mock-up: one picture to screen readers, its sample label kept */
export function CardMockup({ kind }: { kind: StoryMockup }) {
  return (
    <div role="img" aria-label={MOCK_LABEL[kind]}>
      {kind === "rx" ? <RxMockup /> : kind === "team" ? <TeamMockup /> : kind === "plan" ? <PlanMockup /> : <QueueMockup />}
    </div>
  );
}
