"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { PurposeType } from "@/lib/schemas/assessment";
import { CurrencyInput } from "@/components/ui/form-controls";
import { formatCurrencyINR } from "@/lib/utils";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { WhyWeAsk } from "./WhyWeAsk";

interface CostQuestionProps {
  purpose: PurposeType;
  totalCost: number;
  borrowingAmount?: number;
  onChangeTotalCost: (val: number | undefined) => void;
  onChangeBorrowingAmount: (val: number | undefined) => void;
  error?: string;
  borrowingError?: string;
}

export function CostQuestion({
  purpose,
  totalCost,
  borrowingAmount,
  onChangeTotalCost,
  onChangeBorrowingAmount,
  error,
  borrowingError,
}: CostQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.cost;

  const heading =
    purpose === "business" ? qT.businessHeading : qT.educationHeading;

  const presets =
    purpose === "business"
      ? [50000, 120000, 250000, 500000, 1000000]
      : [100000, 250000, 500000, 1000000, 2000000];

  const isBorrowingExceeded =
    borrowingAmount !== undefined &&
    !isNaN(borrowingAmount) &&
    borrowingAmount > 0 &&
    totalCost > 0 &&
    borrowingAmount > totalCost;

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={heading}
        guidance={qT.guidance}
      />

      <div className="space-y-5">
        <div className="space-y-3">
          <CurrencyInput
            id="totalCost"
            label={qT.amountLabel}
            value={totalCost || 0}
            onChange={(val) => onChangeTotalCost(val || 0)}
            error={error}
            required
            aria-required="true"
          />

          {/* Quick Outlay Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-secondary font-medium mr-1">
              {t.assessment.guided.quickSelect}
            </span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeTotalCost(preset)}
                className={`text-xs px-2.5 py-1 rounded-xs border transition-colors ${
                  totalCost === preset
                    ? "bg-ink text-paper border-ink font-semibold"
                    : "bg-surface text-secondary border-border hover:border-ink hover:text-ink"
                }`}
              >
                {formatCurrencyINR(preset)}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
          <CurrencyInput
            id="borrowingAmount"
            label={qT.borrowingLabel}
            value={borrowingAmount || 0}
            onChange={(val) => onChangeBorrowingAmount(val)}
            error={borrowingError || (isBorrowingExceeded ? qT.borrowingErrorExceeded : undefined)}
            helperText={qT.borrowingHelp}
          />
        </div>
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
