"use client";

// "Specialties" (2026-10-24; twenty-five since 2026-10-27): example doctors as glass balls that drop
// into a stage when it comes into view, pile up, and can be dragged, thrown or
// nudged with the arrow keys. The physics is our own (circles, gravity,
// walls, collisions) and runs on refs and style.transform, never React state,
// and only while the stage is on screen and something is moving.
// The names are invented examples (README rule 5): the note below says so.
// With "reduce motion" there is no gravity or drop: the balls sit in rows,
// and can still be dragged.

import { useEffect, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Hand } from "lucide-react";

const DOCTORS = [
  { first: "Sara", last: "Malik", specialty: "General Physician" },
  { first: "Usman", last: "Tariq", specialty: "Cardiologist" },
  { first: "Hina", last: "Raza", specialty: "Pediatrician" },
  { first: "Bilal", last: "Ahmed", specialty: "Dentist" },
  { first: "Ayesha", last: "Khan", specialty: "Eye Specialist" },
  { first: "Hamza", last: "Iqbal", specialty: "Orthopedic" },
  { first: "Zainab", last: "Ali", specialty: "Neurologist" },
  { first: "Noor", last: "Fatima", specialty: "Dermatologist" },
  { first: "Maryam", last: "Shah", specialty: "Gynecologist" },
  { first: "Imran", last: "Sheikh", specialty: "Surgeon" },
  { first: "Saad", last: "Mehmood", specialty: "ENT Specialist" },
  { first: "Rabia", last: "Anwar", specialty: "Psychiatrist" },
  { first: "Faisal", last: "Qureshi", specialty: "Urologist" },
  { first: "Sana", last: "Javed", specialty: "Pulmonologist" },
  { first: "Kamran", last: "Butt", specialty: "Nephrologist" },
  { first: "Mahnoor", last: "Aslam", specialty: "Physiotherapist" },
  { first: "Adeel", last: "Hussain", specialty: "Oncologist" },
  { first: "Iqra", last: "Nadeem", specialty: "Nutritionist" },
  { first: "Tahir", last: "Abbas", specialty: "Rheumatologist" },
  { first: "Fiza", last: "Khalid", specialty: "Radiologist" },
  { first: "Asad", last: "Mirza", specialty: "Endocrinologist" },
  { first: "Komal", last: "Riaz", specialty: "Pathologist" },
  { first: "Shoaib", last: "Latif", specialty: "Hematologist" },
  { first: "Amna", last: "Farooq", specialty: "Psychologist" },
  { first: "Junaid", last: "Rafiq", specialty: "Plastic Surgeon" },
];

// the physics (px and seconds)
const GRAVITY = 2000;
const BOUNCE = 0.5;
const AIR = 0.992; // velocity kept per 1/60 s
const FLOOR_FRICTION = 0.985;
const REST_SPEED = 60; // slower than this on the floor: it stops bouncing
const SUBSTEPS = 2;
const MAX_DT = 0.034;
const ITERATIONS = 3;
const MAX_THROW = 2600;
const STILL_BEFORE_RELEASE = 90; // ms: held still this long, it drops instead of flying
const NUDGE = { ArrowLeft: [-700, 0], ArrowRight: [700, 0], ArrowUp: [0, -900], ArrowDown: [0, 300] } as const;
const SMALL = "(max-width: 620px)";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  entered: boolean; // inside the stage: the ceiling now holds it
  dragging: boolean;
  tx: number; // where the pointer wants it while dragged
  ty: number;
};

