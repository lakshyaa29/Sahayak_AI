"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAssessment } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import {
  PageContainer,
  Stack,
  PageHeader,
  ResponsiveGrid,
} from "@/components/ui/layout-primitives";
import {
  CardHeading,
  Body,
  Caption,
  FinancialFigure,
} from "@/components/ui/typography";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge, DemoDataBadge } from "@/components/ui/badge";
import { Button, StyledLink } from "@/components/ui/button";
import { FinancialMetricCard, FinancingContributionBar } from "@/components/finance/financial-metric-card";
import { AmortizationTable } from "@/components/finance/amortization-table";
import { FinancingTimeline } from "@/components/finance/financing-timeline";
import { WarningBanner, GuidanceNotice } from "@/components/ui/disclaimer-banner";
import { BackLink } from "@/components/ui/navigation-shell";
import { calculateEstimate } from "@/lib/api/client";
import { formatCurrencyINR } from "@/lib/utils";
import {
  FinancialCalculationResult,
  RepaymentFrequency,
  RepaymentMethod,
  MoratoriumTreatment,
  CalculationStatus,
} from "@/types";
import {
  Calculator,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Building2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Scale,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  RefreshCw,
  Info,
} from "lucide-react";

interface AvailableSchemeMeta {
  code: string;
  name_en: string;
  name_hi: string;
  maxOutlay: number;
  maxTenure: number;
  minMora: number;
  maxMora: number;
  maxLoanPct: number;
  minEquityPct: number;
  isDemo: boolean;
}

const AVAILABLE_SCHEMES: AvailableSchemeMeta[] = [
  {
    code: "SC_MICRO_FINANCE",
    name_en: "Micro Finance Scheme for SC Entrepreneurs",
    name_hi: "अनुसूचित जाति उद्यमियों के लिए सूक्ष्म वित्त योजना",
    maxOutlay: 140000,
    maxTenure: 3,
    minMora: 3,
    maxMora: 6,
    maxLoanPct: 90,
    minEquityPct: 10,
    isDemo: false,
  },
  {
    code: "SC_TERM_LOAN",
    name_en: "Term Loan Scheme for Viable Projects",
    name_hi: "व्यावसायिक परियोजनाओं के लिए मियादी ऋण (Term Loan) योजना",
    maxOutlay: 5000000,
    maxTenure: 5,
    minMora: 6,
    maxMora: 12,
    maxLoanPct: 90,
    minEquityPct: 10,
    isDemo: false,
  },
  {
    code: "SC_EDUCATION_LOAN",
    name_en: "Concessional Educational Loan Scheme",
    name_hi: "रियायती शिक्षा ऋण योजना (उच्च एवं तकनीकी शिक्षा)",
    maxOutlay: 3000000,
    maxTenure: 7,
    minMora: 6,
    maxMora: 12,
    maxLoanPct: 90,
    minEquityPct: 10,
    isDemo: false,
  },
  {
    code: "SC_MAHILA_SAMRIDDHI",
    name_en: "Mahila Samriddhi Special Women Scheme (Demonstration)",
    name_hi: "महिला समृद्धि विशेष योजना (प्रदर्शनात्मक)",
    maxOutlay: 140000,
    maxTenure: 4,
    minMora: 6,
    maxMora: 12,
    maxLoanPct: 95,
    minEquityPct: 5,
    isDemo: true,
  },
];

