import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/components/marketing/brand";

// UI audit (2026-10-23): the footer no longer repeats a "Ready to get
// started?" call to action. Every page already ends with one (the CTA band on
// the home and pricing pages, the form on the contact page).
// 2026-10-24: a light mint-white footer (dark in dark mode) in the glass
// style of the home page, with teal links that underline on hover.
const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Specialties", href: "/#specialties" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Products", href: "/products" },
    { label: "Pricing", href: "/pricing" },
  ],
  "Get started": [
    { label: "Book a free demo", href: "/contact" },
    { label: "Sign in", href: "/login" },
  ],
};

const CONTACT = [
  { icon: Phone, text: "+92 307 1118812", href: "tel:+923071118812" },
  { icon: Mail, text: "alihasnain719386@gmail.com", href: "mailto:alihasnain719386@gmail.com" },
  { icon: MapPin, text: "Faisalabad, Pakistan", href: null },
];

export default function Footer() {
  return (
    <footer className="footer-calm relative">
      {/* a teal hairline on top */}
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 min-[700px]:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-12">
          {/* Brand column */}
          <div className="min-[700px]:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-6 inline-flex items-center" aria-label="Clinics, home">
              <Logo size="md" tone="default" />
            </Link>

            <p className="spec-subtext mb-7 max-w-xs text-[14px] leading-[1.7] text-pretty">
              The patient queue, records and prescriptions for Pakistani clinics,
              in one simple app for doctors and receptionists.
            </p>

            <ul className="space-y-1">
              {CONTACT.map(({ icon: Icon, text, href }) => {
                const inner = (
                  <>
                    <span className="icon-tile size-8 rounded-lg">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className={href ? "foot-link" : undefined}>{text}</span>
                  </>
                );
                return (
                  <li key={text}>
                    {href ? (
                      <a href={href} className="foot-item group inline-flex min-h-10 items-center gap-3 text-[13px]">
                        {inner}
                      </a>
                    ) : (
                      <span className="foot-item inline-flex min-h-10 items-center gap-3 text-[13px]">{inner}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="how-ink mb-4 font-display text-[13px] font-semibold">{category}</h4>
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="foot-item group inline-flex min-h-8 items-center text-[14px]">
                      <span className="foot-link">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar (room at the bottom on phones for the WhatsApp button) */}
      <div className="border-t border-primary/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 pt-7 pb-24 sm:flex-row sm:px-6 md:pb-7 lg:px-8">
          <p className="spec-subtext text-[12px]">
            &copy; {new Date().getFullYear()} {BRAND}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
