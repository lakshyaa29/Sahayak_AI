import React, { HTMLAttributes } from "react";
import { cn, formatCurrencyINR } from "@/lib/utils";

export interface FinancialMetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string | number;
  amount?: number;
  subtext?: string;
  variant?: "default" | "highlight" | "secondary" | "primary" | "success";
}

export function FinancialMetricCard({
  label,
  value,
  amount,
  subtext,
  variant = "default",
  className,
  ...props
}: FinancialMetricCardProps) {
  const displayValue = value ?? (amount !== undefined ? formatCurrencyINR(amount) : "₹0");

  const normalizedVariant =
    variant === "primary" ? "highlight" : variant === "success" ? "secondary" : variant;

  const variantStyles = {
    default: "bg-surface border-border text-foreground",
    highlight: "bg-primary-subtle border-primary-muted text-foreground",
    secondary: "bg-secondary-subtle border-secondary-muted text-foreground",
  };

  return (
    <div
      className={cn(
        "border rounded-card p-4 md:p-5 flex flex-col justify-between transition-colors shadow-card",
        variantStyles[normalizedVariant],
        className
      )}
      {...props}
    >
      <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">
        {label}
      </span>
      <div className="my-2.5">
        <span className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-foreground block">
          {typeof displayValue === "number" ? formatCurrencyINR(displayValue) : displayValue}
        </span>
      </div>
      {subtext && (
        <span className="text-xs text-subtle-foreground block leading-relaxed">
          {subtext}
        </span>
      )}
    </div>
  );
}

export interface FinancingContributionBarProps {
  projectCost?: number;
  financedAmount?: number;
  promoterEquity?: number;
  otherSourcesAmount?: number;
  institutionPct?: number;
  promoterPct?: number;
  subsidyPct?: number;
  isHindi?: boolean;
  className?: string;
}

export function FinancingContributionBar({
  projectCost,
  financedAmount,
  promoterEquity,
  otherSourcesAmount,
  institutionPct,
  promoterPct,
  subsidyPct,
  isHindi = false,
  className,
}: FinancingContributionBarProps) {
  const calcFinancedPct =
    institutionPct ??
    (projectCost && financedAmount
      ? Math.min(100, Math.max(0, Math.round((financedAmount / projectCost) * 100)))
      : 90);

  const calcPromoterPct =
    promoterPct ??
    (projectCost && promoterEquity
      ? Math.min(100, Math.max(0, Math.round((promoterEquity / projectCost) * 100)))
      : 10);

  const calcOtherPct =
    projectCost && otherSourcesAmount && otherSourcesAmount > 0
      ? Math.max(0, 100 - calcFinancedPct - calcPromoterPct)
      : 0;

  const calcSubsidyPct = subsidyPct ?? 0;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
        <span>{isHindi ? "पूंजी विभाजन एवं वित्तपोषण अनुपात" : "Capital Outlay Breakdown"}</span>
        {projectCost ? (
          <span className="tabular-nums">
            {isHindi ? "कुल लागत" : "Total Outlay"}: {formatCurrencyINR(projectCost)}
          </span>
        ) : (
          <span className="tabular-nums">{isHindi ? "मानक अनुपात" : "Standard Proportion"}</span>
        )}
      </div>

      {/* Stacked Bar with Accessible Semantics */}
      <div
        className="w-full h-5 rounded-input overflow-hidden flex bg-surface-muted border border-border"
        role="progressbar"
        aria-label={isHindi ? "वित्तपोषण अंशदान प्रतिशत" : "Financing Contribution Percentages"}
        aria-valuenow={calcFinancedPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{ width: `${calcFinancedPct}%` }}
          className="bg-primary h-full transition-all duration-300 flex items-center justify-center text-[10px] text-white font-bold"
          title={`Institution Loan: ${calcFinancedPct}%`}
        >
          {calcFinancedPct >= 15 && `${calcFinancedPct}% ${isHindi ? "ऋण" : "Loan"}`}
        </div>

        {calcSubsidyPct > 0 && (
          <div
            style={{ width: `${calcSubsidyPct}%` }}
            className="bg-warning h-full transition-all duration-300 flex items-center justify-center text-[10px] text-white font-bold"
            title={`Subsidy / Grant: ${calcSubsidyPct}%`}
          >
            {calcSubsidyPct >= 10 && `${calcSubsidyPct}% ${isHindi ? "सब्सिडी" : "Subsidy"}`}
          </div>
        )}

        <div
          style={{ width: `${calcPromoterPct}%` }}
          className="bg-secondary h-full transition-all duration-300 flex items-center justify-center text-[10px] text-white font-bold"
          title={`Beneficiary Equity: ${calcPromoterPct}%`}
        >
          {calcPromoterPct >= 10 && `${calcPromoterPct}% ${isHindi ? "मार्जिन" : "Equity"}`}
        </div>

        {calcOtherPct > 0 && (
          <div
            style={{ width: `${calcOtherPct}%` }}
            className="bg-amber-500 h-full transition-all duration-300 flex items-center justify-center text-[10px] text-white font-bold"
            title={`Other Sources: ${calcOtherPct}%`}
          >
            {calcOtherPct >= 10 && `${calcOtherPct}% ${isHindi ? "अन्य" : "Other"}`}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary flex-shrink-0" />
          <span>
            {isHindi ? "रियायती ऋण" : "Concessional Loan"} ({calcFinancedPct}%
            {financedAmount ? ` · ${formatCurrencyINR(financedAmount)}` : ""})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-secondary flex-shrink-0" />
          <span>
            {isHindi ? "अनिवार्य लाभार्थी मार्जिन" : "Mandatory Beneficiary Equity"} ({calcPromoterPct}%
            {promoterEquity ? ` · ${formatCurrencyINR(promoterEquity)}` : ""})
          </span>
        </div>

        {otherSourcesAmount && otherSourcesAmount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 flex-shrink-0" />
            <span>
              {isHindi ? "अन्य स्रोतों से राशि" : "Amount from Other Sources"} ({calcOtherPct}% · {formatCurrencyINR(otherSourcesAmount)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
