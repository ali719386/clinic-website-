// The closing panel (2026-10-24, in the glass mint-teal style of the sections
// above; a server component, visible without JavaScript). On the home page it
// comes just before the demo form, so its button scrolls to that form instead
// of opening the same form again in a pop-up.
import { ArrowRight, KeyRound, MessageCircle, Phone, Wrench } from "lucide-react";
import { BRAND } from "@/components/marketing/brand";
import { SectionHeader } from "@/components/marketing/section-header";

// What a clinic gets on day one (2026-10-22: replaces placeholder testimonials;
// add real quotes here once clinics agree to be quoted).
const PROMISES = [
  {
    icon: Wrench,
    title: "Set up for you",
    text: "We create your clinic, your staff's usernames and your prescription design, then show your team around.",
  },
  {
    icon: KeyRound,
    title: "Your own clinic link",
    text: "Your staff sign in at your clinic's own link with a username and password. No email addresses needed.",
  },
  {
    icon: MessageCircle,
    title: "Help on WhatsApp",
    text: "Stuck on something? Message us on WhatsApp at +92\u00a0307\u00a01118812 and we'll help.",
  },
];

export default function ClinicCTA() {
  return (
    <section id="for-clinics" className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-card className="glass-tile cta-panel relative mx-auto max-w-[1100px] px-6 py-14 sm:px-12 lg:py-20">
          <SectionHeader
            pill="For Clinics"
            line1="Ready to Modernise"
            line2="Your Clinic?"
            sub={<>See how {BRAND} would run your queue, your records and your prescriptions. The demo is free and takes 30 minutes.</>}
          />
          <div data-card className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <a
              href="#book-demo"
              className="btn-premium group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-4 text-[16px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover sm:w-auto"
            >
              Book a free demo
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="tel:+923071118812"
              className="btn-premium inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-brand-deep/20 bg-transparent px-10 py-4 text-[16px] font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 sm:w-auto dark:border-border"
            >
              <Phone className="size-5 text-primary" />
              Call us
            </a>
          </div>
        </div>

        {/* What a clinic gets */}
        <ul className="mx-auto mt-8 grid max-w-[1100px] gap-6 min-[1024px]:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} data-card className="glass-tile relative p-7">
              <span className="icon-tile" aria-hidden>
                <Icon className="size-5" />
              </span>
              <p className="how-ink mt-5 text-[17px] font-medium">{title}</p>
              <p className="spec-subtext mt-2 text-[15px] leading-[1.7]">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
