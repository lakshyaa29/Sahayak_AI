from enum import Enum
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field


class RuleOutcome(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    UNKNOWN = "UNKNOWN"


class RuleCondition(BaseModel):
    rule_id: str
    field: str
    operator: str  # eq, in, lte, gte, gt, lt, range, exists, all_of, any_of
    expected: Any
    missing_behavior: RuleOutcome = RuleOutcome.UNKNOWN
    source_clause: str
    explanation_template_en: str
    explanation_template_hi: str
    sub_conditions: Optional[List["RuleCondition"]] = None


class EvaluatedCondition(BaseModel):
    rule_id: str
    field: str
    operator: str
    expected: Any
    actual: Any
    outcome: RuleOutcome
    source_clause: str
    reason_en: str
    reason_hi: str


def evaluate_single_condition(condition: RuleCondition, profile: Dict[str, Any]) -> EvaluatedCondition:
    """
    Evaluates a single condition against the beneficiary profile facts.
    Supports atomic operators as well as compound 'all_of' and 'any_of'.
    """
    field_value = profile.get(condition.field)

    # 1. Handle compound conditions
    if condition.operator == "all_of" and condition.sub_conditions:
        sub_evals = [evaluate_single_condition(sub, profile) for sub in condition.sub_conditions]
        if any(sub.outcome == RuleOutcome.FAIL for sub in sub_evals):
            outcome = RuleOutcome.FAIL
        elif any(sub.outcome == RuleOutcome.UNKNOWN for sub in sub_evals):
            outcome = RuleOutcome.UNKNOWN
        else:
            outcome = RuleOutcome.PASS

        return EvaluatedCondition(
            rule_id=condition.rule_id,
            field=condition.field,
            operator=condition.operator,
            expected=[sub.rule_id for sub in condition.sub_conditions],
            actual=[sub.outcome.value for sub in sub_evals],
            outcome=outcome,
            source_clause=condition.source_clause,
            reason_en=condition.explanation_template_en.format(actual=field_value, expected=condition.expected),
            reason_hi=condition.explanation_template_hi.format(actual=field_value, expected=condition.expected),
        )

    if condition.operator == "any_of" and condition.sub_conditions:
        sub_evals = [evaluate_single_condition(sub, profile) for sub in condition.sub_conditions]
        if any(sub.outcome == RuleOutcome.PASS for sub in sub_evals):
            outcome = RuleOutcome.PASS
        elif any(sub.outcome == RuleOutcome.UNKNOWN for sub in sub_evals):
            outcome = RuleOutcome.UNKNOWN
        else:
            outcome = RuleOutcome.FAIL

        return EvaluatedCondition(
            rule_id=condition.rule_id,
            field=condition.field,
            operator=condition.operator,
            expected=[sub.rule_id for sub in condition.sub_conditions],
            actual=[sub.outcome.value for sub in sub_evals],
            outcome=outcome,
            source_clause=condition.source_clause,
            reason_en=condition.explanation_template_en.format(actual=field_value, expected=condition.expected),
            reason_hi=condition.explanation_template_hi.format(actual=field_value, expected=condition.expected),
        )

    # 2. Handle missing or unknown field values
    if field_value is None or field_value == "":
        return EvaluatedCondition(
            rule_id=condition.rule_id,
            field=condition.field,
            operator=condition.operator,
            expected=condition.expected,
            actual=None,
            outcome=condition.missing_behavior,
            source_clause=condition.source_clause,
            reason_en=f"Information for {condition.field} is not provided and requires confirmation.",
            reason_hi=f"{condition.field} के लिए जानकारी प्रदान नहीं की गई है और पुष्टि की आवश्यकता है।",
        )

    # Special handling for explicit uncertainty in community self-declaration
    if condition.field == "community_declaration" and field_value in ("unsure", "prefer_not_to_say"):
        return EvaluatedCondition(
            rule_id=condition.rule_id,
            field=condition.field,
            operator=condition.operator,
            expected=condition.expected,
            actual=field_value,
            outcome=RuleOutcome.UNKNOWN,
            source_clause=condition.source_clause,
            reason_en="Scheduled Caste self-declaration is pending verification at the authorized Channel Partner.",
            reason_hi="अनुसूचित जाति स्व-घोषणा अधिकृत चैनल पार्टनर द्वारा सत्यापन के लिए प्रतीक्षित है।",
        )

    # 3. Evaluate atomic operators
    outcome = RuleOutcome.FAIL
    try:
        if condition.operator == "eq":
            outcome = RuleOutcome.PASS if field_value == condition.expected else RuleOutcome.FAIL
        elif condition.operator == "in":
            outcome = RuleOutcome.PASS if field_value in condition.expected else RuleOutcome.FAIL
        elif condition.operator == "lte":
            outcome = RuleOutcome.PASS if float(field_value) <= float(condition.expected) else RuleOutcome.FAIL
        elif condition.operator == "gte":
            outcome = RuleOutcome.PASS if float(field_value) >= float(condition.expected) else RuleOutcome.FAIL
        elif condition.operator == "gt":
            outcome = RuleOutcome.PASS if float(field_value) > float(condition.expected) else RuleOutcome.FAIL
        elif condition.operator == "lt":
            outcome = RuleOutcome.PASS if float(field_value) < float(condition.expected) else RuleOutcome.FAIL
        elif condition.operator == "range":
            min_val, max_val = condition.expected
            outcome = RuleOutcome.PASS if float(min_val) <= float(field_value) <= float(max_val) else RuleOutcome.FAIL
        elif condition.operator == "exists":
            outcome = RuleOutcome.PASS if bool(field_value) else RuleOutcome.FAIL
    except (ValueError, TypeError):
        outcome = condition.missing_behavior

    # Format human-readable explanations safely
    try:
        reason_en = condition.explanation_template_en.format(
            actual=field_value,
            expected=condition.expected,
            outcome=outcome.value,
        )
        reason_hi = condition.explanation_template_hi.format(
            actual=field_value,
            expected=condition.expected,
            outcome=outcome.value,
        )
    except Exception:
        reason_en = f"Evaluated {condition.field} against criteria with result {outcome.value}."
        reason_hi = f"{condition.field} का मूल्यांकन {outcome.value} परिणाम के साथ किया गया।"

    return EvaluatedCondition(
        rule_id=condition.rule_id,
        field=condition.field,
        operator=condition.operator,
        expected=condition.expected,
        actual=field_value,
        outcome=outcome,
        source_clause=condition.source_clause,
        reason_en=reason_en,
        reason_hi=reason_hi,
    )
