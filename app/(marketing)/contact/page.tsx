// The contact page (2026-10-27 redesign, in the glass mint-teal style of the
// home page). A server component; the form is the shared demo form in its
// contact variant (components/marketing/demo-form.tsx), sending to the same
// action as the home page and the pop-up. Contact details come from one
// place (CONTACT_INFO in components/marketing/brand.ts). Each section is
// revealed once by the home page's lazy wrapper.
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Mail, MapPin, MessageCircle } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { LazySection } from "@/components/marketing/lazy-section";
import { SectionHeader } from "@/components/marketing/section-header";
import { DemoForm } from "@/components/marketing/demo-form";
import { CONTACT_INFO } from "@/components/marketing/brand";
import { Urdu } from "@/components/urdu";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book a free demo of Clinics by Prob N Tech, or reach the team on WhatsApp or at ${CONTACT_INFO.email}.`,
};

const TICKS = ["30-day free trial", "We set up your clinic for you", "WhatsApp support"];

// only the confirmed details (no street address is published)
const REACH = [
  { icon: MessageCircle, label: "WhatsApp", text: CONTACT_INFO.whatsappDisplay, href: CONTACT_INFO.whatsappUrl, external: true },
  { icon: Mail, label: "Email", text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, external: false },
  { icon: MapPin, label: "Office", text: CONTACT_INFO.city, href: null, external: false },
];

const STEPS = [
  { n: "01", title: "Tell us about your team", text: "Share how many doctors and receptionists you have and how your day runs." },
  { n: "02", title: "Book your free demo", text: "We discuss your clinic’s needs and which plan fits your practice." },
  { n: "03", title: "We set up your clinic", text: "Start your 30-day free trial with your clinic already set up for you." },
];

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <main>
        {/* Hero */}
        <LazySection estimate={520} rise={16} duration={0.9} stagger={0.09}>
          <section aria-labelledby="contact-title" className="sec-calm relative overflow-clip pt-[142px] pb-[40px] min-[621px]:pt-[182px] min-[621px]:pb-[60px]">
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <p
                data-card
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground backdrop-blur-md"
              >
                <span className="size-2 rounded-full bg-primary" />
                Contact
              </p>
              <h1
                id="contact-title"
                data-card
                className="how-ink mt-6 font-display text-[clamp(2.3rem,5.4vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance"
              >
                Let&rsquo;s talk about
                <br />
                <span className="font-light text-primary">your clinic.</span>
              </h1>
              <p data-card className="spec-subtext mx-auto mt-6 max-w-[580px] text-base leading-relaxed text-pretty lg:text-lg">
                Tell us about your team and the way your clinic works. We&rsquo;ll help you with the next step.
              </p>
            </div>
          </section>
        </LazySection>

        {/* Info and form: the form first on phones and tablets */}
        <LazySection estimate={1100} rise={16} duration={0.8} stagger={0.09}>
          <section aria-label="Book a demo or reach the team" className="sec-calm relative overflow-clip pt-[30px] pb-[80px] min-[621px]:pb-[110px]">
            <div className="relative mx-auto grid max-w-[1180px] gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
              <div className="flex flex-col gap-6 lg:col-span-5">
                {/* Book a free demo */}
                <article data-card className="glass-tile relative p-7">
                  <h2 className="how-ink font-display text-[22px] font-medium">Book a free demo</h2>
                  <p className="spec-subtext mt-3 text-[15px] leading-[1.7] text-pretty">
                    Clinics offers a 30-day free trial. We set up your clinic for you.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {TICKS.map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                        <span aria-hidden className="contact-tick">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span className="how-ink">{t}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                {/* Reach the team */}
                <article data-card className="glass-tile relative p-7">
                  <h2 className="how-ink font-display text-[22px] font-medium">Reach the team</h2>
                  <ul className="mt-4">
                    {REACH.map(({ icon: Icon, label, text, href, external }) => (
                      <li key={label} className="contact-row flex items-center gap-4 py-3">
                        <span className="icon-tile contact-icon" aria-hidden>
                          <Icon className="size-[18px]" />
                        </span>
                        <div className="min-w-0">
                          <p className="spec-subtext text-[13px]">{label}</p>
                          {href ? (
                            <a
                              href={href}
                              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="contact-link how-ink inline-flex min-h-[28px] items-center break-all text-[15px] font-medium"
                            >
                              {text}
                            </a>
                          ) : (
                            <p className="how-ink text-[15px] font-medium">{text}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>

                {/* Urdu chip and the FAQ */}
                <article data-card className="glass-tile relative flex flex-wrap items-center justify-between gap-4 p-6">
                  <Urdu className="contact-urdu text-[19px]">آپ کے سوال، آسان جواب</Urdu>
                  <Link href="/faq" className="contact-link group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary">
                    Read the FAQ
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </div>

              {/* The form */}
              <div data-card className="order-first lg:order-none lg:col-span-7">
                <div className="glass-tile glass-static p-6 sm:p-9">
                  <h2 className="how-ink font-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em]">
                    Tell us about your clinic
                    <br />
                    <span className="font-light text-primary">We&rsquo;ll take it from there.</span>
                  </h2>
                  <div className="mt-7">
                    <DemoForm idPrefix="demo-contact" glass variant="contact" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </LazySection>

        {/* What to expect */}
        <LazySection estimate={720} rise={16} duration={0.9} stagger={0.09}>
          <section className="sec-calm relative overflow-clip pb-[80px] min-[621px]:pb-[130px]">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader pill="What to expect" line1="A simple start." line2="Built around your clinic." />
              <ol className="mx-auto mt-14 grid max-w-[1100px] gap-6 lg:grid-cols-3">
                {STEPS.map((s) => (
                  <li key={s.n} data-card className="flex">
                    <article className="glass-tile relative w-full p-7">
                      <span className="icon-tile font-display text-[17px] font-semibold" aria-hidden>
                        {s.n}
                      </span>
                      <h3 className="how-ink mt-5 font-display text-[20px] font-medium">
                        <span className="sr-only">Step {s.n}: </span>
                        {s.title}
                      </h3>
                      <p className="spec-subtext mt-3 text-[15px] leading-[1.7] text-pretty">{s.text}</p>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </LazySection>
      </main>
      <LazySection estimate={420} rise={16} duration={0.8} stagger={0.08}>
        <Footer />
      </LazySection>
    </div>
  );
}
