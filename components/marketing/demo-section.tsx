import { DemoForm } from "./demo-form";
import { SectionHeader } from "@/components/marketing/section-header";

/** The home page's "book a demo" section (Part 1, 2026-10-22; glass style 2026-10-24). */
export default function DemoSection() {
  return (
    <section id="book-demo" className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          pill="Get started"
          line1="Book your free demo"
          sub={
            <>
              Leave your name and an email or phone number. We&apos;ll show you the queue, prescriptions and printing,
              and set up your clinic for a free {"30\u2011day"} trial.
            </>
          }
        />
        <div data-card className="glass-tile glass-static relative mx-auto mt-12 max-w-[640px] p-6 sm:p-9">
          <DemoForm idPrefix="demo-home" glass />
        </div>
      </div>
    </section>
  );
}
