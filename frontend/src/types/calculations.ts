import { PolicySourceMeta } from "@/lib/assessment-context";

export type RepaymentFrequency = "monthly" | "quarterly";
export type RepaymentMethod = "equal_instalment" | "equal_principal";
export type MoratoriumTreatment = "capitalize" | "accrue_simple" | "interest_only" | "none";
export type CalculationStatus = "SUCCESS" | "NEEDS_INFORMATION" | "UNSUPPORTED";
export type DataMode = "VERIFIED_POLICY" | "SIMULATION_ASSUMPTION";
export type RuleVersionStatus = "CURRENT" | "OUTDATED" | "UNKNOWN";

export interface AmortizationRow {
  period_index: number;
  period_label: string;
  period_type: "moratorium" | "repayment";
  opening_balance: string | number;
  instalment_amount: string | number;
  principal_component: string | number;
  interest_component: string | number;
  closing_balance: string | number;
}

export interface ParameterOriginItem {
  parameter: string;
  label_en: string;
  label_hi: string;
  origin: "VERIFIED_POLICY" | "USER_SPECIFIED" | "SIMULATION_ASSUMPTION";
  note_en: string;
  note_hi: string;
}

export interface FinancialBreakdown {
  total_cost: string | number;
  eligible_cost_basis: string | number;
  max_permissible_loan: string | number;
  requested_loan: string | number;
  effective_loan_principal: string | number;
  mandatory_promoter_contribution: string | number;
  funding_gap: string | number;
  funding_gap_label_en: string;
  funding_gap_label_hi: string;
}

export interface InterestBreakdown {
  annual_nominal_rate: string | number;
  rate_selection_rationale_en: string;
  rate_selection_rationale_hi: string;
  effective_periodic_rate: string | number;
  compounding_convention: string;
}

export interface MoratoriumBreakdown {
  moratorium_months: number;
  treatment: MoratoriumTreatment;
  treatment_label_en: string;
  treatment_label_hi: string;
  moratorium_interest_accrued: string | number;
  moratorium_interest_capitalized: string | number;
  moratorium_payments_due: string | number;
  opening_repayment_balance: string | number;
  grace_period_policy_rule?: string | null;
}

export interface RepaymentSummary {
  repayment_frequency: RepaymentFrequency;
  frequency_label_en: string;
  frequency_label_hi: string;
  repayment_method: RepaymentMethod;
  method_label_en: string;
  method_label_hi: string;
  number_of_instalments: number;
  tenure_years: number;
  tenure_includes_moratorium: boolean;
  regular_instalment_amount: string | number;
  first_instalment_amount?: string | number | null;
  final_instalment_amount: string | number;
  total_principal_repaid: string | number;
  total_repayment_interest: string | number;
  total_loan_repayment: string | number;
}

export interface FinancialCalculationResult {
  estimate_id: string;
  calculated_at: string;
  calculation_engine_version: string;
  scheme_code: string;
  scheme_name_en: string;
  scheme_name_hi: string;
  version_id: string;
  rule_version_status: RuleVersionStatus;
  data_mode: DataMode;
  is_demonstration: boolean;
  status: CalculationStatus;
  financial_breakdown: FinancialBreakdown;
  interest_breakdown: InterestBreakdown;
  moratorium_breakdown: MoratoriumBreakdown;
  repayment_summary: RepaymentSummary;
  amortization_schedule: AmortizationRow[];
  parameter_origins: ParameterOriginItem[];
  assumptions_en: string[];
  assumptions_hi: string[];
  exclusions_en: string[];
  exclusions_hi: string[];
  policy_source_meta: PolicySourceMeta;
  warnings: string[];
}

export interface CalculationEstimateRequest {
  scheme_code?: string;
  schemeCode?: string;
  version_id?: string;
  versionId?: string;
  rule_version_id?: string;
  ruleVersionId?: string;
  project_cost?: number;
  projectCost?: number;
  total_cost?: number;
  totalCost?: number;
  requested_loan_amount?: number;
  requestedLoanAmount?: number;
  borrowing_amount?: number;
  borrowingAmount?: number;
  tenure_years?: number;
  tenureYears?: number;
  moratorium_months?: number;
  moratoriumMonths?: number;
  course_duration_months?: number;
  courseDurationMonths?: number;
  gender?: string;
  repayment_frequency?: RepaymentFrequency;
  repaymentFrequency?: RepaymentFrequency;
  repayment_method?: RepaymentMethod;
  repaymentMethod?: RepaymentMethod;
  moratorium_treatment?: MoratoriumTreatment;
  moratoriumTreatment?: MoratoriumTreatment;
  tenure_includes_moratorium?: boolean;
  tenureIncludesMoratorium?: boolean;
}
