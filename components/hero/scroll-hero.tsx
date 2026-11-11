"use client";

// The home hero's scroll story (2026-10-24). On a laptop or wider the hero is
// pinned and one GSAP timeline, scrubbed by the scroll, plays:
//   1. the queue tablet and stethoscope (the hero as it loads);
//   2. all of scene 1, copy included, fades and shrinks away; after a short
//      empty beat four glass boxes rise into a 2×2 grid, with a heartbeat
//      line below;
//   3. each feature in turn, one fading out before the next fades in: copy
//      and buttons on the left (with a step indicator), a small mock-up of
//      that part of the app on the right. Then the pin lets go.
// Nothing from one scene is ever on screen with the next, so nothing overlaps.
// The features, lines and mock-ups show only what the app really does (README
// rule 5; the features section is the source), except the first, "Book
// appointment", which the owner asked for (2026-10-24): the app has no
// appointment booking, so its copy is a placeholder (see FEATURES below).
// Names and data are invented examples.
//
// On load the tablet and stethoscope rise in and then float; on wide screens
// they also drift with the scroll (parallax) and the tablet tilts a little
// towards the mouse. Without JavaScript, or with "reduce motion", wide screens
// simply show scene 1, still. Phones and tablets get no pin, parallax or tilt:
// the boxes, then each feature (copy, then mock-up), stack and fade in.

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle } from "lucide-react";
import { CalendarIcon, LabReportIcon, MedicalCrossIcon, PillIcon, StethoscopeIcon } from "@/components/hero/icons";
import { HeroVisual } from "@/components/hero/hero-visual";
import { DoctorCard } from "@/components/hero/doctor-card";
import { BookDemoButton } from "@/components/marketing/demo-dialog";
import { Urdu } from "@/components/urdu";

const MOTION = "(prefers-reduced-motion: no-preference)";
const DESKTOP = `(min-width: 1024px) and ${MOTION}`;
const SMALL = `(max-width: 1023px) and ${MOTION}`;
const TILT_MAX = 6; // degrees
const PIN_LENGTH = 3; // screens of scroll while the hero is pinned

// about 640px, narrower on a laptop; on wide screens it may reach past the
// column into the page margin
const TABLET_WIDTH = "min(640px, calc(100% + max(0px, (100vw - 80rem) / 2)))";

// what the app does, in the words of the features section (README rule 5)
const SCENE1_CARDS = [
  { label: "Walk-in queue", Icon: CalendarIcon },
  { label: "Patient records", Icon: LabReportIcon },
  { label: "Urdu prescriptions", Icon: PillIcon },
];

// the four features of scenes 2 and 3. The first is the owner's "Book
// appointment" scene: a PLACEHOLDER, not a feature of the app (README rule
// 5); its buttons open the demo form and go to the demo section. The other
// three come from the features section.
type Feature = {
  label: string;
  Icon: (props: { size?: number; float?: boolean }) => ReactNode;
  heading: string;
  line: string;
  Mockup: () => ReactNode;
  /** the booking scene: a "Premium care" pill, and "Book now" / "Available today" buttons */
  booking?: boolean;
};

const FEATURES: Feature[] = [
  {
    label: "Book appointment",
    Icon: StethoscopeIcon,
    heading: "Book appointment",
    line: "See a doctor the same day: pick a time, get your token and walk in when it’s your turn.",
    Mockup: BookingMockup,
    booking: true,
  },
  {
    label: "Walk-in queue",
    Icon: CalendarIcon,
    heading: "A live token queue",
    line: "Receptionists register walk-ins and hand out tokens. Each doctor’s queue updates live, so nobody has to call names across the room.",
    Mockup: QueueMockup,
  },
  {
    label: "Patient records",
    Icon: LabReportIcon,
    heading: "Every visit in one place",
    line: "Visits, diagnoses, allergies and past prescriptions together. Reuse a past prescription in one click.",
    Mockup: RecordMockup,
  },
  {
    label: "Urdu prescriptions",
    Icon: PillIcon,
    heading: "Prescriptions in Urdu and English",
    line: "Pick the dose, frequency and meal timing, and the Urdu instructions are written for you. Print in one of six designs or download a PDF.",
    Mockup: PrescriptionMockup,
  },
];

