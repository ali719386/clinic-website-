import type { Metadata } from "next"
import localFont from "next/font/local"
import { Noto_Nastaliq_Urdu } from "next/font/google"

import "@workspace/ui/globals.css"
import "@/styles/urdu.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

const inter = localFont({
  src: "../public/fonts/Inter-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
})

const plusJakarta = localFont({
  src: "../public/fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-heading",
  display: "swap",
})

// Urdu text only (styles/urdu.css): downloaded at build time and served from
// this site, no CDN. Not preloaded: Urdu appears below the fold, so the page's
// first paint does not wait for it.
const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-urdu",
  preload: false,
})

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Variable.woff2",
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Clinics by Prob N Tech", template: "%s · Clinics by Prob N Tech" },
  description:
    "Clinic software for Pakistan: a live token queue, patient records and prescriptions with Urdu instructions, for doctors and receptionists.",
  applicationName: "Clinics by Prob N Tech",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", inter.variable, plusJakarta.variable, geistMono.variable, urdu.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
