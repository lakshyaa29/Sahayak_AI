"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { HelpCircle, RotateCcw, ArrowRight } from "lucide-react";

interface NeedsInfoViewProps {
  schemes: SchemeEvaluationOutcome[];
  className?: string;
}

export function NeedsInfoView({ schemes, className = "" }: NeedsInfoViewProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const allUnknownConditions = schemes.flatMap((s) => s.unknown_conditions);

  return (
    <div
      role="region"
      aria-labelledby="needs-info-heading"
      className={`border border-paper-200 rounded-sm bg-paper-50 p-6 sm:p-8 space-y-6 ${className}`}
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-ink-700 font-bold uppercase text-[11px] tracking-wider bg-paper-100 px-2.5 py-1 rounded-sm border border-paper-200">
          <HelpCircle className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>{isHindi ? "पुष्टि आवश्यक" : "Confirmation Required"}</span>
        </div>

        <h1
          id="needs-info-heading"
          className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight"
        >
          {resT.needsInfoHeading}
        </h1>

        <p className="text-sm text-ink-600 leading-relaxed max-w-2xl">
          {resT.needsInfoSubNew}
        </p>
      </div>

      {allUnknownConditions.length > 0 && (
        <div className="bg-paper-100 border border-paper-200 rounded-sm p-4 space-y-2.5 text-xs">
          <span className="font-bold text-ink-900 block text-[11px] uppercase tracking-wider">
            {isHindi ? "आवश्यक सत्यापन विवरण" : "Verification details needed"}
          </span>

          <ul className="space-y-2 text-ink-700">
            {allUnknownConditions.map((cond) => (
              <li key={cond.rule_id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-ink-500 font-bold" aria-hidden="true">
                  &bull;
                </span>
                <span>
                  {isHindi ? cond.reason_hi : cond.reason_en}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/assessment?step=review"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-white font-bold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          <span>{resT.secondaryReviewAnswers}</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
