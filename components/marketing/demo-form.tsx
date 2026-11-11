"use client";

// The short demo form (Part 1, 2026-10-22): a name, and an email OR a phone,
// everything else optional. One component for the contact page, the home page
// section and the "Book a free demo" pop-up. Leads go to the admin Queries inbox.
// The contact page's variant (2026-10-27) asks for more: name, clinic, phone
// and email are required and checked in the browser first (inline errors,
// focus on the first one); it sends the same fields to the same action.

import { useActionState, useRef, useState, useTransition, type FormEvent } from "react";
import { ArrowRight, CheckCircle, AlertCircle, ChevronDown, Loader2, MessageCircle } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { submitDemoRequest, type DemoRequestState } from "@/app/(marketing)/contact/actions";
import { submitForm } from "@/lib/call-action";

export const WHATSAPP_URL = "https://wa.me/923071118812";

const DOCTOR_COUNT_OPTIONS = [
  { value: "1", label: "Just me" },
  { value: "2-5", label: "2-5 doctors" },
  { value: "6-10", label: "6-10 doctors" },
  { value: "10+", label: "More than 10" },
];

// the contact page's choices, in the current plans' limits (Starter, Clinic, Enterprise)
const CONTACT_DOCTOR_OPTIONS = [
  { value: "1", label: "1 doctor" },
  { value: "2-10", label: "Up to 10 doctors" },
  { value: "10+", label: "More than 10 doctors" },
];

const SELECT_CLASS =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-sm dark:bg-input/30";

// the home page's glass look (2026-10-24): taller fields, a teal focus ring
const GLASS_FIELD =
  "glass-field h-[52px] rounded-[14px] px-4 text-base md:text-[15px] focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/20";
const GLASS_LABEL = "text-[13px] font-medium text-muted-foreground";

/** the contact variant's required fields, in the order they appear */
const REQUIRED = ["name", "clinicName", "phone", "email"] as const;
type Required = (typeof REQUIRED)[number];
type Errors = Partial<Record<Required, string>>;
/** each field's id suffix (the ids the form has always had) */
const FIELD_ID: Record<Required, string> = { name: "name", clinicName: "clinic", phone: "phone", email: "email" };

