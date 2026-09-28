import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.app.core.rules import (
    RuleOutcome,
    EvaluatedCondition,
    evaluate_single_condition,
)
from backend.app.core.catalogue import (
    SchemePolicyRecord,
    PolicySourceMeta,
    VERSIONED_SCHEME_CATALOGUE,
)


class SchemeEligibilityStatus(str, Enum):
    POTENTIALLY_ELIGIBLE = "POTENTIALLY_ELIGIBLE"
    INELIGIBLE = "INELIGIBLE"
    NEEDS_INFORMATION = "NEEDS_INFORMATION"


class SchemeEvaluationOutcome(BaseModel):
    scheme_id: str
    code: str
    name_en: str
    name_hi: str
    provider_en: str
    provider_hi: str
    purpose: str
    status: SchemeEligibilityStatus
    is_demonstration: bool
    version_id: str
    passed_conditions: List[EvaluatedCondition] = Field(default_factory=list)
    failed_conditions: List[EvaluatedCondition] = Field(default_factory=list)
    unknown_conditions: List[EvaluatedCondition] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    max_eligible_loan: float
    min_promoter_contribution_amount: float
    indicative_interest_rate: str
    indicative_moratorium: str
    indicative_tenure_years: int
    source_meta: PolicySourceMeta
    match_reasons_en: List[str] = Field(default_factory=list)
    match_reasons_hi: List[str] = Field(default_factory=list)
    ranking_score: float = 0.0
    ranking_explanation: str = ""


class EvaluationResult(BaseModel):
    evaluation_id: str
    evaluated_at: str
    engine_version: str = "eval-v1.0"
    ranking_policy_version: str = "rank-v1.0"
    disclaimer_en: str
    disclaimer_hi: str
    primary_scheme: Optional[SchemeEvaluationOutcome] = None
    alternative_schemes: List[SchemeEvaluationOutcome] = Field(default_factory=list)
    needs_information_schemes: List[SchemeEvaluationOutcome] = Field(default_factory=list)
    ineligible_schemes: List[SchemeEvaluationOutcome] = Field(default_factory=list)
    total_schemes_evaluated: int
    assessed_purpose: str
    assessed_outlay: float
    assessed_income: float


MISSING_FIELD_LABELS: Dict[str, Dict[str, str]] = {
    "institution_accredited": {
        "en": "Institution/Course accreditation status under UGC/AICTE guidelines",
        "hi": "यूजीसी/एआईसीटीई दिशानिर्देशों के तहत संस्थान/पाठ्यक्रम की मान्यता स्थिति",
    },
    "community_declaration": {
        "en": "Official Scheduled Caste Certificate verification",
        "hi": "आधिकारिक अनुसूचित जाति प्रमाण पत्र सत्यापन",
    },
    "annual_family_income": {
        "en": "Income Certificate issued by competent Revenue Authority",
        "hi": "सक्षम राजस्व प्राधिकारी द्वारा जारी आय प्रमाण पत्र",
    },
    "total_cost": {
        "en": "Formal project quotation or institution course fee structure breakdown",
        "hi": "औपचारिक परियोजना कोटेशन या संस्थान शुल्क संरचना विवरण",
    },
}


