export * from "@/lib/schemas/assessment";
export * from "./calculations";
export * from "./partners";

export interface SchemeSummary {
  id: string;
  code: string;
  name: string;
  schemeType: "BUSINESS" | "EDUCATION" | "EQUIPMENT";
  targetDemographic: string;
  maxIncomeLimit: number;
  minProjectCost: number;
  maxProjectCost: number;
  maxLoanPercentage: number;
  minPromoterContribution: number;
  interestRateMin: number;
  interestRateMax: number;
  moratoriumMonthsMin: number;
  moratoriumMonthsMax: number;
  repaymentTenureMaxYears: number;
  description: string;
  isDemonstration: boolean;
  ruleSource: string;
  lastVerifiedDate: string;
}

export interface SchemeRecommendation {
  scheme: SchemeSummary;
  isBestMatch: boolean;
  reasons: string[];
  estimatedLoanAmount: number;
  beneficiaryContribution: number;
  indicativeInterestRate: number;
  indicativeMoratoriumMonths: number;
  indicativeTenureYears: number;
  indicativeEmi: number;
  alternatives: {
    scheme: SchemeSummary;
    suitabilityReason: string;
  }[];
}

export interface PartnerBranch {
  id: string;
  name: string;
  branchCode: string;
  organizationName: string;
  partnerType: "SCA" | "PSB" | "RRB" | "NBFC_MFI";
  supportedSchemes: string[];
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  operationalStatus: "ACTIVE_ELIGIBLE" | "UNDER_REVIEW" | "QUOTA_EXHAUSTED" | "HIGH_NPA_RESTRICTED";
  grossNpaRatio: number;
  hasPendingOverdues: boolean;
  quotaUtilizedPercent: number;
  contactPerson?: string;
  contactPhone?: string;
  isDemonstration: boolean;
  lastUpdated: string;
  suitabilityReason: string;
}

export interface FinancialSummary {
  projectCost: number;
  eligibleLoanAmount: number;
  promoterContribution: number;
  financingPercentage: number;
  interestRateAnnual: number;
  moratoriumMonths: number;
  tenureYears: number;
  monthlyInstalment: number;
  totalInterestEstimate: number;
  totalRepaymentEstimate: number;
  assumptions: string[];
  isDemonstration: boolean;
}
