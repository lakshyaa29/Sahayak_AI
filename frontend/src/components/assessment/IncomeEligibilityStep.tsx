"use client";

import React from "react";
import { CurrencyInput } from "@/components/ui/form-controls";
import { ChoiceCard } from "@/components/ui/choice-card";
import { ShieldCheck, HelpCircle, UserCheck, AlertTriangle, Lock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { CommunityDeclarationType } from "@/lib/schemas/assessment";
import { formatCurrencyINR } from "@/lib/utils";

interface IncomeEligibilityStepProps {
  annualFamilyIncome: number;
  communityDeclaration: CommunityDeclarationType;
  onChangeIncome: (val: number | undefined) => void;
  onChangeCommunity: (val: CommunityDeclarationType) => void;
  errors?: Record<string, string>;
}

export function IncomeEligibilityStep({
  annualFamilyIncome,
  communityDeclaration,
  onChangeIncome,
  onChangeCommunity,
  errors = {},
}: IncomeEligibilityStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step4;

  const incomePresets = [0, 100000, 200000, 300000, 500000, 800000];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <h2 id="step-heading" tabIndex={-1} className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight focus:outline-none">
          {stepT.heading}
        </h2>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          {stepT.subheading}
        </p>
      </div>

      <div className="space-y-6">
        {/* Field 1: Annual Family Income (Required, allows 0) */}
        <div className="space-y-3">
          <CurrencyInput
            id="annualFamilyIncome"
            label={stepT.incomeLabel}
            value={annualFamilyIncome}
            onChange={(val) => onChangeIncome(val ?? 0)}
            error={errors.annualFamilyIncome}
            required
            helperText={stepT.incomeHelper}
          />

          {/* Quick Income Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium mr-1">Quick Select:</span>
            {incomePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeIncome(preset)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  annualFamilyIncome === preset
                    ? "bg-primary text-white border-primary font-bold shadow-xs"
                    : "bg-surface text-secondary border-border hover:border-primary/50"
                }`}
              >
                {preset === 0 ? "₹0 (Subsistence/None)" : formatCurrencyINR(preset)}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground italic">
            * Higher family income above ₹5 Lakh does not block this form; any statutory ceilings will be transparently detailed in scheme results.
          </p>
        </div>

        {/* Field 2: Community Self-Declaration (Required, 4 options) */}
        <fieldset className="space-y-3 pt-2 border-t border-border">
          <div>
            <legend className="text-sm font-bold text-foreground">
              {stepT.communityLabel} <span className="text-error" aria-hidden="true">*</span>
            </legend>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              {stepT.communityHelper}
            </p>
          </div>

          {errors.communityDeclaration && (
            <p role="alert" className="text-xs font-bold text-error">
              {errors.communityDeclaration}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ChoiceCard
              type="radio"
              title="Yes, SC Category"
              description={stepT.communityOptions.yes}
              selected={communityDeclaration === "yes"}
              onSelect={() => onChangeCommunity("yes")}
              icon={<ShieldCheck className="w-5 h-5 text-success" />}
            />
            <ChoiceCard
              type="radio"
              title="No, Other Category"
              description={stepT.communityOptions.no}
              selected={communityDeclaration === "no"}
              onSelect={() => onChangeCommunity("no")}
              icon={<UserCheck className="w-5 h-5 text-muted-foreground" />}
            />
            <ChoiceCard
              type="radio"
              title="I am not sure"
              description={stepT.communityOptions.unsure}
              selected={communityDeclaration === "unsure"}
              onSelect={() => onChangeCommunity("unsure")}
              icon={<HelpCircle className="w-5 h-5 text-secondary" />}
            />
            <ChoiceCard
              type="radio"
              title="Prefer not to say"
              description={stepT.communityOptions.prefer_not_to_say}
              selected={communityDeclaration === "prefer_not_to_say"}
              onSelect={() => onChangeCommunity("prefer_not_to_say")}
              icon={<Lock className="w-5 h-5 text-muted-foreground" />}
            />
          </div>
        </fieldset>

        {/* Privacy & Safe Draft Handling Banner */}
        <div className="bg-surface-muted p-4 rounded-card border border-border text-xs text-secondary flex items-start gap-3 leading-relaxed">
          <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Strict Privacy & No Document Uploads</p>
            <p>
              We do not ask for certificate numbers, Aadhaar, PAN, bank accounts, or uploads. {stepT.draftNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
