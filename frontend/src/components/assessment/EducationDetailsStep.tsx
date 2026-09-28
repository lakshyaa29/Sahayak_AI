"use client";

import React from "react";
import { Input, Select } from "@/components/ui/form-controls";
import { Info } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import {
  AdmissionStatusType,
  EducationLevelType,
  StudyLocationType,
} from "@/lib/schemas/assessment";

interface EducationDetailsStepProps {
  courseName: string;
  studyLevel?: EducationLevelType;
  admissionStatus?: AdmissionStatusType;
  studyLocation?: StudyLocationType;
  institutionName?: string;
  courseDurationMonths?: number;
  onChangeCourseName: (val: string) => void;
  onChangeStudyLevel: (val: EducationLevelType) => void;
  onChangeAdmissionStatus: (val: AdmissionStatusType) => void;
  onChangeStudyLocation: (val: StudyLocationType) => void;
  onChangeInstitutionName: (val: string) => void;
  onChangeCourseDuration: (val: number | undefined) => void;
  errors?: Record<string, string>;
}

export function EducationDetailsStep({
  courseName,
  studyLevel = "undergraduate",
  admissionStatus = "confirmed",
  studyLocation = "india",
  institutionName = "",
  courseDurationMonths,
  onChangeCourseName,
  onChangeStudyLevel,
  onChangeAdmissionStatus,
  onChangeStudyLocation,
  onChangeInstitutionName,
  onChangeCourseDuration,
  errors = {},
}: EducationDetailsStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step2Education;

  const levelOptions = [
    { value: "diploma", label: stepT.levels.diploma },
    { value: "undergraduate", label: stepT.levels.undergraduate },
    { value: "postgraduate", label: stepT.levels.postgraduate },
    { value: "doctoral", label: stepT.levels.doctoral },
    { value: "other", label: stepT.levels.other },
  ];

  const admissionOptions = [
    { value: "confirmed", label: stepT.admissions.confirmed },
    { value: "applied_awaiting", label: stepT.admissions.applied_awaiting },
    { value: "exploring", label: stepT.admissions.exploring },
  ];

  const locationOptions = [
    { value: "india", label: stepT.locations.india },
    { value: "outside_india", label: stepT.locations.outside_india },
    { value: "not_decided", label: stepT.locations.not_decided },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <h2 id="step-heading" tabIndex={-1} className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight focus:outline-none">
          {stepT.heading}
        </h2>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          {stepT.subheading}
        </p>
      </div>

      <div className="space-y-5">
        {/* Field 1: Course / Programme Name (Required) */}
        <div>
          <Input
            id="courseName"
            label={stepT.courseLabel}
            value={courseName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeCourseName(e.target.value)}
            placeholder={stepT.coursePlaceholder}
            error={errors.courseName}
            maxLength={150}
            required
            helperText="Enter your degree, technical diploma, or certificate programme."
          />
        </div>

        {/* Two-column layout for dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 2: Study Level (Required) */}
          <div>
            <Select
              id="studyLevel"
              label={stepT.levelLabel}
              value={studyLevel}
              onChange={(e) => onChangeStudyLevel(e.target.value as EducationLevelType)}
              options={levelOptions}
              error={errors.studyLevel}
              required
            />
          </div>

          {/* Field 3: Admission Status (Required) */}
          <div>
            <Select
              id="admissionStatus"
              label={stepT.admissionLabel}
              value={admissionStatus}
              onChange={(e) => onChangeAdmissionStatus(e.target.value as AdmissionStatusType)}
              options={admissionOptions}
              error={errors.admissionStatus}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 4: Study Location (Required) */}
          <div>
            <Select
              id="studyLocation"
              label={stepT.locationLabel}
              value={studyLocation}
              onChange={(e) => onChangeStudyLocation(e.target.value as StudyLocationType)}
              options={locationOptions}
              error={errors.studyLocation}
              required
            />
          </div>

          {/* Field 6: Course Duration in Months (Optional) */}
          <div>
            <Input
              id="courseDurationMonths"
              label={stepT.durationLabel}
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={courseDurationMonths !== undefined ? String(courseDurationMonths) : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                onChangeCourseDuration(isNaN(val as number) ? undefined : val);
              }}
              placeholder={stepT.durationPlaceholder}
              error={errors.courseDurationMonths}
              helperText="Typical duration (e.g., 36 for 3-year degree, 48 for 4-year B.Tech)."
            />
          </div>
        </div>

        {/* Field 5: Institution Name (Optional) */}
        <div>
          <Input
            id="institutionName"
            label={stepT.institutionLabel}
            value={institutionName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInstitutionName(e.target.value)}
            placeholder={stepT.institutionPlaceholder}
            error={errors.institutionName}
            maxLength={150}
            helperText="Name of university, institute, or college if decided."
          />
        </div>

        {/* Explanatory Notice */}
        <div className="bg-surface-muted p-4 rounded-card border border-border text-xs text-secondary flex items-start gap-3 leading-relaxed">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p>{stepT.notice}</p>
        </div>
      </div>
    </div>
  );
}
