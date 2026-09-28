from decimal import Decimal
import pytest
from backend.app.core.calculator import (
    calculate_scheme_repayment,
    RepaymentFrequency,
    RepaymentMethod,
    MoratoriumTreatment,
    CalculationStatus,
    RuleVersionStatus,
    DataMode,
)


def test_01_micro_finance_monthly_annuity_reconciliation():
    """1. Monthly annuity reducing-balance reconciliation."""
    # Outlay 1,20,000 -> 90% loan is 108,000, 10% equity is 12,000
    # Effective loan 108,000 > 1,00,000 -> 7.00% tier
    # Moratorium: 6 months capitalized
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("120000.00"),
        moratorium_months=6,
        tenure_years=3,
        repayment_frequency=RepaymentFrequency.MONTHLY,
        repayment_method=RepaymentMethod.EQUAL_INSTALMENT,
        moratorium_treatment=MoratoriumTreatment.CAPITALIZE,
    )

    assert result.status == CalculationStatus.SUCCESS
    assert result.financial_breakdown.effective_loan_principal == Decimal("108000.00")
    assert result.financial_breakdown.mandatory_promoter_contribution == Decimal("12000.00")
    assert result.interest_breakdown.annual_nominal_rate == Decimal("7.00")

    # 6 months of 630.00 = 3,780.00
    assert result.moratorium_breakdown.moratorium_interest_capitalized == Decimal("3780.00")
    opening_repay = result.moratorium_breakdown.opening_repayment_balance
    assert opening_repay == Decimal("111780.00")

    # Schedule length: 6 moratorium + 36 repayment = 42 periods
    assert len(result.amortization_schedule) == 42

    repay_rows = [r for r in result.amortization_schedule if r.period_type == "repayment"]
    assert len(repay_rows) == 36

    sum_principal = sum(r.principal_component for r in repay_rows)
    assert sum_principal == opening_repay
    assert repay_rows[-1].closing_balance == Decimal("0.00")


def test_02_term_loan_quarterly_schedule():
    """2. Quarterly schedule with documented quarterly rate convention."""
    result = calculate_scheme_repayment(
        scheme_code="SC_TERM_LOAN",
        project_cost=Decimal("1500000.00"),
        tenure_years=5,
        moratorium_months=6,
        repayment_frequency=RepaymentFrequency.QUARTERLY,
        moratorium_treatment=MoratoriumTreatment.INTEREST_ONLY,
    )

    assert result.status == CalculationStatus.SUCCESS
    assert result.financial_breakdown.effective_loan_principal == Decimal("1350000.00")
    assert result.interest_breakdown.annual_nominal_rate == Decimal("8.00")
    assert result.repayment_summary.repayment_frequency == RepaymentFrequency.QUARTERLY
    assert result.repayment_summary.number_of_instalments == 20  # 5 years * 4 quarters

    assert result.moratorium_breakdown.opening_repayment_balance == Decimal("1350000.00")
    assert result.moratorium_breakdown.moratorium_payments_due > Decimal("0.00")

    repay_rows = [r for r in result.amortization_schedule if r.period_type == "repayment"]
    sum_principal = sum(r.principal_component for r in repay_rows)
    assert sum_principal == Decimal("1350000.00")
    assert repay_rows[-1].closing_balance == Decimal("0.00")


