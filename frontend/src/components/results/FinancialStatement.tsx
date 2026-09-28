"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import {
  formatRupees,
  formatPercent,
  reconcileFinancialStatement,
} from "@/lib/financial-formatting";

interface FinancialStatementProps {
  totalCost: number;
  maxEligibleLoan: number;
  schemeMaxLoanPct?: number;
  schemeCap?: number;
  className?: string;
}

export function FinancialStatement({
  totalCost,
  maxEligibleLoan,
  schemeMaxLoanPct = 90,
  schemeCap,
  className = "",
}: FinancialStatementProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  // Reconcile figures deterministically
  const statement = reconcileFinancialStatement(
    totalCost,
    maxEligibleLoan,
    schemeMaxLoanPct,
    schemeCap
  );

  return (
    <section aria-labelledby="financial-statement-heading" className={`space-y-4 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="financial-statement-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.financialStatementTitle}
        </h2>
        <p className="text-xs text-ink-600 mt-0.5">
          {resT.financialStatementSub}
        </p>
      </div>

      {/* Main Statement Table */}
      <div className="border border-paper-200 rounded-sm bg-paper-50 overflow-hidden">
        <table className="w-full text-xs text-left border-collapse">
          <caption className="sr-only">
            {isHindi
              ? "परियोजना लागत, अनुमानित ऋण राशि और आवेदक अंशदान का वित्तीय विवरण"
              : "Financial Statement Reconciling Project Cost, Loan Amount, and Applicant Contribution"}
          </caption>
          <thead>
            <tr className="bg-paper-100 border-b border-paper-200 text-ink-600 text-[11px] font-semibold">
              <th scope="col" className="py-2.5 px-3 sm:px-4">
                {isHindi ? "वित्तीय घटक" : "Financial Component"}
              </th>
              <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">
                {isHindi ? "हिस्सेदारी" : "Share"}
              </th>
              <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">
                {isHindi ? "अनुमानित राशि" : "Estimated Amount"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200/70 text-ink-800">
            {/* 1. Project Cost */}
            <tr>
              <th scope="row" className="py-3 px-3 sm:px-4 font-normal text-ink-900">
                <span>{resT.projectCostLabel}</span>
                <span className="block text-[11px] text-ink-500">
                  {isHindi
                    ? "आपके द्वारा घोषित कुल अनुमानित लागत"
                    : "Total estimated outlay stated in assessment"}
                </span>
              </th>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums text-ink-600">
                100%
              </td>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums font-semibold text-ink-900">
                {formatRupees(statement.projectCost)}
              </td>
            </tr>

            {/* 2. Estimated Loan Amount */}
            <tr className="bg-paper-100/40">
              <th scope="row" className="py-3 px-3 sm:px-4 font-normal text-ink-900">
                <span className="font-semibold">{resT.estimatedLoanLabel}</span>
                <span className="block text-[11px] text-ink-500">
                  {isHindi
                    ? `योजना की नीति के अनुसार अधिकतम ${schemeMaxLoanPct}% तक सहायता`
                    : `Concessional financing share (up to ${schemeMaxLoanPct}%)`}
                </span>
              </th>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums font-semibold text-ink-900">
                {formatPercent(statement.loanSharePercent)}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums font-bold text-ink-900">
                {formatRupees(statement.loanAmount)}
              </td>
            </tr>

            {/* 3. Estimated Applicant Contribution */}
            <tr>
              <th scope="row" className="py-3 px-3 sm:px-4 font-normal text-ink-900">
                <span>{resT.applicantContributionLabel}</span>
                <span className="block text-[11px] text-ink-500">
                  {isHindi
                    ? "आवेदक द्वारा स्वयं जुटाई जाने वाली अनुमानित मार्जिन राशि"
                    : "Estimated borrower margin contribution required"}
                </span>
              </th>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums text-ink-600">
                {formatPercent(statement.applicantSharePercent)}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums font-semibold text-ink-900">
                {formatRupees(statement.applicantContribution)}
              </td>
            </tr>

            {/* 4. Reconciliation Total Row */}
            <tr className="border-t-2 border-ink-900 bg-paper-100 font-bold text-ink-900">
              <th scope="row" className="py-3 px-3 sm:px-4 text-xs uppercase tracking-wider">
                {resT.totalLabel}
              </th>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums">
                100%
              </td>
              <td className="py-3 px-3 sm:px-4 text-right tabular-nums text-sm font-extrabold text-ink-900">
                {formatRupees(statement.projectCost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visible Calculation Formula Box (Section 8) */}
      <div className="bg-paper-100 border border-paper-200 rounded-sm p-4 text-xs space-y-2.5">
        <span className="font-bold text-ink-900 block text-[11px] uppercase tracking-wider">
          {resT.calculationFormulaTitle}
        </span>

        <div className="space-y-2 font-mono text-[11px] text-ink-700 bg-paper-50 p-3 rounded-sm border border-paper-200">
          <div>
            <span className="font-sans font-semibold text-ink-900 block">
              {resT.loanFormulaLabel}:
            </span>
            <span>
              {formatRupees(statement.projectCost)} &times; {schemeMaxLoanPct}% ={" "}
              {formatRupees(statement.rawCalculatedLoan)}
            </span>
          </div>

          {statement.isCapped && statement.statutoryCap && (
            <div className="border-t border-paper-200 pt-1.5 text-accent font-sans">
              <span className="block font-semibold">
                {isHindi
                  ? `वैधानिक सीमा: योजना में अधिकतम ऋण सीमा ${formatRupees(statement.statutoryCap)} है।`
                  : `Scheme Cap: Maximum statutory loan ceiling is ${formatRupees(statement.statutoryCap)}.`}
              </span>
              <span className="font-mono text-ink-900">
                {isHindi ? "सीमा के बाद अंतिम ऋण" : "Final loan after scheme limit"}:{" "}
                {formatRupees(statement.loanAmount)}
              </span>
            </div>
          )}

          <div className="border-t border-paper-200 pt-1.5">
            <span className="font-sans font-semibold text-ink-900 block">
              {resT.contributionFormulaLabel}:
            </span>
            <span>
              {formatRupees(statement.projectCost)} &minus; {formatRupees(statement.loanAmount)} ={" "}
              {formatRupees(statement.applicantContribution)} ({statement.applicantSharePercent}%)
            </span>
          </div>
        </div>

        <p className="text-[11px] text-ink-500 leading-relaxed italic">
          {isHindi
            ? "ऋणदाता संस्थान मूल्यांकन और दस्तावेज़ सत्यापन के समय आवेदक अंशदान और ऋण राशि की अंतिम पुष्टि करेगा।"
            : "The authorized lending institution will confirm the final loan amount and required applicant margin upon appraisal."}
        </p>
      </div>
    </section>
  );
}
