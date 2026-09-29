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
  institutionAccredited?: boolean;
  onChangeCourseName: (val: string) => void;
  onChangeInstitutionName: (val: string) => void;
  onChangeCourseDuration: (val: number | undefined) => void;
  onChangeInstitutionAccredited?: (val: boolean) => void;
  error?: string;
}

export function EducationCourseQuestion({
  courseName,
  institutionName = "",
  courseDurationMonths,
  institutionAccredited = true,
  onChangeCourseName,
  onChangeInstitutionName,
  onChangeCourseDuration,
  onChangeInstitutionAccredited,
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

        {/* Institution Accreditation Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-sm border border-paper-200 bg-paper-50 hover:bg-paper-100 transition-colors cursor-pointer select-none">
            <input
              id="institutionAccredited"
              type="checkbox"
              checked={institutionAccredited}
              onChange={(e) => onChangeInstitutionAccredited?.(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-xs border-border text-accent focus:ring-focus"
            />
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-ink-900 leading-snug">
                {qT.accreditationCheckbox}
              </span>
              <span className="block text-[11px] text-ink-600 leading-relaxed">
                {qT.accreditationHelper}
              </span>
            </div>
          </label>
        </div>
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}

