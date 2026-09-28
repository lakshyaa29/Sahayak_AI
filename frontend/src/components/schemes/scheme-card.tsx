import React from "react";
import { SchemeSummary } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge, DataFreshnessBadge, DemoDataBadge } from "@/components/ui/badge";
import { FinancialFigure } from "@/components/ui/typography";
import { StyledLink, Button } from "@/components/ui/button";
import { formatCurrencyINR } from "@/lib/utils";
import { CheckCircle2, FileText, ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* EligibilityReasonList                                                      */
/* -------------------------------------------------------------------------- */
export function EligibilityReasonList({ reasons }: { reasons: string[] }) {
  if (!reasons.length) return null;

  return (
    <div className="space-y-2 pt-1">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Why this matches your profile:
      </h4>
      <ul className="space-y-1.5" aria-label="Recommendation reasons">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SchemeCard                                                                 */
/* -------------------------------------------------------------------------- */
export interface SchemeCardProps {
  scheme: SchemeSummary;
  isBestMatch?: boolean;
  reasons?: string[];
  estimatedLoan?: number;
  indicativeEmi?: number;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function SchemeCard({
  scheme,
  isBestMatch = false,
  reasons = [],
  estimatedLoan,
  indicativeEmi,
  primaryAction,
  secondaryAction,
}: SchemeCardProps) {
  return (
    <Card
      className={
        isBestMatch
          ? "border-2 border-primary bg-surface shadow-md relative overflow-hidden"
          : "border border-border bg-surface"
      }
    >
      {isBestMatch && (
        <div className="bg-primary text-primary-foreground text-xs font-bold px-3.5 py-1 uppercase tracking-wider inline-flex items-center gap-1.5 rounded-br-card absolute top-0 left-0">
          <span>★ Best Match</span>
        </div>
      )}

      <CardHeader className={isBestMatch ? "pt-8" : ""}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="primary">{scheme.schemeType}</Badge>
          <DemoDataBadge />
          <span className="text-xs text-subtle-foreground font-medium font-mono">
            {scheme.code}
          </span>
        </div>
        <CardTitle className="text-xl md:text-2xl text-foreground font-bold">
          {scheme.name}
        </CardTitle>
        <CardDescription className="mt-1 text-muted-foreground leading-relaxed">
          {scheme.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Core Financial Bounds Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-muted/60 p-4 rounded-card border border-border">
          <div>
            <span className="text-xs text-subtle-foreground block font-medium">Project Cost Range</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {formatCurrencyINR(scheme.minProjectCost)} – {formatCurrencyINR(scheme.maxProjectCost)}
            </span>
          </div>
          <div>
            <span className="text-xs text-subtle-foreground block font-medium">Financing Quantum</span>
            <span className="text-sm font-bold text-primary tabular-nums">
              Up to {scheme.maxLoanPercentage}%
            </span>
          </div>
          <div>
            <span className="text-xs text-subtle-foreground block font-medium">Concessional Rate</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {scheme.interestRateMin}% – {scheme.interestRateMax}% p.a.
            </span>
          </div>
          <div>
            <span className="text-xs text-subtle-foreground block font-medium">Moratorium Grace</span>
            <span className="text-sm font-bold text-foreground">
              {scheme.moratoriumMonthsMin}–{scheme.moratoriumMonthsMax} Months
            </span>
          </div>
        </div>

        {/* Dynamic Highlight Estimate if provided */}
        {(estimatedLoan !== undefined || indicativeEmi !== undefined) && (
          <div className="bg-primary-subtle border border-primary-muted rounded-card p-4 flex flex-wrap items-center justify-between gap-4">
            {estimatedLoan !== undefined && (
              <FinancialFigure
                label="Indicative Loan Eligibility"
                value={estimatedLoan}
                size="lg"
              />
            )}
            {indicativeEmi !== undefined && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  Indicative Monthly EMI
                </span>
                <span className="text-2xl sm:text-3xl font-black tabular-nums text-foreground tracking-tight">
                  {formatCurrencyINR(indicativeEmi)}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </span>
              </div>
            )}
            <StyledLink
              href="/calculator"
              size="sm"
              variant="outline"
              className="text-xs border-primary-muted text-primary hover:bg-primary-muted"
            >
              View Full Repayment
            </StyledLink>
          </div>
        )}

        {/* Why this scheme reasons */}
        <EligibilityReasonList reasons={reasons} />

        {/* Source metadata */}
        <div className="text-xs text-subtle-foreground pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Source: {scheme.ruleSource}</span>
          </span>
          <DataFreshnessBadge date={scheme.lastVerifiedDate} />
        </div>
      </CardContent>

      {(primaryAction || secondaryAction) && (
        <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
          {primaryAction}
          {secondaryAction}
        </CardFooter>
      )}
    </Card>
  );
}
