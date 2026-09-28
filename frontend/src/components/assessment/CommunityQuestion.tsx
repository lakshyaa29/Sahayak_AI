"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { CommunityDeclarationType } from "@/lib/schemas/assessment";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { LargeRadioGroup } from "./LargeRadioGroup";
import { WhyWeAsk } from "./WhyWeAsk";

interface CommunityQuestionProps {
  value: CommunityDeclarationType;
  onChange: (val: CommunityDeclarationType) => void;
  error?: string;
}

export function CommunityQuestion({
  value,
  onChange,
  error,
}: CommunityQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.community;

  const options = [
    {
      value: "yes",
      label: qT.options.yes,
    },
    {
      value: "no",
      label: qT.options.no,
    },
    {
      value: "unsure",
      label: qT.options.unsure,
    },
    {
      value: "prefer_not_to_say",
      label: qT.options.prefer_not_to_say,
    },
  ];

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <LargeRadioGroup
        name="communityDeclaration"
        legend={qT.heading}
        options={options}
        value={value}
        onChange={(val) => onChange(val as CommunityDeclarationType)}
        error={error}
      />

      <div className="text-xs text-secondary bg-surface-muted/30 border border-border rounded-xs p-3 leading-relaxed">
        {qT.privacyNotice}
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
