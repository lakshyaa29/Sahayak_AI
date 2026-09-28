"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldAlert, HeartHandshake, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { DemoDataBadge } from "@/components/ui/badge";

export function Footer() {
  const { lang, setLang, t } = useLanguage();

  return (
    <footer className="bg-surface border-t border-border-default text-ink-900 mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-ink-900 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-tight text-ink-900">
                SAHAYAK <span className="text-accent">AI</span>
              </span>
              <DemoDataBadge />
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed max-w-md">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-900 bg-paper-200 p-2.5 rounded-[4px] border border-border-default inline-flex">
              <HeartHandshake className="w-4 h-4 text-ink-700 flex-shrink-0" aria-hidden="true" />
              <span>{t.footer.sihBadge}</span>
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900">
              {t.footer.sectionsTitle}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <Link href="/" className="hover:text-accent hover:underline transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-accent hover:underline transition-colors">
                  {t.nav.checkEligibility || t.nav.findMyScheme}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-accent hover:underline transition-colors">
                  {t.nav.calculator}
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-accent hover:underline transition-colors">
                  {t.nav.partners}
                </Link>
              </li>
              <li>
                <Link href="/next-steps" className="hover:text-accent hover:underline transition-colors">
                  {t.nav.nextSteps}
                </Link>
              </li>
            </ul>
          </div>

          {/* Channel Finance Network Info & Language Switcher */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900">
              {t.footer.channelNetworkTitle}
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {t.footer.networkDesc}
            </p>

            {/* Footer Language Selector */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-neutral-700 block mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.nav.language}:</span>
              </span>
              <div className="flex items-center gap-1.5" role="group" aria-label="Footer language selection">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={`text-xs px-2.5 py-1 rounded-[2px] font-medium transition-colors border ${
                    lang === "en"
                      ? "bg-ink-900 text-white border-ink-900 font-bold"
                      : "bg-surface text-ink-900 border-border-default hover:bg-paper-200"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang("hi")}
                  aria-pressed={lang === "hi"}
                  className={`text-xs px-2.5 py-1 rounded-[2px] font-medium transition-colors border ${
                    lang === "hi"
                      ? "bg-ink-900 text-white border-ink-900 font-bold"
                      : "bg-surface text-ink-900 border-border-default hover:bg-paper-200"
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preliminary Guidance Disclaimer */}
        <div className="pt-6 border-t border-border-subtle">
          <div className="bg-paper-100 p-4 rounded-[4px] border border-border-subtle text-xs text-neutral-700 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <span className="font-bold text-ink-900 uppercase tracking-wider text-[11px] block">
                {t.footer.disclaimerTitle}
              </span>
              <p className="leading-relaxed">
                {t.footer.disclaimerText}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
            <span>© {new Date().getFullYear()} {t.footer.copyright}</span>
            <span>{lang === "hi" ? "कार्यरत भाषा: हिन्दी" : "Working Language: English"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
