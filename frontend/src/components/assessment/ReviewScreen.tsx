"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { AssessmentFormValues } from "@/lib/schemas/assessment";
import { formatCurrencyINR } from "@/lib/utils";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";

interface ReviewScreenProps {
  values: AssessmentFormValues;
  onEditQuestion: (questionId: string) => void;
  errors?: Record<string, string>;
}

export function ReviewScreen({
  values,
  onEditQuestion,
  errors = {},
}: ReviewScreenProps) {
  const { t } = useLanguage();
  const guidedT = t.assessment.guided;
  const isBusiness = values.purpose === "business";

  const communityLabelMap: Record<string, string> = {
    yes: guidedT.questions.community.options.yes,
    no: guidedT.questions.community.options.no,
    unsure: guidedT.questions.community.options.unsure,
    prefer_not_to_say: guidedT.questions.community.options.prefer_not_to_say,
  };

  const businessCategoryMap: Record<string, string> = {
    agriculture_allied: t.assessment.step2Business.categories.agriculture_allied,
    manufacturing: t.assessment.step2Business.categories.manufacturing,
    retail_services: t.assessment.step2Business.categories.retail_services,
    transport: t.assessment.step2Business.categories.transport,
    other: t.assessment.step2Business.categories.other,
  };

  const studyLevelMap: Record<string, string> = {
    diploma: t.assessment.step2Education.levels.diploma,
    undergraduate: t.assessment.step2Education.levels.undergraduate,
    postgraduate: t.assessment.step2Education.levels.postgraduate,
    doctoral: t.assessment.step2Education.levels.doctoral,
    other: t.assessment.step2Education.levels.other,
  };

  const admissionStatusMap: Record<string, string> = {
    confirmed: t.assessment.step2Education.admissions.confirmed,
    applied_awaiting: t.assessment.step2Education.admissions.applied_awaiting,
    exploring: t.assessment.step2Education.admissions.exploring,
  };

  const studyLocationMap: Record<string, string> = {
    india: t.assessment.step2Education.locations.india,
    outside_india: t.assessment.step2Education.locations.outside_india,
    not_decided: t.assessment.step2Education.locations.not_decided,
  };

  const hasValidationErrors = Object.keys(errors).length > 0;

  // Build the ordered rows for the active path
  const rows: { id: string; label: string; value: React.ReactNode }[] = [
    {
      id: "purpose",
      label: guidedT.questions.purpose.heading,
      value: isBusiness
        ? guidedT.questions.purpose.businessLabel
        : guidedT.questions.purpose.educationLabel,
    },
  ];

  if (isBusiness) {
    rows.push({
      id: "businessStage",
      label: guidedT.questions.businessStage.heading,
      value:
        values.businessStage === "new"
          ? guidedT.questions.businessStage.newLabel
          : guidedT.questions.businessStage.expandingLabel,
    });
    rows.push({
      id: "businessActivity",
      label: guidedT.questions.businessActivity.heading,
      value: (
        <div>
          <div>{values.businessDescription || "—"}</div>
          {values.businessCategory && (
            <div className="text-xs text-secondary mt-0.5">
              {businessCategoryMap[values.businessCategory] || values.businessCategory}
            </div>
          )}
        </div>
      ),
    });
  } else {
    rows.push({
      id: "educationCourse",
      label: guidedT.questions.educationCourse.heading,
      value: (
        <div>
          <div>{values.courseName || "—"}</div>
          {values.institutionName && (
            <div className="text-xs text-secondary mt-0.5">{values.institutionName}</div>
          )}
          {values.courseDurationMonths && (
            <div className="text-xs text-secondary mt-0.5">
              {values.courseDurationMonths} months
            </div>
          )}
          <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 inline-block px-1.5 py-0.5 rounded-xs mt-1 border border-emerald-200">
            {values.institutionAccredited !== false
              ? (guidedT.questions.educationCourse.accreditationLabel + ": " + (values.institutionName ? "Recognized" : "Accredited"))
              : "Pending accreditation confirmation"}
          </div>
        </div>
      ),
    });
    rows.push({
      id: "educationLevel",
      label: guidedT.questions.educationLevel.heading,
      value: values.studyLevel
        ? studyLevelMap[values.studyLevel] || values.studyLevel
        : "—",
    });
    rows.push({
      id: "educationAdmission",
      label: guidedT.questions.educationAdmission.heading,
      value: values.admissionStatus
        ? admissionStatusMap[values.admissionStatus] || values.admissionStatus
        : "—",
    });
    rows.push({
      id: "educationLocation",
      label: guidedT.questions.educationLocation.heading,
      value: values.studyLocation
        ? studyLocationMap[values.studyLocation] || values.studyLocation
        : "—",
    });
  }

  rows.push({
    id: "cost",
    label: isBusiness
      ? guidedT.questions.cost.businessHeading
      : guidedT.questions.cost.educationHeading,
    value: (
      <div>
        <div className="font-semibold text-ink">{formatCurrencyINR(values.totalCost)}</div>
        {values.borrowingAmount && values.borrowingAmount > 0 && (
          <div className="text-xs text-secondary mt-0.5">
            Requested: {formatCurrencyINR(values.borrowingAmount)}
          </div>
        )}
      </div>
    ),
  });

  rows.push({
    id: "income",
    label: guidedT.questions.income.heading,
    value: (
      <span className="font-semibold text-ink">
        {values.annualFamilyIncome === 0
          ? "₹0"
          : formatCurrencyINR(values.annualFamilyIncome)}
      </span>
    ),
  });

  rows.push({
    id: "community",
    label: guidedT.questions.community.heading,
    value: communityLabelMap[values.communityDeclaration] || values.communityDeclaration,
  });

  rows.push({
    id: "location",
    label: guidedT.questions.location.heading,
    value: (
      <div>
        <div>
          {values.district}, {values.state}
        </div>
        {values.pincode && (
          <div className="text-xs text-secondary mt-0.5">PIN: {values.pincode}</div>
        )}
      </div>
    ),
  });

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={guidedT.reviewTitle}
        guidance={guidedT.reviewSubtitle}
      />

      {hasValidationErrors && (
        <div
          role="alert"
          className="p-3.5 bg-error/10 border-l-3 border-error text-error text-xs rounded-xs font-semibold leading-relaxed"
        >
          <p className="font-bold mb-1">Please complete all required answers before proceeding:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary List */}
      <div className="border border-border rounded-xs divide-y divide-border bg-surface overflow-hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 sm:gap-4 hover:bg-surface-muted/30 transition-colors"
          >
            <div className="sm:w-5/12 text-xs font-semibold text-secondary">
              {row.label}
            </div>
            <div className="sm:w-5/12 text-sm text-ink leading-relaxed">
              {row.value}
            </div>
            <div className="sm:w-2/12 sm:text-right pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => onEditQuestion(row.id)}
                className="text-xs font-semibold text-link underline hover:text-ink transition-colors p-1"
                aria-label={`${guidedT.changeAction}: ${row.label}`}
              >
                {guidedT.changeAction}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preliminary Notice */}
      <div className="border border-border bg-surface-muted/60 rounded-xs p-3.5 text-xs text-secondary leading-relaxed">
        {guidedT.reviewNotice}
      </div>
    </div>
  );
}
