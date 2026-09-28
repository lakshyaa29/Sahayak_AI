"use client";

import React from "react";
import { ChoiceCard } from "@/components/ui/choice-card";
import { HelpCircle, Briefcase, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { PurposeType } from "@/lib/schemas/assessment";

interface PurposeStepProps {
  purpose: PurposeType;
  onSelectPurpose: (purpose: PurposeType) => void;
  error?: string;
}

export function PurposeStep({ purpose, onSelectPurpose, error }: PurposeStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step1;

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

      {error && (
        <p role="alert" className="text-sm font-semibold text-error bg-error/10 border border-error/20 p-3 rounded-input">
          {error}
        </p>
      )}

      {/* Two Choice Cards with Radio Semantics */}
      <fieldset className="space-y-3">
        <legend className="sr-only">{stepT.heading}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChoiceCard
            type="radio"
            title={stepT.businessTitle}
            description={stepT.businessDesc}
            selected={purpose === "business"}
            onSelect={() => onSelectPurpose("business")}
            icon={<Briefcase className="w-6 h-6 stroke-[2]" />}
            aria-describedby="purpose-help"
          />
          <ChoiceCard
            type="radio"
            title={stepT.educationTitle}
            description={stepT.educationDesc}
            selected={purpose === "education"}
            onSelect={() => onSelectPurpose("education")}
            icon={<GraduationCap className="w-6 h-6 stroke-[2]" />}
            aria-describedby="purpose-help"
          />
        </div>
      </fieldset>

      {/* Helpful statutory rationale note */}
      <div
        id="purpose-help"
        className="bg-surface-muted p-4 rounded-card border border-border text-xs text-secondary flex items-start gap-3 leading-relaxed"
      >
        <HelpCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p>{stepT.helpText}</p>
      </div>
    </div>
  );
}
