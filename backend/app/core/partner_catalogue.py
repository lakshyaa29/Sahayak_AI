"""
Authoritative and Demonstration Channel Partner Catalogue
Codifies institutional partner directories, service jurisdictions, scheme authorizations,
and time-sensitive operational snapshots with strict provenance metadata.
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class PartnerOrgRecord(BaseModel):
    id: str
    name: str
    partner_type: str  # 'SCA', 'PSB', 'RRB', 'NBFC_MFI'
    headquarters: str
    authorization_ref: str
    verified_website: Optional[str] = None
    is_active: bool = True
    is_demonstration: bool = False
    is_fictional: bool = False


class PartnerBranchRecord(BaseModel):
    id: str
    organization_id: str
    branch_code: str
    name: str
    public_address: str
    district: str
    state: str
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_accuracy: str = "EXACT_BRANCH"  # "EXACT_BRANCH" | "APPROXIMATE_PINCODE" | "DISTRICT_OFFICE" | "UNAVAILABLE"
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    supported_schemes: List[str]
    jurisdiction_type: str = "DISTRICT"  # "STATEWIDE" | "DISTRICT" | "MULTI_DISTRICT"
    served_districts: List[str] = []  # Empty means full state if jurisdiction_type == "STATEWIDE"
    is_active: bool = True
    is_demonstration: bool = False
    is_fictional: bool = False


class OperationalSnapshotRecord(BaseModel):
    id: str
    branch_id: str
    observed_at: datetime
    retrieved_at: datetime
    valid_until: Optional[datetime] = None
    gross_npa_ratio: Optional[float] = None
    net_npa_ratio: Optional[float] = None
    has_pending_overdues: bool = False
    annual_quota_total: Optional[float] = None
    quota_utilized: Optional[float] = None
    operational_status: str = "ACTIVE_ELIGIBLE"  # "ACTIVE_ELIGIBLE" | "HIGH_NPA_RESTRICTED" | "OVERDUES_RESTRICTED" | "QUOTA_EXHAUSTED"
    suitability_reason_en: str
    suitability_reason_hi: str
    source_reference: str
    is_demonstration: bool = False


# Known approximate district centroids for resolving coordinates when GPS is not provided
DISTRICT_CENTROIDS: Dict[str, Dict[str, float]] = {
    # Maharashtra
    "wardha": {"lat": 20.7453, "lng": 78.6022},
    "nagpur": {"lat": 21.1458, "lng": 79.0882},
    "pune": {"lat": 18.5204, "lng": 73.8567},
    "mumbai": {"lat": 19.0760, "lng": 72.8777},
    "mumbai suburban": {"lat": 19.1136, "lng": 72.8697},
    "amravati": {"lat": 20.9374, "lng": 77.7796},
    "nashik": {"lat": 19.9975, "lng": 73.7898},
    # Punjab
    "ludhiana": {"lat": 30.9010, "lng": 75.8573},
    "amritsar": {"lat": 31.6340, "lng": 74.8723},
    "jalandhar": {"lat": 31.3260, "lng": 75.5762},
    "patiala": {"lat": 30.3398, "lng": 76.3869},
    # Uttar Pradesh
    "varanasi": {"lat": 25.3176, "lng": 82.9739},
    "lucknow": {"lat": 26.8467, "lng": 80.9462},
    "kanpur nagar": {"lat": 26.4499, "lng": 80.3319},
    "prayagraj": {"lat": 25.4358, "lng": 81.8463},
}

# Current reference UTC time for data observation (fresh baseline)
BASE_NOW = datetime.now(timezone.utc)



# =================================================================
# 1. Partner Organizations Directory
# =================================================================
PARTNER_ORGANIZATIONS: List[PartnerOrgRecord] = [
    # SCAs (State Channelizing Agencies - Official Statutory Partners)
    PartnerOrgRecord(
        id="org-sca-mpbcdc",
        name="Mahatma Phule Backward Class Development Corporation (MPBCDC)",
        partner_type="SCA",
        headquarters="Mumbai, Maharashtra",
        authorization_ref="MoSJE/NSFDC/SCA-MH-01 (Govt of Maharashtra Undertaking)",
        verified_website="https://mpbcdc.maharashtra.gov.in",
        is_active=True,
        is_demonstration=False,
    ),
    PartnerOrgRecord(
        id="org-sca-pscdc",
        name="Punjab State Scheduled Castes Land Development & Finance Corporation (PSCDC)",
        partner_type="SCA",
        headquarters="Chandigarh, Punjab",
        authorization_ref="MoSJE/NSFDC/SCA-PB-01 (Govt of Punjab Statutory Corp)",
        verified_website="https://pscdc.punjab.gov.in",
        is_active=True,
        is_demonstration=False,
    ),
    PartnerOrgRecord(
        id="org-sca-upsdfc",
        name="Uttar Pradesh Scheduled Castes Finance & Development Corp. (UPSFDC)",
        partner_type="SCA",
        headquarters="Lucknow, Uttar Pradesh",
        authorization_ref="MoSJE/NSFDC/SCA-UP-01 (Govt of UP Statutory Corp)",
        verified_website="https://upsdfc.up.gov.in",
        is_active=True,
        is_demonstration=False,
    ),
    # PSBs (Public Sector Banks)
    PartnerOrgRecord(
        id="org-psb-boi",
        name="Bank of India",
        partner_type="PSB",
        headquarters="Bandra-Kurla Complex, Mumbai, Maharashtra",
        authorization_ref="RBI/2020-21/FIDD.CO.Plan.BC.5/04.09.01/2020-21 (Priority Sector Accredited)",
        verified_website="https://bankofindia.co.in",
        is_active=True,
        is_demonstration=False,
    ),
    PartnerOrgRecord(
        id="org-psb-pnb",
        name="Punjab National Bank",
        partner_type="PSB",
        headquarters="Dwarka, New Delhi",
        authorization_ref="RBI/2020-21/FIDD.CO.Plan.BC.5/04.09.01/2020-21 (Lead Bank Designated)",
        verified_website="https://pnbindia.in",
        is_active=True,
        is_demonstration=False,
    ),
    PartnerOrgRecord(
        id="org-psb-sbi",
        name="State Bank of India",
        partner_type="PSB",
        headquarters="State Bank Bhavan, Mumbai, Maharashtra",
        authorization_ref="RBI Priority Sector Master Directions (Lead Bank Ref PB/MH)",
        verified_website="https://sbi.co.in",
        is_active=True,
        is_demonstration=False,
    ),
    # RRBs (Regional Rural Banks)
    PartnerOrgRecord(
        id="org-rrb-vkgb",
        name="Vidharbha Konkan Gramin Bank",
        partner_type="RRB",
        headquarters="Nagpur, Maharashtra",
        authorization_ref="NABARD/RRB-MH-2023/11 (Sponsored by Bank of India)",
        verified_website="https://vkgb.co.in",
        is_active=True,
        is_demonstration=False,
    ),
    PartnerOrgRecord(
        id="org-rrb-pgb",
        name="Punjab Gramin Bank",
        partner_type="RRB",
        headquarters="Kapurthala, Punjab",
        authorization_ref="NABARD/RRB-PB-2023/04 (Sponsored by Punjab National Bank)",
        verified_website="https://pgb.org.in",
        is_active=True,
        is_demonstration=False,
    ),
    # Simulated / Fictional Institutions for Edge Testing
    PartnerOrgRecord(
        id="org-demo-mfi-01",
        name="Sample Central Microfinance Trust (Fictional Demo)",
        partner_type="NBFC_MFI",
        headquarters="Nagpur, Maharashtra",
        authorization_ref="DEMO-MFI-ACC-2024 (Prototype Sandbox Entry)",
        verified_website=None,
        is_active=True,
        is_demonstration=True,
        is_fictional=True,
    ),
    PartnerOrgRecord(
        id="org-demo-inactive-01",
        name="Defunct Regional Rural Lending Co-op (De-authorized)",
        partner_type="RRB",
        headquarters="Pune, Maharashtra",
        authorization_ref="REVOKED-LICENCE-2021",
        verified_website=None,
        is_active=False,  # Inactive authorization
        is_demonstration=True,
        is_fictional=True,
    ),
]


# =================================================================
# 2. Partner Branches Directory
# =================================================================
PARTNER_BRANCHES: List[PartnerBranchRecord] = [
    # -------------------------------------------------------------
    # MAHARASHTRA - Wardha District
    # -------------------------------------------------------------
    PartnerBranchRecord(
        id="br-mpbcdc-wrd-01",
        organization_id="org-sca-mpbcdc",
        branch_code="SCA-WRD-01",
        name="MPBCDC Wardha District Office",
        public_address="Administrative Complex, Collectorate Road, Civil Lines, Wardha - 442001",
        district="Wardha",
        state="Maharashtra",
        pincode="442001",
        latitude=20.7453,
        longitude=78.6022,
        location_accuracy="EXACT_BRANCH",
        contact_person="District Manager, MPBCDC",
        contact_phone="07152-241100",
        contact_email="dm.wardha@mpbcdc.maharashtra.gov.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="STATEWIDE",
        served_districts=["Wardha", "Nagpur", "Amravati", "Chandrapur", "Yavatmal"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    PartnerBranchRecord(
        id="br-boi-svg-401",
        organization_id="org-psb-boi",
        branch_code="BOI-SVG-401",
        name="Bank of India - Sevagram Lead Bank Branch",
        public_address="Sevagram Ashram Road, Near Railway Station, Sevagram, Wardha - 442102",
        district="Wardha",
        state="Maharashtra",
        pincode="442102",
        latitude=20.7291,
        longitude=78.5835,
        location_accuracy="EXACT_BRANCH",
        contact_person="Chief Manager (Priority Sector Desk)",
        contact_phone="07152-282200",
        contact_email="sevagram.wardha@bankofindia.co.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="DISTRICT",
        served_districts=["Wardha"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    PartnerBranchRecord(
        id="br-vkgb-arv-112",
        organization_id="org-rrb-vkgb",
        branch_code="VKGB-ARV-112",
        name="Vidharbha Konkan Gramin Bank - Arvi Road Branch",
        public_address="Plot No. 14, Arvi Road, Pipri, Wardha - 442001",
        district="Wardha",
        state="Maharashtra",
        pincode="442001",
        latitude=20.7511,
        longitude=78.6189,
        location_accuracy="EXACT_BRANCH",
        contact_person="Branch Head",
        contact_phone="07152-253300",
        contact_email="arvi.wardha@vkgb.co.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN"],
        jurisdiction_type="DISTRICT",
        served_districts=["Wardha"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    # Fictional MFI in Wardha (Restricted due to high NPA > 5% and overdues)
    PartnerBranchRecord(
        id="br-demo-mfi-wrd-99",
        organization_id="org-demo-mfi-01",
        branch_code="MFI-WRD-DEMO",
        name="Sample Central Microfinance - Wardha Service Point (Demo)",
        public_address="Illustrative Plot 88, Market Yard, Wardha - 442001 (Sample Address)",
        district="Wardha",
        state="Maharashtra",
        pincode="442001",
        latitude=20.7601,
        longitude=78.6301,
        location_accuracy="APPROXIMATE_PINCODE",
        contact_person="Manager Operations (Sample)",
        contact_phone=None,  # Disabled for fictional
        contact_email=None,
        supported_schemes=["SC_MICRO_FINANCE"],
        jurisdiction_type="DISTRICT",
        served_districts=["Wardha"],
        is_active=True,
        is_demonstration=True,
        is_fictional=True,
    ),

    # -------------------------------------------------------------
    # MAHARASHTRA - Nagpur District (Close to Wardha, ~75km away)
    # -------------------------------------------------------------
    PartnerBranchRecord(
        id="br-boi-ngp-lead",
        organization_id="org-psb-boi",
        branch_code="BOI-NGP-101",
        name="Bank of India - Nagpur Main Lead Bank Branch",
        public_address="Kingsway, Station Road, Nagpur - 440001",
        district="Nagpur",
        state="Maharashtra",
        pincode="440001",
        latitude=21.1498,
        longitude=79.0806,
        location_accuracy="EXACT_BRANCH",
        contact_person="Lead District Manager (LDM Office)",
        contact_phone="0712-2561100",
        contact_email="nagpur.ldm@bankofindia.co.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="DISTRICT",
        served_districts=["Nagpur"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),

    # -------------------------------------------------------------
    # PUNJAB - Ludhiana District
    # -------------------------------------------------------------
    PartnerBranchRecord(
        id="br-pscdc-ldh-01",
        organization_id="org-sca-pscdc",
        branch_code="PSCDC-LDH-01",
        name="PSCDC Ludhiana District Office",
        public_address="Room 102, District Administrative Complex (Mini Secretariat), Ferozepur Road, Ludhiana - 141001",
        district="Ludhiana",
        state="Punjab",
        pincode="141001",
        latitude=30.9010,
        longitude=75.8273,
        location_accuracy="EXACT_BRANCH",
        contact_person="District Manager, PSCDC",
        contact_phone="0161-2401200",
        contact_email="dm.ludhiana@pscdc.punjab.gov.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="STATEWIDE",
        served_districts=["Ludhiana", "Jalandhar", "Fatehgarh Sahib"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    PartnerBranchRecord(
        id="br-pnb-ldh-lead",
        organization_id="org-psb-pnb",
        branch_code="PNB-LDH-202",
        name="Punjab National Bank - Bharat Nagar Chowk Branch",
        public_address="Ferozepur Road, Near Bharat Nagar Chowk, Ludhiana - 141001",
        district="Ludhiana",
        state="Punjab",
        pincode="141001",
        latitude=30.8995,
        longitude=75.8450,
        location_accuracy="EXACT_BRANCH",
        contact_person="Chief Manager (Priority Sector Desk)",
        contact_phone="0161-2774400",
        contact_email="bo0291@pnb.co.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="DISTRICT",
        served_districts=["Ludhiana"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    PartnerBranchRecord(
        id="br-pgb-ldh-rural",
        organization_id="org-rrb-pgb",
        branch_code="PGB-LDH-311",
        name="Punjab Gramin Bank - Khanna Road Branch",
        public_address="GT Road, Samrala Chowk, Ludhiana - 141008",
        district="Ludhiana",
        state="Punjab",
        pincode="141008",
        latitude=30.9150,
        longitude=75.8750,
        location_accuracy="EXACT_BRANCH",
        contact_person="Senior Branch Manager",
        contact_phone="0161-2661800",
        contact_email="khanna.ldh@pgb.org.in",
        supported_schemes=["SC_MICRO_FINANCE"],
        jurisdiction_type="DISTRICT",
        served_districts=["Ludhiana"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),

    # -------------------------------------------------------------
    # UTTAR PRADESH - Varanasi District
    # -------------------------------------------------------------
    PartnerBranchRecord(
        id="br-upsdfc-vns-01",
        organization_id="org-sca-upsdfc",
        branch_code="UPSFDC-VNS-01",
        name="UPSFDC Varanasi District Office",
        public_address="Vikas Bhawan, Kutchery Campus, Varanasi - 221002",
        district="Varanasi",
        state="Uttar Pradesh",
        pincode="221002",
        latitude=25.3340,
        longitude=82.9810,
        location_accuracy="EXACT_BRANCH",
        contact_person="District Social Welfare Officer / Manager",
        contact_phone="0542-2508800",
        contact_email="dm.varanasi@upsdfc.up.gov.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="STATEWIDE",
        served_districts=["Varanasi", "Chandauli", "Jaunpur", "Mirzapur"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    PartnerBranchRecord(
        id="br-sbi-vns-cantt",
        organization_id="org-psb-sbi",
        branch_code="SBI-VNS-901",
        name="State Bank of India - Varanasi Main Cantt Branch",
        public_address="Kutchery Road, Varanasi Cantt, Varanasi - 221002",
        district="Varanasi",
        state="Uttar Pradesh",
        pincode="221002",
        latitude=25.3280,
        longitude=82.9750,
        location_accuracy="EXACT_BRANCH",
        contact_person="Assistant General Manager (Financial Inclusion Desk)",
        contact_phone="0542-2502200",
        contact_email="sbi.00201@sbi.co.in",
        supported_schemes=["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
        jurisdiction_type="DISTRICT",
        served_districts=["Varanasi"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),

    # -------------------------------------------------------------
    # Edge-Testing Branches
    # -------------------------------------------------------------
    # Branch with Missing Coordinates (Coordinates unavailable, verified contact available)
    PartnerBranchRecord(
        id="br-sca-wrd-remote",
        organization_id="org-sca-mpbcdc",
        branch_code="SCA-WRD-HNG",
        name="MPBCDC Hinganghat Sub-Divisional Office",
        public_address="Old Tahsil Building, Hinganghat, Wardha - 442301",
        district="Wardha",
        state="Maharashtra",
        pincode="442301",
        latitude=None,
        longitude=None,
        location_accuracy="UNAVAILABLE",
        contact_person="Field Inspector (Hinganghat Block)",
        contact_phone="07153-244100",
        contact_email="hinganghat@mpbcdc.maharashtra.gov.in",
        supported_schemes=["SC_MICRO_FINANCE"],
        jurisdiction_type="DISTRICT",
        served_districts=["Wardha"],
        is_active=True,
        is_demonstration=False,
        is_fictional=False,
    ),
    # Branch with Inactive Authorization
    PartnerBranchRecord(
        id="br-inactive-pune-01",
        organization_id="org-demo-inactive-01",
        branch_code="DEFUNCT-PUN-01",
        name="Defunct Regional Rural Lending Branch",
        public_address="Shivajinagar, Pune - 411005",
        district="Pune",
        state="Maharashtra",
        pincode="411005",
        latitude=18.5308,
        longitude=73.8475,
        location_accuracy="EXACT_BRANCH",
        contact_person="Liquidator Office",
        contact_phone=None,
        contact_email=None,
        supported_schemes=["SC_MICRO_FINANCE"],
        jurisdiction_type="DISTRICT",
        served_districts=["Pune"],
        is_active=False,
        is_demonstration=True,
        is_fictional=True,
    ),
]


# =================================================================
# 3. Operational Snapshots Directory
# =================================================================
OPERATIONAL_SNAPSHOTS: List[OperationalSnapshotRecord] = [
    # MPBCDC Wardha - Active, Low NPA (3.2%), No Overdues, Fresh Snapshot
    OperationalSnapshotRecord(
        id="snap-mpbcdc-wrd-01",
        branch_id="br-mpbcdc-wrd-01",
        observed_at=BASE_NOW - timedelta(days=12),
        retrieved_at=BASE_NOW - timedelta(days=2),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=3.2,
        net_npa_ratio=1.1,
        has_pending_overdues=False,
        annual_quota_total=15000000.0,
        quota_utilized=10200000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Accredited State Channelizing Agency with state sovereign guarantee, active NSFDC quota, and low NPA profile.",
        suitability_reason_hi="राज्य सरकार की संप्रभु गारंटी, सक्रिय एनएसएफडीसी कोटा और निम्न एनपीए वाली मान्यता प्राप्त राज्य चैनलाइजिंग एजेंसी।",
        source_reference="NSFDC State Channelizing Monitoring Report FY24-Q1",
        is_demonstration=False,
    ),
    # BOI Sevagram - Active, PSB Gross NPA 4.1%, No Overdues
    OperationalSnapshotRecord(
        id="snap-boi-svg-401",
        branch_id="br-boi-svg-401",
        observed_at=BASE_NOW - timedelta(days=15),
        retrieved_at=BASE_NOW - timedelta(days=3),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=4.1,
        net_npa_ratio=1.8,
        has_pending_overdues=False,
        annual_quota_total=25000000.0,
        quota_utilized=18500000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Designated Lead Bank branch with dedicated Priority Sector Lending desk and active concessional lending allocation.",
        suitability_reason_hi="नामित लीड बैंक शाखा, जिसमें समर्पित प्राथमिकता क्षेत्र ऋण डेस्क और सक्रिय रियायती ऋण आवंटन उपलब्ध है।",
        source_reference="SLBC Maharashtra Priority Sector Banking Dashboard Q1-2024",
        is_demonstration=False,
    ),
    # VKGB Wardha - Active, RRB Gross NPA 4.8% (<= 5.0%), No Overdues
    OperationalSnapshotRecord(
        id="snap-vkgb-arv-112",
        branch_id="br-vkgb-arv-112",
        observed_at=BASE_NOW - timedelta(days=20),
        retrieved_at=BASE_NOW - timedelta(days=5),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=4.8,
        net_npa_ratio=2.2,
        has_pending_overdues=False,
        annual_quota_total=8000000.0,
        quota_utilized=6560000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Regional Rural Bank partner specializing in tiny cottage and micro-enterprise loans for rural beneficiaries.",
        suitability_reason_hi="ग्रामीण लाभार्थियों के लिए कुटीर और सूक्ष्म उद्यम ऋण में विशेषज्ञता रखने वाला क्षेत्रीय ग्रामीण बैंक।",
        source_reference="NABARD Financial Health Review of RRBs 2024",
        is_demonstration=False,
    ),
    # BOI Nagpur Lead Bank
    OperationalSnapshotRecord(
        id="snap-boi-ngp-lead",
        branch_id="br-boi-ngp-lead",
        observed_at=BASE_NOW - timedelta(days=10),
        retrieved_at=BASE_NOW - timedelta(days=1),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=3.9,
        net_npa_ratio=1.5,
        has_pending_overdues=False,
        annual_quota_total=35000000.0,
        quota_utilized=24000000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Lead District Office with full statutory priority lending window and high capital adequacy.",
        suitability_reason_hi="पूर्ण वैधानिक प्राथमिकता ऋण विंडो और उच्च पूंजी पर्याप्तता वाला प्रमुख जिला कार्यालय।",
        source_reference="RBI Priority Lending Public Return Q1-2024",
        is_demonstration=False,
    ),
    # PSCDC Ludhiana - Active SCA
    OperationalSnapshotRecord(
        id="snap-pscdc-ldh-01",
        branch_id="br-pscdc-ldh-01",
        observed_at=BASE_NOW - timedelta(days=18),
        retrieved_at=BASE_NOW - timedelta(days=4),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=3.4,
        net_npa_ratio=1.2,
        has_pending_overdues=False,
        annual_quota_total=20000000.0,
        quota_utilized=13800000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Official Punjab State Channelizing nodal office with active NSFDC concession quota and direct field appraisal team.",
        suitability_reason_hi="सक्रिय एनएसएफडीसी रियायती कोटे और प्रत्यक्ष क्षेत्रीय मूल्यांकन टीम के साथ आधिकारिक पंजाब राज्य चैनलाइजिंग नोडल कार्यालय।",
        source_reference="PSCDC Annual Performance Report 2024",
        is_demonstration=False,
    ),
    # PNB Ludhiana - Active PSB
    OperationalSnapshotRecord(
        id="snap-pnb-ldh-lead",
        branch_id="br-pnb-ldh-lead",
        observed_at=BASE_NOW - timedelta(days=14),
        retrieved_at=BASE_NOW - timedelta(days=2),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=4.3,
        net_npa_ratio=1.9,
        has_pending_overdues=False,
        annual_quota_total=30000000.0,
        quota_utilized=21000000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Major Lead Bank branch with dedicated credit officer for concessional government schemes.",
        suitability_reason_hi="रियायती सरकारी योजनाओं के लिए समर्पित ऋण अधिकारी वाली प्रमुख लीड बैंक शाखा।",
        source_reference="SLBC Punjab Banking Performance Monitor Q1-2024",
        is_demonstration=False,
    ),
    # PGB Ludhiana - Active RRB
    OperationalSnapshotRecord(
        id="snap-pgb-ldh-rural",
        branch_id="br-pgb-ldh-rural",
        observed_at=BASE_NOW - timedelta(days=22),
        retrieved_at=BASE_NOW - timedelta(days=6),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=4.7,
        net_npa_ratio=2.0,
        has_pending_overdues=False,
        annual_quota_total=10000000.0,
        quota_utilized=7500000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Regional Rural Bank partner supporting micro-enterprises across peri-urban Ludhiana blocks.",
        suitability_reason_hi="पेरी-अर्बन लुधियाना ब्लॉक्स में सूक्ष्म उद्यमों का समर्थन करने वाला क्षेत्रीय ग्रामीण बैंक भागीदार।",
        source_reference="NABARD Punjab RRB Performance Index 2024",
        is_demonstration=False,
    ),
    # UPSFDC Varanasi - Active SCA
    OperationalSnapshotRecord(
        id="snap-upsdfc-vns-01",
        branch_id="br-upsdfc-vns-01",
        observed_at=BASE_NOW - timedelta(days=16),
        retrieved_at=BASE_NOW - timedelta(days=3),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=3.8,
        net_npa_ratio=1.4,
        has_pending_overdues=False,
        annual_quota_total=18000000.0,
        quota_utilized=12500000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Official Uttar Pradesh State Channelizing Agency district unit with active concession window.",
        suitability_reason_hi="सक्रिय रियायती विंडो के साथ आधिकारिक उत्तर प्रदेश राज्य चैनलाइजिंग एजेंसी जिला इकाई।",
        source_reference="UPSFDC Lending Review FY24-25",
        is_demonstration=False,
    ),
    # SBI Varanasi - Active PSB
    OperationalSnapshotRecord(
        id="snap-sbi-vns-cantt",
        branch_id="br-sbi-vns-cantt",
        observed_at=BASE_NOW - timedelta(days=12),
        retrieved_at=BASE_NOW - timedelta(days=1),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=3.5,
        net_npa_ratio=1.2,
        has_pending_overdues=False,
        annual_quota_total=40000000.0,
        quota_utilized=26000000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Lead Public Sector Bank with comprehensive priority sector desk and subsidized education loan support.",
        suitability_reason_hi="व्यापक प्राथमिकता क्षेत्र डेस्क और रियायती शिक्षा ऋण सहायता वाला प्रमुख सार्वजनिक क्षेत्र बैंक।",
        source_reference="State Bank Priority Credit Circular 2024",
        is_demonstration=False,
    ),
    # Sample Restricted MFI in Wardha (Disqualified due to High NPA 8.4% and Overdues)
    OperationalSnapshotRecord(
        id="snap-demo-mfi-wrd-99",
        branch_id="br-demo-mfi-wrd-99",
        observed_at=BASE_NOW - timedelta(days=10),
        retrieved_at=BASE_NOW - timedelta(days=1),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=8.4,
        net_npa_ratio=4.5,
        has_pending_overdues=True,  # Overdues present
        annual_quota_total=5000000.0,
        quota_utilized=4800000.0,
        operational_status="HIGH_NPA_RESTRICTED",
        suitability_reason_en="Disqualified from routing due to elevated Gross NPA (8.40% > 5.00%) and pending overdue repayments.",
        suitability_reason_hi="उच्च सकल एनपीए (8.40% > 5.00%) और लंबित बकाया राशि के कारण रूटिंग के लिए अयोग्य।",
        source_reference="Simulated Prototype Edge-Case Dataset",
        is_demonstration=True,
    ),
    # Hinganghat Office with Missing Coordinates (Active but distance unavailable)
    OperationalSnapshotRecord(
        id="snap-sca-wrd-remote",
        branch_id="br-sca-wrd-remote",
        observed_at=BASE_NOW - timedelta(days=30),
        retrieved_at=BASE_NOW - timedelta(days=5),
        valid_until=BASE_NOW + timedelta(days=90),
        gross_npa_ratio=3.3,
        net_npa_ratio=1.2,
        has_pending_overdues=False,
        annual_quota_total=4000000.0,
        quota_utilized=2100000.0,
        operational_status="ACTIVE_ELIGIBLE",
        suitability_reason_en="Sub-divisional branch office with active scheme support; GPS coordinates pending official geo-tagging.",
        suitability_reason_hi="सक्रिय योजना समर्थन के साथ उप-विभागीय शाखा कार्यालय; जीपीएस निर्देशांक आधिकारिक जियो-टैगिंग के लिए लंबित हैं।",
        source_reference="MPBCDC Sub-Divisional Roster 2024",
        is_demonstration=False,
    ),
]


def get_all_organizations() -> List[PartnerOrgRecord]:
    return PARTNER_ORGANIZATIONS


def get_all_branches() -> List[PartnerBranchRecord]:
    return PARTNER_BRANCHES


def get_all_snapshots() -> List[OperationalSnapshotRecord]:
    return OPERATIONAL_SNAPSHOTS


def get_district_centroid(district: str) -> Optional[Dict[str, float]]:
    clean = district.strip().lower()
    return DISTRICT_CENTROIDS.get(clean)
