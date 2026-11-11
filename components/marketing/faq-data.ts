// The questions on /faq (2026-10-27), as the owner supplied them: each
// question and answer in English and Urdu (the Urdu questions are our
// translation, for the owner to review). Prices, the annual offer and the
// Clinic plan's doctors come from lib/billing.ts (through the pricing page's
// plans), in both languages, so the FAQ always matches /pricing.
import { CreditCard, LayoutGrid, LifeBuoy, Rocket, Stethoscope, Users, type LucideIcon } from "lucide-react";
import { PLANS as BILLING } from "@/lib/billing";
import { FREE_MONTHS, PLANS, YEARLY_MONTHS, pkr, planPrice } from "@/components/marketing/pricing-plans";

export type TopicId = "start" | "billing" | "daily" | "teams" | "support";

export const TOPICS: { id: TopicId | "all"; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All questions", icon: LayoutGrid },
  { id: "start", label: "Getting started", icon: Rocket },
  { id: "billing", label: "Plans & billing", icon: CreditCard },
  { id: "daily", label: "Daily clinic work", icon: Stethoscope },
  { id: "teams", label: "Teams & locations", icon: Users },
  { id: "support", label: "Support", icon: LifeBuoy },
];

export interface FaqEntry {
  /** stable: the panel ids and the number shown ("01") come from it */
  id: string;
  category: TopicId;
  question: { en: string; ur: string };
  answer: { en: string; ur: string };
  link?: { href: string; labelEn: string; labelUr: string };
}

const plan = (id: string) => PLANS.find((p) => p.id === id)!;
const monthly = (id: string) => pkr(plan(id).monthly!);
const yearly = (id: string) => pkr(planPrice(plan(id), "annually")!);
const clinicDoctors = BILLING.clinic.maxDoctors;

const DEMO = { href: "/contact", labelEn: "Book a free demo", labelUr: "مفت ڈیمو بُک کریں" };
const CONTACT = { href: "/contact", labelEn: "Contact our team", labelUr: "ہماری ٹیم سے رابطہ کریں" };
const PRICING = { href: "/pricing", labelEn: "Explore pricing", labelUr: "قیمتیں دیکھیں" };

