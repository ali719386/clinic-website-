import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { checkSession } from "@/lib/auth"
import { SessionEnded } from "@/components/forget-previous-session"
import { roleHome } from "@/lib/role-home"
import Navbar from "@/components/marketing/navbar"
import Hero from "@/components/marketing/hero"
import Specialties from "@/components/marketing/specialties"
import HowItWorks from "@/components/marketing/how-it-works"
import ClinicCTA from "@/components/marketing/clinic-cta"
import DemoSection from "@/components/marketing/demo-section"
import Faq from "@/components/marketing/faq"
import Footer from "@/components/marketing/footer"
import { LazySection } from "@/components/marketing/lazy-section"

export const metadata: Metadata = {
  title: { absolute: "Clinics | Clinic software for Pakistan" },
  description:
    "Run your clinic's walk-in queue, patient records and prescriptions with Urdu instructions in one simple app. Free 30-day trial; we set up your clinic for you.",
  openGraph: {
    title: "Clinics",
    description: "The token queue, patient records and Urdu prescriptions for Pakistani clinics, in one simple app.",
    siteName: "Clinics",
    type: "website",
  },
}

// Logged-in users go to their dashboard; guests see the landing page
export default async function HomePage() {
  const check = await checkSession()
  if (check.status === "valid") redirect(roleHome(check.session.role)) // RT-1: one redirect, correct home per role

  return (
    <div>
      {/* privacy G3: this browser's session ended (not an outage): the other tabs are told */}
      {check.status === "invalid" && <SessionEnded />}
      <Navbar />
      <main>
        <Hero />
        {/* below the hero: each section renders when it nears the screen,
            in a space kept for it (the estimates are its usual height) */}
        <LazySection estimate={1180}><Specialties /></LazySection>
        <LazySection estimate={1250} rise={26} duration={1} stagger={0.11}><HowItWorks /></LazySection>
        <LazySection estimate={1100} rise={26} duration={1} stagger={0.11}><Faq variant="glass" /></LazySection>
        {/* the band leads into the form (its button scrolls to #book-demo) */}
        <LazySection estimate={1050} rise={26} duration={1} stagger={0.11}><ClinicCTA /></LazySection>
        <LazySection estimate={1050} rise={26} duration={1} stagger={0.11}><DemoSection /></LazySection>
      </main>
      <LazySection estimate={420} rise={16} duration={0.8} stagger={0.08}><Footer /></LazySection>
    </div>
  )
}
