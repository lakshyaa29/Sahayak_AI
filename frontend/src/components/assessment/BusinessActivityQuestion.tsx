"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { BusinessCategoryType } from "@/lib/schemas/assessment";
import { Input, Select } from "@/components/ui/form-controls";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { WhyWeAsk } from "./WhyWeAsk";

interface BusinessActivityQuestionProps {
  description: string;
  category?: BusinessCategoryType | "";
  onChangeDescription: (val: string) => void;
  onChangeCategory: (val: BusinessCategoryType | "") => void;
  error?: string;
}

export function BusinessActivityQuestion({
  description,
  category,
  onChangeDescription,
  onChangeCategory,
  error,
}: BusinessActivityQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.businessActivity;
  const legacyCategories = t.assessment.step2Business.categories;

  const categoryOptions = [
    { value: "", label: qT.categoryPlaceholder },
    { value: "agriculture_allied", label: legacyCategories.agriculture_allied },
    { value: "manufacturing", label: legacyCategories.manufacturing },
    { value: "retail_services", label: legacyCategories.retail_services },
    { value: "transport", label: legacyCategories.transport },
    { value: "other", label: legacyCategories.other },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="businessDescription" className="block text-sm font-semibold text-ink mb-1.5">
            {qT.descLabel} <span className="text-error" aria-hidden="true">*</span>
          </label>
          <Input
            id="businessDescription"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDescription(e.target.value)}
            placeholder={qT.descPlaceholder}
            error={error}
            maxLength={200}
            required
            aria-required="true"
          />
        </div>

        <div>
          <Select
            id="businessCategory"
            label={qT.categoryLabel}
            value={category || ""}
            onChange={(e) => onChangeCategory(e.target.value as BusinessCategoryType | "")}
            options={categoryOptions}
          />
        </div>
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
