"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  isReview?: boolean;
}

export function AssessmentProgress({
  currentQuestion,
  totalQuestions,
  isReview = false,
}: AssessmentProgressProps) {
  const { t } = useLanguage();
  const guidedT = t.assessment.guided;

  if (isReview) {
    return (
      <div className="pt-1 pb-2">
        <div
          role="status"
          aria-live="polite"
          className="text-xs font-semibold text-secondary uppercase tracking-wider"
        >
          {guidedT.reviewTitle}
        </div>
      </div>
    );
  }

  const progressText = guidedT.progressLabel(currentQuestion, totalQuestions);
  const percentage = Math.min(100, Math.max(0, Math.round((currentQuestion / totalQuestions) * 100)));

  return (
    <div className="space-y-2 pt-1 pb-2">
      {/* Mandatory Text Progress */}
      <div
        role="status"
        aria-live="polite"
        className="text-xs sm:text-sm font-semibold text-secondary uppercase tracking-wider"
      >
        {progressText}
      </div>

      {/* Secondary Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={currentQuestion}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={guidedT.progressAriaLabel(currentQuestion, totalQuestions)}
        className="w-full h-1 sm:h-1.5 bg-surface-muted rounded-full overflow-hidden border border-border"
      >
        <div
          className="h-full bg-saffron transition-all duration-200 motion-reduce:transition-none rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
