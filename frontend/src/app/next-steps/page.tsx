"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessment } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { formatRupees } from "@/lib/financial-formatting";
import {
  PageContainer,
  Stack,
  PageHeader,
} from "@/components/ui/layout-primitives";
import {
  CardHeading,
  SupportingText,
  Caption,
} from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ChecklistItem } from "@/components/checklist/checklist-item";
import { WarningBanner, GuidanceNotice } from "@/components/ui/disclaimer-banner";
import { BackLink } from "@/components/ui/navigation-shell";
import { DEMO_DOCUMENT_CHECKLIST, SAMPLE_RECOMMENDATION } from "@/lib/fixtures/sample-data";
import {
  Printer,
  RotateCcw,
  Building2,
  Compass,
  FileCheck2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function NextStepsPage() {
  const { values, evaluationResult, selectedPartner } = useAssessment();
  const { t, lang } = useLanguage();
  const nextStepsT = t.nextSteps;

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    "doc-1": true,
    "doc-2": false,
    "doc-3": false,
    "doc-4": false,
  });

  const toggleCheck = (id: string, completed: boolean) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: completed }));
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const activeScheme = evaluationResult?.primary_scheme;
  const activeSchemeName = activeScheme
    ? (lang === "hi" && activeScheme.name_hi ? activeScheme.name_hi : activeScheme.name_en)
    : (lang === "hi" ? "सूक्ष्म वित्त योजना (ऋण मार्गदर्शन)" : SAMPLE_RECOMMENDATION.scheme.name);
  const activeSchemeCode = activeScheme?.code || SAMPLE_RECOMMENDATION.scheme.code;
  const activeLoanAmount = activeScheme?.max_eligible_loan || SAMPLE_RECOMMENDATION.estimatedLoanAmount;
  const activeInterestRate = activeScheme?.indicative_interest_rate ?? SAMPLE_RECOMMENDATION.indicativeInterestRate;

  const totalCost = values.totalCost || values.projectCost || activeLoanAmount;
  const income = values.annualFamilyIncome;

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = DEMO_DOCUMENT_CHECKLIST.length;

  const currentDateFormatted = new Date().toLocaleDateString(
    lang === "hi" ? "hi-IN" : "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <PageContainer variant="default" className="py-6 md:py-10">
      <Stack gap={8}>
        {/* Top Header */}
        <PageHeader
          title={nextStepsT.pageTitle}
          description={nextStepsT.pageSubtitle}
          badge={
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xs border border-border bg-surface-muted text-foreground">
              <FileCheck2 className="w-3.5 h-3.5 text-primary stroke-[2.5]" aria-hidden="true" />
              <span>{nextStepsT.badge}</span>
            </span>
          }
          actions={
            <div className="flex flex-wrap items-center gap-2 no-print">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="text-xs gap-1.5 border-border bg-surface hover:bg-surface-muted"
                aria-label={nextStepsT.printSummary}
              >
                <Printer className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                <span>{nextStepsT.printSummary}</span>
              </Button>
              <Link href="/assessment?step=review">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs gap-1.5 text-secondary hover:text-foreground"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{nextStepsT.editAnswers}</span>
                </Button>
              </Link>
            </div>
          }
        />

        {/* Printable Guidance Summary Card */}
        <div className="border border-border bg-surface rounded-xs p-5 md:p-6 space-y-5 print:border-none print:p-0 print:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xs bg-primary text-white flex items-center justify-center font-bold" aria-hidden="true">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <CardHeading className="text-base font-bold text-foreground">
                {nextStepsT.guidanceSummaryTitle}
              </CardHeading>
            </div>
            <Caption className="text-secondary text-xs">
              {nextStepsT.generatedOn} {currentDateFormatted}
            </Caption>
          </div>

          {/* Profile Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-surface-muted border border-border rounded-xs">
              <span className="text-secondary block font-medium mb-1">
                {nextStepsT.beneficiaryCategory}
              </span>
              <span className="font-bold text-foreground block">
                {nextStepsT.declaredSC}
              </span>
            </div>

            <div className="p-3 bg-surface-muted border border-border rounded-xs">
              <span className="text-secondary block font-medium mb-1">
                {nextStepsT.requirementPurpose}
              </span>
              <span className="font-bold text-foreground capitalize block">
                {values.purpose === "education"
                  ? (lang === "hi" ? "शिक्षा ऋण" : "Higher Education")
                  : (lang === "hi" ? "व्यावसायिक उद्यम" : "Business Enterprise")}
                {values.courseName && ` (${values.courseName})`}
              </span>
            </div>

            <div className="p-3 bg-surface-muted border border-border rounded-xs">
              <span className="text-secondary block font-medium mb-1">
                {nextStepsT.estimatedOutlay}
              </span>
              <span className="font-bold text-foreground text-sm block">
                {totalCost ? formatRupees(totalCost) : "—"}
              </span>
            </div>

            <div className="p-3 bg-surface-muted border border-border rounded-xs">
              <span className="text-secondary block font-medium mb-1">
                {nextStepsT.familyIncome}
              </span>
              <span className="font-bold text-foreground text-sm block">
                {income ? formatRupees(income) : "—"}
              </span>
            </div>
          </div>

          {/* Matched Scheme and Partner Section */}
          <div className="p-4 bg-surface-muted border border-border rounded-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-secondary block font-medium mb-1">
                {nextStepsT.recommendedScheme}:
              </span>
              <span className="font-bold text-foreground text-sm block">
                {activeSchemeName}
              </span>
              <span className="text-secondary block mt-1">
                {lang === "hi"
                  ? `ऋण सीमा: ${formatRupees(activeLoanAmount)} • ब्याज दर: ${activeInterestRate}% वार्षिक`
                  : `Eligible limit up to ${formatRupees(activeLoanAmount)} at ${activeInterestRate}% p.a.`}
              </span>
              {activeSchemeCode && (
                <span className="text-[11px] text-secondary mt-1 font-mono block">
                  Scheme Code: {activeSchemeCode}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-secondary font-medium">
                  {nextStepsT.selectedPartner}:
                </span>
                <Link
                  href="/partners"
                  className="text-primary hover:underline text-xs font-semibold inline-flex items-center gap-1 no-print"
                >
                  <span>{selectedPartner ? nextStepsT.changePartner : nextStepsT.selectPartner}</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              {selectedPartner ? (
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-sm block">
                    {selectedPartner.organization_name} ({selectedPartner.name})
                  </span>
                  <span className="text-secondary block text-xs">
                    {selectedPartner.public_address}
                  </span>
                  {(selectedPartner.contact_phone || selectedPartner.contact_email) && (
                    <span className="text-secondary block text-[11px]">
                      {lang === "hi" ? "संपर्क" : "Contact"}: {selectedPartner.contact_phone || selectedPartner.contact_email}
                    </span>
                  )}
                  {selectedPartner.is_demonstration && (
                    <span className="inline-block px-1.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                      {nextStepsT.demoNotice}
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-sm block">
                    {nextStepsT.noPartnerSelected}
                  </span>
                  <span className="text-secondary block text-xs">
                    {lang === "hi"
                      ? `ज़िला: ${values.district || "निकटतम शाखा"} • नज़दीकी शाखा और संपर्क विवरण देखने के लिए चैनल पार्टनर लोकेटर का उपयोग करें।`
                      : `District: ${values.district || "Nearest Branch"} • Visit the Channel Partner locator to view nearby branches and operational contact info.`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Physical Documents Checklist */}
        <section className="space-y-4" aria-labelledby="checklist-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 id="checklist-heading" className="text-lg md:text-xl font-bold text-foreground">
                {nextStepsT.checklistTitle}
              </h2>
              <SupportingText className="text-secondary text-xs mt-0.5">
                {nextStepsT.checklistSubtitle}
              </SupportingText>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-xs border border-border bg-surface-muted text-foreground self-start sm:self-auto">
              {checkedCount} / {totalDocs} {nextStepsT.preparedBadge}
            </span>
          </div>

          <WarningBanner
            title={nextStepsT.verificationNoticeTitle}
            description={nextStepsT.verificationNoticeDesc}
          />

          <div className="space-y-3" role="group" aria-label={nextStepsT.checklistTitle}>
            {DEMO_DOCUMENT_CHECKLIST.map((doc) => (
              <ChecklistItem
                key={doc.id}
                id={doc.id}
                title={doc.title}
                description={doc.description}
                completed={!!checkedDocs[doc.id]}
                onToggle={(id, val) => toggleCheck(id, val)}
                badgeText={doc.mandatory ? (lang === "hi" ? "अनिवार्य" : "Mandatory") : (lang === "hi" ? "वैकल्पिक / सहायक" : "Optional / Supporting")}
              />
            ))}
          </div>
        </section>

        {/* Handoff Guidance Box */}
        <div className="border border-border bg-surface rounded-xs p-5 md:p-6 space-y-3.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary stroke-[2.5]" aria-hidden="true" />
            <h3 className="text-base font-bold text-foreground">
              {nextStepsT.handoffTitle}
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            {nextStepsT.handoffIntro}
          </p>
          <ol className="list-decimal list-inside space-y-2 text-xs text-foreground font-medium pl-1">
            <li className="leading-relaxed">
              <span>{nextStepsT.handoffStep1}</span>
            </li>
            <li className="leading-relaxed">
              <span>{nextStepsT.handoffStep2}</span>
            </li>
            <li className="leading-relaxed">
              <span>{nextStepsT.handoffStep3}</span>
            </li>
          </ol>
        </div>

        {/* Bottom Actions and Disclaimers */}
        <div className="space-y-4 no-print pt-2">
          <GuidanceNotice />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <BackLink href="/partners" label={nextStepsT.returnToPartners} />
            <Link
              href="/results"
              className="text-xs font-semibold text-secondary hover:text-foreground inline-flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span>{nextStepsT.returnToResults}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Stack>
    </PageContainer>
  );
}
