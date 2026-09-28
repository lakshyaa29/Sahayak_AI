"use client";

import React from "react";
import { CurrencyInput } from "@/components/ui/form-controls";
import { HelpCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { PurposeType } from "@/lib/schemas/assessment";
import { formatCurrencyINR } from "@/lib/utils";

interface CostStepProps {
  purpose: PurposeType;
  totalCost: number;
  borrowingAmount?: number;
  onChangeTotalCost: (val: number | undefined) => void;
  onChangeBorrowingAmount: (val: number | undefined) => void;
  errors?: Record<string, string>;
}

export function CostStep({
  purpose,
  totalCost,
  borrowingAmount,
  onChangeTotalCost,
  onChangeBorrowingAmount,
  errors = {},
}: CostStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step3;

  const heading =
    purpose === "business" ? stepT.businessHeading : stepT.educationHeading;

  // Shortcut presets for common baseline project outlays
  const businessPresets = [50000, 120000, 250000, 500000, 1000000];
  const educationPresets = [100000, 250000, 500000, 1000000, 2000000];
  const presets = purpose === "business" ? businessPresets : educationPresets;

  const isBorrowingExceeded =
    borrowingAmount !== undefined &&
    !isNaN(borrowingAmount) &&
    borrowingAmount > 0 &&
    totalCost > 0 &&
    borrowingAmount > totalCost;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <h2 id="step-heading" tabIndex={-1} className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight focus:outline-none">
          {heading}
        </h2>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          {stepT.costHelper}
        </p>
      </div>

      <div className="space-y-6">
        {/* Field 1: Total Estimated Cost (Required) */}
        <div className="space-y-3">
          <CurrencyInput
            id="totalCost"
            label={stepT.costLabel}
            value={totalCost || 0}
            onChange={(val) => onChangeTotalCost(val || 0)}
            error={errors.totalCost}
            required
            helperText="Total financial outlay needed for equipment, materials, establishment, or full tuition & hostel fees."
          />

          {/* Quick Outlay Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium mr-1">Quick Select:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeTotalCost(preset)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  totalCost === preset
                    ? "bg-primary text-white border-primary font-bold shadow-xs"
                    : "bg-surface text-secondary border-border hover:border-primary/50"
                }`}
              >
                {formatCurrencyINR(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: Requested Borrowing Amount (Optional) */}
        <div className="space-y-2 pt-2 border-t border-border">
          <CurrencyInput
            id="borrowingAmount"
            label={stepT.borrowingLabel}
            value={borrowingAmount || 0}
            onChange={(val) => onChangeBorrowingAmount(val)}
            error={errors.borrowingAmount}
            helperText={stepT.borrowingHelper}
          />
        </div>

        {/* Inconsistency Warning if borrowing > total cost */}
        {isBorrowingExceeded && (
          <div
            role="alert"
            className="p-3.5 bg-error/10 border border-error/20 text-error rounded-card text-xs flex items-start gap-2.5 font-medium leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Inconsistent Borrowing Amount</p>
              <p>
                The requested loan amount ({formatCurrencyINR(borrowingAmount!)}) cannot exceed the total project cost ({formatCurrencyINR(totalCost)}). In concessional schemes, financing covers up to 90%–100% of the outlay with a required promoter equity contribution.
              </p>
            </div>
          </div>
        )}

        {/* Informative Guidance Box */}
        <div className="bg-surface-muted p-4 rounded-card border border-border text-xs text-secondary flex items-start gap-3 leading-relaxed">
          <HelpCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p>
            <strong>Note on Promoters Equity:</strong> Government lending corporations (like NSFDC) typically finance up to 90% of the project cost, with the remaining 10% contributed as borrower equity or State subsidy. The exact ratio will be detailed on the repayment calculation screen.
          </p>
        </div>
      </div>
    </div>
  );
}
