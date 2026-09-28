"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { AdmissionStatusType } from "@/lib/schemas/assessment";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { LargeRadioGroup } from "./LargeRadioGroup";
import { WhyWeAsk } from "./WhyWeAsk";

interface EducationAdmissionQuestionProps {
  value?: AdmissionStatusType;
  onChange: (val: AdmissionStatusType) => void;
  error?: string;
}

export function EducationAdmissionQuestion({
  value = "confirmed",
  onChange,
  error,
}: EducationAdmissionQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.educationAdmission;
  const legacyAdmissions = t.assessment.step2Education.admissions;

  const options = [
    { value: "confirmed", label: legacyAdmissions.confirmed },
    { value: "applied_awaiting", label: legacyAdmissions.applied_awaiting },
    { value: "exploring", label: legacyAdmissions.exploring },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <LargeRadioGroup
        name="admissionStatus"
        legend={qT.heading}
        options={options}
        value={value}
        onChange={(val) => onChange(val as AdmissionStatusType)}
        error={error}
      />

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
