from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.calculations import (
    CalculationEstimateRequest,
    CalculationEstimateResponse,
    CalculationSimulateRequest,
    CalculationSimulateResponse,
)
from backend.app.core.calculator import calculate_scheme_repayment

router = APIRouter(prefix="/calculations", tags=["Financial Calculator"])


@router.post(
    "/simulate",
    response_model=CalculationSimulateResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate Scheme Repayment (Step 6 Engine)",
    description="Calculates deterministic scheme-aware reducing-balance or equal-principal amortization, moratorium grace, and equity requirements.",
)
def simulate_calculation(payload: CalculationSimulateRequest) -> CalculationSimulateResponse:
    """
    Executes deterministic scheme-aware financial amortization with Python Decimal precision.
    """
    try:
        result = calculate_scheme_repayment(
            scheme_code=payload.get_scheme_code(),
            project_cost=payload.get_project_cost(),
            requested_loan_amount=payload.get_requested_loan(),
            tenure_years=payload.get_tenure_years(),
            moratorium_months=payload.get_moratorium_months(),
            course_duration_months=payload.get_course_duration_months(),
            repayment_frequency=payload.get_repayment_frequency(),
            repayment_method=payload.get_repayment_method(),
            moratorium_treatment=payload.get_moratorium_treatment(),
            tenure_includes_moratorium=payload.get_tenure_includes_moratorium(),
            gender=payload.get_gender(),
            rule_version_id=payload.get_version_id(),
        )
        return result
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"status": "invalid_parameters", "message": str(err)},
        )


@router.post(
    "/estimate",
    response_model=CalculationEstimateResponse,
    status_code=status.HTTP_200_OK,
    summary="Estimate Repayment Structure",
    description="Alias endpoint for scheme-aware financial calculation.",
)
def estimate_calculation(payload: CalculationEstimateRequest) -> CalculationEstimateResponse:
    return simulate_calculation(payload)
