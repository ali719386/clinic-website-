// The features bento (2026-10-24, in the glass mint-teal style of the
// sections above): six glass cards, two with small mock-ups of the app
// (invented example data, tagged "Example"). A server component: everything
// is visible without JavaScript; the lazy wrapper reveals the [data-card]
// parts once, and a soft light follows the mouse over the cards.
import {
  ListOrdered,
  ClipboardList,
  FileText,
  Users,
  BookmarkPlus,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import prescription from "@/public/marketing/prescription.png";
import { SectionHeader } from "@/components/marketing/section-header";
import { Spotlight } from "@/components/marketing/spotlight";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tag?: string;
  /** its place in the grid (styles/marketing.css, .features-grid) */
  area: "urdu" | "queue" | "hist" | "doc" | "tmpl" | "priv";
  visual?: "queue" | "history" | "prescription";
}

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Prescriptions in Urdu and English",
    description:
      "Search medicines, pick the dose, frequency and meal timing, and the Urdu instructions are written for you. Print in one of six designs or download a PDF.",
    tag: "Urdu + English",
    area: "urdu",
    visual: "prescription",
  },
  {
    icon: ListOrdered,
    title: "Live Token Queue",
    description:
      "Receptionists register walk-ins and hand out tokens. Each doctor's queue updates live, so nobody has to call names across the room.",
    area: "queue",
    visual: "queue",
  },
  {
    icon: ClipboardList,
    title: "Patient History",
    description:
      "Every visit, diagnosis, allergy and past prescription in one place. Reuse a past prescription in one click.",
    area: "hist",
    visual: "history",
  },
  {
    icon: Users,
    title: "Doctors & Receptionists",
    description:
      "A clinic admin, doctors and receptionists, each with their own username. Assign receptionists to the doctors they work for.",
    area: "doc",
  },
  {
    icon: BookmarkPlus,
    title: "Templates & Test Panels",
    description:
      "Save your common prescriptions as templates, and add the full baseline test panel (CBC, LFTs, RFTs and more) in one click.",
    area: "tmpl",
  },
  {
    icon: ShieldCheck,
    title: "Private by Design",
    description:
      "Each clinic's records are kept separate, every connection is encrypted, staff see only what their role allows, and the database is backed up every night.",
    area: "priv",
  },
];

function BentoCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  const text = (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="icon-tile" aria-hidden>
          <Icon className="size-6" />
        </span>
        {feature.tag && <span className="teal-chip">{feature.tag}</span>}
      </div>
      <h3 className="how-ink mt-5 font-display text-[20px] font-medium text-balance">{feature.title}</h3>
      <p className="spec-subtext mt-3 text-[15px] leading-[1.7] text-pretty">{feature.description}</p>
    </div>
  );

  return (
    <article data-card data-spot className="glass-tile spot relative flex flex-col p-7 lg:p-8" style={{ gridArea: feature.area }}>
      {feature.visual === "prescription" ? (
        // the real printed prescription (Classic design, sample patient), beside the text where there is room
        <div className="flex h-full flex-col gap-6 min-[700px]:flex-row min-[700px]:items-center">
          <div className="flex-1">{text}</div>
          <Image
            src={prescription}
            placeholder="blur"
            loading="lazy"
            alt="A printed prescription with Urdu instructions, Classic design"
            width={350}
            height={534}
            sizes="(min-width: 700px) 200px, 80vw"
            className="mx-auto h-auto w-full max-w-[200px] rounded-xl border border-border shadow-card"
          />
        </div>
      ) : (
        text
      )}
      {feature.visual === "queue" && (
        <div className="mt-auto pt-6">
          <QueueMockup />
        </div>
      )}
      {feature.visual === "history" && (
        <div className="mt-auto pt-6">
          <HistoryMockup />
        </div>
      )}
    </article>
  );
}

/** The live queue (invented names, the same as the hero's) */
function QueueMockup() {
  const rows = [
    { token: "07", name: "Ayesha Bibi", status: "Called" },
    { token: "08", name: "Muhammad Asif", status: "Waiting" },
    { token: "09", name: "Sana Tariq", status: "Waiting" },
  ];
  return (
    <div className="how-mock">
      <div className="mb-1 flex justify-end">
        <span className="how-tag">Example</span>
      </div>
      <ul aria-label="Example token queue">
        {rows.map((r) => (
          <li key={r.token} data-card className="how-mock-row flex items-center gap-3 py-2">
            <span className="how-token">{r.token}</span>
            <span className="how-ink min-w-0 flex-1 truncate text-[14px] font-medium">{r.name}</span>
            {r.status === "Called" ? (
              <span className="how-status how-status-called">
                <span className="relative flex size-1.5">
                  <span className="dot-pulse absolute inset-0 rounded-full bg-secondary" />
                  <span className="relative size-1.5 rounded-full bg-secondary" />
                </span>
                {r.status}
              </span>
            ) : (
              <span className="how-status">{r.status}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A visit history as a small timeline (invented visits) */
function HistoryMockup() {
  const visits = [
    { day: "12 Oct", what: "Fever · Rx with 3 medicines" },
    { day: "28 Sep", what: "Follow-up · CBC, LFTs" },
    { day: "02 Sep", what: "Cough · Rx with 2 medicines" },
  ];
  return (
    <div className="how-mock">
      <div className="mb-1 flex justify-end">
        <span className="how-tag">Example</span>
      </div>
      <ul aria-label="Example visit history" className="hist-list">
        {visits.map((v) => (
          <li key={v.day} data-card className="hist-row flex items-center gap-3 py-2 text-[14px]">
            <span className="w-14 shrink-0 font-semibold text-primary tabular-nums">{v.day}</span>
            <span className="how-ink min-w-0 truncate">{v.what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          pill="Features"
          line1="Everything Your"
          line2="Clinic Needs"
          sub="Made for Pakistani clinics: simple enough for day one, with the details doctors asked for."
        />
        {/* 3 columns from 1081px (Urdu wide, Queue tall), 2 on tablets, 1 on phones */}
        <Spotlight className="features-grid mt-16 lg:mt-20">
          {FEATURES.map((f) => (
            <BentoCard key={f.title} feature={f} />
          ))}
        </Spotlight>
      </div>
    </section>
  );
}