def test_03_equal_principal_repayment_schedule():
    """3. Equal-principal repayments (principal divided equally, decreasing interest)."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        tenure_years=2,
        moratorium_months=0,
        repayment_frequency=RepaymentFrequency.MONTHLY,
        repayment_method=RepaymentMethod.EQUAL_PRINCIPAL,
        moratorium_treatment=MoratoriumTreatment.NONE,
    )

    assert result.status == CalculationStatus.SUCCESS
    assert result.repayment_summary.repayment_method == RepaymentMethod.EQUAL_PRINCIPAL
    # 90% of 100,000 = 90,000. 2 years = 24 months. Base principal = 90,000 / 24 = 3,750.00
    repay_rows = [r for r in result.amortization_schedule if r.period_type == "repayment"]
    assert len(repay_rows) == 24
    assert repay_rows[0].principal_component == Decimal("3750.00")
    assert repay_rows[1].principal_component == Decimal("3750.00")

    # In equal principal, the first payment is strictly greater than the last payment
    assert repay_rows[0].instalment_amount > repay_rows[-1].instalment_amount

    # Sum of principal equals initial loan
    sum_principal = sum(r.principal_component for r in repay_rows)
    assert sum_principal == Decimal("90000.00")
    assert repay_rows[-1].closing_balance == Decimal("0.00")


def test_04_zero_interest_handling():
    """4. Zero interest calculation handled separately without division by zero."""
    # We can test by setting a synthetic zero interest rate or simulating a zero interest policy
    # Mahila Samriddhi is low, but let's test zero rate logic directly by modifying scheme or asserting engine handles r=0
    from backend.app.core.catalogue import SchemePolicyRecord, PolicySourceMeta

    zero_scheme = SchemePolicyRecord(
        scheme_id="test-zero-int",
        code="TEST_ZERO_INT",
        name_en="Test Zero Interest Scheme",
        name_hi="परीक्षण शून्य ब्याज योजना",
        provider_en="Test Provider",
        provider_hi="परीक्षण प्रदाता",
        purpose="business",
        description_en="Test",
        description_hi="टेस्ट",
        is_demonstration=True,
        version_id="TEST-0.1",
        effective_from="2024-01-01",
        min_outlay=10000.0,
        max_outlay=100000.0,
        max_loan_percentage=90.0,
        min_promoter_contribution=10.0,
        interest_rate_min=0.0,
        interest_rate_max=0.0,
        moratorium_months_min=0,
        moratorium_months_max=0,
        repayment_tenure_max_years=2,
        source_meta=PolicySourceMeta(
            title="Test",
            document_ref="REF-0",
            clause="C1",
            official_url="https://test.nic.in",
            effective_date="2024-01-01",
            source_checked_date="2024-01-01",
            verification_status="DEMONSTRATION",
        ),
        conditions=[],
    )

    result = calculate_scheme_repayment(
        scheme_code="TEST_ZERO_INT",
        project_cost=Decimal("100000.00"),
        tenure_years=2,
        moratorium_months=0,
        repayment_frequency=RepaymentFrequency.MONTHLY,
        catalogue=[zero_scheme],
    )

    assert result.status == CalculationStatus.SUCCESS
    assert result.interest_breakdown.annual_nominal_rate == Decimal("0.00")
    # Loan is 90,000. 24 months. Each payment should be exactly 90,000 / 24 = 3,750.00
    assert result.repayment_summary.regular_instalment_amount == Decimal("3750.00")
    assert result.repayment_summary.total_repayment_interest == Decimal("0.00")
    assert result.repayment_summary.total_loan_repayment == Decimal("90000.00")


def test_05_financing_percentage_and_maximum_cap():
    """5. Financing percentage (90%) and maximum cap enforcement."""
    # Micro Finance cap is 1,40,000. If outlay is 2,00,000:
    # 90% is 1,80,000, clamped to 1,40,000.
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("200000.00"),
    )
    assert result.financial_breakdown.max_permissible_loan == Decimal("140000.00")
    assert result.financial_breakdown.effective_loan_principal == Decimal("140000.00")
    # Mandatory promoter equity (10% of 200,000) = 20,000
    assert result.financial_breakdown.mandatory_promoter_contribution == Decimal("20000.00")
    # Funding gap = 200,000 - (140,000 + 20,000) = 40,000
    assert result.financial_breakdown.funding_gap == Decimal("40000.00")


def test_06_requested_amount_below_cap_creates_funding_gap():
    """6. Requested loan below permissible maximum creates a funding gap."""
    # Outlay 1,20,000 -> Max permitted is 1,08,000. User requested 70,000.
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("120000.00"),
        requested_loan_amount=Decimal("70000.00"),
    )
    assert result.financial_breakdown.effective_loan_principal == Decimal("70000.00")
    assert result.financial_breakdown.mandatory_promoter_contribution == Decimal("12000.00")
    # Funding gap = 120,000 - (70,000 + 12,000) = 38,000
    assert result.financial_breakdown.funding_gap == Decimal("38000.00")


def test_07_requested_amount_above_cap_triggers_warning_and_clamp():
    """7. Requested amount above cap triggers warning and clamps to permissible max."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("120000.00"),
        requested_loan_amount=Decimal("150000.00"),
    )
    # Permissible max for 120,000 is 108,000
    assert result.financial_breakdown.effective_loan_principal == Decimal("108000.00")
    assert any("exceeds permissible statutory cap" in w for w in result.warnings)


