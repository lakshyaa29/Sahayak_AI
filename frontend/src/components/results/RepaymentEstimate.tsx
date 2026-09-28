"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import {
  formatRupees,
  formatTenure,
  formatMoratoriumPeriod,
  formatInterestRateDisplay,
  calculateEstimatedMonthlyInstalment,
  extractBaseInterestRate,
} from "@/lib/financial-formatting";

interface RepaymentEstimateProps {
  loanAmount: number;
  interestRateStr: string;
  tenureYears: number;
  moratoriumStr?: string;
  className?: string;
}

export function RepaymentEstimate({
  loanAmount,
  interestRateStr,
  tenureYears,
  moratoriumStr,
  className = "",
}: RepaymentEstimateProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const baseRate = extractBaseInterestRate(interestRateStr);
  const estimate = calculateEstimatedMonthlyInstalment(loanAmount, baseRate, tenureYears);

  if (!estimate.isAvailable) {
    return (
      <section aria-labelledby="repayment-estimate-heading" className={`space-y-3 ${className}`}>
        <div className="border-b border-paper-200 pb-2">
          <h2
            id="repayment-estimate-heading"
            className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
          >
            {resT.repaymentTitle}
          </h2>
        </div>
        <div className="bg-paper-100 border border-paper-200 rounded-sm p-4 text-xs text-ink-600 space-y-1">
          <p className="font-bold text-ink-900">{resT.calculationUnavailableHeading}</p>
          <p>{resT.calculationUnavailableNotice}</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="repayment-estimate-heading" className={`space-y-4 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="repayment-estimate-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.repaymentTitle}
        </h2>
        <p className="text-xs text-ink-600 mt-0.5">
          {resT.repaymentSub}
        </p>
      </div>

      <div className="border border-paper-200 rounded-sm bg-paper-50 overflow-hidden">
        <dl className="divide-y divide-paper-200/70 text-xs">
          {/* 1. Indicative Interest Rate */}
          <div className="py-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <dt className="text-ink-600 font-medium">
              <span>{resT.interestRateLabel}</span>
              <span className="block text-[11px] text-ink-500 font-normal">
                {resT.interestRateType}
              </span>
            </dt>
            <dd className="font-bold text-ink-900 text-sm sm:text-right">
              {formatInterestRateDisplay(interestRateStr, isHindi)}
            </dd>
          </div>

          {/* 2. Repayment Tenure */}
          <div className="py-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <dt className="text-ink-600 font-medium">
              <span>{resT.repaymentTermLabel}</span>
              <span className="block text-[11px] text-ink-500 font-normal">
                {isHindi ? "योजना की अधिकतम अनुमत अवधि" : "Maximum permissible scheme tenure"}
              </span>
            </dt>
            <dd className="font-bold text-ink-900 text-sm sm:text-right">
              {formatTenure(tenureYears, isHindi)}
            </dd>
          </div>

          {/* 3. Repayment Frequency */}
          <div className="py-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <dt className="text-ink-600 font-medium">
              <span>{resT.repaymentFrequencyLabel}</span>
              <span className="block text-[11px] text-ink-500 font-normal">
                {isHindi ? "नियमित किस्त भुगतान अंतराल" : "Regular payment cadence"}
              </span>
            </dt>
            <dd className="font-bold text-ink-900 text-sm sm:text-right">
              {resT.monthlyFrequency} ({estimate.tenureMonths} {isHindi ? "किस्तें" : "instalments"})
            </dd>
          </div>

          {/* 4. Moratorium */}
          {moratoriumStr && (
            <div className="py-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-paper-100/30">
              <dt className="text-ink-600 font-medium">
                <span>{resT.moratoriumGraceLabel}</span>
                <span className="block text-[11px] text-ink-500 font-normal">
                  {resT.moratoriumNote}
                </span>
              </dt>
              <dd className="font-bold text-ink-900 text-sm sm:text-right">
                {formatMoratoriumPeriod(moratoriumStr, isHindi)}
              </dd>
            </div>
          )}

          {/* 5. Estimated Monthly Instalment (Highlight) */}
          <div className="py-3 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-paper-100/70 border-t border-paper-200">
            <dt className="text-ink-900 font-semibold">
              <span className="text-sm">{resT.estimatedMonthlyInstalmentLabel}</span>
              <span className="block text-[11px] text-ink-600 font-normal">
                {isHindi
                  ? `घटते मूलधन पर सांकेतिक किस्त (आधार दर ${baseRate}% पर अनुमानित)`
                  : `Indicative reducing-balance instalment (estimated at ${baseRate}% p.a.)`}
              </span>
            </dt>
            <dd className="font-extrabold text-ink-900 text-base sm:text-lg sm:text-right tabular-nums">
              {formatRupees(estimate.monthlyInstalment)}
            </dd>
          </div>

          {/* 6. Estimated Total Repayment & Interest */}
          <div className="py-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <dt className="text-ink-600 font-medium">
              <span>{resT.estimatedTotalRepaymentLabel}</span>
              <span className="block text-[11px] text-ink-500 font-normal">
                {isHindi
                  ? `कुल अनुमानित मूलधन + ब्याज (${formatRupees(estimate.totalInterest)} ब्याज सहित)`
                  : `Principal + interest (incl. ${formatRupees(estimate.totalInterest)} total interest)`}
              </span>
            </dt>
            <dd className="font-semibold text-ink-900 text-sm sm:text-right tabular-nums">
              {formatRupees(estimate.totalRepayment)}
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-[11px] text-ink-500 leading-relaxed italic border-l-2 border-paper-200 pl-3">
        {resT.repaymentDisclaimer}
      </p>
    </section>
  );
}
