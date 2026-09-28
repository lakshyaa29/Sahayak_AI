"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Badge, DemoDataBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { RotateCcw, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface AssessmentLayoutProps {
  children: ReactNode;
  stepIndicator: ReactNode;
  onResetClick: () => void;
  draftRestored?: boolean;
  draftWarning?: string | null;
  onDismissWarning?: () => void;
}

export function AssessmentLayout({
  children,
  stepIndicator,
  onResetClick,
  draftRestored,
  draftWarning,
  onDismissWarning,
}: AssessmentLayoutProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Compact Assessment Header */}
      <header
        role="banner"
        className="sticky top-0 z-30 bg-surface/95 backdrop-blur-xs border-b border-border py-2.5 px-4 sm:px-6"
      >
        <div className="max-w-[720px] mx-auto flex items-center justify-between gap-3">
          {/* Brand Identity & Prototype Pill */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="font-black text-base md:text-lg tracking-tight text-primary flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
            >
              <span>SAHAYAK AI</span>
            </Link>
            <Badge variant="primary" className="hidden sm:inline-flex text-2xs py-0.5 px-1.5">
              {t.assessment.header.badge}
            </Badge>
          </div>

          {/* Header Controls: Language Toggle & Start Again */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill */}
            <div
              role="group"
              aria-label="Language selection"
              className="flex items-center bg-surface-muted rounded-full p-0.5 border border-border text-xs"
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`px-2.5 py-1 rounded-full font-bold transition-colors ${
                  lang === "en"
                    ? "bg-primary text-white shadow-xs"
                    : "text-secondary hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("hi")}
                aria-pressed={lang === "hi"}
                className={`px-2.5 py-1 rounded-full font-bold transition-colors ${
                  lang === "hi"
                    ? "bg-primary text-white shadow-xs"
                    : "text-secondary hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Start Again Action */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetClick}
              className="text-xs text-secondary hover:text-error gap-1.5 px-2.5 h-8"
              aria-label={t.assessment.header.startAgain}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.assessment.header.startAgain}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Form Body (Centered ~720px) */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-28 sm:pb-12"
      >
        {/* Draft Notification if restored */}
        {draftRestored && (
          <div
            role="status"
            className="flex items-center justify-between gap-2 p-3 bg-success/10 border border-success/30 text-success rounded-card text-xs font-medium animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{t.assessment.header.draftRestored}</span>
            </div>
          </div>
        )}

        {/* Incompatible draft alert if reset occurred */}
        {draftWarning && (
          <div
            role="alert"
            className="flex items-start justify-between gap-2 p-3.5 bg-warning/10 border border-warning/30 text-warning-foreground rounded-card text-xs leading-relaxed"
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <span>{draftWarning}</span>
            </div>
            {onDismissWarning && (
              <button
                type="button"
                onClick={onDismissWarning}
                className="text-2xs font-bold text-secondary hover:text-foreground uppercase underline ml-2"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Progress Stepper */}
        <div className="pt-1 pb-2">{stepIndicator}</div>

        {/* Active Step Content */}
        {children}
      </main>

      {/* Minimal Civic Footer */}
      <footer className="border-t border-border bg-surface py-4 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.assessment.header.draftSaved}</span>
          <span>{t.footer.sihBadge}</span>
        </div>
      </footer>
    </div>
  );
}
