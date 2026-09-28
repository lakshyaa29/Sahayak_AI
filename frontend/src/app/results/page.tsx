"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAssessment, SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { PreliminaryGuidanceNotice } from "@/components/results/PreliminaryGuidanceNotice";
import { ResultDecision } from "@/components/results/ResultDecision";
import { MatchExplanation } from "@/components/results/MatchExplanation";
import { FinancialStatement } from "@/components/results/FinancialStatement";
import { RepaymentEstimate } from "@/components/results/RepaymentEstimate";
import { AssumptionsList } from "@/components/results/AssumptionsList";
import { InformationSource } from "@/components/results/InformationSource";
import { DocumentChecklist } from "@/components/results/DocumentChecklist";
import { ResultActions } from "@/components/results/ResultActions";
import { MultipleMatchesComparison } from "@/components/results/MultipleMatchesComparison";
import { NoMatchView } from "@/components/results/NoMatchView";
import { NeedsInfoView } from "@/components/results/NeedsInfoView";
import { ResultErrorView } from "@/components/results/ResultErrorView";
import { IncompleteResultView } from "@/components/results/IncompleteResultView";
import { RotateCcw } from "lucide-react";

export default function ResultsPage() {
  const {
    values,
    isCompleted,
    confirmedProfile,
    evaluationResult,
    isEvaluating,
    evaluationError,
    evaluateAssessment,
    resetAssessment,
  } = useAssessment();

  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  // Active scheme selection for multiple matches
  const [selectedSchemeOverride, setSelectedSchemeOverride] =
    useState<SchemeEvaluationOutcome | null>(null);

  const mainHeadingRef = useRef<HTMLDivElement>(null);

  // Trigger evaluation if answers are confirmed but result is missing
  useEffect(() => {
    if (!evaluationResult && !isEvaluating && (isCompleted || confirmedProfile)) {
      evaluateAssessment();
    }
  }, [evaluationResult, isEvaluating, isCompleted, confirmedProfile, evaluateAssessment]);

  // Set document title and manage accessible focus
  useEffect(() => {
    const titleText = isHindi
      ? "योजना मूल्यांकन परिणाम | SAHAYAK AI"
      : "Scheme Assessment Results | SAHAYAK AI";
    document.title = titleText;

    if (evaluationResult && mainHeadingRef.current) {
      mainHeadingRef.current.focus();
    }
  }, [evaluationResult, isHindi]);

  // 1. Loading State
  if (isEvaluating && !evaluationResult) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <div
          role="status"
          aria-live="polite"
          className="max-w-md w-full border border-paper-200 rounded-sm bg-paper-50 p-8 text-center space-y-4 shadow-xs"
        >
          <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-ink-900">
              {resT.evaluatingText}
            </h1>
            <p className="text-xs text-ink-600 leading-relaxed">
              {isHindi
                ? "आधिकारिक ऋण नीतियों और वैधानिक नियमों के आधार पर आपके विवरणों का मूल्यांकन किया जा रहा है।"
                : "Evaluating declared profile against versioned statutory circulars and parameters."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 2. Technical Error State
  if (evaluationError && !evaluationResult) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <ResultErrorView onRetry={() => evaluateAssessment()} />
      </main>
    );
  }

  // 3. Incomplete / Missing Session State
  if (!isCompleted && !confirmedProfile && !evaluationResult) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <IncompleteResultView />
      </main>
    );
  }

  // Profile data
  const profile = confirmedProfile || {
    purpose: values.purpose,
    totalCost: values.totalCost || 120000,
    annualFamilyIncome: values.annualFamilyIncome || 250000,
    communityDeclaration: values.communityDeclaration || "yes",
    district: values.district || "Wardha",
    state: values.state || "Maharashtra",
    businessDescription: values.businessDescription || "",
    courseName: values.courseName || "",
  };

  const primaryScheme = evaluationResult?.primary_scheme || null;
  const alternatives = evaluationResult?.alternative_schemes || [];
  const needsInfoSchemes = evaluationResult?.needs_information_schemes || [];
  const ineligibleSchemes = evaluationResult?.ineligible_schemes || [];

  const allEligibleSchemes: SchemeEvaluationOutcome[] = primaryScheme
    ? [primaryScheme, ...alternatives]
    : [];

  const activeScheme =
    selectedSchemeOverride &&
    allEligibleSchemes.some((s) => s.scheme_id === selectedSchemeOverride.scheme_id)
      ? selectedSchemeOverride
      : primaryScheme;

  const hasMultipleMatches = allEligibleSchemes.length > 1;

  // 4. No Match State
  if (!primaryScheme && ineligibleSchemes.length > 0 && needsInfoSchemes.length === 0) {
    const failedConditions = ineligibleSchemes[0]?.failed_conditions || [];
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <div className="no-print">
          <Link
            href="/assessment?step=review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-link-default hover:text-link-hover"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{resT.secondaryReviewAnswers}</span>
          </Link>
        </div>
        <NoMatchView
          failedConditions={failedConditions}
          district={profile.district}
          state={profile.state}
        />
      </main>
    );
  }

  // 5. Needs Information State (No primary match, but schemes require verification)
  if (!primaryScheme && needsInfoSchemes.length > 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <div className="no-print">
          <Link
            href="/assessment?step=review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-link-default hover:text-link-hover"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{resT.secondaryReviewAnswers}</span>
          </Link>
        </div>
        <NeedsInfoView schemes={needsInfoSchemes} />
      </main>
    );
  }

  // Fallback if no active scheme resolved
  if (!activeScheme) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
        <IncompleteResultView />
      </main>
    );
  }

  const schemeCap =
    activeScheme.code === "SC_MICRO_FINANCE"
      ? 140000
      : activeScheme.code === "SC_TERM_LOAN"
      ? 5000000
      : activeScheme.code === "SC_EDUCATION_LOAN"
      ? 3000000
      : undefined;

  return (
    <main
      className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-8"
      tabIndex={-1}
      ref={mainHeadingRef}
    >
      {/* 1. Back / Edit Answers Action */}
      <div className="no-print flex items-center justify-between border-b border-paper-200 pb-3">
        <Link
          href="/assessment?step=review"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-link-default hover:text-link-hover"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{resT.secondaryReviewAnswers}</span>
        </Link>

        <span className="text-[11px] text-ink-500 font-mono">
          {profile.district}, {profile.state}
        </span>
      </div>

      {/* 2. Preliminary-Guidance Status Notice */}
      <PreliminaryGuidanceNotice />

      {/* 3. Plain Decision & Scheme Identity */}
      <ResultDecision
        scheme={activeScheme}
        hasMultipleMatches={hasMultipleMatches}
      />

      {/* Multiple Matches Comparison (if >1 scheme matches) */}
      {hasMultipleMatches && (
        <MultipleMatchesComparison
          schemes={allEligibleSchemes}
          selectedSchemeId={activeScheme.scheme_id}
          onSelectScheme={(s) => setSelectedSchemeOverride(s)}
        />
      )}

      {/* 4. Why It Matched (Deterministic Criteria Breakdown) */}
      <MatchExplanation
        scheme={activeScheme}
        userAnswers={{
          purpose: profile.purpose,
          totalCost: profile.totalCost,
          annualFamilyIncome: profile.annualFamilyIncome,
          communityDeclaration: profile.communityDeclaration,
          courseName: "courseName" in profile ? profile.courseName : undefined,
          businessDescription:
            "businessDescription" in profile ? profile.businessDescription : undefined,
        }}
      />

      {/* 5. Financial Statement (Reconciled Table & Formulas) */}
      <FinancialStatement
        totalCost={profile.totalCost}
        maxEligibleLoan={activeScheme.max_eligible_loan}
        schemeMaxLoanPct={activeScheme.code === "SC_MAHILA_SAMRIDDHI" ? 95 : 90}
        schemeCap={schemeCap}
      />

      {/* 6. Estimated Repayment (Reducing Balance Amortization & Moratorium) */}
      <RepaymentEstimate
        loanAmount={activeScheme.max_eligible_loan}
        interestRateStr={activeScheme.indicative_interest_rate}
        tenureYears={activeScheme.indicative_tenure_years}
        moratoriumStr={activeScheme.indicative_moratorium}
      />

      {/* 7. Assumptions Used */}
      <AssumptionsList
        totalCost={profile.totalCost}
        financingPercentage={activeScheme.code === "SC_MAHILA_SAMRIDDHI" ? 95 : 90}
        tenureYears={activeScheme.indicative_tenure_years}
        interestRateStr={activeScheme.indicative_interest_rate}
        moratoriumStr={activeScheme.indicative_moratorium}
      />

      {/* 8. Information Source & Metadata */}
      <InformationSource
        sourceMeta={activeScheme.source_meta}
        providerName={isHindi ? activeScheme.provider_hi : activeScheme.provider_en}
        isDemonstration={activeScheme.is_demonstration}
      />

      {/* 9. Documents to Prepare */}
      <DocumentChecklist
        purpose={profile.purpose as "business" | "education"}
        communityDeclaration={profile.communityDeclaration}
      />

      {/* 10. Clear Next Actions & Secondary Actions */}
      <ResultActions
        schemeCode={activeScheme.code}
        loanAmount={activeScheme.max_eligible_loan}
        district={profile.district}
        state={profile.state}
        onStartAgain={() => resetAssessment()}
      />
    </main>
  );
}
