/**
 * Financial Formatting & Calculation Utilities
 * Civic Field Guide & Explainable Financial Statement
 * Standardizes Indian rupee currency formatting, percentages, loan tenures,
 * repayment instalments, and missing value fallbacks.
 */

export interface CurrencyFormatOptions {
  showPaise?: boolean;
  fallback?: string;
  locale?: string;
}

/**
 * Formats a numeric value into the Indian Rupee numbering system (e.g., ₹1,00,000).
 * Handles whole rupees, lakhs, crores, negatives, and gracefully falls back on missing values.
 */
export function formatRupees(
  amount: number | string | null | undefined,
  options?: CurrencyFormatOptions
): string {
  const fallback = options?.fallback ?? "Not available";

  if (amount === null || amount === undefined || amount === "") {
    return fallback;
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) {
    return fallback;
  }

  const showPaise = options?.showPaise ?? false;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formattedNumber = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: showPaise ? 2 : 0,
    maximumFractionDigits: showPaise ? 2 : 0,
  }).format(absNum);

  return `${isNegative ? "-" : ""}₹${formattedNumber}`;
}

/**
 * Formats a number as a percentage string (e.g., 90% or 6.5%).
 */
export function formatPercent(
  percent: number | string | null | undefined,
  decimals = 0,
  fallback = "Not available"
): string {
  if (percent === null || percent === undefined || percent === "") {
    return fallback;
  }
  const num = typeof percent === "string" ? parseFloat(percent) : percent;
  if (isNaN(num)) {
    return fallback;
  }
  return `${num.toFixed(decimals).replace(/\.0+$/, "")}%`;
}

/**
 * Formats loan repayment tenure with year and month equivalents.
 */
export function formatTenure(
  years: number | null | undefined,
  isHindi = false,
  fallback?: string
): string {
  const fallbackText = fallback ?? (isHindi ? "उपलब्ध नहीं" : "Not available");
  if (!years || isNaN(years) || years <= 0) {
    return fallbackText;
  }
  const months = Math.round(years * 12);
  if (isHindi) {
    return `${years} वर्ष (${months} महीने)`;
  }
  return `${years} ${years === 1 ? "year" : "years"} (${months} months)`;
}

/**
 * Localizes moratorium or grace period text.
 */
export function formatMoratoriumPeriod(
  moratoriumStr: string | null | undefined,
  isHindi = false,
  fallback?: string
): string {
  const fallbackText = fallback ?? (isHindi ? "लागू नहीं" : "None");
  if (!moratoriumStr || moratoriumStr.trim() === "") {
    return fallbackText;
  }
  if (isHindi) {
    return moratoriumStr
      .replace(/months/gi, "माह")
      .replace(/month/gi, "माह")
      .replace(/p\.a\./gi, "वार्षिक");
  }
  return moratoriumStr;
}

/**
 * Localizes interest rate display string.
 */
export function formatInterestRateDisplay(
  rateStr: string | null | undefined,
  isHindi = false,
  fallback?: string
): string {
  const fallbackText = fallback ?? (isHindi ? "उपलब्ध नहीं" : "Not available");
  if (!rateStr || rateStr.trim() === "") {
    return fallbackText;
  }
  if (isHindi) {
    return rateStr
      .replace(/p\.a\./gi, "प्रति वर्ष")
      .replace(/per annum/gi, "प्रति वर्ष")
      .replace(/per year/gi, "प्रति वर्ष");
  }
  return rateStr;
}

/**
 * Formats an ISO date into readable Indian English or Hindi date.
 */
export function formatIndianDate(
  dateStr: string | null | undefined,
  isHindi = false,
  fallback?: string
): string {
  const fallbackText = fallback ?? (isHindi ? "उपलब्ध नहीं" : "Not available");
  if (!dateStr || dateStr.trim() === "") {
    return fallbackText;
  }

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    const day = d.getDate();
    const monthsEn = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthsHi = [
      "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
      "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];

    const month = isHindi ? monthsHi[d.getMonth()] : monthsEn[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Extracts a numeric interest rate from string e.g. "6.5% - 7.5% p.a." -> 6.5
 */
export function extractBaseInterestRate(rateStr: string | null | undefined): number {
  if (!rateStr) return 7.0; // Standard NSFDC fallback rate
  const match = rateStr.match(/(\d+(\.\d+)?)/);
  if (match && match[1]) {
    const parsed = parseFloat(match[1]);
    return isNaN(parsed) ? 7.0 : parsed;
  }
  return 7.0;
}

export interface EstimatedRepaymentBreakdown {
  monthlyInstalment: number;
  totalRepayment: number;
  totalInterest: number;
  tenureMonths: number;
  annualRate: number;
  isAvailable: boolean;
  unavailableReason?: string;
}

/**
 * Deterministically computes estimated monthly instalment (annuity reducing-balance)
 * matching standard banking amortization without floating point drift.
 */
export function calculateEstimatedMonthlyInstalment(
  loanAmount: number,
  annualRatePercent: number,
  tenureYears: number
): EstimatedRepaymentBreakdown {
  if (!loanAmount || loanAmount <= 0 || !tenureYears || tenureYears <= 0) {
    return {
      monthlyInstalment: 0,
      totalRepayment: 0,
      totalInterest: 0,
      tenureMonths: 0,
      annualRate: annualRatePercent || 0,
      isAvailable: false,
      unavailableReason: "Loan amount or repayment tenure not provided",
    };
  }

  const tenureMonths = Math.round(tenureYears * 12);
  const monthlyRate = (annualRatePercent / 100) / 12;

  let emi = 0;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    emi = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
  } else {
    emi = Math.round(loanAmount / tenureMonths);
  }

  const totalRepayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  return {
    monthlyInstalment: emi,
    totalRepayment,
    totalInterest,
    tenureMonths,
    annualRate: annualRatePercent,
    isAvailable: true,
  };
}

/**
 * Reconciles financial figures ensuring projectCost === loanAmount + applicantContribution
 */
export interface ReconciledFinancials {
  projectCost: number;
  loanAmount: number;
  applicantContribution: number;
  loanSharePercent: number;
  applicantSharePercent: number;
  isCapped: boolean;
  statutoryCap: number | null;
  rawCalculatedLoan: number;
}

export function reconcileFinancialStatement(
  totalCost: number,
  maxEligibleLoan: number,
  schemeMaxLoanPct = 90,
  schemeCap?: number
): ReconciledFinancials {
  const cost = Math.max(0, Math.round(totalCost));
  const rawCalculated = Math.round(cost * (schemeMaxLoanPct / 100));
  const statutoryCap = schemeCap ? Math.round(schemeCap) : null;

  const isCapped = statutoryCap !== null && rawCalculated > statutoryCap;
  const loan = Math.max(0, Math.round(maxEligibleLoan));
  const contribution = Math.max(0, cost - loan);

  const loanSharePercent = cost > 0 ? Math.round((loan / cost) * 100) : 0;
  const applicantSharePercent = cost > 0 ? Math.round((contribution / cost) * 100) : 0;

  return {
    projectCost: cost,
    loanAmount: loan,
    applicantContribution: contribution,
    loanSharePercent,
    applicantSharePercent,
    isCapped,
    statutoryCap,
    rawCalculatedLoan: rawCalculated,
  };
}