def evaluate_beneficiary_profile(
    profile: Dict[str, Any],
    catalogue: Optional[List[SchemePolicyRecord]] = None,
) -> EvaluationResult:
    """
    Deterministic rule evaluation and explainable ranking engine.
    Evaluates confirmed beneficiary facts against versioned scheme rules.
    Does not invent eligibility decisions or policy parameters.
    """
    if catalogue is None:
        catalogue = VERSIONED_SCHEME_CATALOGUE

    eval_time = datetime.now(timezone.utc).isoformat()
    eval_id = f"eval-{uuid.uuid4().hex[:12]}"

    purpose = profile.get("purpose", "business")
    total_cost = float(profile.get("total_cost", 0.0) or 0.0)
    annual_income = float(profile.get("annual_family_income", 0.0) or 0.0)

    evaluated_schemes: List[SchemeEvaluationOutcome] = []

    for scheme in catalogue:
        passed: List[EvaluatedCondition] = []
        failed: List[EvaluatedCondition] = []
        unknown: List[EvaluatedCondition] = []
        missing_fields: List[str] = []

        # Evaluate each condition in the scheme policy
        for cond in scheme.conditions:
            res = evaluate_single_condition(cond, profile)
            if res.outcome == RuleOutcome.PASS:
                passed.append(res)
            elif res.outcome == RuleOutcome.FAIL:
                failed.append(res)
            else:
                unknown.append(res)
                if cond.field not in missing_fields:
                    missing_fields.append(cond.field)

        # Determine overall scheme eligibility status
        if len(failed) > 0:
            status = SchemeEligibilityStatus.INELIGIBLE
        elif len(unknown) > 0:
            status = SchemeEligibilityStatus.NEEDS_INFORMATION
        else:
            status = SchemeEligibilityStatus.POTENTIALLY_ELIGIBLE

        # Financial parameters calculation strictly based on scheme policies
        # Max loan is the minimum of (project outlay * max_loan_percentage / 100) and max_outlay
        potential_loan_share = total_cost * (scheme.max_loan_percentage / 100.0)
        max_eligible_loan = min(potential_loan_share, scheme.max_outlay)
        min_promoter_contribution = total_cost * (scheme.min_promoter_contribution / 100.0)

        interest_rate_str = f"{scheme.interest_rate_min}% - {scheme.interest_rate_max}% p.a."
        moratorium_str = f"{scheme.moratorium_months_min} - {scheme.moratorium_months_max} months"

        # Construct localized match reasons
        match_reasons_en = [p.reason_en for p in passed]
        match_reasons_hi = [p.reason_hi for p in passed]

        # Ranking score calculation under policy 'rank-v1.0':
        # 1. Verified official schemes receive +1000 precedence over demonstration schemes (+0)
        # 2. Scheme purpose match: exact match gets +500
        # 3. Passed conditions count (+50 per condition)
        # 4. Outlay suitability: cost within [min_outlay, max_outlay] gets +200
        # 5. Concessional interest rate penalty reduction (lower min interest rate gets small bonus)
        score = 0.0
        if not scheme.is_demonstration:
            score += 1000.0
        if scheme.purpose == purpose:
            score += 500.0
        score += len(passed) * 50.0
        if scheme.min_outlay <= total_cost <= scheme.max_outlay:
            score += 200.0
        score += max(0.0, (10.0 - scheme.interest_rate_min) * 10.0)

        ranking_explanation = (
            f"Evaluated under ranking policy rank-v1.0. Base score {score:.1f} "
            f"derived from: verified status ({'official' if not scheme.is_demonstration else 'demonstration'}), "
            f"purpose alignment ({scheme.purpose}), {len(passed)} verified policy rules, "
            f"and outlay fit (₹{scheme.min_outlay:,.0f} - ₹{scheme.max_outlay:,.0f})."
        )

        outcome = SchemeEvaluationOutcome(
            scheme_id=scheme.scheme_id,
            code=scheme.code,
            name_en=scheme.name_en,
            name_hi=scheme.name_hi,
            provider_en=scheme.provider_en,
            provider_hi=scheme.provider_hi,
            purpose=scheme.purpose,
            status=status,
            is_demonstration=scheme.is_demonstration,
            version_id=scheme.version_id,
            passed_conditions=passed,
            failed_conditions=failed,
            unknown_conditions=unknown,
            missing_information=missing_fields,
            max_eligible_loan=round(max_eligible_loan, 2),
            min_promoter_contribution_amount=round(min_promoter_contribution, 2),
            indicative_interest_rate=interest_rate_str,
            indicative_moratorium=moratorium_str,
            indicative_tenure_years=scheme.repayment_tenure_max_years,
            source_meta=scheme.source_meta,
            match_reasons_en=match_reasons_en,
            match_reasons_hi=match_reasons_hi,
            ranking_score=round(score, 2),
            ranking_explanation=ranking_explanation,
        )
        evaluated_schemes.append(outcome)

    # Segment into status buckets
    eligible_schemes = [
        s for s in evaluated_schemes if s.status == SchemeEligibilityStatus.POTENTIALLY_ELIGIBLE
    ]
    needs_info_schemes = [
        s for s in evaluated_schemes if s.status == SchemeEligibilityStatus.NEEDS_INFORMATION
    ]
    ineligible_schemes = [
        s for s in evaluated_schemes if s.status == SchemeEligibilityStatus.INELIGIBLE
    ]

    # Rank eligible schemes deterministically:
    # Primary: ranking_score descending
    # Secondary: code ascending (alphabetical tie-breaker)
    eligible_schemes.sort(key=lambda s: (-s.ranking_score, s.code))
    needs_info_schemes.sort(key=lambda s: (-s.ranking_score, s.code))
    ineligible_schemes.sort(key=lambda s: (-s.ranking_score, s.code))

    primary_scheme: Optional[SchemeEvaluationOutcome] = None
    alternative_schemes: List[SchemeEvaluationOutcome] = []

    if eligible_schemes:
        primary_scheme = eligible_schemes[0]
        alternative_schemes = eligible_schemes[1:]

    disclaimer_en = (
        "Preliminary guidance based on self-declared information under official NSFDC and "
        "State Channel Partner lending policies. Final eligibility, appraisal, document "
        "verification, and loan sanction remain with the authorized Channel Partner or State Agency."
    )
    disclaimer_hi = (
        "आधिकारिक NSFDC और राज्य चैनल पार्टनर ऋण नीतियों के तहत स्व-घोषित जानकारी पर आधारित "
        "प्रारंभिक मार्गदर्शन। अंतिम पात्रता, दस्तावेज़ सत्यापन और ऋण स्वीकृति अधिकृत चैनल "
        "पार्टनर या राज्य एजेंसी के अधीन है।"
    )

    return EvaluationResult(
        evaluation_id=eval_id,
        evaluated_at=eval_time,
        engine_version="eval-v1.0",
        ranking_policy_version="rank-v1.0",
        disclaimer_en=disclaimer_en,
        disclaimer_hi=disclaimer_hi,
        primary_scheme=primary_scheme,
        alternative_schemes=alternative_schemes,
        needs_information_schemes=needs_info_schemes,
        ineligible_schemes=ineligible_schemes,
        total_schemes_evaluated=len(evaluated_schemes),
        assessed_purpose=purpose,
        assessed_outlay=total_cost,
        assessed_income=annual_income,
    )
