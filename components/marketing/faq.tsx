// The FAQ (Part 1, 2026-10-22). Every answer states only what the product and
// the owner's pricing actually offer. One component for the home page and the
// pricing page (UI audit, 2026-10-23): the pricing page keeps the classic look
// (native <details>), the home page the glass accordion (variant="glass",
// 2026-10-24).
import { ChevronDown } from "lucide-react"
import { PLANS, YEARLY_MONTHS } from "@/lib/billing"
import { SectionHeader } from "@/components/marketing/section-header"
import { FaqAccordion } from "@/components/marketing/faq-accordion"

const pkr = (n: number | null) => (n ?? 0).toLocaleString("en-PK")

/** qUr / aUr: the Urdu, shown as on /faq (the glass accordion only) */
export type FaqItem = { q: string; a: string; qUr?: string; aUr?: string }

// the phone number kept left to right inside Urdu (a Unicode isolate)
const PHONE_LTR = "\u2066+92 307 1118812\u2069"

// The Urdu (2026-10-27) is our translation of the English, for the owner to review.
export const HOME_FAQS: FaqItem[] = [
  // prices from lib/billing.ts, shared with the admin panel (Release B)
  {
    q: "How much does it cost?",
    a: `PKR ${pkr(PLANS.starter.monthly)} a month for ${PLANS.starter.maxDoctors} doctor and ${PLANS.starter.maxReceptionists} receptionist, or PKR ${pkr(PLANS.clinic.monthly)} a month for up to ${PLANS.clinic.maxDoctors} doctors. Larger clinics: contact us for a price.`,
    qUr: "اس کی قیمت کتنی ہے؟",
    aUr: `${PLANS.starter.maxDoctors} ڈاکٹر اور ${PLANS.starter.maxReceptionists} ریسیپشنسٹ کے لیے PKR ${pkr(PLANS.starter.monthly)} ماہانہ، یا زیادہ سے زیادہ ${PLANS.clinic.maxDoctors} ڈاکٹرز کے لیے PKR ${pkr(PLANS.clinic.monthly)} ماہانہ۔ بڑے کلینکس قیمت کے لیے ہم سے رابطہ کریں۔`,
  },
  {
    q: "Is there a free trial?",
    a: "Yes, 30 days, with no payment needed. We set up your clinic for you.",
    qUr: "کیا مفت ٹرائل موجود ہے؟",
    aUr: "جی ہاں، 30 دن کا، بغیر کسی ادائیگی کے۔ ہم آپ کا کلینک آپ کے لیے سیٹ اپ کرتے ہیں۔",
  },
  {
    q: "Is there a discount for paying yearly?",
    a: `Yes. Pay for a year and get ${12 - YEARLY_MONTHS} months free.`,
    qUr: "کیا سالانہ ادائیگی پر رعایت ہے؟",
    aUr: `جی ہاں۔ پورے سال کی ادائیگی کریں اور ${12 - YEARLY_MONTHS} مہینے مفت پائیں۔`,
  },
  {
    q: "Is my patients' data safe?",
    a: "Each clinic's records are kept separate from every other clinic's, every connection is encrypted (HTTPS), staff see only what their role allows, and the database is backed up every night.",
    qUr: "کیا میرے مریضوں کا ڈیٹا محفوظ ہے؟",
    aUr: "ہر کلینک کا ریکارڈ باقی تمام کلینکس سے الگ رکھا جاتا ہے، ہر کنکشن انکرپٹڈ (HTTPS) ہوتا ہے، اسٹاف صرف وہی دیکھ سکتا ہے جس کی اس کے رول میں اجازت ہو، اور ڈیٹا بیس کا ہر رات بیک اپ لیا جاتا ہے۔",
  },
  {
    q: "What do I need?",
    a: "A computer, tablet or phone with a browser and internet. There is nothing to install.",
    qUr: "مجھے کیا چاہیے؟",
    aUr: "براؤزر اور انٹرنیٹ کے ساتھ ایک کمپیوٹر، ٹیبلٹ یا فون۔ کچھ بھی انسٹال کرنے کی ضرورت نہیں۔",
  },
  {
    q: "Can I print prescriptions?",
    a: "Yes, on any printer, in one of six designs, with your clinic's details.",
    qUr: "کیا میں نسخے پرنٹ کر سکتا ہوں؟",
    aUr: "جی ہاں، کسی بھی پرنٹر پر، چھ میں سے کسی ایک ڈیزائن میں، آپ کے کلینک کی تفصیلات کے ساتھ۔",
  },
  {
    q: "Are the instructions in Urdu?",
    a: "Yes. The dose, timing and duration are written in Urdu for the patient.",
    qUr: "کیا ہدایات اردو میں ہیں؟",
    aUr: "جی ہاں۔ خوراک، وقت اور دورانیہ مریض کے لیے اردو میں لکھے جاتے ہیں۔",
  },
  {
    q: "How do I start?",
    a: "Book a free demo, or message us on WhatsApp at +92 307 1118812.",
    qUr: "میں کیسے شروع کروں؟",
    aUr: `مفت ڈیمو بُک کریں، یا ہمیں WhatsApp پر ${PHONE_LTR} پر پیغام بھیجیں۔`,
  },
]

export default function Faq({
  items = HOME_FAQS,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
  intro,
  id = "faq",
  className = "bg-background",
  variant = "classic",
}: {
  variant?: "classic" | "glass"
  items?: FaqItem[]
  title?: React.ReactNode
  eyebrow?: string
  intro?: React.ReactNode
  id?: string
  className?: string
}) {
  if (variant === "glass") {
    return (
      <section id={id} className="sec-calm relative overflow-clip py-[80px] min-[621px]:py-[130px]">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader pill={eyebrow} line1="Frequently" line2="asked questions" sub={intro} />
          <FaqAccordion items={items} />
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`relative py-20 lg:py-28 ${className}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-success text-[13px] font-semibold uppercase tracking-[0.15em] mb-4">{eyebrow}</p>
          <h2 className="font-display text-[2rem] lg:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.1] text-balance">
            {title}
          </h2>
          {intro && <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto text-pretty">{intro}</p>}
        </div>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-premium">
          {items.map(({ q, a }) => (
            <details key={q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                {q}
                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
