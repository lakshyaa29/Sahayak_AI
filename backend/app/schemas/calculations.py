from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field
from backend.app.core.calculator import (
    FinancialCalculationResult,
    RepaymentFrequency,
    RepaymentMethod,
    MoratoriumTreatment,
    CalculationStatus,
    DataMode,
    RuleVersionStatus,
)


class CalculationEstimateRequest(BaseModel):
    # Scheme identifier
    scheme_code: Optional[str] = Field(None, description="Scheme identifier code e.g. SC_MICRO_FINANCE")
    schemeCode: Optional[str] = Field(None)

    # Rule versioning
    version_id: Optional[str] = Field(None, description="Rule version identifier e.g. NSFDC-MF-2024.1")
    versionId: Optional[str] = Field(None)
    rule_version_id: Optional[str] = Field(None)
    ruleVersionId: Optional[str] = Field(None)
    
    # Financial outlay
    project_cost: Optional[Decimal] = Field(None, gt=Decimal("0.00"), description="Total estimated outlay")
    projectCost: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    total_cost: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    totalCost: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    
    # Requested borrowing
    requested_loan_amount: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    requestedLoanAmount: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    borrowing_amount: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    borrowingAmount: Optional[Decimal] = Field(None, gt=Decimal("0.00"))
    
    # Repayment tenure
    tenure_years: Optional[int] = Field(None, ge=1, le=30)
    tenureYears: Optional[int] = Field(None, ge=1, le=30)
    
    # Moratorium grace
    moratorium_months: Optional[int] = Field(None, ge=0, le=84)
    moratoriumMonths: Optional[int] = Field(None, ge=0, le=84)
    
    # Education specific course duration
    course_duration_months: Optional[int] = Field(None, ge=0, le=72)
    courseDurationMonths: Optional[int] = Field(None, ge=0, le=72)

    # Beneficiary gender for targeted concessions
    gender: Optional[str] = Field(None)
    
    # Repayment structure
    repayment_frequency: Optional[RepaymentFrequency] = Field(None)
    repaymentFrequency: Optional[RepaymentFrequency] = Field(None)

    repayment_method: Optional[RepaymentMethod] = Field(None)
    repaymentMethod: Optional[RepaymentMethod] = Field(None)
    
    # Moratorium interest treatment
    moratorium_treatment: Optional[MoratoriumTreatment] = Field(None)
    moratoriumTreatment: Optional[MoratoriumTreatment] = Field(None)
    moratorium_interest_treatment: Optional[MoratoriumTreatment] = Field(None)
    moratoriumInterestTreatment: Optional[MoratoriumTreatment] = Field(None)

    # Tenure includes moratorium
    tenure_includes_moratorium: Optional[bool] = Field(None)
    tenureIncludesMoratorium: Optional[bool] = Field(None)

    def get_scheme_code(self) -> str:
        code = self.scheme_code or self.schemeCode
        if not code:
            return "SC_MICRO_FINANCE"
        return code

    def get_version_id(self) -> Optional[str]:
        return self.version_id or self.versionId or self.rule_version_id or self.ruleVersionId

    def get_project_cost(self) -> Decimal:
        val = self.project_cost or self.projectCost or self.total_cost or self.totalCost
        if val is None:
            return Decimal("120000.00")
        return Decimal(str(val))

    def get_requested_loan(self) -> Optional[Decimal]:
        val = self.requested_loan_amount or self.requestedLoanAmount or self.borrowing_amount or self.borrowingAmount
        if val is not None and val > Decimal("0.00"):
            return Decimal(str(val))
        return None

    def get_tenure_years(self) -> Optional[int]:
        return self.tenure_years or self.tenureYears

    def get_moratorium_months(self) -> Optional[int]:
        return self.moratorium_months or self.moratoriumMonths

    def get_course_duration_months(self) -> Optional[int]:
        return self.course_duration_months or self.courseDurationMonths

    def get_gender(self) -> Optional[str]:
        return self.gender

    def get_repayment_frequency(self) -> RepaymentFrequency:
        return self.repayment_frequency or self.repaymentFrequency or RepaymentFrequency.MONTHLY

    def get_repayment_method(self) -> RepaymentMethod:
        return self.repayment_method or self.repaymentMethod or RepaymentMethod.EQUAL_INSTALMENT

    def get_moratorium_treatment(self) -> MoratoriumTreatment:
        return (
            self.moratorium_treatment
            or self.moratoriumTreatment
            or self.moratorium_interest_treatment
            or self.moratoriumInterestTreatment
            or MoratoriumTreatment.CAPITALIZE
        )

    def get_tenure_includes_moratorium(self) -> bool:
        if self.tenure_includes_moratorium is not None:
            return self.tenure_includes_moratorium
        if self.tenureIncludesMoratorium is not None:
            return self.tenureIncludesMoratorium
        return False


# Backward compatibility aliases
CalculationSimulateRequest = CalculationEstimateRequest
CalculationSimulateResponse = FinancialCalculationResult
CalculationEstimateResponse = FinancialCalculationResult
