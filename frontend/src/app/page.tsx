"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { ArrowRight, Info } from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  const journeys = [
    {
      id: "journey-eligibility",
      number: t.home.journeys.journey1.number,
      title: t.home.journeys.journey1.title,
      description: t.home.journeys.journey1.description,
      action: t.home.journeys.journey1.action,
      href: "/assessment",
    },
    {
      id: "journey-repayment",
      number: t.home.journeys.journey2.number,
      title: t.home.journeys.journey2.title,
      description: t.home.journeys.journey2.description,
      action: t.home.journeys.journey2.action,
      href: "/calculator",
    },
    {
      id: "journey-partner",
      number: t.home.journeys.journey3.number,
      title: t.home.journeys.journey3.title,
      description: t.home.journeys.journey3.description,
      action: t.home.journeys.journey3.action,
      href: "/partners",
    },
  ];

  return (
    <div className="w-full bg-[#F5F1E8] text-[#17233C] py-8 sm:py-12 md:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 1. PRIMARY INTRODUCTION */}
        <section aria-labelledby="home-intro-heading" className="space-y-3 max-w-3xl">
          <h1
            id="home-intro-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#17233C] font-sans"
          >
            {t.home.heading}
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
            {t.home.supportingText}
          </p>
        </section>

        {/* 2. THREE PRIMARY JOURNEYS */}
        <section aria-label="Primary Tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {journeys.map((journey) => (
              <Link
                key={journey.id}
                href={journey.href}
                className="group flex flex-col justify-between bg-surface border-2 border-[#D8D2C6] hover:border-[#17233C] focus-visible:border-[#155E9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155E9A] focus-visible:ring-offset-2 rounded-[4px] p-6 transition-colors text-left"
              >
                <div className="space-y-2.5">
                  <span
                    className="text-xs font-bold text-[#C65D27] tracking-wider uppercase block tabular-nums"
                    aria-hidden="true"
                  >
                    {journey.number}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#17233C] leading-snug group-hover:text-[#155E9A] transition-colors">
                    {journey.title}
                  </h2>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {journey.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8D2C6]/70 mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#155E9A] group-hover:underline inline-flex items-center gap-1.5">
                    <span>{journey.action}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 3. PRELIMINARY GUIDANCE NOTICE (SHOWN ONCE) */}
          <div
            role="note"
            aria-label="Preliminary Guidance Notice"
            className="bg-surface border border-[#D8D2C6] rounded-[4px] p-4 text-xs sm:text-sm text-neutral-700 leading-relaxed flex items-start gap-3"
          >
            <Info className="w-4 h-4 text-[#C65D27] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{t.home.preliminaryNotice}</span>
          </div>
        </section>

        {/* 4. MINIMAL SUPPORTING INFORMATION ("HOW THIS SERVICE HELPS") */}
        <section
          aria-labelledby="how-it-helps-heading"
          className="pt-6 border-t border-[#D8D2C6] space-y-6"
        >
          <h2
            id="how-it-helps-heading"
            className="text-xl sm:text-2xl font-bold text-[#17233C]"
          >
            {t.home.howItHelps.heading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#17233C]">
                {t.home.howItHelps.step1Title}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {t.home.howItHelps.step1Desc}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#17233C]">
                {t.home.howItHelps.step2Title}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {t.home.howItHelps.step2Desc}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#17233C]">
                {t.home.howItHelps.step3Title}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {t.home.howItHelps.step3Desc}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
