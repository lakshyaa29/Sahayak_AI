"use client";

import React from "react";
import { Input, Select } from "@/components/ui/form-controls";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Info, Sparkles, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BusinessCategoryType, BusinessStageType } from "@/lib/schemas/assessment";

interface BusinessDetailsStepProps {
  description: string;
  category?: BusinessCategoryType | "";
  stage?: BusinessStageType;
  onChangeDescription: (val: string) => void;
  onChangeCategory: (val: BusinessCategoryType | "") => void;
  onChangeStage: (val: BusinessStageType) => void;
  errors?: Record<string, string>;
}

export function BusinessDetailsStep({
  description,
  category,
  stage = "new",
  onChangeDescription,
  onChangeCategory,
  onChangeStage,
  errors = {},
}: BusinessDetailsStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step2Business;

  const categoryOptions = [
    { value: "", label: stepT.categoryPlaceholder },
    { value: "agriculture_allied", label: stepT.categories.agriculture_allied },
    { value: "manufacturing", label: stepT.categories.manufacturing },
    { value: "retail_services", label: stepT.categories.retail_services },
    { value: "transport", label: stepT.categories.transport },
    { value: "other", label: stepT.categories.other },
  ];

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

      <div className="space-y-5">
        {/* Field 1: Business Description (Required) */}
        <div>
          <Input
            id="businessDescription"
            label={stepT.descLabel}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDescription(e.target.value)}
            placeholder={stepT.descPlaceholder}
            error={errors.businessDescription}
            maxLength={200}
            required
            helperText="Write what your enterprise produces, sells, or services (max 200 characters)."
          />
        </div>

        {/* Field 2: Broad Category (Optional) */}
        <div>
          <Select
            id="businessCategory"
            label={stepT.categoryLabel}
            value={category || ""}
            onChange={(e) => onChangeCategory(e.target.value as BusinessCategoryType | "")}
            options={categoryOptions}
            error={errors.businessCategory}
            helperText="Optional grouping. Your written description above remains the primary detail."
          />
        </div>

        {/* Field 3: Business Stage (Required) */}
        <fieldset className="space-y-2.5">
          <legend className="text-sm font-bold text-foreground">
            {stepT.stageLabel} <span className="text-error" aria-hidden="true">*</span>
          </legend>
          {errors.businessStage && (
            <p role="alert" className="text-xs font-bold text-error">
              {errors.businessStage}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <ChoiceCard
              type="radio"
              title={stepT.stages.new}
              description="Setting up a greenfield venture, procuring initial stock, tools, or establishment."
              selected={stage === "new"}
              onSelect={() => onChangeStage("new")}
              icon={<Sparkles className="w-5 h-5 text-primary" />}
            />
            <ChoiceCard
              type="radio"
              title={stepT.stages.expanding}
              description="Scaling an operating trade, upgrading equipment, adding a vehicle, or increasing working capital."
              selected={stage === "expanding"}
              onSelect={() => onChangeStage("expanding")}
              icon={<TrendingUp className="w-5 h-5 text-secondary" />}
            />
          </div>
        </fieldset>

        {/* Explanatory Notice */}
        <div className="bg-surface-muted p-4 rounded-card border border-border text-xs text-secondary flex items-start gap-3 leading-relaxed">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p>{stepT.notice}</p>
        </div>
      </div>
    </div>
  );
}
