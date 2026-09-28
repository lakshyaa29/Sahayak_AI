import uuid
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field

from backend.app.core.catalogue import (
    SchemePolicyRecord,
    PolicySourceMeta,
    VERSIONED_SCHEME_CATALOGUE,
)


class RepaymentFrequency(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"


class RepaymentMethod(str, Enum):
    EQUAL_INSTALMENT = "equal_instalment"
    EQUAL_PRINCIPAL = "equal_principal"


class MoratoriumTreatment(str, Enum):
    CAPITALIZE = "capitalize"
    ACCRUE_SIMPLE = "accrue_simple"
    INTEREST_ONLY = "interest_only"
    NONE = "none"


class CalculationStatus(str, Enum):
    SUCCESS = "SUCCESS"
    NEEDS_INFORMATION = "NEEDS_INFORMATION"
    UNSUPPORTED = "UNSUPPORTED"


class DataMode(str, Enum):
    VERIFIED_POLICY = "VERIFIED_POLICY"
    SIMULATION_ASSUMPTION = "SIMULATION_ASSUMPTION"


class RuleVersionStatus(str, Enum):
    CURRENT = "CURRENT"
    OUTDATED = "OUTDATED"
    UNKNOWN = "UNKNOWN"


class AmortizationRow(BaseModel):
    period_index: int
    period_label: str
    period_type: str  # "moratorium" | "repayment"
    opening_balance: Decimal
    instalment_amount: Decimal
    principal_component: Decimal
    interest_component: Decimal
    closing_balance: Decimal


class ParameterOriginItem(BaseModel):
    parameter: str
    label_en: str
    label_hi: str
    origin: str  # "VERIFIED_POLICY" | "USER_SPECIFIED" | "SIMULATION_ASSUMPTION"
    note_en: str
    note_hi: str


class FinancialBreakdown(BaseModel):
    total_cost: Decimal
    eligible_cost_basis: Decimal
    max_permissible_loan: Decimal
    requested_loan: Decimal
    effective_loan_principal: Decimal
    mandatory_promoter_contribution: Decimal
    funding_gap: Decimal
    funding_gap_label_en: str = "Amount to fund from other sources"
    funding_gap_label_hi: str = "अन्य स्रोतों से जुटाई जाने वाली शेष राशि"


class InterestBreakdown(BaseModel):
    annual_nominal_rate: Decimal
    rate_selection_rationale_en: str
    rate_selection_rationale_hi: str
    effective_periodic_rate: Decimal
    compounding_convention: str = "nominal_annual_divided_by_periods"


class MoratoriumBreakdown(BaseModel):
    moratorium_months: int
    treatment: MoratoriumTreatment
    treatment_label_en: str
    treatment_label_hi: str
    moratorium_interest_accrued: Decimal
    moratorium_interest_capitalized: Decimal
    moratorium_payments_due: Decimal
    opening_repayment_balance: Decimal
    grace_period_policy_rule: Optional[str] = None


class RepaymentSummary(BaseModel):
    repayment_frequency: RepaymentFrequency
    frequency_label_en: str
    frequency_label_hi: str
    repayment_method: RepaymentMethod = RepaymentMethod.EQUAL_INSTALMENT
    method_label_en: str = "Equal Monthly Instalment (Annuity)"
    method_label_hi: str = "समान मासिक किस्त (वार्षिकी)"
    number_of_instalments: int
    tenure_years: int
    tenure_includes_moratorium: bool
    regular_instalment_amount: Decimal
    first_instalment_amount: Optional[Decimal] = None
    final_instalment_amount: Decimal
    total_principal_repaid: Decimal
    total_repayment_interest: Decimal
    total_loan_repayment: Decimal


class FinancialCalculationResult(BaseModel):
    estimate_id: str
    calculated_at: str
    calculation_engine_version: str = "calc-v1.0"
    scheme_code: str
    scheme_name_en: str
    scheme_name_hi: str
    version_id: str
    rule_version_status: RuleVersionStatus = RuleVersionStatus.CURRENT
    data_mode: DataMode = DataMode.VERIFIED_POLICY
    is_demonstration: bool
    status: CalculationStatus
    financial_breakdown: FinancialBreakdown
    interest_breakdown: InterestBreakdown
    moratorium_breakdown: MoratoriumBreakdown
    repayment_summary: RepaymentSummary
    amortization_schedule: List[AmortizationRow] = Field(default_factory=list)
    parameter_origins: List[ParameterOriginItem] = Field(default_factory=list)
    assumptions_en: List[str] = Field(default_factory=list)
    assumptions_hi: List[str] = Field(default_factory=list)
    exclusions_en: List[str] = Field(default_factory=list)
    exclusions_hi: List[str] = Field(default_factory=list)
    policy_source_meta: PolicySourceMeta
    warnings: List[str] = Field(default_factory=list)


def quantize_money(amount: Decimal) -> Decimal:
    """Rounds monetary amount strictly to 2 decimal places using standard ROUND_HALF_UP."""
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def determine_statutory_interest_rate(
    scheme: SchemePolicyRecord,
    effective_loan: Decimal,
    gender: Optional[str] = None,
) -> Tuple[Decimal, str, str]:
    """
    Determines the applicable statutory beneficiary interest rate under verified NSFDC policy tiers.
    Does not take an arbitrary midpoint or fabricate unsubstantiated rates.
    """
    if scheme.code == "SC_MICRO_FINANCE":
        if effective_loan <= Decimal("100000.00"):
            rate = Decimal("6.50")
            rationale_en = (
                "Statutory concessional tier: 6.50% p.a. for micro-credit loans up to ₹1,00,000 "
                "under NSFDC Policy Circular Section 4."
            )
            rationale_hi = (
                "वैधानिक रियायती स्तर: NSFDC नीति परिपत्र खंड 4 के तहत ₹1,00,000 तक के सूक्ष्म ऋण के लिए 6.50% वार्षिक ब्याज दर।"
            )
        else:
            rate = Decimal("7.00")
            rationale_en = (
                "Statutory concessional tier: 7.00% p.a. for micro-credit loans between ₹1,00,001 "
                "and ₹1,40,000 under NSFDC Policy Circular Section 4."
            )
            rationale_hi = (
                "वैधानिक रियायती स्तर: NSFDC नीति परिपत्र खंड 4 के तहत ₹1,00,001 से ₹1,40,000 के बीच के ऋण के लिए 7.00% वार्षिक ब्याज दर।"
            )
        return rate, rationale_en, rationale_hi

    if scheme.code == "SC_TERM_LOAN":
        if effective_loan <= Decimal("500000.00"):
            rate = Decimal("7.00")
            rationale_en = (
                "Statutory term loan tier: 7.00% p.a. for project loans up to ₹5,00,000 "
                "under NSFDC Operational Guidelines Section 6."
            )
            rationale_hi = (
                "वैधानिक मियादी ऋण स्तर: NSFDC परिचालन दिशानिर्देश खंड 6 के तहत ₹5,00,000 तक के ऋण के लिए 7.00% वार्षिक ब्याज दर।"
            )
        else:
            rate = Decimal("8.00")
            rationale_en = (
                "Statutory term loan tier: 8.00% p.a. for commercial outlays above ₹5,00,000 "
                "up to ₹50,00,000 under NSFDC Operational Guidelines Section 6."
            )
            rationale_hi = (
                "वैधानिक मियादी ऋण स्तर: NSFDC परिचालन दिशानिर्देश खंड 6 के तहत ₹5,00,000 से अधिक (₹50,00,000 तक) के ऋण के लिए 8.00% वार्षिक ब्याज दर।"
            )
        return rate, rationale_en, rationale_hi

    if scheme.code == "SC_EDUCATION_LOAN":
        is_female = gender and gender.strip().lower() in ["female", "woman", "f"]
        if is_female:
            rate = Decimal("6.50")
            rationale_en = (
                "Statutory concessional education tier for female beneficiaries: 6.50% p.a. "
                "under NSFDC Educational Credit Guidelines Clause 8.2 (0.50% statutory rebate for women)."
            )
            rationale_hi = (
                "महिला लाभार्थियों के लिए वैधानिक रियायती शिक्षा ऋण दर: NSFDC शिक्षा ऋण दिशानिर्देश खंड 8.2 के तहत 6.50% वार्षिक (महिला सशक्तिकरण हेतु 0.50% छूट)।"
            )
        else:
            rate = Decimal("7.00")
            rationale_en = (
                "Statutory education loan base rate: 7.00% p.a. under NSFDC Educational Credit "
                "Guidelines Clause 8.2 (6.50% available for female beneficiaries upon Channel Partner sanction)."
            )
            rationale_hi = (
                "वैधानिक शिक्षा ऋण आधार दर: NSFDC शिक्षा ऋण दिशानिर्देश खंड 8.2 के तहत 7.00% वार्षिक (महिला लाभार्थियों के लिए 6.50% रियायती दर उपलब्ध)।"
            )
        return rate, rationale_en, rationale_hi

    if scheme.code == "SC_MAHILA_SAMRIDDHI":
        rate = Decimal("4.50")
        rationale_en = (
            "Demonstration specialized grant model: 4.50% p.a. illustrative subsidized rate "
            "for women micro-enterprises under State Channelising Agency demo terms."
        )
        rationale_hi = (
            "प्रदर्शनात्मक विशेष सहायता मॉडल: राज्य चैनलाइजिंग एजेंसी की शर्तों के तहत महिला सूक्ष्म उद्यमों के लिए 4.50% वार्षिक सांकेतिक रियायती दर।"
        )
        return rate, rationale_en, rationale_hi

    # Default fallback to verified scheme minimum
    rate = Decimal(str(scheme.interest_rate_min))
    return (
        rate,
        f"Concessional rate established at {rate}% p.a. per official policy reference.",
        f"आधिकारिक नीति संदर्भ के अनुसार रियायती ब्याज दर {rate}% वार्षिक निर्धारित।",
    )


def calculate_scheme_repayment(
    scheme_code: str,
    project_cost: Decimal,
    requested_loan_amount: Optional[Decimal] = None,
    tenure_years: Optional[int] = None,
    moratorium_months: Optional[int] = None,
    course_duration_months: Optional[int] = None,
    repayment_frequency: RepaymentFrequency = RepaymentFrequency.MONTHLY,
    repayment_method: RepaymentMethod = RepaymentMethod.EQUAL_INSTALMENT,
    moratorium_treatment: MoratoriumTreatment = MoratoriumTreatment.CAPITALIZE,
    tenure_includes_moratorium: bool = False,
    gender: Optional[str] = None,
    rule_version_id: Optional[str] = None,
    catalogue: Optional[List[SchemePolicyRecord]] = None,
) -> FinancialCalculationResult:
    """
    Deterministic scheme-aware financial calculation engine.
    Uses strict Python Decimal arithmetic with exact reducing-balance annuity or equal-principal amortization,
    moratorium grace handling, statutory rate tier selection, and complete schedule reconciliation.
    """
    if catalogue is None:
        catalogue = VERSIONED_SCHEME_CATALOGUE

    scheme = next((s for s in catalogue if s.code == scheme_code), None)
    if not scheme:
        raise ValueError(f"Scheme code '{scheme_code}' is not recognized in the policy catalogue.")

    warnings: List[str] = []
    assumptions_en: List[str] = []
    assumptions_hi: List[str] = []
    exclusions_en: List[str] = []
    exclusions_hi: List[str] = []
    parameter_origins: List[ParameterOriginItem] = []

    # 0. Version Checking & Data Mode
    rule_version_status = RuleVersionStatus.CURRENT
    if rule_version_id and rule_version_id != scheme.version_id:
        rule_version_status = RuleVersionStatus.OUTDATED
        warnings.append(
            f"The requested rule version '{rule_version_id}' is superseded by the active verified policy version '{scheme.version_id}'. "
            f"Calculations reflect the current active rule version."
        )

    data_mode = (
        DataMode.SIMULATION_ASSUMPTION
        if scheme.is_demonstration
        else DataMode.VERIFIED_POLICY
    )

    # 1. Financial Breakdown Calculations
    cost = quantize_money(project_cost)
    eligible_cost_basis = cost

    parameter_origins.append(
        ParameterOriginItem(
            parameter="project_cost",
            label_en="Total Outlay",
            label_hi="कुल परियोजना लागत",
            origin="USER_SPECIFIED",
            note_en="Derived from beneficiary confirmed requirement.",
            note_hi="लाभार्थी की पुष्टीकृत आवश्यकता पर आधारित।",
        )
    )

    # Maximum permissible loan: min(eligible_cost * max_percentage / 100, scheme_max_outlay)
    max_pct = Decimal(str(scheme.max_loan_percentage)) / Decimal("100")
    raw_max_loan = eligible_cost_basis * max_pct
    scheme_cap = Decimal(str(scheme.max_outlay))
    max_permissible_loan = quantize_money(min(raw_max_loan, scheme_cap))

    parameter_origins.append(
        ParameterOriginItem(
            parameter="max_permissible_loan",
            label_en="Maximum Permitted Financing",
            label_hi="अधिकतम अनुमत वित्तपोषण",
            origin="VERIFIED_POLICY",
            note_en=f"Capped at {scheme.max_loan_percentage:.0f}% of cost up to scheme statutory ceiling of ₹{scheme_cap:,.0f}.",
            note_hi=f"लागत का {scheme.max_loan_percentage:.0f}% या वैधानिक अधिकतम सीमा ₹{scheme_cap:,.0f} तक सीमित।",
        )
    )

    # Mandatory promoter contribution: min percentage
    min_promoter_pct = Decimal(str(scheme.min_promoter_contribution)) / Decimal("100")
    mandatory_promoter_contribution = quantize_money(eligible_cost_basis * min_promoter_pct)

    parameter_origins.append(
        ParameterOriginItem(
            parameter="mandatory_promoter_contribution",
            label_en="Mandatory Beneficiary Equity",
            label_hi="अनिवार्य लाभार्थी अंशदान",
            origin="VERIFIED_POLICY",
            note_en=f"Minimum {scheme.min_promoter_contribution:.0f}% promoter equity mandated by lending policy.",
            note_hi=f"ऋण नीति द्वारा निर्धारित न्यूनतम {scheme.min_promoter_contribution:.0f}% प्रमोटर मार्जिन राशि।",
        )
    )

    # Requested loan processing
    if requested_loan_amount is not None and requested_loan_amount > Decimal("0.00"):
        requested = quantize_money(requested_loan_amount)
        if requested > max_permissible_loan:
            warnings.append(
                f"Requested loan of ₹{requested:,.2f} exceeds permissible statutory cap of ₹{max_permissible_loan:,.2f}. "
                f"Calculation has been clamped to the maximum permitted financing."
            )
            effective_loan = max_permissible_loan
        else:
            effective_loan = requested
        parameter_origins.append(
            ParameterOriginItem(
                parameter="requested_loan",
                label_en="Requested Borrowing",
                label_hi="अनुरोधित ऋण राशि",
                origin="USER_SPECIFIED",
                note_en=f"Beneficiary specified borrowing of ₹{requested:,.2f}.",
                note_hi=f"लाभार्थी द्वारा अनुरोधित ऋण राशि ₹{requested:,.2f}।",
            )
        )
    else:
        requested = max_permissible_loan
        effective_loan = max_permissible_loan
        assumptions_en.append(
            f"No specific borrowing amount was requested; simulation defaults to the maximum permissible financing of ₹{effective_loan:,.2f}."
        )
        assumptions_hi.append(
            f"कोई विशिष्ट ऋण राशि का अनुरोध नहीं किया गया था; सिमुलेशन अधिकतम अनुमत वित्तपोषण ₹{effective_loan:,.2f} का उपयोग करता है।"
        )
        parameter_origins.append(
            ParameterOriginItem(
                parameter="requested_loan",
                label_en="Requested Borrowing",
                label_hi="अनुरोधित ऋण राशि",
                origin="SIMULATION_ASSUMPTION",
                note_en="Defaults to maximum permissible loan in simulation mode.",
                note_hi="सिमुलेशन मोड में डिफ़ॉल्ट रूप से अधिकतम अनुमत ऋण का उपयोग किया गया है।",
            )
        )

    # Funding gap (Amount to fund from other sources)
    funding_gap = max(Decimal("0.00"), cost - (effective_loan + mandatory_promoter_contribution))

    # 2. Tenure Bounds
    max_tenure = scheme.repayment_tenure_max_years
    if tenure_years is None or tenure_years <= 0:
        actual_tenure_years = max_tenure
    else:
        actual_tenure_years = min(tenure_years, max_tenure)
        if tenure_years > max_tenure:
            warnings.append(
                f"Requested tenure of {tenure_years} years exceeds scheme maximum of {max_tenure} years; "
                f"clamped to {max_tenure} years."
            )

    parameter_origins.append(
        ParameterOriginItem(
            parameter="tenure_years",
            label_en="Repayment Tenure",
            label_hi="पुनर्भुगतान अवधि",
            origin="USER_SPECIFIED" if tenure_years else "VERIFIED_POLICY",
            note_en=f"{actual_tenure_years} years (statutory maximum is {max_tenure} years).",
            note_hi=f"{actual_tenure_years} वर्ष (वैधानिक अधिकतम {max_tenure} वर्ष)।",
        )
    )

    # 3. Moratorium Grace Bounds & Event-Based Education Rule
    grace_policy_rule = None
    if scheme.code == "SC_EDUCATION_LOAN" and course_duration_months and course_duration_months > 0:
        # NSFDC Policy Clause 8.2: Course Duration + 1 year (12 months)
        statutory_education_mora = course_duration_months + 12
        grace_policy_rule = (
            f"Course duration ({course_duration_months} months) + 12 months grace period "
            f"under NSFDC Educational Credit Guidelines Clause 8.2."
        )
        if moratorium_months is None:
            actual_moratorium_months = statutory_education_mora
        else:
            actual_moratorium_months = max(0, min(moratorium_months, 84))
    else:
        min_mora = scheme.moratorium_months_min
        max_mora = scheme.moratorium_months_max
        if moratorium_treatment == MoratoriumTreatment.NONE:
            actual_moratorium_months = 0
        elif moratorium_months is None:
            actual_moratorium_months = min_mora
        else:
            if moratorium_months < min_mora:
                actual_moratorium_months = min_mora
            elif moratorium_months > max_mora:
                actual_moratorium_months = max_mora
                warnings.append(
                    f"Requested moratorium of {moratorium_months} months exceeds policy maximum of {max_mora} months; "
                    f"clamped to {max_mora} months."
                )
            else:
                actual_moratorium_months = moratorium_months

    if moratorium_treatment == MoratoriumTreatment.NONE:
        actual_moratorium_months = 0

    parameter_origins.append(
        ParameterOriginItem(
            parameter="moratorium_months",
            label_en="Moratorium Grace Period",
            label_hi="मोरेटोरियम (छूट अवधि)",
            origin="VERIFIED_POLICY" if moratorium_months is None else "USER_SPECIFIED",
            note_en=f"{actual_moratorium_months} months grace.",
            note_hi=f"{actual_moratorium_months} माह की छूट अवधि।",
        )
    )

    # 4. Statutory Concessional Interest Rate
    annual_rate, rate_rationale_en, rate_rationale_hi = determine_statutory_interest_rate(
        scheme, effective_loan, gender=gender
    )

    parameter_origins.append(
        ParameterOriginItem(
            parameter="interest_rate",
            label_en="Concessional Interest Rate",
            label_hi="रियायती ब्याज दर",
            origin="VERIFIED_POLICY",
            note_en=rate_rationale_en,
            note_hi=rate_rationale_hi,
        )
    )

    # Periodic rate conversion: Monthly = 12, Quarterly = 4
    periods_per_year = Decimal("12") if repayment_frequency == RepaymentFrequency.MONTHLY else Decimal("4")
    periodic_rate = (annual_rate / Decimal("100")) / periods_per_year if annual_rate > Decimal("0.00") else Decimal("0.00")

    # 5. Moratorium Phase Evaluation
    monthly_rate = (annual_rate / Decimal("100")) / Decimal("12") if annual_rate > Decimal("0.00") else Decimal("0.00")
    moratorium_interest_accrued = Decimal("0.00")
    moratorium_interest_capitalized = Decimal("0.00")
    moratorium_payments_due = Decimal("0.00")

    amortization_schedule: List[AmortizationRow] = []

    if actual_moratorium_months > 0:
        current_mora_balance = effective_loan
        for m in range(1, actual_moratorium_months + 1):
            m_interest = quantize_money(effective_loan * monthly_rate)
            moratorium_interest_accrued += m_interest

            if moratorium_treatment == MoratoriumTreatment.INTEREST_ONLY:
                m_payment = m_interest
                m_principal = Decimal("0.00")
                moratorium_payments_due += m_interest
                closing = current_mora_balance
            elif moratorium_treatment == MoratoriumTreatment.ACCRUE_SIMPLE:
                m_payment = Decimal("0.00")
                m_principal = Decimal("0.00")
                closing = current_mora_balance
            elif moratorium_treatment == MoratoriumTreatment.CAPITALIZE:
                m_payment = Decimal("0.00")
                m_principal = Decimal("0.00")
                closing = current_mora_balance
            else:
                m_payment = Decimal("0.00")
                m_principal = Decimal("0.00")
                closing = current_mora_balance

            amortization_schedule.append(
                AmortizationRow(
                    period_index=m,
                    period_label=f"Moratorium Month {m}",
                    period_type="moratorium",
                    opening_balance=current_mora_balance,
                    instalment_amount=m_payment,
                    principal_component=m_principal,
                    interest_component=m_interest,
                    closing_balance=closing,
                )
            )

        if moratorium_treatment == MoratoriumTreatment.CAPITALIZE:
            moratorium_interest_capitalized = moratorium_interest_accrued
            opening_repayment_balance = effective_loan + moratorium_interest_capitalized
            assumptions_en.append(
                f"Moratorium accrued simple interest of ₹{moratorium_interest_accrued:,.2f} is capitalized at month {actual_moratorium_months}, "
                f"entering regular repayment on a consolidated balance of ₹{opening_repayment_balance:,.2f}."
            )
            assumptions_hi.append(
                f"मोरेटोरियम के दौरान संचित साधारण ब्याज ₹{moratorium_interest_accrued:,.2f} को {actual_moratorium_months}वें महीने में पूंजीकृत किया गया है, "
                f"जिससे ₹{opening_repayment_balance:,.2f} के समेकित शेष पर नियमित पुनर्भुगतान प्रारंभ होता है।"
            )
        elif moratorium_treatment == MoratoriumTreatment.ACCRUE_SIMPLE:
            opening_repayment_balance = effective_loan
            assumptions_en.append(
                f"Simple interest of ₹{moratorium_interest_accrued:,.2f} accrues during the {actual_moratorium_months}-month moratorium "
                f"and is tracked as accrued simple debt without compounding into principal."
            )
            assumptions_hi.append(
                f"{actual_moratorium_months} माह के मोरेटोरियम के दौरान ₹{moratorium_interest_accrued:,.2f} का साधारण ब्याज संचित होता है, "
                f"जिसे मूलधन में जोड़े बिना पृथक देय साधारण ब्याज के रूप में दर्ज किया गया है।"
            )
        else:
            opening_repayment_balance = effective_loan
    else:
        opening_repayment_balance = effective_loan

    # 6. Repayment Amortization Schedule Calculation
    total_repayment_periods = int(actual_tenure_years * int(periods_per_year))
    if tenure_includes_moratorium and actual_moratorium_months > 0:
        # If tenure explicitly includes moratorium, deduct moratorium periods
        mora_periods = (
            actual_moratorium_months
            if repayment_frequency == RepaymentFrequency.MONTHLY
            else (actual_moratorium_months + 2) // 3
        )
        total_repayment_periods = max(1, total_repayment_periods - mora_periods)

    n = total_repayment_periods
    P = opening_repayment_balance
    r = periodic_rate

    first_instalment_amount: Optional[Decimal] = None
    regular_instalment: Decimal = Decimal("0.00")
    final_instalment_amount: Decimal = Decimal("0.00")

    curr_balance = P
    total_principal_repaid = Decimal("0.00")
    total_repayment_interest = Decimal("0.00")
    start_period_index = actual_moratorium_months

    if repayment_method == RepaymentMethod.EQUAL_INSTALMENT:
        # Equal Annuity Instalment formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
        if r > Decimal("0.00") and n > 0 and P > Decimal("0.00"):
            factor = (Decimal("1.0") + r) ** n
            numerator = P * r * factor
            denominator = factor - Decimal("1.0")
            regular_instalment = quantize_money(numerator / denominator)
        elif n > 0 and P > Decimal("0.00"):
            # Zero interest loan
            regular_instalment = quantize_money(P / Decimal(str(n)))
        else:
            regular_instalment = Decimal("0.00")

        first_instalment_amount = regular_instalment

        for p_idx in range(1, total_repayment_periods + 1):
            period_label = (
                f"Repayment Month {p_idx}"
                if repayment_frequency == RepaymentFrequency.MONTHLY
                else f"Repayment Quarter {p_idx}"
            )

            interest_charge = quantize_money(curr_balance * r) if r > Decimal("0.00") else Decimal("0.00")

            if p_idx == total_repayment_periods:
                # Final period reconciliation: exactly extinguish remaining balance
                principal_paid = curr_balance
                final_payment = principal_paid + interest_charge
                closing_balance = Decimal("0.00")
                final_instalment_amount = final_payment
            else:
                principal_paid = min(curr_balance, regular_instalment - interest_charge)
                final_payment = regular_instalment
                closing_balance = curr_balance - principal_paid
                final_instalment_amount = regular_instalment

            total_principal_repaid += principal_paid
            total_repayment_interest += interest_charge

            amortization_schedule.append(
                AmortizationRow(
                    period_index=start_period_index + p_idx,
                    period_label=period_label,
                    period_type="repayment",
                    opening_balance=curr_balance,
                    instalment_amount=final_payment,
                    principal_component=principal_paid,
                    interest_component=interest_charge,
                    closing_balance=closing_balance,
                )
            )
            curr_balance = closing_balance

    else:
        # RepaymentMethod.EQUAL_PRINCIPAL: straight-line principal division
        if n > 0 and P > Decimal("0.00"):
            base_principal = quantize_money(P / Decimal(str(n)))
        else:
            base_principal = Decimal("0.00")

        for p_idx in range(1, total_repayment_periods + 1):
            period_label = (
                f"Repayment Month {p_idx}"
                if repayment_frequency == RepaymentFrequency.MONTHLY
                else f"Repayment Quarter {p_idx}"
            )

            interest_charge = quantize_money(curr_balance * r) if r > Decimal("0.00") else Decimal("0.00")

            if p_idx == total_repayment_periods:
                principal_paid = curr_balance
                final_payment = principal_paid + interest_charge
                closing_balance = Decimal("0.00")
                final_instalment_amount = final_payment
            else:
                principal_paid = min(curr_balance, base_principal)
                final_payment = principal_paid + interest_charge
                closing_balance = curr_balance - principal_paid

            if p_idx == 1:
                first_instalment_amount = final_payment
                regular_instalment = final_payment

            total_principal_repaid += principal_paid
            total_repayment_interest += interest_charge

            amortization_schedule.append(
                AmortizationRow(
                    period_index=start_period_index + p_idx,
                    period_label=period_label,
                    period_type="repayment",
                    opening_balance=curr_balance,
                    instalment_amount=final_payment,
                    principal_component=principal_paid,
                    interest_component=interest_charge,
                    closing_balance=closing_balance,
                )
            )
            curr_balance = closing_balance

    # Ensure final schedule balance is exactly 0.00
    if len(amortization_schedule) > 0 and total_repayment_periods > 0:
        assert amortization_schedule[-1].closing_balance == Decimal("0.00")

    # Reconciliation: sum of principal paid across repayment periods MUST equal opening repayment balance
    repay_rows = [row for row in amortization_schedule if row.period_type == "repayment"]
    if repay_rows:
        sum_principal = sum(row.principal_component for row in repay_rows)
        assert sum_principal == opening_repayment_balance

    # Total loan repayment = principal repaid + repayment interest + payments made during moratorium
    # Note: If interest was capitalized, it is part of principal repaid, so it is counted once without duplication
    total_loan_repayment = total_principal_repaid + total_repayment_interest + moratorium_payments_due

    # 7. Labels & Localized Assumptions
    treatment_labels = {
        MoratoriumTreatment.CAPITALIZE: {
            "en": "Interest capitalized at end of moratorium into opening repayment balance",
            "hi": "मोरेटोरियम के अंत में संचित ब्याज को ऋण के पुनर्भुगतान शेष में पूंजीकृत किया जाता है",
        },
        MoratoriumTreatment.ACCRUE_SIMPLE: {
            "en": "Simple interest accrues and is payable without compounding into principal",
            "hi": "साधारण ब्याज संचित होता है और बिना मूलधन में चक्रवृद्धि के देय है",
        },
        MoratoriumTreatment.INTEREST_ONLY: {
            "en": "Interest-only servicing due periodically during grace period",
            "hi": "छूट अवधि के दौरान केवल आवधिक ब्याज का भुगतान देय है",
        },
        MoratoriumTreatment.NONE: {
            "en": "Zero moratorium (immediate repayment start)",
            "hi": "शून्य मोरेटोरियम (तत्काल पुनर्भुगतान प्रारंभ)",
        },
    }

    freq_labels = {
        RepaymentFrequency.MONTHLY: {
            "en": "Monthly Equated Instalment (EMI)",
            "hi": "मासिक समान किस्त (EMI)",
        },
        RepaymentFrequency.QUARTERLY: {
            "en": "Quarterly Reducing-Balance Instalment",
            "hi": "त्रैमासिक घटते शेष पर किस्त",
        },
    }

    method_labels = {
        RepaymentMethod.EQUAL_INSTALMENT: {
            "en": "Equal Monthly Instalment (Annuity Amortization)",
            "hi": "समान मासिक किस्त (वार्षिकी परिशोधन)",
        },
        RepaymentMethod.EQUAL_PRINCIPAL: {
            "en": "Equal Principal Repayment (Declining Periodic Instalments)",
            "hi": "समान मूलधन पुनर्भुगतान (घटती आवधिक किस्तें)",
        },
    }

    assumptions_en.extend([
        f"Repayment follows {method_labels[repayment_method]['en']} per NSFDC statutory guidelines.",
        f"Grace moratorium period is {actual_moratorium_months} months before regular principal repayments commence.",
        f"Repayment frequency is {repayment_frequency.value.capitalize()} across {actual_tenure_years} years ({total_repayment_periods} instalments).",
        "Assumes full loan amount is disbursed as a single initial tranche at the start of the loan period.",
        "Calculations are educational decision-support estimates based on self-declared criteria and do not constitute a formal loan sanction offer.",
    ])
    assumptions_hi.extend([
        f"पुनर्भुगतान NSFDC वैधानिक दिशानिर्देशों के अनुसार {method_labels[repayment_method]['hi']} पर आधारित है।",
        f"नियमित मूलधन पुनर्भुगतान शुरू होने से पहले {actual_moratorium_months} महीने की छूट अवधि (मोरेटोरियम) शामिल है।",
        f"पुनर्भुगतान आवृत्ति {actual_tenure_years} वर्षों ({total_repayment_periods} किस्तों) में {'मासिक' if repayment_frequency == RepaymentFrequency.MONTHLY else 'त्रैमासिक'} है।",
        "अनुमान यह मानकर तैयार किया गया है कि ऋण राशि का वितरण शुरुआत में एकमुश्त किया गया है।",
        "यह गणना स्व-घोषित जानकारी पर आधारित प्रारंभिक वित्तीय अनुमान है और किसी बैंक का औपचारिक ऋण प्रस्ताव नहीं है।",
    ])

    exclusions_en.extend([
        "Lender documentation charges, mortgage charges, and state stamp duties are excluded from this preliminary estimate.",
        "Penal interest for delayed payments or loan default is excluded.",
        "Pre-closure penalties (which are waived for concessional lending) are excluded.",
    ])
    exclusions_hi.extend([
        "बैंक दस्तावेज शुल्क, बंधक शुल्क और राज्य स्टांप ड्यूटी इस प्रारंभिक अनुमान में शामिल नहीं हैं।",
        "विलंबित भुगतान या चूक पर दंडात्मक ब्याज शामिल नहीं है।",
        "ऋण पूर्व-समाप्ति शुल्क (जो रियायती ऋणों पर माफ होते हैं) शामिल नहीं हैं।",
    ])

    return FinancialCalculationResult(
        estimate_id=f"est-{uuid.uuid4().hex[:12]}",
        calculated_at=datetime.now(timezone.utc).isoformat(),
        calculation_engine_version="calc-v1.0",
        scheme_code=scheme.code,
        scheme_name_en=scheme.name_en,
        scheme_name_hi=scheme.name_hi,
        version_id=scheme.version_id,
        rule_version_status=rule_version_status,
        data_mode=data_mode,
        is_demonstration=scheme.is_demonstration,
        status=CalculationStatus.SUCCESS,
        financial_breakdown=FinancialBreakdown(
            total_cost=cost,
            eligible_cost_basis=eligible_cost_basis,
            max_permissible_loan=max_permissible_loan,
            requested_loan=requested,
            effective_loan_principal=effective_loan,
            mandatory_promoter_contribution=mandatory_promoter_contribution,
            funding_gap=funding_gap,
            funding_gap_label_en="Amount to fund from other sources",
            funding_gap_label_hi="अन्य स्रोतों से जुटाई जाने वाली शेष राशि",
        ),
        interest_breakdown=InterestBreakdown(
            annual_nominal_rate=annual_rate,
            rate_selection_rationale_en=rate_rationale_en,
            rate_selection_rationale_hi=rate_rationale_hi,
            effective_periodic_rate=quantize_money(periodic_rate * Decimal("100")),
            compounding_convention="nominal_annual_divided_by_periods",
        ),
        moratorium_breakdown=MoratoriumBreakdown(
            moratorium_months=actual_moratorium_months,
            treatment=moratorium_treatment,
            treatment_label_en=treatment_labels[moratorium_treatment]["en"],
            treatment_label_hi=treatment_labels[moratorium_treatment]["hi"],
            moratorium_interest_accrued=quantize_money(moratorium_interest_accrued),
            moratorium_interest_capitalized=quantize_money(moratorium_interest_capitalized),
            moratorium_payments_due=quantize_money(moratorium_payments_due),
            opening_repayment_balance=quantize_money(opening_repayment_balance),
            grace_period_policy_rule=grace_policy_rule,
        ),
        repayment_summary=RepaymentSummary(
            repayment_frequency=repayment_frequency,
            frequency_label_en=freq_labels[repayment_frequency]["en"],
            frequency_label_hi=freq_labels[repayment_frequency]["hi"],
            repayment_method=repayment_method,
            method_label_en=method_labels[repayment_method]["en"],
            method_label_hi=method_labels[repayment_method]["hi"],
            number_of_instalments=total_repayment_periods,
            tenure_years=actual_tenure_years,
            tenure_includes_moratorium=tenure_includes_moratorium,
            regular_instalment_amount=regular_instalment,
            first_instalment_amount=first_instalment_amount,
            final_instalment_amount=final_instalment_amount,
            total_principal_repaid=quantize_money(total_principal_repaid),
            total_repayment_interest=quantize_money(total_repayment_interest),
            total_loan_repayment=quantize_money(total_loan_repayment),
        ),
        amortization_schedule=amortization_schedule,
        parameter_origins=parameter_origins,
        assumptions_en=assumptions_en,
        assumptions_hi=assumptions_hi,
        exclusions_en=exclusions_en,
        exclusions_hi=exclusions_hi,
        policy_source_meta=scheme.source_meta,
        warnings=warnings,
    )
