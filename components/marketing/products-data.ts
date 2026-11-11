// The three products on /products (2026-10-27): one list for the cards, the
// size picker and the compare table, so the copy lives in one place.
// Every product has every feature in the table (owner, 2026-10-27; the
// pricing page and FAQ still list saved templates from the Clinic plan up).
import { Building2, Hospital, User, type LucideIcon } from "lucide-react";

export type ProductId = "dms" | "cms" | "ecms";

/** the table's feature rows, in order */
export const FEATURES = [
  { key: "urdu", label: "Prescriptions in Urdu and English" },
  { key: "queue", label: "Live token queue" },
  { key: "history", label: "Patient history" },
  { key: "templates", label: "Templates & test panels" },
  { key: "privacy", label: "Private by design" },
] as const;

export type FeatureKey = (typeof FEATURES)[number]["key"];

export interface Product {
  id: ProductId;
  abbr: string;
  name: string;
  /** under the abbreviation in the table's header */
  short: string;
  /** the size picker's option */
  size: string;
  /** the picker's result line, after the product's name */
  fit: string;
  description: string;
  icon: LucideIcon;
  doctors: string;
  receptionists: string;
  features: Record<FeatureKey, boolean>;
  /** "page": a link to /pricing; "quote": priced by hand */
  pricing: "page" | "quote";
  cta: "demo" | "quote";
  primary?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "dms",
    abbr: "DMS",
    name: "Doctor Management System",
    short: "Doctor",
    size: "1 doctor",
    fit: "For one doctor and one receptionist.",
    description: "For a single doctor who wants a simple queue, records and printed prescriptions.",
    icon: User,
    doctors: "1",
    receptionists: "1",
    features: { urdu: true, queue: true, history: true, templates: true, privacy: true },
    pricing: "page",
    cta: "demo",
  },
  {
    id: "cms",
    abbr: "CMS",
    name: "Clinic Management System",
    short: "Clinic",
    size: "2-10 doctors",
    fit: "Up to 10 doctors and unlimited receptionists.",
    description: "For a growing clinic with several doctors sharing one front desk.",
    icon: Building2,
    doctors: "Up to 10",
    receptionists: "Unlimited",
    features: { urdu: true, queue: true, history: true, templates: true, privacy: true },
    pricing: "page",
    cta: "demo",
    primary: true,
  },
  {
    id: "ecms",
    abbr: "ECMS",
    name: "Enterprise Clinic Management System",
    short: "Enterprise",
    size: "More than 10",
    fit: "10+ doctors and unlimited receptionists, with a custom quote.",
    description: "For large practices and groups, set up around the way you work.",
    icon: Hospital,
    doctors: "10+",
    receptionists: "Unlimited",
    features: { urdu: true, queue: true, history: true, templates: true, privacy: true },
    pricing: "quote",
    cta: "quote",
  },
];
