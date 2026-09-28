from fastapi import APIRouter, status
from backend.app.schemas.assessments import (
    AssessmentEvaluateRequest,
    AssessmentEvaluateResponse,
)
from backend.app.core.engine import evaluate_beneficiary_profile

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.post(
    "/evaluate",
    response_model=AssessmentEvaluateResponse,
    status_code=status.HTTP_200_OK,
    summary="Deterministic Scheme Matching & Evaluation Engine",
    description="Evaluates self-declared beneficiary facts against versioned, traceable statutory policy rules under rank-v1.0.",
)
def evaluate_assessment(payload: AssessmentEvaluateRequest) -> AssessmentEvaluateResponse:
    """
    Evaluates self-declared beneficiary profile facts against versioned scheme policies.
    Returns 3-state eligibility outcomes (POTENTIALLY_ELIGIBLE, INELIGIBLE, NEEDS_INFORMATION)
    with conditions traces, explainable ranking reasons, and missing info indicators.
    """
    normalized_profile = payload.to_normalized_profile()
    result = evaluate_beneficiary_profile(normalized_profile)
    return result
