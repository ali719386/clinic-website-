"use client";

// A section below the hero, rendered lazily (2026-10-24). Its HTML is always
// there (for search engines and without JavaScript); the browser only skips
// laying it out and painting it until it nears the screen (content-visibility
// in marketing.css), in a space of `estimate` px kept for it, so the page's
// height does not jump. With JavaScript:
//   • it is rendered in full 800px before it reaches the screen (not while
//     the hero is pinned), so nothing pops in;
//   • it rises in once as it comes into view (24px, 500ms; 12px, 300ms on
//     phones), its cards following in turn (unless less motion is asked for,
//     or it is already on screen when the page loads);
//   • its CSS animations pause while it is off screen;
//   • when its real height differs from the estimate, the scroll triggers are
//     measured again, but never while the hero is pinned (that would jolt it).

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NEAR = "800px 0px"; // start rendering and measuring this far ahead

/** Is the hero pinned right now? Nothing new starts while it is. */
const pinning = () => ScrollTrigger.getAll().some((t) => t.pin && t.isActive);

export function LazySection({
  estimate,
  rise = 0,
  duration = 0.5,
  stagger = 0.08,
  children,
}: {
  estimate: number;
  /** the cards' reveal: how far they rise (px), how long (s), how far apart (s) */
  rise?: number;
  duration?: number;
  stagger?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<boolean | null>(null); // null: before JavaScript, shown as is
  const [inView, setInView] = useState(true);
  const [near, setNear] = useState(false); // rendered in full ahead of time

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // already on screen (a reload halfway down): no fade
    const r = el.getBoundingClientRect();
    setShown(r.top < window.innerHeight && r.bottom > 0);

    // the reveal: once, as it comes into view; its cards follow in turn
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        enter.disconnect();
        setShown(true);
        if (reduce) return;
        const cards = el.querySelectorAll(".reveal, [data-card]");
        if (cards.length)
          gsap.fromTo(
            cards,
            { opacity: 0, y: rise },
            { opacity: 1, y: 0, duration, stagger, ease: rise ? "expo.out" : "power2.out", delay: 0.1, clearProps: "opacity,transform" }
          );
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    enter.observe(el);

    // rendered in full 800px ahead (so it never pops in), but not while the
    // hero is pinned: then as soon as the pin lets go
    let wanted = false;
    const ready = () => {
      if (wanted && !pinning()) setNear(true);
    };
    ScrollTrigger.addEventListener("scrollEnd", ready);
    // its animations run only while it is near the screen
    const nearby = new IntersectionObserver(
      ([entry]) => {
        const on = !!entry?.isIntersecting;
        setInView(on);
        if (on) {
          wanted = true;
          ready();
        }
      },
      { rootMargin: NEAR }
    );
    nearby.observe(el);

    // its height settled: measure the scroll triggers again (not during the pin)
    let timer = 0;
    let lastH = el.offsetHeight;
    const resized = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!pinning()) ScrollTrigger.refresh();
      }, 200);
    });
    resized.observe(el);

    return () => {
      enter.disconnect();
      nearby.disconnect();
      ScrollTrigger.removeEventListener("scrollEnd", ready);
      resized.disconnect();
      window.clearTimeout(timer);
    };
  }, [rise, duration, stagger]);

  return (
    <div
      ref={ref}
      className="lazy-section"
      data-shown={shown === null ? undefined : String(shown)}
      data-inview={String(inView)}
      data-near={near ? "true" : undefined}
      style={{ "--lazy-h": `${estimate}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
