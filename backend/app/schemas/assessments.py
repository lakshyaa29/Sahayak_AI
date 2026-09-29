from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, root_validator
from backend.app.core.engine import (
    EvaluationResult,
    SchemeEvaluationOutcome,
    SchemeEligibilityStatus,
)


class AssessmentEvaluateRequest(BaseModel):
    purpose: str = Field("business", description="Requirement purpose: 'business' or 'education'")
    
    # Financials (supporting both frontend camelCase and backend snake_case or legacy names)
    total_cost: Optional[float] = Field(None, ge=0)
    totalCost: Optional[float] = Field(None, ge=0)
    project_cost: Optional[float] = Field(None, ge=0)
    projectCost: Optional[float] = Field(None, ge=0)
    borrowing_amount: Optional[float] = Field(None, ge=0)
    borrowingAmount: Optional[float] = Field(None, ge=0)
    
    annual_family_income: Optional[float] = Field(None, ge=0)
    annualFamilyIncome: Optional[float] = Field(None, ge=0)
    
    # Community Affirmative Declaration
    community_declaration: Optional[str] = Field(None)
    communityDeclaration: Optional[str] = Field(None)
    isScheduledCasteDeclared: Optional[bool] = Field(None)
    
    # Business profile details
    business_description: Optional[str] = Field(None)
    businessDescription: Optional[str] = Field(None)
    activity_type: Optional[str] = Field(None)
    activityType: Optional[str] = Field(None)
    business_category: Optional[str] = Field(None)
    businessCategory: Optional[str] = Field(None)
    business_stage: Optional[str] = Field(None)
    businessStage: Optional[str] = Field(None)
    
    # Education profile details
    course_name: Optional[str] = Field(None)
    courseName: Optional[str] = Field(None)
    study_level: Optional[str] = Field(None)
    studyLevel: Optional[str] = Field(None)
    admission_status: Optional[str] = Field(None)
    admissionStatus: Optional[str] = Field(None)
    study_location: Optional[str] = Field(None)
    studyLocation: Optional[str] = Field(None)
    institution_name: Optional[str] = Field(None)
    institutionName: Optional[str] = Field(None)
    institution_accredited: Optional[bool] = Field(None)
    institutionAccredited: Optional[bool] = Field(None)
    course_duration_months: Optional[int] = Field(None)
    courseDurationMonths: Optional[int] = Field(None)
    
    # Location
    state: Optional[str] = Field("Maharashtra")
    district: Optional[str] = Field("Wardha")
    pincode: Optional[str] = Field(None)

    def to_normalized_profile(self) -> Dict[str, Any]:
        """
        Normalizes all aliases into canonical snake_case keys for the rule engine.
        """
        # Determine total cost
        cost = (
            self.total_cost
            if self.total_cost is not None
            else self.totalCost
            if self.totalCost is not None
            else self.project_cost
            if self.project_cost is not None
            else self.projectCost
            if self.projectCost is not None
            else 0.0
        )

        # Determine annual income
        income = (
            self.annual_family_income
            if self.annual_family_income is not None
            else self.annualFamilyIncome
            if self.annualFamilyIncome is not None
            else 0.0
        )

        # Determine community declaration
        comm = (
            self.community_declaration
            if self.community_declaration is not None
            else self.communityDeclaration
        )
        if comm is None and self.isScheduledCasteDeclared is not None:
            comm = "yes" if self.isScheduledCasteDeclared else "no"

        # Determine description / activity
        desc = (
            self.business_description
            or self.businessDescription
            or self.activity_type
            or self.activityType
            or ""
        )

        # Determine accreditation
        accredited = (
            self.institution_accredited
            if self.institution_accredited is not None
            else self.institutionAccredited
        )
        if accredited is None and self.purpose == "education":
            # For preliminary guidance, affirmative educational profile self-declaration assumes recognized institution
            accredited = True

        return {
            "purpose": self.purpose,
            "total_cost": float(cost),
            "borrowing_amount": float(self.borrowing_amount or self.borrowingAmount or cost),
            "annual_family_income": float(income),
            "community_declaration": comm,
            "business_description": desc,
            "business_category": self.business_category or self.businessCategory,
            "business_stage": self.business_stage or self.businessStage or "new",
            "course_name": self.course_name or self.courseName or "",
            "study_level": self.study_level or self.studyLevel or "undergraduate",
            "admission_status": self.admission_status or self.admissionStatus or "confirmed",
            "study_location": self.study_location or self.studyLocation or "india",
            "institution_name": self.institution_name or self.institutionName or "",
            "institution_accredited": accredited,
            "course_duration_months": self.course_duration_months or self.courseDurationMonths,
            "state": self.state or "",
            "district": self.district or "",
            "pincode": self.pincode or "",
        }


# Output response schema mirrors EvaluationResult
AssessmentEvaluateResponse = EvaluationResult