function CalculatorContent() {
  const searchParams = useSearchParams();
  const { values, confirmedProfile, evaluationResult } = useAssessment();
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const calcT = t.calculator;

  // Active scheme determination
  const urlScheme = searchParams?.get("scheme") || "";
  const primarySchemeCode = evaluationResult?.primary_scheme?.code;

  const defaultSchemeCode =
    AVAILABLE_SCHEMES.find((s) => s.code === urlScheme)?.code ||
    primarySchemeCode ||
    "SC_MICRO_FINANCE";

  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(defaultSchemeCode);
  const currentSchemeMeta =
    AVAILABLE_SCHEMES.find((s) => s.code === selectedSchemeCode) || AVAILABLE_SCHEMES[0];

  // Financial inputs state
  const initialCost =
    confirmedProfile?.totalCost ||
    values.totalCost ||
    (selectedSchemeCode === "SC_TERM_LOAN" ? 1500000 : selectedSchemeCode === "SC_EDUCATION_LOAN" ? 500000 : 120000);

  const [projectCost, setProjectCost] = useState<number>(initialCost);

  // Maximum allowable loan for current project cost
  const maxPermittedForCost = Math.min(
    projectCost * (currentSchemeMeta.maxLoanPct / 100),
    currentSchemeMeta.maxOutlay
  );

  const initialRequestedLoan = searchParams?.get("amount")
    ? Math.min(Number(searchParams.get("amount")), maxPermittedForCost)
    : values.borrowingAmount
    ? Math.min(values.borrowingAmount, maxPermittedForCost)
    : maxPermittedForCost;

  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(initialRequestedLoan);
  const [tenureYears, setTenureYears] = useState<number>(currentSchemeMeta.maxTenure);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(currentSchemeMeta.minMora);
  const [repaymentFrequency, setRepaymentFrequency] = useState<RepaymentFrequency>("monthly");
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>("equal_instalment");
  const [moratoriumTreatment, setMoratoriumTreatment] = useState<MoratoriumTreatment>("capitalize");

  // API calculation result state
  const [calculationResult, setCalculationResult] = useState<FinancialCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState<boolean>(false);

  // Sequence tracker to prevent out-of-order API responses
  const requestSeq = useRef<number>(0);

  // Scheme switch handler
  const handleSchemeChange = (newCode: string) => {
    setSelectedSchemeCode(newCode);
    const meta = AVAILABLE_SCHEMES.find((s) => s.code === newCode) || AVAILABLE_SCHEMES[0];

    // Adjust project cost if outside scheme outlay bounds
    let adjustedCost = projectCost;
    if (newCode === "SC_TERM_LOAN" && projectCost <= 140000) {
      adjustedCost = 1500000;
    } else if (newCode === "SC_MICRO_FINANCE" && projectCost > 140000) {
      adjustedCost = 120000;
    } else if (newCode === "SC_MAHILA_SAMRIDDHI" && projectCost > 140000) {
      adjustedCost = 100000;
    }
    setProjectCost(adjustedCost);

    const newMaxLoan = Math.min(adjustedCost * (meta.maxLoanPct / 100), meta.maxOutlay);
    setRequestedLoanAmount(newMaxLoan);
    setTenureYears(meta.maxTenure);
    setMoratoriumMonths(meta.minMora);
  };

  // Reset to initial assessed defaults
  const handleResetToAssessed = () => {
    const meta = currentSchemeMeta;
    const baseCost = confirmedProfile?.totalCost || values.totalCost || 120000;
    setProjectCost(baseCost);
    const maxLoan = Math.min(baseCost * (meta.maxLoanPct / 100), meta.maxOutlay);
    setRequestedLoanAmount(values.borrowingAmount ? Math.min(values.borrowingAmount, maxLoan) : maxLoan);
    setTenureYears(meta.maxTenure);
    setMoratoriumMonths(meta.minMora);
    setRepaymentFrequency("monthly");
    setRepaymentMethod("equal_instalment");
    setMoratoriumTreatment("capitalize");
  };

  // Trigger backend calculation
  const executeCalculation = useCallback(async () => {
    const currentSeq = ++requestSeq.current;
    setIsLoading(true);
    setIsStale(false);
    setError(null);

    const payload = {
      scheme_code: selectedSchemeCode,
      project_cost: projectCost,
      requested_loan_amount: requestedLoanAmount,
      tenure_years: tenureYears,
      moratorium_months: moratoriumMonths,
      course_duration_months: values.courseDurationMonths,
      gender: values.purpose === "business" ? undefined : undefined,
      repayment_frequency: repaymentFrequency,
      repayment_method: repaymentMethod,
      moratorium_treatment: moratoriumTreatment,
    };

    const res = await calculateEstimate(payload);

    // Guard against stale asynchronous responses
    if (currentSeq !== requestSeq.current) {
      return;
    }

    if (res.error || !res.data) {
      setError(res.error || "Unable to retrieve calculation from engine.");
      setIsLoading(false);
    } else {
      setCalculationResult(res.data);
      setIsLoading(false);
    }
  }, [
    selectedSchemeCode,
    projectCost,
    requestedLoanAmount,
    tenureYears,
    moratoriumMonths,
    values.courseDurationMonths,
    values.purpose,
    repaymentFrequency,
    repaymentMethod,
    moratoriumTreatment,
  ]);

  // Debounced execution when inputs change
  useEffect(() => {
    setIsStale(true);
    const timer = setTimeout(() => {
      executeCalculation();
    }, 250);

    return () => clearTimeout(timer);
  }, [executeCalculation]);

  const schemeDisplayName = isHindi ? currentSchemeMeta.name_hi : currentSchemeMeta.name_en;

  // Beneficiary district & state context for partner routing
  const userDistrict = confirmedProfile?.district || values.district || "Wardha";
  const userState = confirmedProfile?.state || values.state || "Maharashtra";

  return (
    <PageContainer variant="default" className="py-4 md:py-8">
      <Stack gap={8}>
        {/* 1. Header with Breadcrumbs and Status Badges */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BackLink href="/results" label={calcT.returnToResults} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono bg-surface-muted px-2.5 py-1 rounded-md border border-border">
                {currentSchemeMeta.code}
              </span>
              {currentSchemeMeta.isDemo ? (
                <Badge variant="warning" className="gap-1">
                  <Scale className="w-3 h-3" />
                  <span>{calcT.demonstrationMode}</span>
                </Badge>
              ) : (
                <Badge variant="success" className="gap-1 bg-emerald-50 text-emerald-800 border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{calcT.verifiedPolicy}</span>
                </Badge>
              )}
            </div>
          </div>

          <PageHeader
            title={calcT.pageTitle}
            description={`${calcT.pageDescription} (${schemeDisplayName})`}
            badge={
              <div className="flex items-center gap-2">
                <Badge variant="primary">{calcT.badge}</Badge>
                <span className="text-[11px] font-semibold text-muted-foreground bg-surface-muted px-2 py-0.5 rounded border border-border">
                  {calcT.estimatedNotApproved}
                </span>
              </div>
            }
          />
        </div>

        {/* 2. Scheme Switcher Bar */}
        <div className="bg-surface border border-border rounded-card p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                {calcT.schemeSelectLabel}
              </span>
              <span className="text-sm font-bold text-foreground block">{schemeDisplayName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label={calcT.schemeSelectLabel}
              value={selectedSchemeCode}
              onChange={(e) => handleSchemeChange(e.target.value)}
              className="text-xs font-medium bg-surface-muted border border-border rounded-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {AVAILABLE_SCHEMES.map((scheme) => (
                <option key={scheme.code} value={scheme.code}>
                  {isHindi ? scheme.name_hi : scheme.name_en} ({scheme.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Warnings / Out of Date / Statutory Clamp Banners */}
        {calculationResult && calculationResult.warnings.length > 0 && (
          <div className="space-y-2">
            {calculationResult.warnings.map((warn, i) => (
              <WarningBanner
                key={i}
                title={calcT.clampedWarningTitle}
                description={warn}
              />
            ))}
          </div>
        )}

        {isStale && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-xs text-primary flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{calcT.outOfDateBanner}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-900 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{calcT.errorTitle}</span>
                <p>{error}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={executeCalculation}
              className="text-xs"
            >
              {calcT.retryBtn}
            </Button>
          </div>
        )}

        {/* 4. Primary Two-Column Grid: Left Controls, Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/70">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    <span>{calcT.inputsTitle}</span>
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetToAssessed}
                    className="text-[11px] h-7 px-2 text-secondary hover:text-foreground gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{calcT.resetDefaults}</span>
                  </Button>
                </div>
                <CardDescription className="text-xs">{calcT.inputsSub}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 pt-4">
                {/* 1. Project Cost (Read-Only with Edit Link) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-foreground">
                      {calcT.projectCostLabel}
                    </label>
                    <Link
                      href="/assessment"
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      {calcT.editAssessment}
                    </Link>
                  </div>
                  <div className="bg-surface-muted border border-border rounded-input px-3 py-2 text-sm font-bold text-foreground tabular-nums flex items-center justify-between">
                    <span>{formatCurrencyINR(projectCost)}</span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      Cap: {formatCurrencyINR(currentSchemeMeta.maxOutlay)}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {calcT.projectCostHelp}
                  </span>
                </div>

                {/* 2. Requested Loan Amount (Slider + Input) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="requested-loan-input" className="font-semibold text-foreground">
                      {calcT.requestedLoanLabel}
                    </label>
                    <span className="text-xs font-bold text-primary tabular-nums">
                      {formatCurrencyINR(requestedLoanAmount)}
                    </span>
                  </div>

                  <input
                    id="requested-loan-slider"
                    aria-label={calcT.requestedLoanLabel}
                    type="range"
                    min={10000}
                    max={maxPermittedForCost}
                    step={5000}
                    value={requestedLoanAmount}
                    onChange={(e) => setRequestedLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Min: {formatCurrencyINR(10000)}</span>
                    <span>Max: {formatCurrencyINR(maxPermittedForCost)}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {calcT.requestedLoanHelp}
                  </span>
                </div>

                {/* 3. Repayment Tenure (Years) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="tenure-slider" className="font-semibold text-foreground">
                      {calcT.tenureLabel}
                    </label>
                    <span className="text-xs font-bold text-foreground">
                      {tenureYears} {isHindi ? "वर्ष" : "Years"} ({tenureYears * (repaymentFrequency === "monthly" ? 12 : 4)} {isHindi ? "किस्तें" : "Instalments"})
                    </span>
                  </div>

                  <input
                    id="tenure-slider"
                    aria-label={calcT.tenureLabel}
                    type="range"
                    min={1}
                    max={currentSchemeMeta.maxTenure}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>1 {isHindi ? "वर्ष" : "Year"}</span>
                    <span>Max: {currentSchemeMeta.maxTenure} {isHindi ? "वर्ष" : "Years"}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {calcT.tenureHelp}
                  </span>
                </div>

                {/* 4. Moratorium Grace Period (Months) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="moratorium-slider" className="font-semibold text-foreground">
                      {calcT.moratoriumLabel}
                    </label>
                    <span className="text-xs font-bold text-foreground">
                      {moratoriumMonths} {isHindi ? "महीने" : "Months"}
                    </span>
                  </div>

                  <input
                    id="moratorium-slider"
                    aria-label={calcT.moratoriumLabel}
                    type="range"
                    min={0}
                    max={selectedSchemeCode === "SC_EDUCATION_LOAN" ? 48 : currentSchemeMeta.maxMora}
                    step={1}
                    value={moratoriumMonths}
                    onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                    className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>0 {isHindi ? "माह" : "Months"}</span>
                    <span>Max: {selectedSchemeCode === "SC_EDUCATION_LOAN" ? 48 : currentSchemeMeta.maxMora} {isHindi ? "माह" : "Months"}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    {calcT.moratoriumHelp}
                  </span>
                </div>

                {/* 5. Repayment Frequency (Monthly vs Quarterly) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    {calcT.frequencyLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRepaymentFrequency("monthly")}
                      className={`text-xs py-2 px-3 rounded-md font-semibold border transition-all ${
                        repaymentFrequency === "monthly"
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-surface text-secondary border-border hover:bg-surface-muted"
                      }`}
                    >
                      {calcT.monthlyOption}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepaymentFrequency("quarterly")}
                      className={`text-xs py-2 px-3 rounded-md font-semibold border transition-all ${
                        repaymentFrequency === "quarterly"
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-surface text-secondary border-border hover:bg-surface-muted"
                      }`}
                    >
                      {calcT.quarterlyOption}
                    </button>
                  </div>
                </div>

                {/* 6. Repayment Method (Equal Instalment vs Equal Principal) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    {calcT.methodLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRepaymentMethod("equal_instalment")}
                      className={`text-[11px] py-2 px-2.5 rounded-md font-semibold border text-center transition-all ${
                        repaymentMethod === "equal_instalment"
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-surface text-secondary border-border hover:bg-surface-muted"
                      }`}
                    >
                      {calcT.equalInstalmentOption}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepaymentMethod("equal_principal")}
                      className={`text-[11px] py-2 px-2.5 rounded-md font-semibold border text-center transition-all ${
                        repaymentMethod === "equal_principal"
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-surface text-secondary border-border hover:bg-surface-muted"
                      }`}
                    >
                      {calcT.equalPrincipalOption}
                    </button>
                  </div>
                </div>

                {/* 7. Moratorium Interest Treatment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    {calcT.treatmentLabel}
                  </label>
                  <select
                    aria-label={calcT.treatmentLabel}
                    value={moratoriumTreatment}
                    onChange={(e) => setMoratoriumTreatment(e.target.value as MoratoriumTreatment)}
                    className="w-full text-xs font-medium bg-surface border border-border rounded-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="capitalize">{calcT.treatmentCapitalize}</option>
                    <option value="interest_only">{calcT.treatmentInterestOnly}</option>
                    <option value="accrue_simple">{calcT.treatmentAccrueSimple}</option>
                    <option value="none">{calcT.treatmentNone}</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Prominent Financial Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {calculationResult ? (
              <>
                {/* 4 Core Figures Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FinancialMetricCard
                    label={calcT.eligibleLoan}
                    amount={Number(calculationResult.financial_breakdown.effective_loan_principal)}
                    subtext={`${((Number(calculationResult.financial_breakdown.effective_loan_principal) / projectCost) * 100).toFixed(0)}% ${isHindi ? "वित्तपोषण" : "of total cost"}`}
                    variant="primary"
                  />

                  <FinancialMetricCard
                    label={calcT.promoterEquity}
                    amount={Number(calculationResult.financial_breakdown.mandatory_promoter_contribution)}
                    subtext={isHindi ? "अनिवार्य लाभार्थी मार्जिन (10%)" : "Mandatory promoter equity (min. 10%)"}
                    variant="default"
                  />

                  <FinancialMetricCard
                    label={calcT.fundingGap}
                    amount={Number(calculationResult.financial_breakdown.funding_gap)}
                    subtext={isHindi ? "अन्य गैर-ऋण स्रोतों से देय" : "Amount to fund from other sources"}
                    variant={Number(calculationResult.financial_breakdown.funding_gap) > 0 ? "highlight" : "default"}
                  />

                  <FinancialMetricCard
                    label={
                      calculationResult.repayment_summary.repayment_frequency === "monthly"
                        ? calcT.monthlyInstalment
                        : calcT.quarterlyInstalment
                    }
                    amount={Number(calculationResult.repayment_summary.regular_instalment_amount)}
                    subtext={
                      calculationResult.repayment_summary.first_instalment_amount
                        ? `${isHindi ? "प्रथम किस्त" : "First payment"}: ${formatCurrencyINR(Number(calculationResult.repayment_summary.first_instalment_amount))}`
                        : isHindi
                        ? "नियमित आवधिक किस्त"
                        : "Regular periodic instalment"
                    }
                    variant="primary"
                  />
                </div>

                {/* Statutory Interest Rate & Total Repayment Box */}
                <Card className="border-border shadow-xs bg-surface overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-border/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {calcT.annualInterestRate}
                      </span>
                      <Badge variant="primary" size="default" className="font-extrabold text-sm">
                        {calculationResult.interest_breakdown.annual_nominal_rate}% p.a.
                      </Badge>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed bg-surface-muted p-2.5 rounded-md border border-border/80">
                      {isHindi
                        ? calculationResult.interest_breakdown.rate_selection_rationale_hi
                        : calculationResult.interest_breakdown.rate_selection_rationale_en}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-muted/30">
                    <div>
                      <span className="text-xs text-muted-foreground block">{calcT.totalInterest}</span>
                      <div className="text-lg sm:text-xl font-bold text-foreground mt-0.5 tabular-nums">
                        {formatCurrencyINR(Number(calculationResult.repayment_summary.total_repayment_interest))}
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-0.5 block">
                        {isHindi
                          ? `संपूर्ण ${calculationResult.repayment_summary.tenure_years} वर्षों में संचित ब्याज`
                          : `Cumulative interest across ${calculationResult.repayment_summary.tenure_years} years`}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        {calcT.totalLoanRepayment}
                      </span>
                      <div className="text-xl sm:text-2xl font-extrabold text-primary mt-0.5 tabular-nums">
                        {formatCurrencyINR(Number(calculationResult.repayment_summary.total_loan_repayment))}
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-0.5 block">
                        {isHindi ? "मूलधन + ब्याज (बिना दोहरी गणना)" : "Principal + interest (without double counting)"}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Capital Outlay Stacked Proportions Bar */}
                <Card className="border-border shadow-xs">
                  <CardContent className="pt-5">
                    <FinancingContributionBar
                      projectCost={projectCost}
                      financedAmount={Number(calculationResult.financial_breakdown.effective_loan_principal)}
                      promoterEquity={Number(calculationResult.financial_breakdown.mandatory_promoter_contribution)}
                      otherSourcesAmount={Number(calculationResult.financial_breakdown.funding_gap)}
                      isHindi={isHindi}
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="bg-surface border border-border rounded-card p-12 text-center space-y-4">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">{calcT.recalculating}</p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Financing Lifecycle Timeline */}
        {calculationResult && (
          <FinancingTimeline
            financial={calculationResult.financial_breakdown}
            moratorium={calculationResult.moratorium_breakdown}
            repayment={calculationResult.repayment_summary}
            isHindi={isHindi}
          />
        )}

        {/* 6. Complete Amortization Schedule with CSV Download & Print */}
        {calculationResult && (
          <AmortizationTable
            schedule={calculationResult.amortization_schedule}
            calculationResult={calculationResult}
            isHindi={isHindi}
          />
        )}

        {/* 7. "How This Estimate Was Calculated" - Full Assumptions & Sources Accordion */}
        {calculationResult && (
          <div className="border border-border rounded-card bg-surface overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setIsAssumptionsOpen(!isAssumptionsOpen)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={isAssumptionsOpen}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <span className="text-sm sm:text-base font-bold text-foreground block">
                    {calcT.assumptionsTitle}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {calcT.assumptionsSub}
                  </span>
                </div>
              </div>
              {isAssumptionsOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {isAssumptionsOpen && (
              <div className="p-4 sm:p-5 pt-0 border-t border-border/80 space-y-6">
                {/* 1. Core Assumptions List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    {calcT.assumptionsTitle}
                  </span>
                  <ul className="space-y-2 text-xs text-secondary list-disc list-inside">
                    {(isHindi ? calculationResult.assumptions_hi : calculationResult.assumptions_en).map((asm, i) => (
                      <li key={i} className="leading-relaxed">
                        {asm}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Excluded Fees & Charges */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    {calcT.exclusionsTitle}
                  </span>
                  <ul className="space-y-1.5 text-xs text-secondary list-disc list-inside">
                    {(isHindi ? calculationResult.exclusions_hi : calculationResult.exclusions_en).map((ex, i) => (
                      <li key={i} className="leading-relaxed">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Parameter Origins Table */}
                {calculationResult.parameter_origins.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      {calcT.parameterOriginsTitle}
                    </span>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-left text-xs" aria-label="Parameter Origins Table">
                        <thead className="bg-surface-muted text-muted-foreground uppercase font-bold border-b border-border">
                          <tr>
                            <th className="px-3 py-2">Parameter</th>
                            <th className="px-3 py-2">Origin Classification</th>
                            <th className="px-3 py-2">Verification Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {calculationResult.parameter_origins.map((item, i) => (
                            <tr key={i} className="hover:bg-surface-muted/30">
                              <td className="px-3 py-2 font-medium text-foreground">
                                {isHindi ? item.label_hi : item.label_en}
                              </td>
                              <td className="px-3 py-2">
                                <Badge
                                  variant={
                                    item.origin === "VERIFIED_POLICY"
                                      ? "success"
                                      : item.origin === "USER_SPECIFIED"
                                      ? "primary"
                                      : "neutral"
                                  }
                                  size="sm"
                                  className="text-[10px]"
                                >
                                  {item.origin.replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="px-3 py-2 text-secondary">
                                {isHindi ? item.note_hi : item.note_en}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Verified Policy Sources Metadata Box */}
                <div className="bg-surface-muted p-4 rounded-lg border border-border space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    {calcT.sourcesTitle}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Policy Reference:</span>
                      <span className="font-semibold text-foreground">
                        {calculationResult.policy_source_meta.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        {calculationResult.policy_source_meta.document_ref} ({calculationResult.policy_source_meta.clause})
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Verification Status:</span>
                      <span className="font-semibold text-foreground">
                        {calculationResult.policy_source_meta.verification_status} &bull; Verified on {calculationResult.policy_source_meta.source_checked_date}
                      </span>
                      <div className="mt-1">
                        <a
                          href={calculationResult.policy_source_meta.official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                        >
                          <span>Open Official Guidelines</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Statutory Guidance Disclaimer Notice */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-md p-3 text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold block mb-0.5">Guidance Notice:</span>
                  {calcT.preliminaryNotice}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. Bottom Action & Handoff Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
          <BackLink href="/results" label={calcT.returnToResults} />

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/assessment">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{calcT.editAssessment}</span>
              </Button>
            </Link>

            <StyledLink
              href={`/partners?scheme=${encodeURIComponent(selectedSchemeCode)}&district=${encodeURIComponent(userDistrict)}&state=${encodeURIComponent(userState)}`}
              variant="primary"
              className="gap-2 shadow-xs"
            >
              <Building2 className="w-4 h-4" />
              <span>{calcT.findPartnersCta}</span>
              <ArrowRight className="w-4 h-4" />
            </StyledLink>
          </div>
        </div>
      </Stack>
    </PageContainer>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense
      fallback={
        <PageContainer variant="default" className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Loading financial calculator...</p>
        </PageContainer>
      }
    >
      <CalculatorContent />
    </Suspense>
  );
}
