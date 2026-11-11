import Link from "next/link";
import { BookDemoButton } from "@/components/marketing/demo-dialog";
import ScrollHero from "@/components/hero/scroll-hero";
import { ArrowRight, CheckCircle } from "lucide-react";

const TRUST_BADGES = ["No setup fees", "Free 30‑day trial", "Cancel anytime"]; // a non-breaking hyphen

// Since 2026-10-24 the hero is a calm, light band with a scroll-driven story
// (components/hero/scroll-hero.tsx): the queue on a tablet, then glass boxes,
// then a "Book appointment" scene with the doctor's card.
// Light in the light theme, dark in the dark one (marketing.css, "HOME HERO
// IN DARK MODE"); the navbar over it follows.
// The text below is the page's main content: it shows from the start, and
// only makes way for the last scene once the visitor has scrolled to it.
export default function Hero() {
  return (
    <ScrollHero>
      <div className="space-y-7 text-brand-deep animate-rise-in">
        <div className="glass-card inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 animate-pulse" />
          Clinic software made for Pakistan
        </div>

        <div className="space-y-6">
          {/* two lines from a small tablet up; a phone may wrap the second */}
          <h1
            id="hero-title"
            className="hero-title font-display text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.025em]"
          >
            <span className="block sm:whitespace-nowrap">Smarter Clinics,</span>{" "}
            <span className="hero-accent-text block sm:whitespace-nowrap">Healthier Patients</span>
          </h1>

          <p className="text-brand-deep/75 text-base lg:text-[17px] leading-[1.6] max-w-[520px] text-pretty">
            The walk-in queue, patient records and prescriptions with Urdu
            instructions, in one simple app for your doctors and receptionists.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:gap-4">
          <BookDemoButton className="btn-premium group inline-flex w-full items-center justify-center gap-2.5 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-glow-primary hover:bg-primary-hover text-[15px] sm:w-auto">
            Book a free demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </BookDemoButton>
          <Link
            href="#how-it-works"
            className="btn-premium inline-flex w-full items-center justify-center gap-2.5 bg-transparent text-brand-deep font-semibold px-8 py-4 rounded-xl border border-brand-deep/25 text-[15px] hover:bg-brand-deep/[0.05] hover:border-brand-deep/40 sm:w-auto"
          >
            See how it works
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {TRUST_BADGES.map((badge) => (
            <div key={badge} className="flex items-center gap-2.5 text-brand-deep/75 text-[14px]">
              <CheckCircle className="w-[18px] h-[18px] text-secondary flex-shrink-0" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </ScrollHero>
  );
}
