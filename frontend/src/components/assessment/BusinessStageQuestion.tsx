"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { BusinessStageType } from "@/lib/schemas/assessment";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { LargeRadioGroup } from "./LargeRadioGroup";
import { WhyWeAsk } from "./WhyWeAsk";

interface BusinessStageQuestionProps {
  value?: BusinessStageType;
  onChange: (val: BusinessStageType) => void;
  error?: string;
}

export function BusinessStageQuestion({
  value = "new",
  onChange,
  error,
}: BusinessStageQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.businessStage;

  const options = [
    {
      value: "new",
      label: qT.newLabel,
      description: qT.newDesc,
    },
    {
      value: "expanding",
      label: qT.expandingLabel,
      description: qT.expandingDesc,
    },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <LargeRadioGroup
        name="businessStage"
        legend={qT.heading}
        options={options}
        value={value}
        onChange={(val) => onChange(val as BusinessStageType)}
        error={error}
      />

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
