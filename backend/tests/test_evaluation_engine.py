import pytest
from backend.app.core.engine import (
    evaluate_beneficiary_profile,
    SchemeEligibilityStatus,
)
from backend.app.core.rules import RuleOutcome


def test_micro_finance_match():
    profile = {
        "purpose": "business",
        "total_cost": 120000.0,
        "borrowing_amount": 100000.0,
        "annual_family_income": 250000.0,
        "community_declaration": "yes",
        "business_description": "Tailoring and stitching boutique",
        "business_stage": "new",
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    assert result.primary_scheme is not None
    assert result.primary_scheme.code == "SC_MICRO_FINANCE"
    assert result.primary_scheme.status == SchemeEligibilityStatus.POTENTIALLY_ELIGIBLE
    assert result.primary_scheme.max_eligible_loan == 108000.0  # 90% of 1,20,000
    assert result.primary_scheme.min_promoter_contribution_amount == 12000.0  # 10% of 1,20,000

    # Ensure all conditions passed
    assert len(result.primary_scheme.passed_conditions) == 4
    assert len(result.primary_scheme.failed_conditions) == 0
    assert len(result.primary_scheme.unknown_conditions) == 0

    # Ensure explanations exist in English and Hindi
    for cond in result.primary_scheme.passed_conditions:
        assert cond.reason_en
        assert cond.reason_hi
        assert cond.source_clause


def test_term_loan_match():
    profile = {
        "purpose": "business",
        "total_cost": 1500000.0,
        "borrowing_amount": 1350000.0,
        "annual_family_income": 350000.0,
        "community_declaration": "yes",
        "business_description": "Small engineering workshop",
        "business_stage": "new",
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    assert result.primary_scheme is not None
    assert result.primary_scheme.code == "SC_TERM_LOAN"
    assert result.primary_scheme.status == SchemeEligibilityStatus.POTENTIALLY_ELIGIBLE
    assert result.primary_scheme.max_eligible_loan == 1350000.0  # 90% of 15,00,000

    # Micro Finance scheme should be INELIGIBLE because outlay > 1,40,000
    mf_schemes = [s for s in result.ineligible_schemes if s.code == "SC_MICRO_FINANCE"]
    assert len(mf_schemes) == 1
    assert any(c.rule_id == "MF_OUTLAY_LIMIT" for c in mf_schemes[0].failed_conditions)


def test_income_ceiling_exceeded():
    profile = {
        "purpose": "business",
        "total_cost": 100000.0,
        "annual_family_income": 600000.0,  # Exceeds 5.0 Lakh ceiling
        "community_declaration": "yes",
        "business_description": "Grocery store",
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    # NSFDC MF must be ineligible due to income ceiling
    mf = next(s for s in result.ineligible_schemes if s.code == "SC_MICRO_FINANCE")
    assert mf.status == SchemeEligibilityStatus.INELIGIBLE
    assert any(c.rule_id == "MF_INCOME_CEILING" and c.outcome == RuleOutcome.FAIL for c in mf.failed_conditions)


def test_education_loan_needs_information_for_accreditation():
    profile = {
        "purpose": "education",
        "total_cost": 800000.0,
        "annual_family_income": 200000.0,
        "community_declaration": "yes",
        "course_name": "B.Tech Computer Science",
        "institution_accredited": None,  # Not verified yet
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    # Primary is None because no scheme is strictly POTENTIALLY_ELIGIBLE without accreditation
    edu_schemes = [s for s in result.needs_information_schemes if s.code == "SC_EDUCATION_LOAN"]
    assert len(edu_schemes) == 1
    edu = edu_schemes[0]
    assert edu.status == SchemeEligibilityStatus.NEEDS_INFORMATION
    assert "institution_accredited" in edu.missing_information
    assert any(c.rule_id == "EDU_INSTITUTION_ACCREDITATION" and c.outcome == RuleOutcome.UNKNOWN for c in edu.unknown_conditions)


def test_community_declaration_unsure_or_prefer_not_to_say():
    profile = {
        "purpose": "business",
        "total_cost": 80000.0,
        "annual_family_income": 200000.0,
        "community_declaration": "unsure",
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    # Should not be in eligible; should be in needs_information
    mf_schemes = [s for s in result.needs_information_schemes if s.code == "SC_MICRO_FINANCE"]
    assert len(mf_schemes) == 1
    assert mf_schemes[0].status == SchemeEligibilityStatus.NEEDS_INFORMATION
    assert any(c.rule_id == "MF_COMMUNITY_DECLARATION" and c.outcome == RuleOutcome.UNKNOWN for c in mf_schemes[0].unknown_conditions)


def test_community_declaration_no_is_ineligible():
    profile = {
        "purpose": "business",
        "total_cost": 80000.0,
        "annual_family_income": 200000.0,
        "community_declaration": "no",
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    mf_schemes = [s for s in result.ineligible_schemes if s.code == "SC_MICRO_FINANCE"]
    assert len(mf_schemes) == 1
    assert any(c.rule_id == "MF_COMMUNITY_DECLARATION" and c.outcome == RuleOutcome.FAIL for c in mf_schemes[0].failed_conditions)


def test_ranking_prefers_verified_over_demonstration():
    profile = {
        "purpose": "business",
        "total_cost": 80000.0,
        "annual_family_income": 200000.0,
        "community_declaration": "yes",
        "state": "Maharashtra",
        "district": "Wardha",
    }
    result = evaluate_beneficiary_profile(profile)

    # Both SC_MICRO_FINANCE and SC_MAHILA_SAMRIDDHI (demo) pass
    # SC_MICRO_FINANCE must rank as primary because it is verified official policy (+1000 score bonus)
    assert result.primary_scheme is not None
    assert result.primary_scheme.code == "SC_MICRO_FINANCE"
    assert result.primary_scheme.is_demonstration is False
    assert any(s.code == "SC_MAHILA_SAMRIDDHI" for s in result.alternative_schemes)
