// The FAQ page (2026-10-27), in the glass mint-teal style of the home page.
// The answers are the owner's (components/marketing/faq-data.ts); search,
// topics and the accordion are the only client parts
// (components/marketing/faq-browser.tsx). The home page keeps its own short
// FAQ section. Each section is revealed once by the home page's lazy wrapper.
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { LazySection } from "@/components/marketing/lazy-section";
import { SectionHeader } from "@/components/marketing/section-header";
import { Urdu } from "@/components/urdu";
import { FaqContent, FaqProvider, FaqSearch } from "@/components/marketing/faq-browser";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about plans, prescriptions and your clinic’s day with Clinics.",
};

export default function FaqPage() {
  return (
    <div>
      <Navbar />
      <main>
        <FaqProvider>
          {/* Hero */}
          <LazySection estimate={640} rise={16} duration={0.9} stagger={0.09}>
            <section aria-labelledby="faq-title" className="sec-calm relative overflow-clip pt-[142px] pb-[50px] min-[621px]:pt-[182px] min-[621px]:pb-[70px]">
              <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <p
                  data-card
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground backdrop-blur-md"
                >
                  <span className="size-2 rounded-full bg-primary" />
                  Frequently asked questions
                </p>
                <h1
                  id="faq-title"
                  data-card
                  className="how-ink mt-6 font-display text-[clamp(2.3rem,5.4vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance"
                >
                  A little clarity.
                  <br />
                  <span className="font-light text-primary">Before you get started.</span>
                </h1>
                <p data-card className="spec-subtext mx-auto mt-6 max-w-[580px] text-base leading-relaxed text-pretty lg:text-lg">
                  Find answers about plans, prescriptions and your clinic&rsquo;s day. We&rsquo;re here to help with the
                  next step.
                </p>
                <div data-card className="mt-9">
                  <FaqSearch />
                </div>
              </div>
            </section>
          </LazySection>

          {/* Topics and answers (short stagger: the rows follow quickly) */}
          <LazySection estimate={1400} rise={16} duration={0.8} stagger={0.05}>
            <section aria-label="Questions and answers" className="sec-calm relative overflow-clip pt-[30px] pb-[80px] min-[621px]:pb-[110px]">
              <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <FaqContent
                  sidebarExtra={
                    <div className="glass-tile glass-static p-6">
                      <Urdu as="p" className="faqp-urdu text-[22px]">
                        آپ کے سوال، آسان جواب
                      </Urdu>
                      <p className="spec-subtext mt-2 text-[14px] leading-[1.6]">
                        A clear starting point
                        <br />
                        for your clinic&rsquo;s next chapter.
                      </p>
                    </div>
                  }
                />
              </div>
            </section>
          </LazySection>
        </FaqProvider>

        {/* Contact */}
        <LazySection estimate={640} rise={16} duration={0.9} stagger={0.09}>
          <section className="sec-calm relative overflow-clip pb-[80px] min-[621px]:pb-[130px]">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div data-card className="glass-tile glass-static mx-auto max-w-[1100px] px-6 py-14 sm:px-12 lg:py-20">
                <SectionHeader
                  pill="Let’s talk"
                  line1="Still have a question?"
                  line2="Let’s make it clear."
                  sub="Tell us what you need to know about your clinic’s setup."
                />
                <div data-card className="mt-10 flex justify-center">
                  <Link
                    href="/contact"
                    className="btn-premium group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-4 text-[16px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover sm:w-auto"
                  >
                    Contact our team
                    <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
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
