"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { EducationLevelType } from "@/lib/schemas/assessment";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { LargeRadioGroup } from "./LargeRadioGroup";
import { WhyWeAsk } from "./WhyWeAsk";

interface EducationLevelQuestionProps {
  value?: EducationLevelType;
  onChange: (val: EducationLevelType) => void;
  error?: string;
}

export function EducationLevelQuestion({
  value = "undergraduate",
  onChange,
  error,
}: EducationLevelQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.educationLevel;
  const legacyLevels = t.assessment.step2Education.levels;

  const options = [
    { value: "diploma", label: legacyLevels.diploma },
    { value: "undergraduate", label: legacyLevels.undergraduate },
    { value: "postgraduate", label: legacyLevels.postgraduate },
    { value: "doctoral", label: legacyLevels.doctoral },
    { value: "other", label: legacyLevels.other },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <LargeRadioGroup
        name="studyLevel"
        legend={qT.heading}
        options={options}
        value={value}
        onChange={(val) => onChange(val as EducationLevelType)}
        error={error}
      />

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