function checkContact(fd: FormData): Errors {
  const v = (k: string) => String(fd.get(k) ?? "").trim();
  const errors: Errors = {};
  if (v("name").length < 2) errors.name = "Please enter your full name.";
  if (!v("clinicName")) errors.clinicName = "Please enter your clinic’s name.";
  const phone = v("phone");
  if (!phone) errors.phone = "Please enter a WhatsApp or phone number.";
  else if (!/^\+?[\d\s()-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a valid number, for example +92 300 1234567.";
  const email = v("email");
  if (!email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address, for example name@clinic.pk.";
  return errors;
}

export function DemoForm({
  idPrefix,
  onDone,
  glass = false,
  variant = "short",
}: {
  idPrefix: string;
  onDone?: () => void;
  glass?: boolean;
  /** short: the home page and the pop-up; contact: the contact page's fuller form */
  variant?: "short" | "contact";
}) {
  const contact = variant === "contact";
  const field = glass ? GLASS_FIELD : undefined;
  const label = glass ? GLASS_LABEL : undefined;
  // Error-UX step 2: a failed call is an inline message, not an error screen
  // (lib/call-action.ts). Submitted from onSubmit, not <form action>, so a
  // failed send keeps what was typed.
  const [state, formAction, isPending] = useActionState<DemoRequestState, FormData>(
    async (prev, fd) => {
      const r = await submitForm("submitDemoRequest", submitDemoRequest, [prev, fd], {
        write: true,
        unconfirmed: "your request may or may not have been sent. If you don't hear from us within a working day, please send it again.",
      });
      return r && "error" in r ? { success: false, message: r.error } : r;
    },
    null
  );
  const [, startSubmit] = useTransition();
  const [doctorCount, setDoctorCount] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const tried = useRef(false); // after the first try, errors update as fields change
  const id = (name: string) => `${idPrefix}-${name}`;

  if (state?.success) {
    return (
      <div role="status" className="flex flex-col items-center text-center py-10 px-4">
        <div className={cn("w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4", glass && "icon-tile size-14 rounded-full")}>
          <CheckCircle className="w-7 h-7 text-success" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">Thank you, we&apos;ll be in touch!</h3>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{state.message}</p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary-hover",
            glass && "rounded-[14px] bg-primary px-5 py-3 text-primary-foreground hover:bg-primary-hover",
          )}
        >
          <MessageCircle className="w-4 h-4" />
          Want a faster answer? Message us on WhatsApp
        </a>
        {onDone && (
          <button type="button" onClick={onDone} className="mt-3 inline-flex min-h-10 items-center px-2 text-sm text-muted-foreground hover:text-foreground">
            Close
          </button>
        )}
      </div>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return; // no second send while the first is on its way
    const fd = new FormData(e.currentTarget);
    if (contact) {
      tried.current = true;
      const found = checkContact(fd);
      setErrors(found);
      const first = REQUIRED.find((k) => found[k]);
      if (first) {
        document.getElementById(id(FIELD_ID[first]))?.focus();
        return;
      }
    }
    startSubmit(() => formAction(fd));
  };

  /** a required field of the contact variant: its error, linked to it */
  const invalid = (k: Required) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": id(`${FIELD_ID[k]}-error`) } : {};
  const errorText = (k: Required) =>
    errors[k] && (
      <p id={id(`${FIELD_ID[k]}-error`)} className="text-destructive mt-1.5 flex items-start gap-1.5 text-[13px]">
        <AlertCircle aria-hidden className="mt-[2px] size-3.5 shrink-0" />
        {errors[k]}
      </p>
    );
  const errorCount = Object.keys(errors).length;

  return (
    <form
      method="post"
      onSubmit={onSubmit}
      onInput={contact ? (e) => tried.current && setErrors(checkContact(new FormData(e.currentTarget))) : undefined}
      className={glass ? "space-y-5" : "space-y-4"}
      noValidate
    >
      {state && !state.success && (
        <div role="alert" className={cn("flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm", glass && "rounded-[14px] px-5 py-4")}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.message}
        </div>
      )}

      {contact ? (
        <>
          <p aria-live="polite" className={errorCount ? "text-destructive text-[14px] font-medium" : "sr-only"}>
            {errorCount ? `Please check ${errorCount === 1 ? "1 field" : `${errorCount} fields`} below.` : ""}
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={id("name")} className={label}>Full name</Label>
              <Input id={id("name")} className={field} name="name" autoComplete="name" placeholder="Dr. Ahmed Khan" required maxLength={100} {...invalid("name")} />
              {errorText("name")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={id("clinic")} className={label}>Clinic name</Label>
              <Input id={id("clinic")} className={field} name="clinicName" autoComplete="organization" placeholder="Al-Shifa Clinic" required maxLength={150} {...invalid("clinicName")} />
              {errorText("clinicName")}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={id("phone")} className={label}>WhatsApp / phone</Label>
              <Input id={id("phone")} className={field} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 300 1234567" required maxLength={40} {...invalid("phone")} />
              {errorText("phone")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={id("email")} className={label}>Email</Label>
              <Input id={id("email")} className={field} name="email" type="email" autoComplete="email" placeholder="ahmed@clinic.pk" required maxLength={254} {...invalid("email")} />
              {errorText("email")}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={id("doctors")} className={label}>How many doctors work at your clinic?</Label>
            <div className="relative">
              <select id={id("doctors")} name="doctorCount" value={doctorCount} onChange={(e) => setDoctorCount(e.target.value)}
                className={cn(SELECT_CLASS, glass && cn(GLASS_FIELD, "appearance-none pr-11"), doctorCount ? "text-foreground" : "text-muted-foreground")}>
                <option value="">Select</option>
                {CONTACT_DOCTOR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-foreground">{o.label}</option>
                ))}
              </select>
              {glass && <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-primary" />}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={id("message")} className={label}>Anything you&rsquo;d like us to know? <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Textarea id={id("message")} className={glass ? cn(GLASS_FIELD, "h-auto min-h-[120px] py-3") : undefined} name="message" rows={4} maxLength={2000} />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor={id("name")} className={label}>Your name</Label>
            <Input id={id("name")} className={field} name="name" autoComplete="name" placeholder="Dr. Ahmed Khan" required maxLength={100} />
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={id("email")} className={label}>Email</Label>
                <Input id={id("email")} className={field} name="email" type="email" autoComplete="email" placeholder="ahmed@clinic.pk" maxLength={254} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={id("phone")} className={label}>Phone or WhatsApp</Label>
                <Input id={id("phone")} className={field} name="phone" type="tel" autoComplete="tel" placeholder="+92 300 1234567" maxLength={40} />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Email or phone: at least one, so we can reach you.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={id("clinic")} className={label}>Clinic name <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id={id("clinic")} className={field} name="clinicName" autoComplete="organization" placeholder="Al-Shifa Clinic" maxLength={150} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={id("doctors")} className={label}>Number of doctors <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <div className="relative">
                <select id={id("doctors")} name="doctorCount" value={doctorCount} onChange={(e) => setDoctorCount(e.target.value)}
                  className={cn(SELECT_CLASS, glass && cn(GLASS_FIELD, "appearance-none pr-11"), doctorCount ? "text-foreground" : "text-muted-foreground")}>
                  <option value="">Select</option>
                  {DOCTOR_COUNT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="text-foreground">{o.label}</option>
                  ))}
                </select>
                {glass && <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-primary" />}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={id("message")} className={label}>Questions or comments <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Textarea id={id("message")} className={glass ? cn(GLASS_FIELD, "h-auto min-h-[104px] py-3") : undefined} name="message" rows={3} maxLength={2000} placeholder="Anything you'd like to see in the demo…" />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className={cn(
          "group w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-glow-primary",
          "hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed transition-colors",
          glass && "h-[52px] rounded-[14px] py-0 text-[16px]",
        )}
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
        ) : contact ? (
          <>Book a free demo<ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" /></>
        ) : (
          "Book a free demo"
        )}
      </button>
      {contact ? (
        <p className="text-center text-[13px] text-muted-foreground text-balance">We&rsquo;ll use your details only to get back to you about your demo.</p>
      ) : (
        <p className="text-center text-xs text-muted-foreground text-balance">Free · No payment needed · We reply within 24 hours</p>
      )}
    </form>
  );
}
