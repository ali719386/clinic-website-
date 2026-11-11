// The products page (2026-10-27), in the glass mint-teal style of the home
// page's sections. A server component: everything is visible without
// JavaScript. The size picker (components/marketing/product-picker.tsx) is
// the only client part; the cards and the table come from one list
// (components/marketing/products-data.ts). Prices stay on /pricing.
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, Phone } from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { LazySection } from "@/components/marketing/lazy-section";
import { Spotlight } from "@/components/marketing/spotlight";
import { BookDemoButton } from "@/components/marketing/demo-dialog";
import { ProductPicker, SizeSelector } from "@/components/marketing/product-picker";
import { FEATURES, PRODUCTS, type Product } from "@/components/marketing/products-data";

export const metadata: Metadata = {
  title: { absolute: "Products | Clinics by Prob N Tech" },
  description:
    "Doctor, clinic and enterprise clinic management systems for Pakistani clinics, sized by the number of doctors and receptionists.",
};

const BTN = "btn-premium inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold";
const BTN_PRIMARY = `${BTN} bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary-hover`;
const BTN_OUTLINE = `${BTN} border border-primary/25 text-primary hover:border-primary/50 hover:bg-primary/5`;

/** the table's rows: the capacity rows, the features, then pricing */
const ROWS: { label: string; cell: (p: Product) => ReactNode }[] = [
  { label: "Doctors", cell: (p) => p.doctors },
  { label: "Receptionists", cell: (p) => p.receptionists },
  ...FEATURES.map((f) => ({
    label: f.label,
    cell: (p: Product) =>
      p.features[f.key] ? (
        <Check role="img" aria-label="Included" className="mx-auto size-5 text-success" strokeWidth={2.5} />
      ) : (
        <>
          <span aria-hidden className="spec-subtext">
            -
          </span>
          <span className="sr-only">Not included</span>
        </>
      ),
  })),
  {
    label: "Pricing",
    cell: (p) =>
      p.pricing === "page" ? (
        <Link href="/pricing" className="inline-flex min-h-8 items-center font-medium text-primary underline-offset-4 hover:underline">
          See Pricing
        </Link>
      ) : (
        "Custom quote"
      ),
  },
];

