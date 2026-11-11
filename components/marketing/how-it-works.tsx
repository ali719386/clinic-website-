// "How it works" (2026-10-24, in the hero's and Specialties' style): four glass
// step cards in a 2×2 grid, numbered orbs joined in each row by a short dotted
// line (700px and wider), and two
// small mock-ups of the app with invented example data. A server component:
// everything is visible without JavaScript; the section's lazy wrapper
// (components/marketing/lazy-section.tsx) reveals the [data-card] parts once.
import type { ReactNode } from "react";
import { Urdu } from "@/components/urdu";

interface Step {
  step: string;
  title: string;
  description: string;
  extra?: ReactNode;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "We Set Up Your Clinic",
    description:
      "Tell us about your clinic. We create it with your details and give you your clinic's own sign-in link.",
  },
  {
    step: "02",
    title: "Add Your Team",
    description:
      "Create a username for each doctor and receptionist. Everyone signs in with their own account and sees only the screens they need.",
    extra: <Team />,
  },
  {
    step: "03",
    title: "Run the Queue",
    description:
      "Receptionists register walk-in patients and give each one a token. Every doctor's queue updates live on their screen.",
    extra: <QueueMockup />,
  },
  {
    step: "04",
    title: "Prescribe and Print",
    description:
      "Write prescriptions with Urdu instructions, reuse your saved templates, and print in your clinic's chosen design.",
    extra: <PrescriptionMockup />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section relative overflow-clip py-[80px] min-[621px]:py-[130px]">
      {/* two faint teal glows drifting slowly behind */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="spec-blob spec-blob-a" />
        <div className="spec-blob spec-blob-b" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p
            data-card
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-foreground backdrop-blur-md"
          >
            <span className="size-2 rounded-full bg-primary" />
            How It Works
          </p>
          <h2
            data-card
            className="how-ink mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.06] tracking-[-0.035em]"
          >
            Up & Running in
            <br />
            <span className="font-light text-primary">4 Simple Steps</span>
          </h2>
          <p data-card className="spec-subtext mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-pretty lg:text-lg">
            No lengthy onboarding and nothing to install: it runs in the browser on the computers, tablets and phones
            you already have.
          </p>
        </div>

        {/* the steps: 2×2 from 700px (01 02 / 03 04), one under another on phones;
            the two cards of a row stretch to the same height */}
        <ol className="mx-auto mt-[100px] grid max-w-[1000px] grid-cols-1 items-stretch gap-y-[64px] min-[700px]:grid-cols-2 min-[700px]:gap-x-[28px]">
          {STEPS.map((s, i) => (
            <li key={s.step} data-card className="relative flex">
              {/* the dotted line from this orb to the next one in the row, behind both */}
              {i % 2 === 0 && <span aria-hidden className="how-connector hidden min-[700px]:block" />}
              {/* top padding: 36px, and the orb's lower half */}
              <article
                className={`how-card relative flex w-full flex-1 flex-col items-center px-[32px] pt-[66px] pb-[32px] text-center ${
                  s.extra ? "" : "justify-center"
                }`}
              >
                <span className="how-orb absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
                  {s.step}
                </span>
                <h3 className="how-ink font-display text-[20px] font-medium">
                  <span className="sr-only">Step {s.step}: </span>
                  {s.title}
                </h3>
                <p className="spec-subtext mx-auto mt-3 max-w-[440px] text-[15px] leading-[1.7] text-pretty">{s.description}</p>
                {s.extra && <div className="mx-auto mt-auto w-full max-w-[420px] pt-6">{s.extra}</div>}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Step 2: four people in the clinic, and the roles they can have */
function Team() {
  const roles = [
    { name: "Doctor", dot: "how-dot-doctor" },
    { name: "Receptionist", dot: "how-dot-reception" },
    { name: "Admin", dot: "how-dot-admin" },
  ];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex">
        {["DA", "SK", "FM", "UR"].map((initials, i) => (
          <span key={initials} className="how-avatar" style={{ zIndex: 4 - i }} aria-hidden>
            {initials}
          </span>
        ))}
      </div>
      <ul className="flex flex-wrap justify-center gap-2" aria-label="Roles">
        {roles.map((r) => (
          <li key={r.name} className="how-role">
            <span className={`how-dot ${r.dot}`} aria-hidden />
            {r.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExampleTag() {
  return <span className="how-tag">Example</span>;
}

/** Step 3: the receptionist's queue (the tokens and names the app's own screen showed) */
function QueueMockup() {
  const rows = [
    { token: "1", name: "Ahmed Ali", status: "Waiting" },
    { token: "2", name: "Fatima Noor", status: "Waiting" },
  ];
  return (
    <div className="how-mock">
      <div className="mb-2 flex justify-end">
        <ExampleTag />
      </div>
      <ul>
        {rows.map((r) => (
          <li key={r.token} className="how-mock-row flex items-center gap-3 py-2">
            <span className="how-token">{r.token}</span>
            <span className="how-ink flex-1 truncate text-[14px] font-medium">{r.name}</span>
            <span className="how-status">{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 4: a prescription with Urdu instructions */
function PrescriptionMockup() {
  const medicines = [
    { n: "Paracetamol 500mg", u: "ایک گولی روزانہ تین بار کھانے کے بعد" },
    { n: "Cetirizine 10mg", u: "ایک گولی روزانہ ایک بار" },
  ];
  return (
    <div className="how-mock">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-display text-[22px] leading-none font-semibold text-primary">Rx</span>
        <ExampleTag />
      </div>
      <ul>
        {medicines.map((m) => (
          <li key={m.n} className="how-mock-row py-2">
            <p className="how-ink text-[14px] font-medium">{m.n}</p>
            <Urdu as="p" className="how-urdu">
              {m.u}
            </Urdu>
          </li>
        ))}
      </ul>
    </div>
  );
}
