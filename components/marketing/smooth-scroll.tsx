"use client";

// Smooth scrolling for the marketing pages (2026-10-24), one Lenis for the
// whole page, driven by GSAP's ticker so it and ScrollTrigger move in step.
// Not with "reduce motion" (the browser's own scroll then), and touch keeps
// its native scroll (syncTouch off). Links to "#…" glide there, below the
// fixed navbar; `smoothScrollTo` does the same for buttons.

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAVBAR = 72;
let lenis: Lenis | null = null;

/** Scroll to a section ("#features"), smoothly where Lenis runs */
export function smoothScrollTo(target: string) {
  if (lenis) lenis.scrollTo(target, { offset: -NAVBAR });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

export function SmoothScroll() {
  useEffect(() => {
    if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const instance = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -NAVBAR },
    });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000); // GSAP's seconds to Lenis's ms
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
