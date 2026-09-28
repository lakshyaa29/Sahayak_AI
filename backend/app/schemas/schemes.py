from pydantic import BaseModel, Field
from typing import List, Optional


class SchemeBase(BaseModel):
    code: str
    name: str
    schemeType: str
    targetDemographic: str
    maxIncomeLimit: float
    minProjectCost: float
    maxProjectCost: float
    maxLoanPercentage: float
    minPromoterContribution: float
    interestRateMin: float
    interestRateMax: float
    moratoriumMonthsMin: int
    moratoriumMonthsMax: int
    repaymentTenureMaxYears: int
    description: Optional[str] = None
    isDemonstration: bool = True
    ruleSource: str
    lastVerifiedDate: str


class SchemeResponse(SchemeBase):
    id: str

    class Config:
        from_attributes = True


class SchemeListResponse(BaseModel):
    total: int
    isDemonstration: bool = True
    schemes: List[SchemeResponse]
