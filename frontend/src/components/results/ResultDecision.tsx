"use client";

import React from "react";
import { SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

interface ResultDecisionProps {
  scheme: SchemeEvaluationOutcome;
  hasMultipleMatches?: boolean;
  className?: string;
}

export function ResultDecision({
  scheme,
  hasMultipleMatches = false,
  className = "",
}: ResultDecisionProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const schemeName = isHindi ? scheme.name_hi : scheme.name_en;
  const providerName = isHindi ? scheme.provider_hi : scheme.provider_en;
  const headingText = hasMultipleMatches ? resT.multipleMatchHeading : resT.singleMatchHeading;
  const supportingText = hasMultipleMatches ? resT.multipleMatchSub : resT.singleMatchSub;

  const purposeLabel =
    scheme.purpose === "business"
      ? isHindi
        ? "व्यावसायिक उद्यम एवं स्वरोजगार"
        : "Business and self-employment"
      : isHindi
      ? "उच्च एवं व्यावसायिक शिक्षा"
      : "Higher and technical education";

  return (
    <section aria-labelledby="decision-heading" className={`space-y-4 ${className}`}>
      {/* Restrained Decision Heading */}
      <div className="space-y-1">
        <h1
          id="decision-heading"
          className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight"
        >
          {headingText}
        </h1>
        <p className="text-sm text-ink-600 leading-relaxed max-w-2xl">
          {supportingText}
        </p>
      </div>

      {/* Scheme Identification Box */}
      <div className="bg-paper-50 border border-paper-200 rounded-sm p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-600">
              {purposeLabel}
            </span>
            <span className="text-paper-200" aria-hidden="true">
              |
            </span>
            <span className="text-xs font-mono text-ink-500 uppercase">
              {scheme.code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {scheme.is_demonstration ? (
              <Badge variant="warning" className="text-[11px] gap-1">
                <Scale className="w-3 h-3" />
                <span>{resT.demonstrationBadge}</span>
              </Badge>
            ) : (
              <Badge variant="neutral" className="text-[11px]">
                {resT.officialVerifiedBadge}
              </Badge>
            )}
            <span className="text-[11px] font-mono text-ink-500">v{scheme.version_id}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-900 leading-snug">
            {schemeName}
          </h2>
          <div className="text-xs text-ink-600 flex flex-wrap items-baseline gap-1.5">
            <span className="font-semibold text-ink-700">{resT.sourceAuthorityLabel}:</span>
            <span className="text-ink-800">{providerName}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