// The pinned timeline. Its unit is one screen of scroll (it lasts exactly
// PIN_LENGTH), so every number below reads in screens.
// Scenes crossfade: the next starts fading in while the last is still
// fading out, so no scroll position is ever empty (2026-10-24: the empty
// beats between scenes, made longer by the scrub's lag, showed a blank hero).
const SCENE1_END = 0.38; // scene 1 has faded out completely by here
const SCENE2_IN = 0.24; // scene 2 starts while scene 1 leaves…
const SCENE2_OUT = 0.95; // …holds, then leaves (0.25)
const FEATURES_START = 1.06; // the first feature comes in as scene 2 leaves
const FEATURE_IN = 0.2; // each feature: in, a hold, then out as the next comes in
const FEATURE_OUT = 0.2;
const FEATURE_STEP = 0.45;
const FEATURE_OVERLAP = 0.1; // how long one feature's exit and the next's entry share

// one heartbeat, repeated across the line
const ECG_BEAT = "h46l8-6 6 6h10l6 -30 8 52 7 -34 5 12h14l9 -10 9 10h30";
const ECG = `M0 50${ECG_BEAT.repeat(3)}h46`;

export default function ScrollHero({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    // transforms on the GPU from the first frame (no switch mid-animation),
    // and no re-measuring when a phone's address bar shows or hides
    gsap.config({ force3D: true });
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(); // every tween and trigger below is reverted on unmount

    // Fonts and images that arrive late shift the layout: measure the pin again
    const refresh = () => ScrollTrigger.refresh();
    let alive = true;
    document.fonts?.ready.then(() => alive && refresh());
    if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });

    // Idle floats: scene 2's boxes, scene 3's mock-ups and the icons round
    // the booking card drift up and down only (data-idle = the range in px,
    // data-idle-dur / -delay = pace and start). They move an inner wrapper,
    // never the element the scroll fades and slides, and start paused.
    // `owner` (the box or feature it belongs to) is found once, not on every
    // scroll update; `play` turns the float on or off, and with it the
    // wrapper's will-change, so only moving parts get a GPU layer.
    const makeFloats = (scale: number) =>
      gsap.utils.toArray<HTMLElement>("[data-idle]", root).map((el) => {
        const range = Number(el.dataset.idle) * scale;
        const tween = gsap.fromTo(
          el,
          { y: -range },
          {
            y: range,
            duration: Number(el.dataset.idleDur ?? 5),
            delay: Number(el.dataset.idleDelay ?? 0),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true,
          }
        );
        const owner = el.closest<HTMLElement>("[data-s2-box], [data-feature]");
        const play = (on: boolean) => {
          if (on !== tween.paused()) return;
          el.style.willChange = on ? "transform" : "";
          tween.paused(!on);
        };
        return { el, owner, play };
      });

    // every width: the tablet rises in, then floats; the stethoscope settles
    // into its tilt and floats the other way
    mm.add(MOTION, () => {
      const q = gsap.utils.selector(root);
      const tablet = q("[data-tablet-float]");
      const steth = q("[data-steth-float]");
      gsap
        .timeline()
        .from(tablet, { y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out" })
        .to(tablet, { y: -10, duration: 2.5, ease: "sine.out" })
        .to(tablet, { y: 10, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap
        .timeline({ delay: 0.2 })
        .from(steth, { rotation: -13, y: 30, autoAlpha: 0, duration: 1.1, ease: "power3.out" }) // -25° → -12° with its own -12°
        .to(steth, { y: 8, duration: 3, ease: "sine.out" })
        .to(steth, { y: -8, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.from(q("[data-hero-chip]"), { y: 14, autoAlpha: 0, duration: 0.7, stagger: 0.15, delay: 0.6, ease: "power3.out" });
    });

    mm.add(DESKTOP, () => {
      const q = gsap.utils.selector(root);
      const features = q("[data-feature]");

      gsap.set(q("[data-scene]"), { autoAlpha: 1 }); // the layers; their parts are hidden below
      gsap.set(features, { autoAlpha: 0, y: 24 });
      gsap.set(q("[data-step-on]"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * PIN_LENGTH)}`,
          scrub: 0.8, // smoothing, so the scenes glide rather than step
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // scene 1 out: every part of it (copy, tablet, stethoscope and the
      // cards on it, the three cards below, the hint) fades and shrinks to
      // nothing by SCENE1_END. Faded parts are `visibility: hidden` (autoAlpha)
      // and take no clicks; scrolling back up undoes all of it.
      const scene1 = [q("[data-hero-copy]"), q("[data-s1-visual]"), q("[data-s1-card]"), q("[data-cue]")].flat();
      tl.to(q("[data-cue]"), { autoAlpha: 0, duration: 0.1 }, 0)
        .to(q("[data-hero-copy]"), { autoAlpha: 0, scale: 0.96, transformOrigin: "0% 50%", duration: 0.32 }, 0.04)
        .to(q("[data-s1-visual]"), { autoAlpha: 0, scale: 0.5, duration: 0.34 }, 0.04)
        .to(q("[data-s1-card]"), { autoAlpha: 0, scale: 0.9, stagger: 0.06, duration: 0.2 }, 0.06)
        .set(scene1, { pointerEvents: "none" }, SCENE1_END)

        // scene 2, crossfading in as scene 1 leaves: its copy and the boxes
        // rise in, one after another, and the heartbeat line
        .fromTo(q("[data-s2-copy]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.26 }, SCENE2_IN)
        .fromTo(q("[data-s2-box]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.22 }, SCENE2_IN + 0.04)
        .fromTo(q("[data-ecg]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, SCENE2_IN + 0.3)

        // scene 2 out, as the first feature comes in
        .to(q("[data-s2-copy]"), { autoAlpha: 0, y: -16, duration: 0.24 }, SCENE2_OUT)
        .to(q("[data-s2-box]"), { autoAlpha: 0, y: -16, stagger: 0.06, duration: 0.18 }, SCENE2_OUT)
        .to(q("[data-ecg]"), { autoAlpha: 0, duration: 0.18 }, SCENE2_OUT)
        .set(q("[data-s2-copy]"), { pointerEvents: "none" }, SCENE2_OUT + 0.25)
        .fromTo(q("[data-steps]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, FEATURES_START);

      // each feature in turn: the next crossfades in as it leaves, and its
      // step lights up; the last stays until the pin lets go
      features.forEach((feature, i) => {
        const at = FEATURES_START + i * FEATURE_STEP;
        tl.to(feature, { autoAlpha: 1, y: 0, duration: FEATURE_IN }, at).to(q("[data-step-on]")[i]!, { autoAlpha: 1, duration: 0.1 }, at);
        if (i < features.length - 1) {
          const out = at + FEATURE_STEP - FEATURE_OVERLAP;
          tl.to(feature, { autoAlpha: 0, y: -24, duration: FEATURE_OUT }, out).to(q("[data-step-on]")[i]!, { autoAlpha: 0, duration: 0.1 }, out + 0.05);
        }
      });
      // a moment on the last feature, then the pin lets go: the timeline
      // lasts exactly PIN_LENGTH, so its unit stays one screen
      tl.to({}, { duration: Math.max(0.1, PIN_LENGTH - tl.duration()) });

      // parallax while scene 1 leaves: the tablet moves at 0.3 of the
      // scroll, the stethoscope at 0.6 (so it drifts over the tablet). Part
      // of the pinned timeline, so it follows the pin exactly.
      const scrolled = () => SCENE1_END * window.innerHeight; // px of scroll over scene 1
      tl.to(q("[data-tablet-parallax]"), { y: () => -0.3 * scrolled(), ease: "none", duration: SCENE1_END }, 0)
        .to(q("[data-steth-parallax]"), { y: () => -0.6 * scrolled(), ease: "none", duration: SCENE1_END }, 0);

      // the tablet leans a little towards the mouse (quickTo: no new tween
      // per event). The hero's box is measured when the mouse comes in and
      // when ScrollTrigger refreshes, never inside the move handler.
      const tilt = q("[data-tablet-tilt]")[0] as HTMLElement;
      gsap.set(tilt, { transformPerspective: 900 });
      const rotateX = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
      const rotateY = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });
      let box = root.getBoundingClientRect();
      const measure = () => {
        box = root.getBoundingClientRect();
      };
      const onEnter = () => {
        measure();
        tilt.style.willChange = "transform";
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        rotateY(((e.clientX - box.left) / box.width - 0.5) * 2 * TILT_MAX);
        rotateX(-((e.clientY - box.top) / box.height - 0.5) * 2 * TILT_MAX);
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        tilt.style.willChange = "";
      };
      root.addEventListener("pointerenter", onEnter, { passive: true });
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave, { passive: true });
      ScrollTrigger.addEventListener("refresh", measure);

      // the idle floats run only while their box or feature is showing
      // (opacity above 0) and the hero is on screen; gsap.getProperty reads
      // GSAP's own record, not the layout
      const floats = makeFloats(1);
      let onScreen = true;
      const sync = () =>
        floats.forEach(({ owner, play }) =>
          play(onScreen && owner !== null && Number(gsap.getProperty(owner, "opacity")) > 0)
        );
      tl.eventCallback("onUpdate", sync);
      const seen = new IntersectionObserver(([entry]) => {
        onScreen = !!entry?.isIntersecting;
        sync();
      });
      seen.observe(root);
      sync();

      return () => {
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        ScrollTrigger.removeEventListener("refresh", measure);
        seen.disconnect();
        floats.forEach(({ el }) => (el.style.willChange = ""));
      };
    });

    // phones and tablets: each part fades up as it scrolls into view, the
    // ones that arrive together one after another
    mm.add(SMALL, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      gsap.set(items, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }),
      });

      // the idle floats at half range, each running only while on screen
      const floats = makeFloats(0.5);
      const seen = new IntersectionObserver((entries) =>
        entries.forEach((entry) => floats.find((f) => f.el === entry.target)?.play(entry.isIntersecting))
      );
      floats.forEach(({ el }) => seen.observe(el));
      return () => {
        seen.disconnect();
        floats.forEach(({ el }) => (el.style.willChange = ""));
      };
    });

    return () => {
      alive = false;
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    // the navbar (72px) overlays the band: the content below it fills the
    // rest of the screen, and its foot leaves room for the scroll hint and
    // the WhatsApp button
    <section ref={rootRef} aria-labelledby="hero-title" className="hero-calm relative overflow-clip pt-[72px]">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 pt-8 pb-16 sm:px-6 lg:min-h-[calc(100svh-72px)] lg:px-8 lg:pb-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div data-hero-copy className="lg:col-span-7">
            {children}
          </div>

          <div className="lg:col-span-5">
            <HeroStage />
          </div>
        </div>

        <Scene2CopyLayer />
        <FeatureScenes />
      </div>

      {/* desktop only: a hint that the scroll plays the story */}
      <div
        data-cue
        aria-hidden
        className="hero-cue pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[12px] font-medium tracking-wide text-brand-deep/70 lg:flex"
      >
        Scroll to explore
        <span className="hero-cue-line h-7 w-px bg-brand-deep/30" />
      </div>

      {/* the band melts into the next section's background, in either theme */}
      <div aria-hidden className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" />
    </section>
  );
}

/** The right-hand stage: scenes 1 and 2 on top of each other on wide
 *  screens, a simple stack on small ones. */
function HeroStage() {
  return (
    <div
      data-stage
      style={{ "--tablet-w": TABLET_WIDTH } as CSSProperties}
      className="hero-stage relative flex flex-col gap-14 lg:block lg:h-[min(620px,calc(100svh-200px))] xl:h-[min(700px,calc(100svh-200px))]"
    >
      {/* the one soft mint-teal glow, behind the tablet and stethoscope */}
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute top-[calc((100%-136px)/2)] left-[calc(var(--tablet-w)/2)] hidden size-[600px] -translate-1/2 rounded-full lg:block"
      />

      {/* Scene 1: the queue tablet, three cards below */}
      <div data-scene="1" className="relative order-1 lg:absolute lg:inset-0">
        <div className="relative flex justify-center pb-16 lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-[136px] lg:items-center lg:justify-start lg:pb-0">
          <HeroVisual />
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 hidden justify-center gap-4 lg:flex xl:gap-6">
          {SCENE1_CARDS.map(({ label, Icon }, i) => (
            <div key={label} data-s1-card className="glass-card flex w-[118px] flex-col items-center gap-2 rounded-2xl px-3 pt-4 pb-3.5 text-center xl:w-[148px]">
              <Icon size={56} floatDelay={i * 1.3} />
              <span className="font-display text-[14px] leading-tight font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scene 2: the four features as a 2×2 grid of equal glass boxes, and a
          heartbeat line. Left-aligned, so the line ends left of the WhatsApp
          button. The layer lets clicks through to scene 1 below it. */}
      <div data-scene="2" className="relative order-2 flex flex-col justify-center gap-10 lg:pointer-events-none lg:absolute lg:inset-0">
        {/* phones and tablets: scene 2's copy comes first, above the boxes */}
        <div data-reveal className="lg:hidden">
          <Scene2Copy />
        </div>
        {/* rows 28px apart: two boxes floating ±6px out of step still keep 16px */}
        <div aria-hidden className="hero-s2-width grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-7">
          {FEATURES.map(({ label, Icon }, i) => (
            <div key={label} data-s2-box data-reveal className="lg:pointer-events-auto">
              <div data-idle="6" data-idle-dur={BOX_FLOAT[i]?.dur} data-idle-delay={BOX_FLOAT[i]?.delay} className="h-full">
              <div className="glass-card glass-card-teal flex h-full flex-col items-center justify-center gap-3 rounded-[20px] px-3 py-5 text-center transition-[translate,box-shadow] duration-300 hover:-translate-y-1 motion-reduce:transition-none">
                <Icon size={56} float={false} />
                <span className="font-display text-[14px] leading-tight font-semibold text-balance">{label}</span>
              </div>
              </div>
            </div>
          ))}
        </div>
        <div data-ecg data-reveal aria-hidden className="hero-s2-width">
          <svg viewBox="0 0 520 100" className="ecg h-auto w-full overflow-visible">
            <path d={ECG} fill="none" strokeWidth="2" strokeLinejoin="round" style={{ stroke: "var(--primary)" }} strokeOpacity="0.15" />
            <path d={ECG} pathLength={1} className="ecg-trace" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--primary)" }} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// each box's idle float: its own pace and start, so they never move together
const BOX_FLOAT = [
  { dur: 4.2, delay: 0 },
  { dur: 5, delay: 0.6 },
  { dur: 4.6, delay: 1.2 },
  { dur: 5.4, delay: 0.3 },
];

// the same three points as the hero's trust row (components/marketing/hero.tsx)
const TRUST_BADGES = ["No setup fees", "Free 30‑day trial", "Cancel anytime"]; // a non-breaking hyphen

/** Scene 2's copy: what the four boxes add up to. Only the hero's own claims. */
function Scene2Copy() {
  return (
    <div className="max-w-[520px] space-y-6 text-brand-deep">
      <p className="glass-card glass-card-teal inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide">
        <span className="size-1.5 rounded-full bg-primary" />
        Everything in one app
      </p>
      <h2 className="hero-title font-display text-[clamp(2.25rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-balance">
        One app for your <span className="hero-accent-text">whole clinic</span>
      </h2>
      <p className="text-base leading-[1.6] text-pretty text-brand-deep/75 lg:text-[17px]">
        Walk-in queue, patient records and Urdu prescriptions, built for doctors and receptionists in Pakistan.
      </p>
      <BookDemoButton className={PRIMARY_BUTTON}>
        Book a free demo
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
      </BookDemoButton>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {TRUST_BADGES.map((badge) => (
          <div key={badge} className="flex items-center gap-2.5 text-[14px] text-brand-deep/75">
            <CheckCircle className="size-[18px] flex-shrink-0 text-secondary" />
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Wide screens: scene 2's copy in the hero's left column, over where the
 *  headline was. The layer lets clicks through; only the shown copy takes them. */
function Scene2CopyLayer() {
  return (
    <div
      data-scene="2-copy"
      className="pointer-events-none absolute inset-0 hidden items-center px-8 pt-8 pb-24 lg:flex"
    >
      <div className="grid w-full grid-cols-12 gap-8">
        <div data-s2-copy className="pointer-events-auto col-span-7">
          <Scene2Copy />
        </div>
      </div>
    </div>
  );
}

/** Scene 3, the whole hero's width: one feature at a time, copy on the left
 *  and its mock-up on the right. On wide screens the four lie on top of each
 *  other over the hero and the timeline crossfades them; on small ones they
 *  follow the stage, one under another. The layer lets clicks through; only a
 *  shown feature takes them. */
function FeatureScenes() {
  return (
    <div
      data-scene="3"
      className="relative mt-24 w-full lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-center lg:px-8 lg:pt-8 lg:pb-24"
    >
      {/* which feature is showing: one line per feature, the current one lit */}
      <ol data-steps aria-hidden className="absolute top-1/2 left-8 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex">
        {FEATURES.map(({ label }) => (
          <li key={label} className="relative h-7 w-1 rounded-full bg-brand-deep/15">
            <span data-step-on className="absolute inset-0 rounded-full bg-primary" />
          </li>
        ))}
      </ol>

      <div className="grid w-full gap-24 lg:gap-0">
        {FEATURES.map(({ label, heading, line, Mockup, booking }) => (
          <div key={label} data-feature className="grid items-center gap-10 lg:pointer-events-auto lg:[grid-area:1/1] lg:grid-cols-12 lg:gap-8">
            <div data-reveal className="space-y-6 text-brand-deep lg:col-span-7 lg:ml-12">
              {booking ? (
                <p className="glass-card glass-card-teal inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Premium care
                </p>
              ) : (
                <p className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide text-primary">
                  <span className="size-1.5 rounded-full bg-secondary" />
                  {label}
                </p>
              )}
              <h2 className="hero-title font-display text-[clamp(2.25rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-balance">
                {heading}
              </h2>
              <p className="max-w-[520px] text-base leading-[1.6] text-pretty text-brand-deep/75 lg:text-[17px]">{line}</p>
              {booking ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  <BookDemoButton className={PRIMARY_BUTTON}>
                    Book now
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                  </BookDemoButton>
                  <Link
                    href="#book-demo"
                    className="btn-premium inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-brand-deep/25 bg-transparent px-8 py-4 text-[15px] font-semibold text-brand-deep hover:border-brand-deep/40 hover:bg-brand-deep/[0.05] sm:w-auto"
                  >
                    <span className="size-2 rounded-full bg-secondary" />
                    Available today
                  </Link>
                </div>
              ) : (
                <BookDemoButton className={PRIMARY_BUTTON}>
                  Book a free demo
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                </BookDemoButton>
              )}
            </div>
            <div data-reveal className="flex justify-center lg:col-span-5">
              <div className={`w-full ${booking ? "max-w-[340px]" : "max-w-[360px]"}`}>
                <Mockup />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRIMARY_BUTTON =
  "btn-premium group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover sm:w-auto";

/* ── The mock-ups: small drawings of the app, with invented example data ── */

/** A mock-up's glass card, floating ±8px at its own pace (`dur`, `delay`) */
function MockupCard({ title, dur, delay, children }: { title: string; dur: number; delay: number; children: ReactNode }) {
  return (
    <div data-idle="8" data-idle-dur={dur} data-idle-delay={delay}>
    <div className="glass-card glass-card-teal rounded-[20px] p-5 text-brand-deep">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-display text-[15px] font-semibold">{title}</p>
        <span className="rounded-full bg-brand-deep/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-brand-deep/70">Example</span>
      </div>
      {children}
    </div>
    </div>
  );
}

/** 1. Book appointment (a placeholder scene): the doctor's card with a
 *  "Book now" button, and three small glass icons round it, 16px clear of it
 *  (they float up and down only); 1024-1279px and phones have no room beside it */
function BookingMockup() {
  return (
    <div className="relative">
      <div data-idle="8" data-idle-dur={5} data-idle-delay={0}>
      <DoctorCard
        photoClassName="size-14 lg:size-20"
        status="Available today"
        tag="Example"
        float={false}
        footer={
          <BookDemoButton className="btn-premium mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover">
            Book now
          </BookDemoButton>
        }
      />
      </div>
      <span data-s3-icon aria-hidden className="absolute top-2 -left-[72px] hidden sm:block lg:hidden xl:block"><span data-idle="10" data-idle-dur={4.4} data-idle-delay={0.3} className="block"><CalendarIcon size={56} float={false} /></span></span>
      <span data-s3-icon aria-hidden className="absolute top-1/3 -right-[68px] hidden sm:block lg:hidden xl:block"><span data-idle="10" data-idle-dur={5.8} data-idle-delay={1} className="block"><PillIcon size={52} float={false} /></span></span>
      <span data-s3-icon aria-hidden className="absolute bottom-2 -left-[66px] hidden sm:block lg:hidden xl:block"><span data-idle="10" data-idle-dur={5.1} data-idle-delay={0.6} className="block"><MedicalCrossIcon size={50} float={false} /></span></span>
    </div>
  );
}

/** 2. Walk-in queue: who is being seen, and who waits */
function QueueMockup() {
  const waiting = [
    { token: "025", name: "Muhammad Asif" },
    { token: "026", name: "Sana Tariq" },
    { token: "027", name: "Bilal Ahmed" },
  ];
  return (
    <MockupCard title="Dr. Sara Malik’s queue" dur={5.6} delay={0.8}>
      <div className="doctor-pill rounded-2xl px-4 py-3">
        <p className="text-[12px] font-medium text-brand-deep/70">Now serving</p>
        <p className="font-display text-[40px] leading-none font-bold tabular-nums">024</p>
      </div>
      <ul className="mt-3 space-y-2 text-[13px]">
        {waiting.map((p) => (
          <li key={p.token} className="flex items-center gap-3 rounded-xl bg-brand-deep-foreground/60 px-3 py-2">
            <span className="w-8 font-display font-bold tabular-nums">{p.token}</span>
            <span className="flex-1 truncate font-medium">{p.name}</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">Waiting</span>
          </li>
        ))}
      </ul>
    </MockupCard>
  );
}

/** 3. Patient records: one patient, her allergy and her recent visits */
function RecordMockup() {
  const visits = [
    { day: "12 Oct", what: "Fever · Rx with 3 medicines" },
    { day: "28 Sep", what: "Follow-up · CBC, LFTs" },
    { day: "02 Sep", what: "Cough · Rx with 2 medicines" },
  ];
  return (
    <MockupCard title="Patient record" dur={5.2} delay={0.4}>
      <div className="flex items-center gap-3">
        <span className="initials-avatar flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-brand-deep-foreground">AB</span>
        <div className="min-w-0">
          <p className="font-semibold">Ayesha Bibi</p>
          <p className="text-[12px] text-brand-deep/70">Last visit: 12 Oct · Allergy: aspirin</p>
        </div>
      </div>
      <p className="mt-4 mb-2 text-[12px] font-semibold text-brand-deep/70">Recent visits</p>
      <ul className="space-y-2 text-[13px]">
        {visits.map((v) => (
          <li key={v.day} className="flex items-center gap-3 rounded-xl bg-brand-deep-foreground/60 px-3 py-2">
            <span className="w-14 shrink-0 font-semibold text-primary tabular-nums">{v.day}</span>
            <span className="min-w-0 truncate">{v.what}</span>
          </li>
        ))}
      </ul>
    </MockupCard>
  );
}

/** 4. Urdu prescriptions: two medicines, each with its Urdu instructions */
function PrescriptionMockup() {
  const medicines = [
    { name: "Tab. Paracetamol 500 mg", dose: "1 tablet · 3 times a day · after meals", urdu: "ایک گولی، دن میں تین بار، کھانے کے بعد" },
    { name: "Cap. Amoxicillin 500 mg", dose: "1 capsule · twice a day · 5 days", urdu: "ایک کیپسول، دن میں دو بار، پانچ دن تک" },
  ];
  return (
    <MockupCard title="Prescription" dur={6} delay={1.1}>
      <p className="text-[12px] text-brand-deep/70">Muhammad Asif · Dr. Sara Malik</p>
      <ul className="mt-3 space-y-2.5">
        {medicines.map((m) => (
          <li key={m.name} className="rounded-xl bg-brand-deep-foreground/60 px-3 py-2.5">
            <p className="text-[13px] font-semibold">{m.name}</p>
            <p className="text-[12px] text-brand-deep/70">{m.dose}</p>
            <Urdu as="p" className="mt-1 text-[17px] text-brand-deep">
              {m.urdu}
            </Urdu>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] text-brand-deep/70">Printed in the Classic design</p>
    </MockupCard>
  );
}