function Pill({ children }: { children: ReactNode }) {
  return (
    <p
      data-card
      className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-foreground backdrop-blur-md"
    >
      <span className="size-2 rounded-full bg-primary" />
      {children}
    </p>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const Icon = p.icon;
  return (
    <div data-card className="flex">
      <article data-spot data-product={p.id} className="prod-card glass-tile spot relative flex w-full flex-col p-7 lg:p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="icon-tile prod-icon" aria-hidden>
            <Icon className="size-[22px]" />
          </span>
          <span className="teal-chip prod-chip" aria-hidden>
            Best fit
          </span>
        </div>
        <p className="mt-6 text-[13px] font-semibold tracking-[0.06em] text-primary">{p.abbr}</p>
        <h3 className="how-ink mt-2 font-display text-[24px] font-medium leading-tight text-balance">{p.name}</h3>
        <p className="spec-subtext mt-3 text-[15px] leading-[1.7] text-pretty">{p.description}</p>
        <dl className="prod-cap mt-6">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="spec-subtext text-[14px]">Doctors</dt>
            <dd className="how-ink text-[15px] font-medium">{p.doctors}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="spec-subtext text-[14px]">Receptionists</dt>
            <dd className="how-ink text-[15px] font-medium">{p.receptionists}</dd>
          </div>
        </dl>
        <div className="mt-auto pt-7">
          {p.cta === "quote" ? (
            <Link href="/contact" className={BTN_OUTLINE}>
              Request a quote
            </Link>
          ) : (
            <BookDemoButton className={p.primary ? BTN_PRIMARY : BTN_OUTLINE}>Book a free demo</BookDemoButton>
          )}
        </div>
      </article>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="products-calm">
      <Navbar />
      <main>
        <ProductPicker>
          <LazySection estimate={1300} rise={26} duration={1} stagger={0.1}>
            <section
              id="products"
              aria-labelledby="products-title"
              className="prod-sec relative pt-[142px] min-[621px]:pt-[182px]"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <Pill>Products</Pill>
                  <h1
                    id="products-title"
                    data-card
                    className="how-ink mt-6 font-display text-[clamp(2.3rem,5.4vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance"
                  >
                    One app, sized for
                    <br />
                    <span className="font-light text-primary">your clinic</span>
                  </h1>
                  <p data-card className="spec-subtext mx-auto mt-6 max-w-[580px] text-base leading-relaxed text-pretty lg:text-lg">
                    From a single doctor to a large group practice: pick the product that fits how many doctors and
                    receptionists you have.
                  </p>
                </div>

                <div data-card className="mx-auto mt-12 max-w-[760px]">
                  <SizeSelector />
                </div>

                {/* 3 columns from 1024px, one under another below; every card the same height */}
                <Spotlight className="mt-16 grid gap-6 lg:grid-cols-3">
                  {PRODUCTS.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </Spotlight>
              </div>
            </section>
          </LazySection>

          <LazySection estimate={860} rise={26} duration={1} stagger={0.1}>
            <section id="compare" aria-labelledby="compare-title" className="prod-sec relative pt-[90px] min-[621px]:pt-[130px]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <Pill>Compare</Pill>
                  <h2
                    id="compare-title"
                    data-card
                    className="how-ink mt-6 font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.035em]"
                  >
                    Side by side
                  </h2>
                </div>

                <div data-card className="glass-tile glass-static mx-auto mt-12 max-w-[1000px]">
                  {/* scrolls sideways on phones, the first column staying put */}
                  <div className="prod-scroll" role="region" aria-labelledby="compare-title" tabIndex={0}>
                    <table className="prod-table w-full min-w-[640px] text-[15px]">
                      <thead>
                        <tr>
                          <td className="prod-sticky" />
                          {PRODUCTS.map((p) => (
                            <th key={p.id} scope="col" data-col={p.id}>
                              <span className="block font-semibold tracking-[0.06em] text-primary">{p.abbr}</span>
                              <span className="spec-subtext block text-[12px] font-normal">{p.short}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ROWS.map((row) => (
                          <tr key={row.label}>
                            <th scope="row" className="prod-sticky how-ink font-medium">
                              {row.label}
                            </th>
                            {PRODUCTS.map((p) => (
                              <td key={p.id} data-col={p.id} className="how-ink">
                                {row.cell(p)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </LazySection>
        </ProductPicker>

        <LazySection estimate={640} rise={26} duration={1} stagger={0.1}>
          <section id="choose" aria-labelledby="choose-title" className="prod-sec relative py-[90px] min-[621px]:py-[130px]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div data-card className="glass-tile glass-static mx-auto max-w-[1100px] px-6 py-14 text-center sm:px-12 lg:py-20">
                <Pill>Not sure which one?</Pill>
                <h2
                  id="choose-title"
                  data-card
                  className="how-ink mt-6 font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.035em]"
                >
                  We&rsquo;ll help you choose
                </h2>
                <p data-card className="spec-subtext mx-auto mt-6 max-w-[580px] text-base leading-relaxed text-pretty lg:text-lg">
                  Book a free demo and we&rsquo;ll show you the queue, prescriptions and printing, then set up the
                  product that fits your clinic.
                </p>
                <div data-card className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                  <BookDemoButton className="btn-premium group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-4 text-[16px] font-semibold text-primary-foreground shadow-glow-primary hover:bg-primary-hover sm:w-auto">
                    Book a free demo
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                  </BookDemoButton>
                  <a
                    href="tel:+923071118812"
                    className="btn-premium inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-brand-deep/20 bg-transparent px-10 py-4 text-[16px] font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 sm:w-auto dark:border-border"
                  >
                    <Phone className="size-5 text-primary" />
                    Call us
                  </a>
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