export default function Specialties() {
  const stageRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const ballRefs = useRef<(HTMLDivElement | null)[]>([]);
  // everything the loop and the handlers share, outside React's renders
  const sim = useRef({
    balls: DOCTORS.map<Ball>(() => ({ x: 0, y: 0, vx: 0, vy: 0, entered: false, dragging: false, tx: 0, ty: 0 })),
    r: 62,
    w: 0,
    h: 560,
    dropped: false,
    inView: false,
    reduced: false,
    raf: 0,
    last: 0,
    calm: 0, // frames in a row with nothing moving
    z: 10,
    drag: null as null | { i: number; dx: number; dy: number; samples: { x: number; y: number; t: number }[]; rect: DOMRect },
    hintGone: false,
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const s = sim.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia(SMALL);

    const measure = () => {
      s.w = stage.clientWidth;
      s.h = stage.clientHeight;
      s.r = small.matches ? 46 : 62;
    };

    const draw = () => {
      s.balls.forEach((b, i) => {
        const el = ballRefs.current[i];
        if (el) el.style.transform = `translate3d(${(b.x - s.r).toFixed(1)}px, ${(b.y - s.r).toFixed(1)}px, 0)`;
      });
    };

    const show = (on: boolean) =>
      ballRefs.current.forEach((el) => {
        if (el) el.style.visibility = on ? "visible" : "hidden";
      });

    const showHint = (on: boolean) => {
      s.hintGone = !on;
      hintRef.current?.setAttribute("data-gone", String(!on));
    };

    // ── the simulation ──
    const step = (h: number) => {
      const { balls, r, w, h: H } = s;
      const g = s.reduced ? 0 : GRAVITY;
      const air = Math.pow(AIR, h * 60);
      const follow = 1 - Math.pow(0.0005, h); // how fast a dragged ball catches the pointer

      for (const b of balls) {
        if (b.dragging) {
          const nx = b.x + (b.tx - b.x) * follow;
          const ny = b.y + (b.ty - b.y) * follow;
          b.vx = (nx - b.x) / h;
          b.vy = (ny - b.y) / h;
          b.x = nx;
          b.y = ny;
        } else {
          b.vy += g * h;
          b.vx *= air;
          b.vy *= air;
          if (s.reduced) {
            b.vx *= 0.9; // nothing falls: what moves soon stops
            b.vy *= 0.9;
          }
          b.x += b.vx * h;
          b.y += b.vy * h;
        }
        if (b.y >= r) b.entered = true;

        // walls, floor and (once inside) ceiling
        if (b.x < r) {
          b.x = r;
          if (b.vx < 0) b.vx = -b.vx * BOUNCE;
        } else if (b.x > w - r) {
          b.x = w - r;
          if (b.vx > 0) b.vx = -b.vx * BOUNCE;
        }
        if (b.y > H - r) {
          b.y = H - r;
          if (b.vy > 0) b.vy = b.vy < REST_SPEED ? 0 : -b.vy * BOUNCE;
          b.vx *= FLOOR_FRICTION;
        } else if (b.entered && b.y < r) {
          b.y = r;
          if (b.vy < 0) b.vy = -b.vy * BOUNCE;
        }
      }

      // ball against ball: equal masses, the dragged one immovable
      const min = r * 2;
      for (let k = 0; k < ITERATIONS; k++) {
        for (let i = 0; i < balls.length; i++) {
          const a = balls[i]!;
          for (let j = i + 1; j < balls.length; j++) {
            const c = balls[j]!;
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const d2 = dx * dx + dy * dy;
            if (d2 >= min * min || d2 === 0) continue;
            const ia = a.dragging ? 0 : 1;
            const ic = c.dragging ? 0 : 1;
            const sum = ia + ic;
            if (!sum) continue;
            const d = Math.sqrt(d2);
            const nx = dx / d;
            const ny = dy / d;
            const push = (min - d) / sum;
            a.x -= nx * push * ia;
            a.y -= ny * push * ia;
            c.x += nx * push * ic;
            c.y += ny * push * ic;
            const vn = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
            if (vn < 0) {
              const imp = (-(1 + BOUNCE) * vn) / sum;
              a.vx -= imp * nx * ia;
              a.vy -= imp * ny * ia;
              c.vx += imp * nx * ic;
              c.vy += imp * ny * ic;
            }
          }
        }
      }
    };

    const frame = (now: number) => {
      s.raf = 0;
      if (!s.inView || !s.dropped) return;
      const dt = Math.min((now - (s.last || now)) / 1000, MAX_DT) || 1 / 60;
      s.last = now;
      for (let k = 0; k < SUBSTEPS; k++) step(dt / SUBSTEPS);
      draw();

      // a pile at rest: stop the loop until something wakes it
      const moving = s.drag !== null || s.balls.some((b) => Math.abs(b.vx) > 4 || Math.abs(b.vy) > 4 || !b.entered);
      s.calm = moving ? 0 : s.calm + 1;
      if (s.calm > 45) {
        s.balls.forEach((b) => (b.vx = b.vy = 0));
        return;
      }
      s.raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      s.calm = 0;
      if (!s.raf && s.inView && s.dropped) {
        s.last = 0;
        s.raf = requestAnimationFrame(frame);
      }
    };

    // ── placing the balls ──
    const hideAbove = () => {
      s.balls.forEach((b) => Object.assign(b, { x: s.w / 2, y: -s.r * 2, vx: 0, vy: 0, entered: false, dragging: false }));
      show(false);
      draw();
    };

    const drop = () => {
      measure();
      const { r, w } = s;
      s.balls.forEach((b, i) => {
        b.x = r + Math.random() * Math.max(0, w - 2 * r);
        b.y = -r - i * r * 1.6 - Math.random() * 30;
        b.vx = (Math.random() * 2 - 1) * 80;
        b.vy = 0;
        b.entered = false;
        b.dragging = false;
      });
      draw();
      show(true);
      s.dropped = true;
      wake();
    };

    // reduce motion: rows of balls, each row centred, from the floor up
    const grid = () => {
      measure();
      const { r, w, h } = s;
      const gap = 10;
      const perRow = Math.max(1, Math.floor((w + gap) / (2 * r + gap)));
      s.balls.forEach((b, i) => {
        const row = Math.floor(i / perRow);
        const inRow = Math.min(perRow, s.balls.length - row * perRow);
        const col = i % perRow;
        const rowW = inRow * 2 * r + (inRow - 1) * gap;
        Object.assign(b, {
          x: (w - rowW) / 2 + r + col * (2 * r + gap),
          y: h - r - row * (2 * r + gap),
          vx: 0,
          vy: 0,
          entered: true,
          dragging: false,
        });
      });
      draw();
      show(true);
      s.dropped = true;
    };

    measure();
    if (s.reduced) grid();
    else hideAbove();

    // ── on screen or not ──
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        s.inView = entry.isIntersecting;
        if (s.reduced) {
          if (s.inView) wake();
          return;
        }
        // the balls drop once per visit to the page; scrolling away and back
        // leaves the pile where it was (the loop just rests off screen)
        if (entry.intersectionRatio >= 0.3 && !s.dropped) drop();
        else if (!entry.isIntersecting) {
          cancelAnimationFrame(s.raf);
          s.raf = 0;
        } else wake();
      },
      { threshold: [0, 0.3] }
    );
    io.observe(stage);

    // a new width (not just a phone's address bar changing the height)
    let lastW = stage.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = stage.clientWidth;
      if (w === lastW) return;
      lastW = w;
      measure();
      if (s.reduced) grid();
      else if (s.dropped) drop();
    });
    ro.observe(stage);

    // the handlers below reach these through the ref
    Object.assign(s, { wake, showHint });

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, []);

  // ── dragging ──
  const onPointerDown = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sim.current as typeof sim.current & { wake?: () => void; showHint?: (on: boolean) => void };
    if (!s.dropped || e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const rect = stageRef.current!.getBoundingClientRect();
    const b = s.balls[i]!;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    s.drag = { i, dx: b.x - px, dy: b.y - py, samples: [{ x: px, y: py, t: performance.now() }], rect };
    b.dragging = true;
    b.entered = true;
    b.tx = b.x;
    b.ty = b.y;
    el.style.zIndex = String(++s.z);
    el.dataset.dragging = "true";
    if (!s.hintGone) s.showHint?.(false);
    s.wake?.();
  };

  const onPointerMove = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (!s.drag || s.drag.i !== i) return;
    const { rect, dx, dy, samples } = s.drag;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const b = s.balls[i]!;
    b.tx = Math.min(Math.max(px + dx, s.r), s.w - s.r);
    b.ty = Math.min(Math.max(py + dy, s.r), s.h - s.r);
    const t = performance.now();
    samples.push({ x: px, y: py, t });
    while (samples.length > 2 && t - samples[0]!.t > 100) samples.shift();
  };

  const onPointerUp = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sim.current as typeof sim.current & { wake?: () => void };
    if (!s.drag || s.drag.i !== i) return;
    const { samples } = s.drag;
    const b = s.balls[i]!;
    const now = performance.now();
    const lastSample = samples[samples.length - 1]!;
    let vx = 0;
    let vy = 0;
    // thrown: the pointer's recent movement (it was not held still before letting go)
    if (!s.reduced && now - lastSample.t <= STILL_BEFORE_RELEASE && samples.length > 1) {
      const first = samples[0]!;
      const span = Math.max((lastSample.t - first.t) / 1000, 0.016);
      vx = (lastSample.x - first.x) / span;
      vy = (lastSample.y - first.y) / span;
      const speed = Math.hypot(vx, vy);
      if (speed > MAX_THROW) {
        vx *= MAX_THROW / speed;
        vy *= MAX_THROW / speed;
      }
    }
    b.dragging = false;
    b.vx = vx;
    b.vy = vy;
    s.drag = null;
    const el = e.currentTarget;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    delete el.dataset.dragging;
    s.wake?.();
  };

  // ── the keyboard: a nudge ──
  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    const s = sim.current as typeof sim.current & { wake?: () => void };
    const nudge = NUDGE[e.key as keyof typeof NUDGE];
    if (!nudge || !s.dropped) return;
    e.preventDefault();
    const b = s.balls[i]!;
    b.vx += nudge[0];
    b.vy += nudge[1];
    if (s.reduced) {
      // no gravity: a small step instead of a flight
      b.x = Math.min(Math.max(b.x + Math.sign(nudge[0]) * 24, s.r), s.w - s.r);
      b.y = Math.min(Math.max(b.y + Math.sign(nudge[1]) * 24, s.r), s.h - s.r);
      b.vx = b.vy = 0;
      const el = ballRefs.current[i];
      if (el) el.style.transform = `translate3d(${(b.x - s.r).toFixed(1)}px, ${(b.y - s.r).toFixed(1)}px, 0)`;
    }
    s.wake?.();
  };

  return (
    <section id="specialties" className="specialties-section relative overflow-clip py-[90px] min-[621px]:py-[130px]">
      {/* two faint teal glows drifting slowly behind */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="spec-blob spec-blob-a" />
        <div className="spec-blob spec-blob-b" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-foreground backdrop-blur-md">
            <span className="size-2 rounded-full bg-primary" />
            Specialties
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.035em] text-foreground">
            All Specialties,
            <br />
            <span className="font-light text-primary">One Platform</span>
          </h2>
          <p className="spec-subtext mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-pretty lg:text-lg">
            Whether you run a general clinic or a specialist practice, every doctor gets their own queue, prescriptions and
            saved templates.
          </p>
        </div>

        <p ref={hintRef} data-gone="false" className="spec-hint mt-10 flex items-center justify-center gap-2 text-[13px] font-medium">
          <Hand className="size-4" aria-hidden />
          Drag, throw and play with the doctors
        </p>

        <div
          ref={stageRef}
          role="group"
          aria-label="Doctors by specialty as balls. Drag or throw a ball, or focus it and use the arrow keys to nudge it."
          // taller as it narrows, so all twenty-five balls fit: 4 rows on a
          // laptop, up to 7 on a tablet, about 9 small ones on a phone
          className="spec-stage relative mx-auto mt-4 h-[560px] w-full max-w-[1180px] max-[1023px]:h-[640px] max-[800px]:h-[780px] max-[620px]:h-[760px]"
        >
          {DOCTORS.map((d, i) => (
            <div
              key={d.first + d.last}
              ref={(el) => {
                ballRefs.current[i] = el;
              }}
              role="button"
              tabIndex={0}
              aria-label={`Dr. ${d.first} ${d.last}, ${d.specialty}`}
              onPointerDown={onPointerDown(i)}
              onPointerMove={onPointerMove(i)}
              onPointerUp={onPointerUp(i)}
              onPointerCancel={onPointerUp(i)}
              onKeyDown={onKeyDown(i)}
              className="doc-ball absolute top-0 left-0"
              style={{ visibility: "hidden" }}
            >
              <span className="doc-ball-face">
                <span className="text-[20px] font-semibold text-primary max-[620px]:text-[16px]">
                  {d.first[0]}
                  {d.last[0]}
                </span>
                <span className="text-[13.5px] leading-tight font-medium max-[620px]:text-[11.5px]">
                  Dr. {d.first}
                  <br />
                  {d.last}
                </span>
                <span className="spec-muted mt-0.5 text-[10.5px] leading-tight max-[620px]:text-[9px]">{d.specialty}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="spec-muted mt-6 text-center text-[12px]">Example doctors, for illustration only.</p>
      </div>
    </section>
  );
}
