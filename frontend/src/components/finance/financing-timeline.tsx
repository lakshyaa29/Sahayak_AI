"use client";

import React from "react";
import { MoratoriumBreakdown, RepaymentSummary, FinancialBreakdown } from "@/types";
import { formatCurrencyINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

interface FinancingTimelineProps {
  financial: FinancialBreakdown;
  moratorium: MoratoriumBreakdown;
  repayment: RepaymentSummary;
  isHindi?: boolean;
}

export function FinancingTimeline({
  financial,
  moratorium,
  repayment,
  isHindi = false,
}: FinancingTimelineProps) {
  const hasMoratorium = moratorium.moratorium_months > 0;

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>{isHindi ? "ऋण जीवनचक्र एवं पुनर्भुगतान समयरेखा" : "Loan Lifecycle & Repayment Timeline"}</span>
        </CardTitle>
        <CardDescription>
          {isHindi
            ? "स्वीकृति से पूर्ण चुकता होने तक के दो मुख्य चरण"
            : "Two key stages from initial disbursement to final zero-balance loan closure"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative border-l-2 border-primary/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
          {/* Milestone 1: Disbursement & Grace Period */}
          <div className="relative">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-700 flex items-center justify-center text-xs font-bold shadow-xs">
              1
            </div>

            <div className="bg-surface-muted/60 rounded-lg p-4 border border-border/80 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {isHindi ? "चरण 1: छूट अवधि (मोरेटोरियम)" : "Phase 1: Grace & Moratorium Period"}
                </span>

                <Badge variant={hasMoratorium ? "warning" : "neutral"} size="sm">
                  {hasMoratorium
                    ? `${moratorium.moratorium_months} ${isHindi ? "महीने" : "Months"}`
                    : isHindi
                    ? "शून्य छूट"
                    : "Zero Grace"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block">{isHindi ? "शुरुआती ऋण राशि" : "Opening Loan Balance"}:</span>
                  <span className="font-bold text-foreground text-sm">
                    {formatCurrencyINR(Number(financial.effective_loan_principal))}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">{isHindi ? "ब्याज व्यवस्था" : "Interest Handling"}:</span>
                  <span className="font-semibold text-foreground text-xs leading-relaxed">
                    {isHindi ? moratorium.treatment_label_hi : moratorium.treatment_label_en}
                  </span>
                </div>
              </div>

              {hasMoratorium && Number(moratorium.moratorium_interest_capitalized) > 0 && (
                <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {isHindi
                      ? `मोरेटोरियम के दौरान ₹${formatCurrencyINR(Number(moratorium.moratorium_interest_capitalized))} का साधारण ब्याज संचित होकर नियमित पुनर्भुगतान शेष ₹${formatCurrencyINR(Number(moratorium.opening_repayment_balance))} में पूंजीकृत होता है।`
                      : `Simple interest of ₹${formatCurrencyINR(Number(moratorium.moratorium_interest_capitalized))} accrued during grace is consolidated into an opening repayment balance of ₹${formatCurrencyINR(Number(moratorium.opening_repayment_balance))}.`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Milestone 2: Amortization & Repayment */}
          <div className="relative">
            <div className="absolute -left-[33px] sm:-left-[41px] top-0 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary text-primary flex items-center justify-center text-xs font-bold shadow-xs">
              2
            </div>

            <div className="bg-surface-muted/60 rounded-lg p-4 border border-border/80 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isHindi ? "चरण 2: नियमित पुनर्भुगतान एवं परिशोधन" : "Phase 2: Regular Amortization & Repayment"}
                </span>

                <Badge variant="primary" size="sm">
                  {repayment.tenure_years} {isHindi ? "वर्ष" : "Years"} ({repayment.number_of_instalments} {isHindi ? "किस्तें" : "Instalments"})
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block">{isHindi ? "किस्त आवृत्ति" : "Instalment Frequency"}:</span>
                  <span className="font-bold text-foreground capitalize">
                    {isHindi ? repayment.frequency_label_hi : repayment.frequency_label_en}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">{isHindi ? "नियमित किस्त" : "Regular Instalment"}:</span>
                  <span className="font-extrabold text-primary text-sm">
                    {formatCurrencyINR(Number(repayment.regular_instalment_amount))}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">{isHindi ? "कुल चुकता राशि" : "Total Repayment"}:</span>
                  <span className="font-bold text-foreground text-sm">
                    {formatCurrencyINR(Number(repayment.total_loan_repayment))}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {isHindi
                    ? `अंतिम किस्त के पश्चात ऋण शेष शून्य (₹0.00) हो जाता है और खाता पूर्ण रूप से चुकता हो जाता है।`
                    : `Upon payment of the ${repayment.number_of_instalments}th instalment, the outstanding loan balance reaches strictly ₹0.00.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
