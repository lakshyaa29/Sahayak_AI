"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { AssessmentFormValues } from "@/lib/schemas/assessment";
import { formatCurrencyINR } from "@/lib/utils";

interface ReviewStepProps {
  values: AssessmentFormValues;
  onEditStep: (stepNumber: number) => void;
  errors?: Record<string, string>;
}

export function ReviewStep({ values, onEditStep, errors = {} }: ReviewStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step6;
  const isBusiness = values.purpose === "business";

  // Human readable labels
  const communityLabelMap: Record<string, string> = {
    yes: "Yes, SC Category Declared",
    no: "No, Other Category",
    unsure: "I am not sure (Pending Verification)",
    prefer_not_to_say: "Prefer not to say",
  };

  const businessCategoryMap: Record<string, string> = {
    agriculture_allied: "Agriculture and allied activities",
    manufacturing: "Manufacturing or small industry",
    retail_services: "Retail, trade, or services",
    transport: "Transport",
    other: "Other / not sure",
  };

  const studyLevelMap: Record<string, string> = {
    diploma: "Diploma",
    undergraduate: "Undergraduate Degree",
    postgraduate: "Postgraduate Degree",
    doctoral: "Doctoral (Ph.D)",
    other: "Other / Not sure",
  };

  const admissionStatusMap: Record<string, string> = {
    confirmed: "Admission Confirmed",
    applied_awaiting: "Applied / Awaiting Admission",
    exploring: "Still Exploring",
  };

  const studyLocationMap: Record<string, string> = {
    india: "In India",
    outside_india: "Outside India (Abroad)",
    not_decided: "Not Decided",
  };

  const hasValidationErrors = Object.keys(errors).length > 0;

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

      {hasValidationErrors && (
        <div
          role="alert"
          className="p-4 bg-error/10 border border-error/20 rounded-card text-error text-xs flex items-start gap-2.5 leading-relaxed font-medium"
        >
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Please resolve required fields before confirming:</p>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* GROUP 1: Purpose & Requirement Details */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground">
              {stepT.group1Title}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(isBusiness ? 2 : 2)}
              className="text-xs text-primary hover:text-primary-hover gap-1 h-8 px-2"
              aria-label={`Edit ${stepT.group1Title}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{stepT.editBtn}</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Primary Purpose</dt>
                <dd className="font-semibold text-foreground text-sm mt-0.5 capitalize">
                  {isBusiness ? "Business / Self-Employment" : "Professional / Technical Education"}
                </dd>
              </div>

              {isBusiness ? (
                <>
                  <div>
                    <dt className="text-muted-foreground">Business Stage</dt>
                    <dd className="font-semibold text-foreground mt-0.5 capitalize">
                      {values.businessStage === "new" ? "Starting a new business" : "Expanding existing business"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Business Description</dt>
                    <dd className="font-medium text-foreground mt-0.5 leading-relaxed">
                      {values.businessDescription || stepT.notProvided}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Activity Category</dt>
                    <dd className="font-medium text-foreground mt-0.5">
                      {values.businessCategory ? businessCategoryMap[values.businessCategory] : stepT.notProvided}
                    </dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="text-muted-foreground">Course / Programme</dt>
                    <dd className="font-semibold text-foreground mt-0.5 text-sm">
                      {values.courseName || stepT.notProvided}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Study Level</dt>
                    <dd className="font-medium text-foreground mt-0.5">
                      {values.studyLevel ? studyLevelMap[values.studyLevel] : stepT.notProvided}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Admission Status</dt>
                    <dd className="font-medium text-foreground mt-0.5">
                      {values.admissionStatus ? admissionStatusMap[values.admissionStatus] : stepT.notProvided}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Study Location</dt>
                    <dd className="font-medium text-foreground mt-0.5">
                      {values.studyLocation ? studyLocationMap[values.studyLocation] : stepT.notProvided}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Institution Name</dt>
                    <dd className="font-medium text-foreground mt-0.5">
                      {values.institutionName || stepT.notProvided}
                    </dd>
                  </div>
                  {values.courseDurationMonths && (
                    <div>
                      <dt className="text-muted-foreground">Course Duration</dt>
                      <dd className="font-medium text-foreground mt-0.5">
                        {values.courseDurationMonths} months
                      </dd>
                    </div>
                  )}
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* GROUP 2: Estimated Costs */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground">
              {stepT.group2Title}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(3)}
              className="text-xs text-primary hover:text-primary-hover gap-1 h-8 px-2"
              aria-label={`Edit ${stepT.group2Title}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{stepT.editBtn}</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Total Estimated Outlay</dt>
                <dd className="font-black text-foreground text-base mt-0.5 tabular-nums">
                  {formatCurrencyINR(values.totalCost)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Requested Borrowing</dt>
                <dd className="font-semibold text-foreground text-sm mt-0.5 tabular-nums">
                  {values.borrowingAmount && values.borrowingAmount > 0
                    ? formatCurrencyINR(values.borrowingAmount)
                    : stepT.notProvided}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* GROUP 3: Income & Eligibility */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground">
              {stepT.group3Title}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(4)}
              className="text-xs text-primary hover:text-primary-hover gap-1 h-8 px-2"
              aria-label={`Edit ${stepT.group3Title}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{stepT.editBtn}</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Annual Family Income</dt>
                <dd className="font-bold text-foreground text-sm mt-0.5 tabular-nums">
                  {values.annualFamilyIncome === 0
                    ? "₹0 (Subsistence)"
                    : formatCurrencyINR(values.annualFamilyIncome)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Community Self-Declaration</dt>
                <dd className="font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
                  {values.communityDeclaration === "yes" && (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  )}
                  <span>{communityLabelMap[values.communityDeclaration] || values.communityDeclaration}</span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* GROUP 4: Location */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground">
              {stepT.group4Title}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(5)}
              className="text-xs text-primary hover:text-primary-hover gap-1 h-8 px-2"
              aria-label={`Edit ${stepT.group4Title}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{stepT.editBtn}</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">State / UT</dt>
                <dd className="font-semibold text-foreground mt-0.5">{values.state}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">District</dt>
                <dd className="font-semibold text-foreground mt-0.5">{values.district}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">PIN Code</dt>
                <dd className="font-medium text-foreground mt-0.5">
                  {values.pincode || stepT.notProvided}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Supporting Disclaimer Notice */}
        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-card text-xs text-secondary leading-relaxed space-y-1">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Preliminary Assessment Confirmation</span>
          </div>
          <p>{stepT.preliminaryNotice}</p>
        </div>
      </div>
    </div>
  );
}
