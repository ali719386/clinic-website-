"use client";

// The doctor's profile card (2026-10-24): a real portrait instead of the
// drawn avatar, a calm "In clinic" pill and a small row for today. The same
// card floats by the tablet (wide screens), stacks under it (phones and
// tablets) and closes the scroll story.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { CalendarIcon, PhoneConsultIcon } from "@/components/hero/icons";

const PHOTO = "/hero/doctor-sara.png";

/** The round portrait; if the file fails to load, her initials on teal */
function DoctorPhoto({ className }: { className: string }) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // an error before hydration never reaches onError: check the image itself
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <span
      className={`doctor-photo relative inline-flex shrink-0 overflow-hidden rounded-full border-2 border-brand-deep-foreground ${className}`}
    >
      {failed ? (
        <span role="img" aria-label="Dr. Sara Malik" className="doctor-photo-fallback flex size-full items-center justify-center font-display font-semibold text-brand-deep-foreground">
          SM
        </span>
      ) : (
        <Image
          ref={img}
          src={PHOTO}
          alt="Dr. Sara Malik"
          fill
          priority
          sizes="80px"
          onError={() => setFailed(true)}
          className="object-cover object-[center_30%]"
        />
      )}
    </span>
  );
}

export function DoctorCard({
  photoClassName = "size-14 xl:size-20",
  floatDuration = 8,
  floatDelay = 2.4,
  float = true,
  status = "In clinic",
  tag,
  footer,
}: {
  /** a small label in the top-right corner, such as "Example" */
  tag?: string;
  photoClassName?: string;
  /** seconds per float cycle and its offset, so it drifts out of step with the cards near it */
  floatDuration?: number;
  floatDelay?: number;
  /** false where a wrapper already floats the card (the hero's scroll scenes) */
  float?: boolean;
  /** the pill's words, next to the green dot */
  status?: string;
  footer?: ReactNode;
}) {
  return (
    // the float (outer) and the hover lift (inner) are separate, so they never undo each other
    <div className={float ? "card-float" : undefined} style={{ "--float-dur": `${floatDuration}s`, "--float-delay": `${-floatDelay}s` } as CSSProperties}>
      <div className="glass-card glass-card-teal doctor-card relative rounded-[20px] p-5">
        {tag && (
          <span className="absolute top-3.5 right-3.5 rounded-full bg-brand-deep/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-brand-deep/70">{tag}</span>
        )}
        <div className="flex items-center gap-4">
          <DoctorPhoto className={photoClassName} />
          <div className="min-w-0">
            <p className="font-display text-[15px] leading-tight font-semibold">Dr. Sara Malik</p>
            <p className="doctor-muted mt-1 text-[13px] leading-tight">General physician</p>
            <span className="doctor-pill mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold">
              <span className="relative flex size-1.5">
                <span className="dot-pulse absolute inset-0 rounded-full bg-secondary" />
                <span className="relative size-1.5 rounded-full bg-secondary" />
              </span>
              {status}
            </span>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-brand-deep/10 pt-3.5 text-[12px] text-brand-deep/75">
          <li className="flex items-center gap-1.5">
            <CalendarIcon size={18} float={false} />
            Today: <strong className="font-semibold text-brand-deep">18 patients</strong>
          </li>
          <li className="flex items-center gap-1.5">
            <PhoneConsultIcon size={18} float={false} />
            Next: <strong className="font-semibold text-brand-deep">Token #24</strong>
          </li>
        </ul>

        {footer}
      </div>
    </div>
  );
}