export const FAQS: FaqEntry[] = [
  {
    id: "01",
    category: "start",
    question: {
      en: "Can I try Clinics before choosing a plan?",
      ur: "کیا میں پلان منتخب کرنے سے پہلے Clinics آزما سکتا ہوں؟",
    },
    answer: {
      en: "Yes. Clinics offers a 30-day free trial. Book a free demo to discuss your clinic’s needs and how to get started.",
      ur: "جی ہاں۔ Clinics 30 دن کا مفت ٹرائل فراہم کرتا ہے۔ اپنے کلینک کی ضروریات اور شروع کرنے کے طریقے پر بات کرنے کے لیے مفت ڈیمو بُک کریں۔",
    },
    link: DEMO,
  },
  {
    id: "02",
    category: "start",
    question: {
      en: "Will you help set up my clinic?",
      ur: "کیا آپ میرا کلینک سیٹ اپ کرنے میں مدد کریں گے؟",
    },
    answer: {
      en: "Yes. We set up your clinic for you. On-site training is included in the Enterprise plan. Contact the team to discuss the setup your clinic needs.",
      ur: "جی ہاں۔ ہم آپ کا کلینک آپ کے لیے سیٹ اپ کرتے ہیں۔ Enterprise پلان میں آن سائٹ ٹریننگ شامل ہے۔ آپ کے کلینک کو جس سیٹ اپ کی ضرورت ہے، اس پر بات کرنے کے لیے ہماری ٹیم سے رابطہ کریں۔",
    },
    link: CONTACT,
  },
  {
    id: "03",
    category: "billing",
    question: {
      en: "Which plan is right for my team?",
      ur: "میری ٹیم کے لیے کون سا پلان صحیح ہے؟",
    },
    answer: {
      en: `Starter is for solo practitioners and includes 1 doctor and 1 receptionist. Clinic supports up to ${clinicDoctors} doctors and unlimited receptionists. Enterprise is for hospitals and chains, with unlimited doctors and staff.`,
      ur: `Starter اکیلے ڈاکٹرز کے لیے ہے اور اس میں 1 ڈاکٹر اور 1 ریسیپشنسٹ شامل ہیں۔ Clinic زیادہ سے زیادہ ${clinicDoctors} ڈاکٹرز اور لامحدود ریسیپشنسٹس کو سپورٹ کرتا ہے۔ Enterprise ہسپتالوں اور چینز کے لیے ہے، جس میں لامحدود ڈاکٹرز اور اسٹاف شامل ہیں۔`,
    },
    link: PRICING,
  },
  {
    id: "04",
    category: "billing",
    question: {
      en: "How much does Clinics cost?",
      ur: "Clinics کی قیمت کتنی ہے؟",
    },
    answer: {
      en: `Starter is PKR ${monthly("starter")}/month. Clinic is PKR ${monthly("clinic")}/month. Enterprise has custom pricing.`,
      ur: `Starter کی قیمت PKR ${monthly("starter")} ماہانہ ہے۔ Clinic کی قیمت PKR ${monthly("clinic")} ماہانہ ہے۔ Enterprise کی قیمت کسٹم ہے۔`,
    },
    link: PRICING,
  },
  {
    id: "05",
    category: "billing",
    question: {
      en: "How does the annual offer work?",
      ur: "سالانہ آفر کیسے کام کرتی ہے؟",
    },
    answer: {
      en: `Pay annually and get ${FREE_MONTHS} months free on any plan. For Starter, ${YEARLY_MONTHS} monthly payments total PKR ${yearly("starter")} for a year. For Clinic, the annual total is PKR ${yearly("clinic")}. Enterprise pricing is provided in a custom quote.`,
      ur: `سالانہ ادائیگی کریں اور کسی بھی پلان پر ${FREE_MONTHS} مہینے مفت پائیں۔ Starter کے لیے ${YEARLY_MONTHS} ماہانہ ادائیگیوں کا مجموعہ پورے سال کے لیے PKR ${yearly("starter")} بنتا ہے۔ Clinic کے لیے سالانہ کل رقم PKR ${yearly("clinic")} ہے۔ Enterprise کی قیمت کسٹم کوٹ میں بتائی جاتی ہے۔`,
    },
    link: PRICING,
  },
  {
    id: "06",
    category: "daily",
    question: {
      en: "Do prescriptions support Urdu instructions?",
      ur: "کیا نسخوں میں اردو ہدایات شامل ہو سکتی ہیں؟",
    },
    answer: {
      en: "Yes. Starter includes prescriptions with Urdu instructions and 6 prescription print designs. Clinic includes everything in Starter, and Enterprise includes everything in Clinic.",
      ur: "جی ہاں۔ Starter میں اردو ہدایات کے ساتھ نسخے اور پرنٹ کے 6 ڈیزائنز شامل ہیں۔ Clinic میں Starter کی ہر چیز شامل ہے، اور Enterprise میں Clinic کی ہر چیز شامل ہے۔",
    },
  },
  {
    id: "07",
    category: "daily",
    question: {
      en: "Can I keep patient records and visit history?",
      ur: "کیا میں مریضوں کا ریکارڈ اور وزٹ ہسٹری رکھ سکتا ہوں؟",
    },
    answer: {
      en: "Yes. Patient records and visit history are included in Starter and carried through to Clinic and Enterprise.",
      ur: "جی ہاں۔ مریضوں کا ریکارڈ اور وزٹ ہسٹری Starter میں شامل ہیں اور Clinic اور Enterprise میں بھی دستیاب رہتی ہیں۔",
    },
  },
  {
    id: "08",
    category: "daily",
    question: {
      en: "Does Clinics have a queue for walk-in patients?",
      ur: "کیا Clinics میں بغیر اپائنٹمنٹ آنے والے مریضوں کے لیے قطار ہے؟",
    },
    answer: {
      en: "Yes. A token queue for walk-in patients is included in Starter, Clinic and Enterprise.",
      ur: "جی ہاں۔ بغیر اپائنٹمنٹ آنے والے مریضوں کے لیے ٹوکن قطار Starter، Clinic اور Enterprise تینوں میں شامل ہے۔",
    },
  },
  {
    id: "09",
    category: "daily",
    question: {
      en: "Can I save prescription templates?",
      ur: "کیا میں نسخوں کے ٹیمپلیٹس محفوظ کر سکتا ہوں؟",
    },
    answer: {
      en: "Saved prescription templates are included in Clinic and Enterprise. Clinic also includes your clinic’s details on every prescription.",
      ur: "محفوظ شدہ نسخہ ٹیمپلیٹس Clinic اور Enterprise میں شامل ہیں۔ Clinic میں ہر نسخے پر آپ کے کلینک کی تفصیلات بھی شامل ہوتی ہیں۔",
    },
  },
  {
    id: "10",
    category: "teams",
    question: {
      en: "How many receptionists can use each plan?",
      ur: "ہر پلان میں کتنے ریسیپشنسٹ کام کر سکتے ہیں؟",
    },
    answer: {
      en: "Starter includes 1 receptionist. Clinic includes unlimited receptionists. Enterprise includes unlimited staff.",
      ur: "Starter میں 1 ریسیپشنسٹ شامل ہے۔ Clinic میں لامحدود ریسیپشنسٹس شامل ہیں۔ Enterprise میں لامحدود اسٹاف شامل ہے۔",
    },
  },
  {
    id: "11",
    category: "teams",
    question: {
      en: "Can I manage several clinics?",
      ur: "کیا میں کئی کلینکس سنبھال سکتا ہوں؟",
    },
    answer: {
      en: "Enterprise includes several clinics, each with its own workspace. Each clinic’s data is kept separate.",
      ur: "Enterprise میں کئی کلینکس شامل ہیں، اور ہر ایک کا اپنا الگ ورک اسپیس ہے۔ ہر کلینک کا ڈیٹا الگ رکھا جاتا ہے۔",
    },
    link: CONTACT,
  },
  {
    id: "12",
    category: "support",
    question: {
      en: "What support is included?",
      ur: "کون سی سپورٹ شامل ہے؟",
    },
    answer: {
      en: "Starter includes WhatsApp support. Clinic includes priority WhatsApp support. Enterprise includes everything in Clinic, plus a dedicated account manager, on-site training, custom integrations, and an SLA and uptime guarantee.",
      ur: "Starter میں WhatsApp سپورٹ شامل ہے۔ Clinic میں ترجیحی WhatsApp سپورٹ شامل ہے۔ Enterprise میں Clinic کی ہر چیز کے ساتھ ایک مخصوص اکاؤنٹ مینیجر، آن سائٹ ٹریننگ، کسٹم انٹیگریشنز، اور SLA اور اپ ٹائم گارنٹی شامل ہیں۔",
    },
    link: CONTACT,
  },
];
