// The heading block of the home page's glass sections (2026-10-24): a pill
// with a teal dot, a two-line heading (the second line light and teal) and a
// short line under it. Each part is a [data-card], so the section's lazy
// wrapper reveals them in turn.
import type { ReactNode } from "react";

export function SectionHeader({
  pill,
  line1,
  line2,
  sub,
  className = "",
}: {
  pill: string;
  line1: ReactNode;
  line2?: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <p
        data-card
        className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-foreground backdrop-blur-md"
      >
        <span className="size-2 rounded-full bg-primary" />
        {pill}
      </p>
      <h2
        data-card
        className="how-ink mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance"
      >
        {line1}
        {line2 && (
          <>
            <br />
            <span className="font-light text-primary">{line2}</span>
          </>
        )}
      </h2>
      {sub && (
        <p data-card className="spec-subtext mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-pretty lg:text-lg">
          {sub}
        </p>
      )}
    </div>
  );
}
