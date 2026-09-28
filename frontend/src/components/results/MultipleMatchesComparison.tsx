"use client";

import React from "react";
import { SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import {
  formatRupees,
  formatTenure,
  formatInterestRateDisplay,
} from "@/lib/financial-formatting";
import { Info, Check } from "lucide-react";

interface MultipleMatchesComparisonProps {
  schemes: SchemeEvaluationOutcome[];
  selectedSchemeId: string;
  onSelectScheme: (scheme: SchemeEvaluationOutcome) => void;
  className?: string;
}

export function MultipleMatchesComparison({
  schemes,
  selectedSchemeId,
  onSelectScheme,
  className = "",
}: MultipleMatchesComparisonProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  if (schemes.length <= 1) return null;

  return (
    <section aria-labelledby="multiple-matches-heading" className={`space-y-3 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="multiple-matches-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.multipleMatchesCompareTitle} ({schemes.length})
        </h2>
        <p className="text-xs text-ink-600 mt-0.5">
          {resT.rankingSelectionExplanation}
        </p>
      </div>

      <div className="border border-paper-200 rounded-sm bg-paper-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <caption className="sr-only">
              {isHindi
                ? "पात्र योजनाओं की तथ्यात्मक तुलना तालिका"
                : "Factual comparison table of matching eligible schemes"}
            </caption>
            <thead>
              <tr className="bg-paper-100 border-b border-paper-200 text-ink-600 text-[11px] font-semibold">
                <th scope="col" className="py-2.5 px-3 sm:px-4">
                  {resT.compareColumnScheme}
                </th>
                <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">
                  {resT.compareColumnMaxLoan}
                </th>
                <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">
                  {resT.compareColumnInterest}
                </th>
                <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">
                  {resT.compareColumnTenure}
                </th>
                <th scope="col" className="py-2.5 px-3 sm:px-4 text-center">
                  {isHindi ? "विवरण देखें" : "View Statement"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200/70 text-ink-800">
              {schemes.map((s, idx) => {
                const isSelected = s.scheme_id === selectedSchemeId;
                const schemeName = isHindi ? s.name_hi : s.name_en;

                return (
                  <tr
                    key={s.scheme_id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-paper-100/80 font-medium"
                        : "hover:bg-paper-100/40"
                    }`}
                  >
                    <th scope="row" className="py-3 px-3 sm:px-4 font-normal text-ink-900">
                      <div className="space-y-0.5">
                        <span className="font-bold text-ink-900 block">
                          {schemeName}
                        </span>
                        <span className="font-mono text-[10px] text-ink-500 uppercase block">
                          {s.code} {idx === 0 && `(${isHindi ? "प्राथमिक विकल्प" : "Primary option"})`}
                        </span>
                      </div>
                    </th>
                    <td className="py-3 px-3 sm:px-4 text-right tabular-nums text-ink-900 font-semibold">
                      {formatRupees(s.max_eligible_loan)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right tabular-nums text-ink-700">
                      {formatInterestRateDisplay(s.indicative_interest_rate, isHindi)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right tabular-nums text-ink-700">
                      {formatTenure(s.indicative_tenure_years, isHindi)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectScheme(s)}
                        className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-colors focus-visible:outline-focus ${
                          isSelected
                            ? "bg-ink-900 text-white"
                            : "border border-paper-200 bg-paper-50 text-ink-800 hover:bg-paper-100"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {isSelected
                          ? isHindi
                            ? "प्रदर्शित विवरण"
                            : "Showing"
                          : isHindi
                          ? "चुनें"
                          : "Select"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
