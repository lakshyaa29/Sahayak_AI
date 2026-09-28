"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Building2, RotateCcw, Calculator, Printer, ArrowRight } from "lucide-react";

interface ResultActionsProps {
  schemeCode?: string;
  loanAmount?: number;
  district?: string;
  state?: string;
  onStartAgain?: () => void;
  className?: string;
}

export function ResultActions({
  schemeCode,
  loanAmount,
  district = "Wardha",
  state = "Maharashtra",
  onStartAgain,
  className = "",
}: ResultActionsProps) {
  const { lang, t } = useLanguage();
  const resT = t.results;

  // Safe routing parameters: ONLY non-sensitive state, district, and scheme code
  const partnerQuery = new URLSearchParams();
  if (district) partnerQuery.set("district", district);
  if (state) partnerQuery.set("state", state);
  if (schemeCode) partnerQuery.set("scheme", schemeCode);
  const partnerUrl = `/partners?${partnerQuery.toString()}`;

  const calcQuery = new URLSearchParams();
  if (schemeCode) calcQuery.set("scheme", schemeCode);
  if (loanAmount && loanAmount > 0) calcQuery.set("amount", loanAmount.toString());
  const calculatorUrl = `/calculator?${calcQuery.toString()}`;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <section aria-labelledby="actions-heading" className={`space-y-4 no-print ${className}`}>
      <div className="border-b border-paper-200 pb-2 sr-only">
        <h2 id="actions-heading">{resT.primaryNextActionTitle}</h2>
      </div>

      {/* ONE Primary Action Box */}
      <div className="bg-paper-100 border-2 border-accent rounded-sm p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent block">
            {resT.primaryNextActionTitle}
          </span>
          <p className="text-xs text-ink-700 leading-relaxed max-w-xl">
            {resT.primaryNextActionSub}
          </p>
        </div>

        <div>
          <Link
            href={partnerUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-accent hover:bg-accent-hover text-white font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Building2 className="w-4 h-4 text-white" aria-hidden="true" />
            <span>{resT.primaryNextActionTitle}</span>
            <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Secondary Plain Actions */}
      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
        <Link
          href="/assessment?step=review"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-paper-200 bg-paper-50 text-ink-800 hover:bg-paper-100 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
          <span>{resT.secondaryReviewAnswers}</span>
        </Link>

        <Link
          href={calculatorUrl}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-paper-200 bg-paper-50 text-ink-800 hover:bg-paper-100 font-semibold transition-colors"
        >
          <Calculator className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
          <span>{resT.secondaryEstimateDifferent}</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-paper-200 bg-paper-50 text-ink-800 hover:bg-paper-100 font-semibold transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
          <span>{resT.secondaryPrint}</span>
        </button>

        {onStartAgain && (
          <button
            type="button"
            onClick={onStartAgain}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-ink-500 hover:text-ink-800 hover:underline transition-colors ml-auto"
          >
            <span>{resT.secondaryStartAgain}</span>
          </button>
        )}
      </div>
    </section>
  );
}
