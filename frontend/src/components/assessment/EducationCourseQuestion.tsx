"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { Input } from "@/components/ui/form-controls";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { WhyWeAsk } from "./WhyWeAsk";

interface EducationCourseQuestionProps {
  courseName: string;
  institutionName?: string;
  courseDurationMonths?: number;
  onChangeCourseName: (val: string) => void;
  onChangeInstitutionName: (val: string) => void;
  onChangeCourseDuration: (val: number | undefined) => void;
  error?: string;
}

export function EducationCourseQuestion({
  courseName,
  institutionName = "",
  courseDurationMonths,
  onChangeCourseName,
  onChangeInstitutionName,
  onChangeCourseDuration,
  error,
}: EducationCourseQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.educationCourse;

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="courseName" className="block text-sm font-semibold text-ink mb-1.5">
            {qT.courseLabel} <span className="text-error" aria-hidden="true">*</span>
          </label>
          <Input
            id="courseName"
            value={courseName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeCourseName(e.target.value)}
            placeholder={qT.coursePlaceholder}
            error={error}
            maxLength={150}
            required
            aria-required="true"
          />
        </div>

        <div>
          <Input
            id="institutionName"
            label={qT.institutionLabel}
            value={institutionName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInstitutionName(e.target.value)}
            placeholder={qT.institutionPlaceholder}
            maxLength={150}
          />
        </div>

        <div>
          <Input
            id="courseDurationMonths"
            label={qT.durationLabel}
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            value={courseDurationMonths !== undefined ? String(courseDurationMonths) : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const parsed = parseInt(e.target.value, 10);
              onChangeCourseDuration(isNaN(parsed) ? undefined : parsed);
            }}
            placeholder={qT.durationPlaceholder}
          />
        </div>
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
