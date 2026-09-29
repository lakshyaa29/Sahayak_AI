"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { HelpCircle, RotateCcw, ArrowRight } from "lucide-react";

interface NeedsInfoViewProps {
  schemes: SchemeEvaluationOutcome[];
  district?: string;
  state?: string;
  className?: string;
}

export function NeedsInfoView({
  schemes,
  district = "Wardha",
  state = "Maharashtra",
  className = "",
}: NeedsInfoViewProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const primaryNeedsInfoScheme = schemes[0] || null;
  const allUnknownConditions = schemes.flatMap((s) => s.unknown_conditions);

  const partnerQuery = new URLSearchParams();
  if (district) partnerQuery.set("district", district);
  if (state) partnerQuery.set("state", state);
  if (primaryNeedsInfoScheme?.code) partnerQuery.set("scheme", primaryNeedsInfoScheme.code);
  const partnerUrl = `/partners?${partnerQuery.toString()}`;

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

      {/* Conditionally Matched Scheme Preview */}
      {primaryNeedsInfoScheme && (
        <div className="bg-paper-100 border border-paper-200 rounded-sm p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-200 pb-2.5">
            <div>
              <span className="text-[11px] font-mono font-semibold text-accent block">
                {primaryNeedsInfoScheme.code}
              </span>
              <h2 className="text-base font-bold text-ink-900">
                {isHindi ? primaryNeedsInfoScheme.name_hi : primaryNeedsInfoScheme.name_en}
              </h2>
              <p className="text-xs text-ink-600">
                {isHindi ? primaryNeedsInfoScheme.provider_hi : primaryNeedsInfoScheme.provider_en}
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-xs">
              {isHindi ? "सत्यापन उपरांत पात्र" : "Eligible Subject to Verification"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <span className="text-ink-500 block text-[11px]">
                {isHindi ? "अधिकतम ऋण सीमा" : "Max Eligible Loan"}
              </span>
              <strong className="text-ink-900 text-sm font-semibold">
                ₹{primaryNeedsInfoScheme.max_eligible_loan.toLocaleString("en-IN")}
              </strong>
            </div>
            <div>
              <span className="text-ink-500 block text-[11px]">
                {isHindi ? "ब्याज दर" : "Interest Rate"}
              </span>
              <strong className="text-ink-900 text-sm font-semibold">
                {primaryNeedsInfoScheme.indicative_interest_rate}
              </strong>
            </div>
            <div>
              <span className="text-ink-500 block text-[11px]">
                {isHindi ? "अनुग्रह अवधि (Moratorium)" : "Moratorium"}
              </span>
              <strong className="text-ink-900 text-sm font-semibold">
                {primaryNeedsInfoScheme.indicative_moratorium}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* What needs to be verified */}
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

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        {primaryNeedsInfoScheme && (
          <Link
            href={partnerUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-white font-bold text-xs transition-colors"
          >
            <span>{isHindi ? "सत्यापन एवं आवेदन हेतु चैनल पार्टनर खोजें" : "Find Channel Partners for Verification"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </Link>
        )}

        <Link
          href="/assessment?step=review"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-paper-200 bg-paper-50 hover:bg-paper-100 text-ink-800 font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
          <span>{resT.secondaryReviewAnswers}</span>
        </Link>
      </div>
    </div>
  );
}
