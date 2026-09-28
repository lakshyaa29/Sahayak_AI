"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, StyledLink } from "@/components/ui/button";
import { DemoDataBadge } from "@/components/ui/badge";
import { SkipToContent } from "@/components/ui/navigation-shell";
import { useLanguage } from "@/lib/language-context";
import { Menu, X, ArrowRight, Compass, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAssessmentRoute = pathname.startsWith("/assessment");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { lang, setLang, t } = useLanguage();

  const isHome = pathname === "/";

  // Minimal service navigation corresponding to primary user tasks
  const navLinks = [
    { label: t.nav.checkEligibility, href: "/assessment" },
    { label: t.nav.calculator, href: "/calculator" },
    { label: t.nav.partners, href: "/partners" },
  ];

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <SkipToContent targetId="main-content" />
      <header className="sticky top-0 z-40 w-full bg-surface border-b border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[4px] p-1"
            >
              <div className="w-9 h-9 rounded-[4px] bg-[#17233C] flex items-center justify-center text-white font-black text-lg">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-[#17233C] font-sans">
                    SAHAYAK <span className="text-[#C65D27]">AI</span>
                  </span>
                  <DemoDataBadge className="hidden sm:inline-flex text-[10px] py-0 px-1.5" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground leading-tight hidden sm:block">
                  {t.home.descriptor}
                </span>
              </div>
            </Link>
          </div>

          {/* Minimal Desktop Navigation */}
          {!isAssessmentRoute && (
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-[4px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "text-[#17233C] bg-surface-muted font-semibold"
                        : "text-neutral-700 hover:text-[#17233C] hover:bg-surface-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop Language Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <div
              className="flex items-center bg-surface-muted border border-border rounded-[4px] p-0.5 text-xs font-medium"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={cn(
                  "px-2.5 py-1 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  lang === "en"
                    ? "bg-[#17233C] text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                aria-pressed={lang === "hi"}
                className={cn(
                  "px-2.5 py-1 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  lang === "hi"
                    ? "bg-[#17233C] text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Mobile Navigation and Language Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Compact Mobile Language Button */}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="px-2.5 py-1.5 text-xs font-bold rounded-input border border-border bg-surface-muted text-foreground flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Switch language. Current language: ${lang === "en" ? "English" : "हिन्दी"}`}
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang === "en" ? "हिन्दी" : "EN"}</span>
            </button>

            {/* Hamburger / Close Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-input text-foreground hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t.nav.menuClose : t.nav.menuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Menu Modal Drawer */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="lg:hidden fixed inset-0 top-18 z-50 bg-background/98 backdrop-blur-md px-5 pt-4 pb-8 space-y-4 overflow-y-auto"
          >
            <div className="pb-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DemoDataBadge />
                <span className="text-xs text-muted-foreground font-semibold">
                  {lang === "hi" ? "भाषा: हिन्दी" : "Language: English"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold p-1"
              >
                Close (Esc)
              </button>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-3 rounded-card bg-surface border border-border">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" />
                <span>{t.nav.language}:</span>
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-input transition-colors",
                    lang === "en" ? "bg-primary text-white" : "bg-surface-muted text-secondary"
                  )}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang("hi")}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-input transition-colors",
                    lang === "hi" ? "bg-primary text-white" : "bg-surface-muted text-secondary"
                  )}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation Links">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-[4px] text-base font-semibold text-foreground hover:bg-surface-muted transition-colors min-h-[48px] flex items-center border border-border"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
