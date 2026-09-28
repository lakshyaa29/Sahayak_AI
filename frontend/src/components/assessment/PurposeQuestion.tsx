"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { PurposeType } from "@/lib/schemas/assessment";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { LargeRadioGroup } from "./LargeRadioGroup";
import { WhyWeAsk } from "./WhyWeAsk";

interface PurposeQuestionProps {
  value: PurposeType;
  onChange: (val: PurposeType) => void;
  error?: string;
}

export function PurposeQuestion({ value, onChange, error }: PurposeQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.purpose;

  const options = [
    {
      value: "business",
      label: qT.businessLabel,
      description: qT.businessDesc,
    },
    {
      value: "education",
      label: qT.educationLabel,
      description: qT.educationDesc,
    },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <LargeRadioGroup
        name="purpose"
        legend={qT.heading}
        options={options}
        value={value}
        onChange={(val) => onChange(val as PurposeType)}
        error={error}
      />

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
