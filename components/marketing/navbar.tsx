"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookDemoButton } from "@/components/marketing/demo-dialog";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-provider";

// The site's pages (2026-10-27), the home page first.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Success stories", href: "/success-stories" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // what the bar sits on: its own light background once scrolled; at the top,
  // the home hero's light photo (since 2026-10-23: dark teal text in both
  // themes) or another page's dark band. /products, /success-stories,
  // /pricing, /faq and /contact have no band: their mint-white (dark in dark
  // mode) background takes the light bar's colours.
  const lightTop = ["/products", "/success-stories", "/pricing", "/faq", "/contact"].includes(pathname);
  const band = scrolled || lightTop ? "light" : onHome ? "photo" : "dark";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // the open menu: the page under it does not scroll (Lenis's wheel too),
  // Escape closes it, and focus goes back to the menu button
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const stopWheel = (e: WheelEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("wheel", stopWheel, { capture: true, passive: false });
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("wheel", stopWheel, { capture: true });
      window.removeEventListener("keydown", onKey);
      if (menuRef.current?.contains(document.activeElement) || document.activeElement === document.body) toggle?.focus();
    };
  }, [mobileOpen]);

  const isCurrent = (href: string) => pathname === href;

  return (
    <nav
      // over the home hero in dark mode its dark teal turns light (marketing.css)
      data-band={band}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-card"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* from 1024px: logo | links (centred) | buttons */}
        <div className="flex items-center justify-between h-[72px] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-self-start" aria-label="Clinics, home">
            <Logo size="md" tone={band === "light" ? "default" : band === "photo" ? "onLight" : "onDark"} />
          </Link>

          {/* Desktop navigation links: one height for links and buttons */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {NAV_LINKS.map((link) => {
              const current = isCurrent(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`relative inline-flex h-11 items-center whitespace-nowrap text-[14px] font-medium px-2.5 xl:px-4 rounded-lg transition-all duration-300 ${
                    band === "light"
                      ? current
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      : band === "photo"
                        ? current
                          ? "text-brand-deep bg-brand-deep/10"
                          : "text-brand-deep/80 hover:text-brand-deep hover:bg-brand-deep/5"
                        : current
                          ? "text-brand-deep-foreground bg-brand-deep-foreground/10"
                          : "text-brand-deep-foreground/70 hover:text-brand-deep-foreground hover:bg-brand-deep-foreground/5"
                  }`}
                >
                  {link.label}
                  {current && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full ${
                      band === "light" ? "bg-primary" : band === "photo" ? "bg-brand-deep" : "bg-brand-deep-foreground"
                    }`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center justify-self-end gap-2 xl:gap-3">
            <ThemeToggle className={`rounded-xl ${band === "light" ? "text-muted-foreground hover:bg-muted" : band === "photo" ? "text-brand-deep hover:bg-brand-deep/10 hover:text-brand-deep" : "text-brand-deep-foreground hover:bg-brand-deep-foreground/10 hover:text-brand-deep-foreground"}`} />
            <Link
              href="/login"
              className={`inline-flex h-11 items-center whitespace-nowrap text-[14px] font-semibold rounded-xl px-4 xl:px-5 transition-all duration-300 ${
                band === "light"
                  ? "text-primary border border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                  : band === "photo"
                    ? "text-brand-deep border border-brand-deep/25 hover:bg-brand-deep/10 hover:border-brand-deep/40"
                    : "text-brand-deep-foreground border border-brand-deep-foreground/20 hover:bg-brand-deep-foreground/10 hover:border-brand-deep-foreground/40"
              }`}
            >
              Sign in
            </Link>
            <BookDemoButton className="btn-premium inline-flex h-11 items-center whitespace-nowrap text-[14px] font-semibold bg-primary text-primary-foreground rounded-xl px-5 xl:px-6 shadow-glow-primary hover:shadow-glow-primary"
            >
              Book a free demo
            </BookDemoButton>
          </div>

          {/* Tablet and phone: theme and menu, together at the right */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle className={`size-10 rounded-xl ${band === "light" ? "text-muted-foreground hover:bg-muted" : band === "photo" ? "text-brand-deep hover:bg-brand-deep/10 hover:text-brand-deep" : "text-brand-deep-foreground hover:bg-brand-deep-foreground/10 hover:text-brand-deep-foreground"}`} />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`inline-flex size-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                band === "light" ? "text-muted-foreground hover:bg-muted" : band === "photo" ? "text-brand-deep hover:bg-brand-deep/10" : "text-brand-deep-foreground hover:bg-brand-deep-foreground/10"
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (out of the tab order while closed) */}
      <div
        id="mobile-menu"
        ref={menuRef}
        inert={!mobileOpen}
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-background/95 backdrop-blur-xl px-4 pb-5 pt-3">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const current = isCurrent(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex min-h-11 items-center px-3 text-[15px] font-medium rounded-xl transition-all duration-300 text-left ${
                    current ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2.5 mt-3 pt-4 border-t border-border">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center justify-center border border-primary/20 text-primary rounded-xl text-[15px] font-semibold hover:bg-primary/5 transition-all duration-300"
              >
                Sign in
              </Link>
              <BookDemoButton onClick={() => setMobileOpen(false)} className="flex min-h-11 items-center justify-center bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold shadow-glow-primary"
              >
                Book a free demo
              </BookDemoButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
