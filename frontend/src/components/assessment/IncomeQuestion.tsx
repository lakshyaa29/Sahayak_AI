"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { CurrencyInput } from "@/components/ui/form-controls";
import { formatCurrencyINR } from "@/lib/utils";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { WhyWeAsk } from "./WhyWeAsk";

interface IncomeQuestionProps {
  annualFamilyIncome: number;
  onChangeIncome: (val: number | undefined) => void;
  error?: string;
}

export function IncomeQuestion({
  annualFamilyIncome,
  onChangeIncome,
  error,
}: IncomeQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.income;

  const incomePresets = [0, 100000, 200000, 300000, 500000, 800000];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <div className="space-y-4">
        <div className="space-y-3">
          <CurrencyInput
            id="annualFamilyIncome"
            label={qT.amountLabel}
            value={annualFamilyIncome}
            onChange={(val) => onChangeIncome(val ?? 0)}
            error={error}
            required
            aria-required="true"
          />

          {/* Quick Income Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-secondary font-medium mr-1">
              {t.assessment.guided.quickSelect}
            </span>
            {incomePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeIncome(preset)}
                className={`text-xs px-2.5 py-1 rounded-xs border transition-colors ${
                  annualFamilyIncome === preset
                    ? "bg-ink text-paper border-ink font-semibold"
                    : "bg-surface text-secondary border-border hover:border-ink hover:text-ink"
                }`}
              >
                {preset === 0 ? "₹0" : formatCurrencyINR(preset)}
              </button>
            ))}
          </div>

          <p className="text-xs text-secondary italic">
            {qT.zeroIncomeNote}
          </p>
        </div>
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
