"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { StudyLocationType } from "@/lib/schemas/assessment";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { LargeRadioGroup } from "./LargeRadioGroup";
import { WhyWeAsk } from "./WhyWeAsk";

interface EducationLocationQuestionProps {
  value?: StudyLocationType;
  onChange: (val: StudyLocationType) => void;
  error?: string;
}

export function EducationLocationQuestion({
  value = "india",
  onChange,
  error,
}: EducationLocationQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.educationLocation;
  const legacyLocations = t.assessment.step2Education.locations;

  const options = [
    { value: "india", label: legacyLocations.india },
    { value: "outside_india", label: legacyLocations.outside_india },
    { value: "not_decided", label: legacyLocations.not_decided },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <LargeRadioGroup
        name="studyLocation"
        legend={qT.heading}
        options={options}
        value={value}
        onChange={(val) => onChange(val as StudyLocationType)}
        error={error}
      />

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
