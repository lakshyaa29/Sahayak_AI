"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge, DemoDataBadge } from "@/components/ui/badge";
import { FinancialFigure } from "@/components/ui/typography";
import { Button, StyledLink } from "@/components/ui/button";
import { formatCurrencyINR } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Calculator,
  Building2,
  ShieldCheck,
  Scale,
} from "lucide-react";

interface EvaluationSchemeCardProps {
  outcome: SchemeEvaluationOutcome;
  isPrimary?: boolean;
  userDistrict?: string;
  userState?: string;
}

export function EvaluationSchemeCard({
  outcome,
  isPrimary = false,
  userDistrict = "Wardha",
  userState = "Maharashtra",
}: EvaluationSchemeCardProps) {
  const { lang, t } = useLanguage();
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(isPrimary);
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  const isHindi = lang === "hi";
  const schemeName = isHindi ? outcome.name_hi : outcome.name_en;
  const providerName = isHindi ? outcome.provider_hi : outcome.provider_en;
  const matchReasons = isHindi ? outcome.match_reasons_hi : outcome.match_reasons_en;

  const resT = t.results;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${
        isPrimary
          ? "border-2 border-primary bg-surface shadow-md ring-1 ring-primary/20"
          : "border border-border bg-surface shadow-xs"
      }`}
    >
      {/* Top Banner for Primary Scheme */}
      {isPrimary && (
        <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 uppercase tracking-wider inline-flex items-center gap-1.5 rounded-br-card absolute top-0 left-0 shadow-xs z-10">
          <span>★ {resT.topPickBadge}</span>
        </div>
      )}

      <CardHeader className={isPrimary ? "pt-10 sm:pt-11 pb-4" : "pb-4"}>
        {/* Badges strip */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {outcome.is_demonstration ? (
            <Badge variant="warning" className="gap-1">
              <Scale className="w-3 h-3" />
              <span>{resT.demonstrationBadge}</span>
            </Badge>
          ) : (
            <Badge variant="success" className="gap-1 bg-emerald-50 text-emerald-800 border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{resT.officialVerifiedBadge}</span>
            </Badge>
          )}

          <Badge variant="neutral" className="font-mono text-[11px] text-muted-foreground uppercase">
            {outcome.code}
          </Badge>

          <span className="text-xs text-muted-foreground font-mono ml-auto">
            v{outcome.version_id}
          </span>
        </div>

        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {schemeName}
        </CardTitle>

        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
          <span>{resT.providerLabel}:</span>
          <span className="text-foreground font-semibold">{providerName}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Core Financial Structure Box */}
        <div className="bg-surface-muted/70 rounded-card p-4 sm:p-5 border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {resT.estimatedAssistance}
            </span>
            <span className="text-xs font-semibold text-primary">
              NSFDC Concessional Pattern
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface p-3.5 rounded-lg border border-border/60">
              <span className="text-xs text-muted-foreground block font-medium">
                {resT.maxLoanLabel}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-primary tabular-nums mt-0.5">
                {formatCurrencyINR(outcome.max_eligible_loan)}
              </div>
              <span className="text-[11px] text-muted-foreground block mt-1">
                Concessional lending share (up to 90% of total outlay)
              </span>
            </div>

            <div className="bg-surface p-3.5 rounded-lg border border-border/60">
              <span className="text-xs text-muted-foreground block font-medium">
                {resT.promoterContributionLabel}
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums mt-0.5">
                {formatCurrencyINR(outcome.min_promoter_contribution_amount)}
              </div>
              <span className="text-[11px] text-muted-foreground block mt-1">
                Borrower promoter margin equity required (min. 10%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-border/60">
            <div className="p-2">
              <span className="text-[11px] text-muted-foreground block">{resT.interestRateLabel}</span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {outcome.indicative_interest_rate}
              </span>
            </div>
            <div className="p-2 border-x border-border/60">
              <span className="text-[11px] text-muted-foreground block">{resT.moratoriumLabel}</span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {outcome.indicative_moratorium}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[11px] text-muted-foreground block">{resT.tenureLabel}</span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {outcome.indicative_tenure_years} {resT.yearsSuffix}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <StyledLink
            href={`/calculator?scheme=${encodeURIComponent(outcome.code)}&amount=${outcome.max_eligible_loan}`}
            variant="primary"
            size="md"
            className="flex-1 justify-center gap-2 shadow-xs"
          >
            <Calculator className="w-4 h-4" />
            <span>{resT.viewCalculationCta}</span>
          </StyledLink>

          <StyledLink
            href={`/partners?district=${encodeURIComponent(userDistrict)}&state=${encodeURIComponent(userState)}`}
            variant="outline"
            size="md"
            className="flex-1 justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-primary" />
            <span>{resT.findPartnerCta}</span>
          </StyledLink>
        </div>

        {/* Accordion: "How we assessed this scheme" */}
        <div className="border border-border rounded-card overflow-hidden bg-surface">
          <button
            type="button"
            onClick={() => setIsAssessmentOpen(!isAssessmentOpen)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-expanded={isAssessmentOpen}
          >
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-foreground block">
                  {resT.assessmentDisclosureTitle}
                </span>
                <span className="text-xs text-muted-foreground block">
                  {outcome.passed_conditions.length} criteria passed &bull; {outcome.ranking_score.toFixed(0)} ranking score
                </span>
              </div>
            </div>
            {isAssessmentOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {isAssessmentOpen && (
            <div className="p-4 sm:p-5 pt-0 border-t border-border/80 space-y-4">
              {/* Ranking Reason */}
              {outcome.ranking_explanation && (
                <div className="bg-primary/5 p-3 rounded-md text-xs text-secondary leading-relaxed border border-primary/10">
                  <span className="font-bold text-primary block mb-0.5">
                    Ranking Policy (rank-v1.0):
                  </span>
                  {outcome.ranking_explanation}
                </div>
              )}

              {/* Passed Conditions */}
              {outcome.passed_conditions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {resT.passedRulesTitle} ({outcome.passed_conditions.length})
                  </span>
                  <div className="space-y-2">
                    {outcome.passed_conditions.map((cond) => (
                      <div
                        key={cond.rule_id}
                        className="text-xs p-2.5 rounded-md bg-emerald-50/50 border border-emerald-200/60 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-emerald-950">
                            {isHindi ? cond.reason_hi : cond.reason_en}
                          </p>
                          <span className="text-[11px] text-emerald-700 font-mono block">
                            {resT.clauseRefLabel}: {cond.source_clause}
                          </span>
                        </div>
                        <Badge variant="success" className="text-[10px] uppercase flex-shrink-0">
                          Pass
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unknown Conditions */}
              {outcome.unknown_conditions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    {resT.unknownRulesTitle} ({outcome.unknown_conditions.length})
                  </span>
                  <div className="space-y-2">
                    {outcome.unknown_conditions.map((cond) => (
                      <div
                        key={cond.rule_id}
                        className="text-xs p-2.5 rounded-md bg-amber-50/50 border border-amber-200/60 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-amber-950">
                            {isHindi ? cond.reason_hi : cond.reason_en}
                          </p>
                          <span className="text-[11px] text-amber-700 font-mono block">
                            {resT.clauseRefLabel}: {cond.source_clause}
                          </span>
                        </div>
                        <Badge variant="warning" className="text-[10px] uppercase flex-shrink-0">
                          Confirm
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collapsible: "Sources and Dates" */}
        <div className="border border-border/80 rounded-card overflow-hidden bg-surface-muted/30">
          <button
            type="button"
            onClick={() => setIsSourceOpen(!isSourceOpen)}
            className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-secondary hover:text-foreground focus-visible:outline-none"
            aria-expanded={isSourceOpen}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{resT.sourcesTitle}</span>
            </div>
            {isSourceOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {isSourceOpen && (
            <div className="p-4 pt-0 border-t border-border/60 text-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-muted-foreground block text-[11px]">{resT.documentRef}</span>
                  <span className="font-mono font-medium text-foreground">
                    {outcome.source_meta.document_ref}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">{resT.clauseRefLabel}</span>
                  <span className="font-medium text-foreground">{outcome.source_meta.clause}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">{resT.effectiveDate}</span>
                  <span className="font-medium text-foreground">{outcome.source_meta.effective_date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">{resT.sourceCheckedDate}</span>
                  <span className="font-medium text-foreground">{outcome.source_meta.source_checked_date}</span>
                </div>
              </div>

              {outcome.source_meta.notes && (
                <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-2">
                  {outcome.source_meta.notes}
                </p>
              )}

              {outcome.source_meta.official_url && (
                <div className="pt-2 border-t border-border/40">
                  <a
                    href={outcome.source_meta.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-semibold"
                  >
                    <span>{resT.openOfficialDoc}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
