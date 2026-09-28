from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class PartnerBranchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    branchCode: str
    organizationName: str
    partnerType: str
    supportedSchemes: List[str]
    district: str
    state: str
    latitude: float
    longitude: float
    distanceKm: float
    operationalStatus: str
    grossNpaRatio: float
    hasPendingOverdues: bool
    quotaUtilizedPercent: float
    contactPerson: Optional[str] = None
    contactPhone: Optional[str] = None
    isDemonstration: bool = True
    lastUpdated: str
    suitabilityReason: str


class PartnerListResponse(BaseModel):
    total: int
    isDemonstration: bool = True
    district: Optional[str] = None
    partners: List[PartnerBranchResponse]


# ==========================================
# Step 7 Partner Locator & Routing Contracts
# ==========================================

class LocationInterpretation(BaseModel):
    state: str
    district: str
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_approximate: bool = True
    location_type: str = "DISTRICT_CENTROID"  # "USER_COORDINATES" | "DISTRICT_CENTROID" | "PINCODE_CENTROID" | "MANUAL_ENTRY"
    resolved_name: str = ""


class PartnerSearchRequest(BaseModel):
    scheme_code: str = Field(..., description="Target scheme code, e.g. SC_MICRO_FINANCE")
    rule_version_id: Optional[str] = Field(default=None, description="Verified rule version ID, e.g. NSFDC-MF-2024.1")
    state: str = Field(..., description="Beneficiary state, e.g. Maharashtra")
    district: str = Field(..., description="Beneficiary district, e.g. Wardha")
    pincode: Optional[str] = Field(default=None, description="Beneficiary 6-digit postal code")
    latitude: Optional[float] = Field(default=None, description="Optional GPS latitude (WGS84)")
    longitude: Optional[float] = Field(default=None, description="Optional GPS longitude (WGS84)")
    location_type: str = Field(default="DISTRICT_CENTROID", description="USER_COORDINATES, DISTRICT_CENTROID, PINCODE_CENTROID, MANUAL_ENTRY")
    radius_km: float = Field(default=50.0, description="Spatial search radius in kilometres (e.g. 15, 30, 50, 100)")
    partner_type: Optional[str] = Field(default=None, description="Filter by SCA, PSB, RRB, NBFC_MFI or ALL")
    data_mode: str = Field(default="ALL", description="ALL, VERIFIED_ONLY, DEMONSTRATION")


class RankedPartnerItem(BaseModel):
    rank: int
    is_top_recommended: bool = False
    id: str
    organization_id: str
    organization_name: str
    branch_code: str
    name: str
    partner_type: str  # 'SCA', 'PSB', 'RRB', 'NBFC_MFI'
    public_address: str
    district: str
    state: str
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance_km: Optional[float] = None
    distance_method: str = "GEODESIC_WGS84"  # 'POSTGIS_GEOGRAPHY' | 'GEODESIC_WGS84' | 'UNAVAILABLE'
    is_approximate_distance: bool = True
    
    # Scheme & Policy Context
    supported_schemes: List[str]
    routing_status: str = "ELIGIBLE_FOR_ROUTING"  # 'ELIGIBLE_FOR_ROUTING'
    selection_reasons_en: List[str] = []
    selection_reasons_hi: List[str] = []
    
    # Provenance & Verification
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website_url: Optional[str] = None
    is_demonstration: bool = True
    is_fictional: bool = False
    sample_institution_label: Optional[str] = None
    
    # Citizen Actions
    can_call: bool = False
    can_direct: bool = False
    external_map_url: Optional[str] = None
    
    # Freshness & Metadata
    data_as_of: str
    observed_at: str
    retrieved_at: str
    source_reference: str
    freshness_status: str = "FRESH"


class UnverifiedPartnerItem(BaseModel):
    id: str
    name: str
    organization_name: str
    partner_type: str
    district: str
    state: str
    public_address: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_person: Optional[str] = None
    unverified_reason: str
    unverified_reason_hi: str
    notice_en: str = "Contact branch directly to confirm scheme availability and current fund quota."
    notice_hi: str = "योजना की उपलब्धता और वर्तमान कोटा की पुष्टि के लिए शाखा से सीधे संपर्क करें।"


class CitizenSafeExclusionSummary(BaseModel):
    reason_code: str
    count: int
    description_en: str
    description_hi: str


class PartnerSearchResponse(BaseModel):
    search_id: str
    evaluated_at: str
    scheme_code: str
    rule_version_id: str
    routing_policy_version: str = "route-v1.0"
    freshness_policy_version: str = "freshness-v1.0"
    data_mode: str
    location_interpretation: LocationInterpretation
    search_radius_km: float
    total_eligible: int
    eligible_partners: List[RankedPartnerItem]
    unverified_partners: List[UnverifiedPartnerItem]
    excluded_count: int
    exclusion_summaries: List[CitizenSafeExclusionSummary]
    disclaimer_en: str
    disclaimer_hi: str
