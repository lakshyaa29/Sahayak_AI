"use client";

import React, { useState } from "react";
import { AmortizationRow, FinancialCalculationResult } from "@/types";
import { formatCurrencyINR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  calculationResult: FinancialCalculationResult;
  isHindi?: boolean;
}

export function AmortizationTable({
  schedule,
  calculationResult,
  isHindi = false,
}: AmortizationTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const initialRowsCount = 12;
  const hasMoreRows = schedule.length > initialRowsCount;
  const visibleRows = isExpanded || !hasMoreRows ? schedule : schedule.slice(0, initialRowsCount);

  // Generate CSV download
  const handleDownloadCsv = () => {
    const lines: string[] = [];
    lines.push(`"SAHAYAK AI — PRELIMINARY REPAYMENT ESTIMATE"`);
    lines.push(`"NOTICE: This is an educational decision-support estimate, not a binding loan sanction offer."`);
    lines.push(`"Scheme:","${calculationResult.scheme_name_en} (${calculationResult.scheme_code})"`);
    lines.push(`"Rule Version:","${calculationResult.version_id}"`);
    lines.push(`"Generated On:","${calculationResult.calculated_at}"`);
    lines.push(`"Effective Loan Principal (INR):","${calculationResult.financial_breakdown.effective_loan_principal}"`);
    lines.push(`"Mandatory Promoter Equity (INR):","${calculationResult.financial_breakdown.mandatory_promoter_contribution}"`);
    lines.push(`"Annual Interest Rate:","${calculationResult.interest_breakdown.annual_nominal_rate}%"`);
    lines.push(`"Moratorium Duration:","${calculationResult.moratorium_breakdown.moratorium_months} Months (${calculationResult.moratorium_breakdown.treatment})"`);
    lines.push(`"Repayment Frequency:","${calculationResult.repayment_summary.frequency_label_en}"`);
    lines.push(`"Total Estimated Repayment (INR):","${calculationResult.repayment_summary.total_loan_repayment}"`);
    lines.push("");
    lines.push(
      `"Period","Period Type","Opening Balance (INR)","Instalment Amount (INR)","Principal Component (INR)","Interest Component (INR)","Closing Balance (INR)"`
    );

    for (const row of schedule) {
      lines.push(
        `"${row.period_label}","${row.period_type}","${row.opening_balance}","${row.instalment_amount}","${row.principal_component}","${row.interest_component}","${row.closing_balance}"`
      );
    }

    const csvContent = lines.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sahayak_repayment_estimate_${calculationResult.scheme_code.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="border-border shadow-xs overflow-hidden print:border-none print:shadow-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-primary print:hidden" />
            <span>
              {isHindi ? "परिशोधन पुनर्भुगतान अनुसूची" : "Amortization Repayment Schedule"}
            </span>
          </CardTitle>
          <CardDescription className="mt-1">
            {isHindi
              ? `कुल ${schedule.length} अवधियों (किस्तों) में मूलधन और ब्याज का विस्तृत विवरण`
              : `Complete period-by-period breakdown across all ${schedule.length} scheduled instalments`}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="text-xs gap-1.5 h-9"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHindi ? "CSV डाउनलोड" : "Download CSV"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs gap-1.5 h-9"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isHindi ? "प्रिंट सारांश" : "Print Summary"}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-sm text-foreground"
            aria-label={isHindi ? "पुनर्भुगतान अनुसूची तालिका" : "Amortization Repayment Schedule Table"}
          >
            <thead className="bg-surface-muted text-xs uppercase font-bold text-muted-foreground border-b border-border select-none">
              <tr>
                <th scope="col" className="px-4 py-3 min-w-[140px]">
                  {isHindi ? "अवधि" : "Period"}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {isHindi ? "प्रारंभिक शेष" : "Opening Balance"}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-extrabold text-foreground">
                  {isHindi ? "किस्त राशि" : "Instalment"}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {isHindi ? "मूलधन" : "Principal"}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {isHindi ? "ब्याज" : "Interest"}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {isHindi ? "अंतिम शेष" : "Closing Balance"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {visibleRows.map((row) => {
                const isMoratorium = row.period_type === "moratorium";
                const isFinalRow = row.closing_balance === 0 || row.closing_balance === "0.00" || row.closing_balance === "0";

                return (
                  <tr
                    key={row.period_index}
                    className={`transition-colors ${
                      isMoratorium
                        ? "bg-amber-50/40 hover:bg-amber-50/70 dark:bg-amber-950/10"
                        : isFinalRow
                        ? "bg-emerald-50/40 hover:bg-emerald-50/70 font-semibold dark:bg-emerald-950/10"
                        : "hover:bg-surface-muted/40"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isMoratorium ? (
                          <Badge variant="warning" size="sm" className="text-[10px] px-1.5 py-0 h-4">
                            <Clock className="w-2.5 h-2.5 mr-0.5 inline" />
                            {isHindi ? "छूट" : "Grace"}
                          </Badge>
                        ) : isFinalRow ? (
                          <Badge variant="success" size="sm" className="text-[10px] px-1.5 py-0 h-4">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline" />
                            {isHindi ? "अंतिम" : "Final"}
                          </Badge>
                        ) : null}
                        <span>{row.period_label}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {formatCurrencyINR(Number(row.opening_balance))}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums font-bold text-primary">
                      {formatCurrencyINR(Number(row.instalment_amount))}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {formatCurrencyINR(Number(row.principal_component))}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums text-secondary">
                      {formatCurrencyINR(Number(row.interest_component))}
                    </td>

                    <td className="px-4 py-3 text-right tabular-nums font-medium text-foreground">
                      {formatCurrencyINR(Number(row.closing_balance))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {hasMoreRows && (
          <div className="p-3 border-t border-border flex items-center justify-between bg-surface-muted/30 print:hidden">
            <span className="text-xs text-muted-foreground">
              {isExpanded
                ? isHindi
                  ? `सभी ${schedule.length} किस्तें प्रदर्शित हैं`
                  : `Displaying all ${schedule.length} instalments`
                : isHindi
                ? `पहली ${initialRowsCount} किस्तें प्रदर्शित हैं (कुल: ${schedule.length})`
                : `Showing first ${initialRowsCount} of ${schedule.length} instalments`}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs gap-1 h-8 text-primary hover:text-primary font-semibold"
            >
              {isExpanded ? (
                <>
                  <span>{isHindi ? "कम पंक्तियां देखें" : "Show Fewer Rows"}</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{isHindi ? "पूरी अनुसूची देखें" : `Show All ${schedule.length} Rows`}</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
