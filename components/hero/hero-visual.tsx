import type { CSSProperties } from "react";
import Image from "next/image";
import { BellRing, Languages } from "lucide-react";
import { DoctorCard } from "@/components/hero/doctor-card";
import tablet from "@/public/hero/queue-tablet.png";
import stethoscope from "@/public/hero/stethoscope.png";

// Small glass cards round the tablet, each floating at its own pace (±6px).
// Laptops and wider only; on phones and tablets they would cover the screen.
// From 1280px the doctor's card takes the tablet's top-right corner, so the
// others move: "Token" to the top-left corner, "Urdu" to the foot, right of
// the stethoscope. Every pair keeps 16px or more apart,
// float included (checked at 1024, 1280×720, 1280×800, 1366, 1440, 1536 and
// 1920px). From 1280px they stick out only 20px, so short screens fit too.
const CHIPS = [
  {
    label: "Urdu instructions",
    Icon: Languages,
    tone: "text-primary",
    duration: 9,
    delay: 3.1,
    className: "hero-short-tuck -top-7 left-[4%] xl:top-auto xl:-bottom-5 xl:left-[23%]",
  },
  {
    label: "Token #24 called",
    Icon: BellRing,
    tone: "text-primary",
    duration: 6,
    delay: 0,
    className: "-top-3 right-[2%] xl:-top-5 xl:right-auto xl:-left-[9%]",
  },
];

/** Scene 1's main visual: the queue on a tablet, a stethoscope over its
 *  lower-left corner, two floating cards and the doctor's card. The nested
 *  wrappers each carry one motion (scene timeline, parallax, tilt, float), so
 *  the GSAP tweens never fight over the same transform. */
export function HeroVisual() {
  return (
    <div data-s1-visual className="relative w-[92vw] max-w-none shrink-0 lg:w-[var(--tablet-w)]">
      {/* the tablet's own box: the stethoscope and the cards are placed on it */}
      <div className="relative">
        <div data-tablet-parallax className="relative">
          <div data-tablet-tilt>
            <div data-tablet-float>
              <Image
                src={tablet}
                alt="The patient queue on a tablet: now serving token 024, with three patients waiting"
                priority
                sizes="(min-width: 1024px) 640px, 92vw"
                draggable={false}
                className="hero-tablet h-auto w-full select-none"
              />
            </div>
          </div>

          {CHIPS.map(({ label, Icon, tone, duration, delay, className }) => (
            <div key={label} data-hero-chip data-float-card aria-hidden className={`absolute hidden lg:block ${className}`}>
              <div
                className="glass-card glass-card-teal card-float flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap"
                style={{ "--float-dur": `${duration}s`, "--float-delay": `${-delay}s` } as CSSProperties}
              >
                <Icon className={`size-4 shrink-0 ${tone}`} strokeWidth={2.25} />
                {label}
              </div>
            </div>
          ))}

          {/* the doctor's card over the tablet's top-right corner (from 1280px; below that the stage is too narrow) */}
          <div data-hero-chip data-float-card data-doctor-card className="absolute -top-[4%] -right-[2%] hidden w-[264px] xl:block">
            <DoctorCard photoClassName="size-20" floatDuration={8.4} floatDelay={2.4} />
          </div>
        </div>

        {/* over the lower-left corner, its chest piece beside the token number, not on it */}
        <div data-steth-parallax className="hero-short-tuck absolute -bottom-16 -left-2 z-10 w-[130px] lg:-bottom-8 lg:-left-28 lg:w-[170px] xl:-bottom-5 xl:-left-32 xl:w-[210px]">
          <div data-steth-float>
            <Image
              src={stethoscope}
              alt=""
              priority
              sizes="(min-width: 1280px) 210px, (min-width: 1024px) 170px, 130px"
              draggable={false}
              className="hero-steth h-auto w-full -rotate-12 select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