def test_08_mandatory_contribution_vs_residual_gap_distinction():
    """8. Distinct labeling for mandatory promoter equity and amount to fund from other sources."""
    result = calculate_scheme_repayment(
        scheme_code="SC_TERM_LOAN",
        project_cost=Decimal("2000000.00"),
        requested_loan_amount=Decimal("1200000.00"),
    )
    # Mandatory 10% is 200,000
    assert result.financial_breakdown.mandatory_promoter_contribution == Decimal("200000.00")
    # Effective loan = 1,200,000
    assert result.financial_breakdown.effective_loan_principal == Decimal("1200000.00")
    # Residual gap = 2,000,000 - 1,200,000 - 200,000 = 600,000
    assert result.financial_breakdown.funding_gap == Decimal("600000.00")
    assert result.financial_breakdown.funding_gap_label_en == "Amount to fund from other sources"


def test_09_zero_moratorium():
    """9. Zero moratorium grace period (immediate repayment start)."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        moratorium_treatment=MoratoriumTreatment.NONE,
    )
    assert result.moratorium_breakdown.moratorium_months == 0
    assert result.moratorium_breakdown.moratorium_interest_accrued == Decimal("0.00")
    assert result.moratorium_breakdown.moratorium_interest_capitalized == Decimal("0.00")
    # Schedule should only have repayment rows, no moratorium rows
    mora_rows = [r for r in result.amortization_schedule if r.period_type == "moratorium"]
    assert len(mora_rows) == 0


def test_10_interest_only_servicing_during_moratorium():
    """10. Interest serviced monthly during grace period; opening principal unchanged."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        moratorium_months=3,
        moratorium_treatment=MoratoriumTreatment.INTEREST_ONLY,
    )
    # Effective loan = 90,000 at 6.50%
    # Monthly interest = 90,000 * 0.065 / 12 = 487.50
    assert result.moratorium_breakdown.moratorium_months == 3
    assert result.moratorium_breakdown.moratorium_payments_due == Decimal("1462.50")
    assert result.moratorium_breakdown.moratorium_interest_capitalized == Decimal("0.00")
    assert result.moratorium_breakdown.opening_repayment_balance == Decimal("90000.00")


def test_11_capitalized_interest_after_moratorium():
    """11. Capitalized interest increases opening repayment balance."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        moratorium_months=4,
        moratorium_treatment=MoratoriumTreatment.CAPITALIZE,
    )
    # 4 months * 487.50 = 1,950.00
    assert result.moratorium_breakdown.moratorium_interest_capitalized == Decimal("1950.00")
    assert result.moratorium_breakdown.opening_repayment_balance == Decimal("91950.00")


def test_12_accrue_simple_interest_moratorium():
    """12. Simple interest accrued during moratorium is not capitalized into principal."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        moratorium_months=3,
        moratorium_treatment=MoratoriumTreatment.ACCRUE_SIMPLE,
    )
    assert result.moratorium_breakdown.moratorium_interest_accrued == Decimal("1462.50")
    assert result.moratorium_breakdown.moratorium_interest_capitalized == Decimal("0.00")
    assert result.moratorium_breakdown.opening_repayment_balance == Decimal("90000.00")


def test_13_tenure_including_vs_excluding_moratorium():
    """13. Tenure including moratorium deducts moratorium months from repayment periods."""
    result_excl = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        tenure_years=3,
        moratorium_months=6,
        tenure_includes_moratorium=False,
    )
    repay_rows_excl = [r for r in result_excl.amortization_schedule if r.period_type == "repayment"]
    assert len(repay_rows_excl) == 36  # full 3 years of repayments

    result_incl = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        tenure_years=3,
        moratorium_months=6,
        tenure_includes_moratorium=True,
    )
    repay_rows_incl = [r for r in result_incl.amortization_schedule if r.period_type == "repayment"]
    assert len(repay_rows_incl) == 30  # 36 total months - 6 moratorium months = 30 repayment months


