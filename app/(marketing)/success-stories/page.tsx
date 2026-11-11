// The success stories page (2026-10-27), in the glass mint-teal style of the
// home page. Until clinics agree to be featured, every story is an
// illustrative sample, and the page says so (components/marketing/stories-data.ts).
// A server component: everything is visible without JavaScript; the filter,
// search and story dialog are the only client parts
// (components/marketing/story-browser.tsx). Each section is revealed once by
// the home page's lazy wrapper.
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { LazySection } from "@/components/marketing/lazy-section";
import { SectionHeader } from "@/components/marketing/section-header";
import { BookDemoButton } from "@/components/marketing/demo-dialog";
import { StoryBrowser, StoryButton, StoryDialogProvider } from "@/components/marketing/story-browser";
import { QueueMockup } from "@/components/marketing/story-mockups";
import { FEATURED } from "@/components/marketing/stories-data";

export const metadata: Metadata = {
  title: "Success stories",
  description:
    "Illustrative sample stories of how Pakistani clinics of different sizes could organise their day. Not customer results.",
};

const STEPS = [
  {
    n: "01",
    title: "The everyday challenge",
    text: "Start with the team, its routine and the problem it wanted to solve.",
  },
  {
    n: "02",
    title: "The practical change",
    text: "Show the workflow and the parts of the clinic’s day it supports.",
  },
  {
    n: "03",
    title: "The verified outcome",
    text: "Publish real results only when the clinic has confirmed the evidence.",
  },
];

const REVEAL = { rise: 20, duration: 0.9, stagger: 0.09 };

export default function SuccessStoriesPage() {
  return (
    <div>
      <Navbar />
      <StoryDialogProvider>
        <main>
          {/* Hero */}
          <LazySection estimate={620} {...REVEAL}>
            <section aria-labelledby="stories-title" className="sec-calm relative overflow-clip pt-[142px] pb-[60px] min-[621px]:pt-[182px] min-[621px]:pb-[90px]">
              <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <p
                  data-card
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground backdrop-blur-md"
                >
                  <span className="size-2 rounded-full bg-primary" />
                  The people behind the practice
                </p>
                <h1
                  id="stories-title"
                  data-card
                  className="how-ink mt-6 font-display text-[clamp(2.3rem,5.4vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance"
                >
                  Every clinic has a story.
                  <br />
                  <span className="font-light text-primary">Here&rsquo;s where we share it.</span>
                </h1>
                <p data-card className="spec-subtext mx-auto mt-6 max-w-[580px] text-base leading-relaxed text-pretty lg:text-lg">
                  Behind every appointment is a team making care happen. Explore what a more connected clinic day could
                  look like.
                </p>
                <p data-card className="mx-auto mt-8 flex max-w-[580px] flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
                  <span className="teal-chip">Design preview</span>
                  <span className="spec-subtext text-[14px]">All stories below are illustrative samples, not customer results.</span>
                </p>
              </div>
            </section>
          </LazySection>

          {/* Featured sample story */}
          <LazySection estimate={720} {...REVEAL}>
            <section aria-labelledby="featured-title" className="sec-calm relative overflow-clip py-[40px] min-[621px]:py-[60px]">
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div data-card className="glass-tile glass-static mx-auto grid max-w-[1100px] items-center gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold tracking-[0.06em] text-primary">Featured story</span>
                      <span className="teal-chip">Sample</span>
                    </div>
                    <h2
                      id="featured-title"
                      className="how-ink mt-5 font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.035em] text-balance"
                    >
                      A busy reception.
                      <br />
                      <span className="font-light text-primary">A clearer path from arrival to care.</span>
                    </h2>
                    <p className="spec-subtext mt-5 max-w-[480px] text-base leading-relaxed text-pretty">{FEATURED.summary}</p>
                    <dl className="story-practice mt-7 py-4">
                      <dt className="how-ink text-[15px] font-medium">Sample single-doctor practice</dt>
                      <dd className="spec-subtext mt-1 text-[14px]">DMS · 1 doctor · 1 receptionist</dd>
                    </dl>
                    <StoryButton
                      id={FEATURED.id}
                      className="btn-premium group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-[15px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover sm:w-auto"
                    >
                      Explore the sample story
                      <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
                    </StoryButton>
                  </div>
                  <QueueMockup />
                </div>
              </div>
            </section>
          </LazySection>

          {/* Story collection */}
          <LazySection estimate={1150} {...REVEAL}>
            <section id="stories" className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  pill="Sample stories"
                  line1="Different practices."
                  line2="A shared focus on care."
                  sub="Explore sample stories by the size of the team."
                />
                <StoryBrowser />
              </div>
            </section>
          </LazySection>

          {/* Story approach */}
          <LazySection estimate={760} {...REVEAL}>
            <section className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  pill="Our approach"
                  line1="Context first."
                  line2="Evidence always."
                  sub="A useful clinic story should explain what changed, why it mattered, and how it was measured."
                />
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

          {/* Final call to action */}
          <LazySection estimate={640} {...REVEAL}>
            <section className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div data-card className="glass-tile glass-static mx-auto max-w-[1100px] px-6 py-14 sm:px-12 lg:py-20">
                  <SectionHeader
                    pill="Your clinic, your workflow"
                    line1={<>Let&rsquo;s talk about</>}
                    line2="your everyday challenges."
                    sub="Start with your team and the way your clinic works."
                  />
                  <div data-card className="mt-10 flex justify-center">
                    <BookDemoButton className="btn-premium group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-4 text-[16px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover sm:w-auto">
                      Book a free demo
                      <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
                    </BookDemoButton>
                  </div>
                </div>
              </div>
            </section>
          </LazySection>
        </main>
      </StoryDialogProvider>
      <LazySection estimate={420} rise={16} duration={0.8} stagger={0.08}>
        <Footer />
      </LazySection>
    </div>
  );
}