def test_14_education_loan_course_duration_grace():
    """14. Education loan course-duration event-based grace rule."""
    # Under NSFDC Clause 8.2: Course Duration (e.g. 36 months) + 12 months grace = 48 months moratorium
    result = calculate_scheme_repayment(
        scheme_code="SC_EDUCATION_LOAN",
        project_cost=Decimal("500000.00"),
        course_duration_months=36,
    )
    assert result.moratorium_breakdown.moratorium_months == 48
    assert "Course duration (36 months) + 12 months grace period" in (
        result.moratorium_breakdown.grace_period_policy_rule or ""
    )


def test_15_education_loan_female_concession():
    """15. Female concessional rate tier (6.50% vs 7.00%) for SC_EDUCATION_LOAN."""
    result_male = calculate_scheme_repayment(
        scheme_code="SC_EDUCATION_LOAN",
        project_cost=Decimal("500000.00"),
        gender="male",
    )
    assert result_male.interest_breakdown.annual_nominal_rate == Decimal("7.00")

    result_female = calculate_scheme_repayment(
        scheme_code="SC_EDUCATION_LOAN",
        project_cost=Decimal("500000.00"),
        gender="female",
    )
    assert result_female.interest_breakdown.annual_nominal_rate == Decimal("6.50")
    assert "rebate for women" in result_female.interest_breakdown.rate_selection_rationale_en


def test_16_final_payment_adjustment_exact_zero():
    """16. Final payment adjusts for fractional cent rounding; closing balance strictly 0.00."""
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("111111.00"),
        tenure_years=3,
        moratorium_months=5,
    )
    repay_rows = [r for r in result.amortization_schedule if r.period_type == "repayment"]
    assert repay_rows[-1].closing_balance == Decimal("0.00")


def test_17_reconciliation_sums_and_schedule():
    """17. Sum of principal components strictly equals opening balance."""
    result = calculate_scheme_repayment(
        scheme_code="SC_TERM_LOAN",
        project_cost=Decimal("1250000.00"),
        tenure_years=4,
        moratorium_months=6,
        repayment_frequency=RepaymentFrequency.QUARTERLY,
        moratorium_treatment=MoratoriumTreatment.CAPITALIZE,
    )
    repay_rows = [r for r in result.amortization_schedule if r.period_type == "repayment"]
    opening_bal = result.moratorium_breakdown.opening_repayment_balance
    sum_principal = sum(r.principal_component for r in repay_rows)
    assert sum_principal == opening_bal
    assert result.repayment_summary.total_principal_repaid == opening_bal


def test_18_no_double_counting_of_capitalized_interest():
    """18. Capitalized interest is not double-counted in total estimated loan repayment."""
    # When interest is capitalized, it enters the opening repayment balance and is repaid via principal.
    # Therefore: total_loan_repayment = total_principal_repaid + total_repayment_interest + moratorium_payments_due
    # and total_principal_repaid already includes the capitalized interest.
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        moratorium_months=6,
        moratorium_treatment=MoratoriumTreatment.CAPITALIZE,
    )
    repay_summary = result.repayment_summary
    expected_total = (
        repay_summary.total_principal_repaid
        + repay_summary.total_repayment_interest
        + result.moratorium_breakdown.moratorium_payments_due
    )
    assert repay_summary.total_loan_repayment == expected_total


def test_19_version_checking_and_invalid_scheme():
    """19. Detect outdated rule versions and reject invalid scheme codes."""
    # Outdated version check
    result = calculate_scheme_repayment(
        scheme_code="SC_MICRO_FINANCE",
        project_cost=Decimal("100000.00"),
        rule_version_id="OLD-VERSION-2020",
    )
    assert result.rule_version_status == RuleVersionStatus.OUTDATED
    assert any("superseded" in w for w in result.warnings)

    # Invalid scheme check
    with pytest.raises(ValueError) as exc_info:
        calculate_scheme_repayment(
            scheme_code="NON_EXISTENT_SCHEME",
            project_cost=Decimal("100000.00"),
        )
    assert "not recognized" in str(exc_info.value)
