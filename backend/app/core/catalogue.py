from datetime import date
from typing import Dict, List, Optional
from pydantic import BaseModel
from backend.app.core.rules import RuleCondition, RuleOutcome


class PolicySourceMeta(BaseModel):
    title: str
    document_ref: str
    clause: str
    official_url: str
    publication_date: Optional[str] = None
    effective_date: str
    source_checked_date: str
    verification_status: str  # "VERIFIED" | "DEMONSTRATION"
    notes: Optional[str] = None


class SchemePolicyRecord(BaseModel):
    scheme_id: str
    code: str
    name_en: str
    name_hi: str
    provider_en: str
    provider_hi: str
    purpose: str  # "business" | "education"
    description_en: str
    description_hi: str
    is_demonstration: bool
    version_id: str
    effective_from: str
    effective_to: Optional[str] = None
    min_outlay: float
    max_outlay: float
    max_loan_percentage: float
    min_promoter_contribution: float
    interest_rate_min: float
    interest_rate_max: float
    moratorium_months_min: int
    moratorium_months_max: int
    repayment_tenure_max_years: int
    source_meta: PolicySourceMeta
    conditions: List[RuleCondition]


# Official Verified NSFDC Policies & Traceable Demonstration Catalogue
VERSIONED_SCHEME_CATALOGUE: List[SchemePolicyRecord] = [
    # 1. NSFDC Micro Finance Scheme (Business, <= 1.40 Lakhs)
    SchemePolicyRecord(
        scheme_id="sch-nsfdc-mf-01",
        code="SC_MICRO_FINANCE",
        name_en="Micro Finance Scheme for SC Entrepreneurs",
        name_hi="अनुसूचित जाति उद्यमियों के लिए सूक्ष्म वित्त योजना",
        provider_en="National Scheduled Castes Finance & Development Corporation (NSFDC)",
        provider_hi="राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)",
        purpose="business",
        description_en="Direct concessional micro-credit assistance up to ₹1,40,000 for tiny self-employment ventures, service units, and small trade shops.",
        description_hi="छोटे स्वरोजगार, सेवा इकाइयों और खुदरा व्यापार के लिए ₹1,40,000 तक की प्रत्यक्ष रियायती सूक्ष्म ऋण सहायता।",
        is_demonstration=False,
        version_id="NSFDC-MF-2024.1",
        effective_from="2024-04-01",
        effective_to=None,
        min_outlay=10000.0,
        max_outlay=140000.0,
        max_loan_percentage=90.0,
        min_promoter_contribution=10.0,
        interest_rate_min=6.5,
        interest_rate_max=7.5,
        moratorium_months_min=3,
        moratorium_months_max=6,
        repayment_tenure_max_years=3,
        source_meta=PolicySourceMeta(
            title="NSFDC Lending Policy Circular for Micro Credit Finance",
            document_ref="Circular No. NSFDC/OPS/PL/MC-2024",
            clause="Section 4 (Financial Assistance for Small Units)",
            official_url="https://nsfdc.nic.in/en/micro-credit-finance",
            publication_date="2024-03-15",
            effective_date="2024-04-01",
            source_checked_date="2024-09-01",
            verification_status="VERIFIED",
            notes="Concessional micro-credit for project costs strictly up to ₹1.40 Lakh with 90% loan quantum and 10% borrower promoter contribution.",
        ),
        conditions=[
            RuleCondition(
                rule_id="MF_PURPOSE_CHECK",
                field="purpose",
                operator="eq",
                expected="business",
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 4.1",
                explanation_template_en="Matches the requirement purpose: Micro Finance is designed for business and self-employment ventures.",
                explanation_template_hi="आवश्यकता के उद्देश्य से मेल खाता है: सूक्ष्म वित्त योजना व्यवसाय और स्वरोजगार उद्यमों के लिए है।",
            ),
            RuleCondition(
                rule_id="MF_COMMUNITY_DECLARATION",
                field="community_declaration",
                operator="eq",
                expected="yes",
                missing_behavior=RuleOutcome.UNKNOWN,
                source_clause="NSFDC Mandate Directive Clause 2.1",
                explanation_template_en="Beneficiary self-declares Scheduled Caste eligibility, satisfying statutory affirmative mandate criteria.",
                explanation_template_hi="लाभार्थी ने अनुसूचित जाति पात्रता की स्व-घोषणा की है, जो वैधानिक मानदंड को पूरा करता है।",
            ),
            RuleCondition(
                rule_id="MF_INCOME_CEILING",
                field="annual_family_income",
                operator="lte",
                expected=500000.0,
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 4.3 (Income Eligibility)",
                explanation_template_en="Stated annual family income (₹{actual:,.0f}) is within the scheme ceiling limit of ₹{expected:,.0f}.",
                explanation_template_hi="पारिवारिक वार्षिक आय (₹{actual:,.0f}) योजना की अधिकतम सीमा ₹{expected:,.0f} के भीतर है।",
            ),
            RuleCondition(
                rule_id="MF_OUTLAY_LIMIT",
                field="total_cost",
                operator="range",
                expected=[10000.0, 140000.0],
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 4.2 (Project Cost Ceilings)",
                explanation_template_en="Estimated project outlay (₹{actual:,.0f}) fits within the Micro Finance threshold (₹10,000 to ₹1,40,000).",
                explanation_template_hi="अनुमानित परियोजना लागत (₹{actual:,.0f}) सूक्ष्म वित्त योजना की सीमा (₹10,000 से ₹1,40,000) के अनुकूल है।",
            ),
        ],
    ),

    # 2. NSFDC Term Loan Scheme (Business, > 1.40 Lakhs up to 50 Lakhs)
    SchemePolicyRecord(
        scheme_id="sch-nsfdc-tl-02",
        code="SC_TERM_LOAN",
        name_en="Term Loan Scheme for Viable Projects",
        name_hi="व्यावसायिक परियोजनाओं के लिए मियादी ऋण (Term Loan) योजना",
        provider_en="National Scheduled Castes Finance & Development Corporation (NSFDC)",
        provider_hi="राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)",
        purpose="business",
        description_en="Substantial concessional term loan assistance up to ₹50,00,000 for viable commercial enterprises, machinery purchase, and workshops.",
        description_hi="व्यावसायिक उद्यमों, मशीनरी खरीद और कार्यशालाओं के लिए ₹50,00,000 तक की रियायती मियादी ऋण सहायता।",
        is_demonstration=False,
        version_id="NSFDC-TL-2024.1",
        effective_from="2024-04-01",
        effective_to=None,
        min_outlay=140001.0,
        max_outlay=5000000.0,
        max_loan_percentage=90.0,
        min_promoter_contribution=10.0,
        interest_rate_min=7.0,
        interest_rate_max=8.0,
        moratorium_months_min=6,
        moratorium_months_max=12,
        repayment_tenure_max_years=5,
        source_meta=PolicySourceMeta(
            title="NSFDC Operational Guidelines for Medium Term Lending",
            document_ref="Circular No. NSFDC/OPS/PL/TL-2024",
            clause="Section 6 (Term Lending Operational Framework)",
            official_url="https://nsfdc.nic.in/en/term-loan",
            publication_date="2024-03-20",
            effective_date="2024-04-01",
            source_checked_date="2024-09-01",
            verification_status="VERIFIED",
            notes="Requires commercially viable enterprise plan. 90% financed with 10% promoter equity.",
        ),
        conditions=[
            RuleCondition(
                rule_id="TL_PURPOSE_CHECK",
                field="purpose",
                operator="eq",
                expected="business",
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 6.1",
                explanation_template_en="Matches the requirement purpose: Term Loan is designated for self-employment and commercial business outlays.",
                explanation_template_hi="आवश्यकता के उद्देश्य से मेल खाता है: मियादी ऋण व्यावसायिक उद्यमों के लिए निर्धारित है।",
            ),
            RuleCondition(
                rule_id="TL_COMMUNITY_DECLARATION",
                field="community_declaration",
                operator="eq",
                expected="yes",
                missing_behavior=RuleOutcome.UNKNOWN,
                source_clause="NSFDC Mandate Directive Clause 2.1",
                explanation_template_en="Beneficiary self-declares Scheduled Caste eligibility, satisfying statutory affirmative mandate criteria.",
                explanation_template_hi="लाभार्थी ने अनुसूचित जाति पात्रता की स्व-घोषणा की है, जो वैधानिक मानदंड को पूरा करता है।",
            ),
            RuleCondition(
                rule_id="TL_INCOME_CEILING",
                field="annual_family_income",
                operator="lte",
                expected=500000.0,
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 6.2 (Income Ceiling)",
                explanation_template_en="Stated annual family income (₹{actual:,.0f}) is within the scheme ceiling limit of ₹{expected:,.0f}.",
                explanation_template_hi="पारिवारिक वार्षिक आय (₹{actual:,.0f}) योजना की अधिकतम सीमा ₹{expected:,.0f} के भीतर है।",
            ),
            RuleCondition(
                rule_id="TL_OUTLAY_LIMIT",
                field="total_cost",
                operator="range",
                expected=[140001.0, 5000000.0],
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 6.3 (Project Cost Bounds)",
                explanation_template_en="Estimated project outlay (₹{actual:,.0f}) fits within the Term Loan range (₹1,40,001 to ₹50,00,000).",
                explanation_template_hi="अनुमानित परियोजना लागत (₹{actual:,.0f}) मियादी ऋण सीमा (₹1,40,001 से ₹50,00,000) के अनुकूल है।",
            ),
        ],
    ),

    # 3. NSFDC Educational Loan Scheme (Education, up to 20 Lakhs in India, 30 Lakhs Abroad)
    SchemePolicyRecord(
        scheme_id="sch-nsfdc-edu-03",
        code="SC_EDUCATION_LOAN",
        name_en="Concessional Educational Loan Scheme",
        name_hi="रियायती शिक्षा ऋण योजना (उच्च एवं तकनीकी शिक्षा)",
        provider_en="National Scheduled Castes Finance & Development Corporation (NSFDC)",
        provider_hi="राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)",
        purpose="education",
        description_en="Concessional educational financing supporting tuition, hostel, and academic fees for approved professional degrees and technical diplomas.",
        description_hi="मान्यता प्राप्त व्यावसायिक डिग्री और तकनीकी डिप्लोमा के लिए शिक्षण शुल्क और छात्रावास व्यय हेतु रियायती शिक्षा ऋण।",
        is_demonstration=False,
        version_id="NSFDC-EDU-2024.1",
        effective_from="2024-04-01",
        effective_to=None,
        min_outlay=25000.0,
        max_outlay=3000000.0,
        max_loan_percentage=90.0,
        min_promoter_contribution=10.0,
        interest_rate_min=6.5,
        interest_rate_max=7.5,
        moratorium_months_min=6,
        moratorium_months_max=12,
        repayment_tenure_max_years=7,
        source_meta=PolicySourceMeta(
            title="NSFDC Education Loan Scheme Operational Guidelines",
            document_ref="Circular No. NSFDC/OPS/PL/EDU-2024",
            clause="Section 8 (Educational Credit Assistance)",
            official_url="https://nsfdc.nic.in/en/education-loan",
            publication_date="2024-03-25",
            effective_date="2024-04-01",
            source_checked_date="2024-09-01",
            verification_status="VERIFIED",
            notes="Financing up to ₹20 Lakhs in India and up to ₹30 Lakhs for studies abroad. Formal institutional accreditation must be verified by the lending branch.",
        ),
        conditions=[
            RuleCondition(
                rule_id="EDU_PURPOSE_CHECK",
                field="purpose",
                operator="eq",
                expected="education",
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 8.1",
                explanation_template_en="Matches the requirement purpose: Educational Loan Scheme is designed for professional and technical studies.",
                explanation_template_hi="आवश्यकता के उद्देश्य से मेल खाता है: शिक्षा ऋण योजना व्यावसायिक और तकनीकी अध्ययन के लिए है।",
            ),
            RuleCondition(
                rule_id="EDU_COMMUNITY_DECLARATION",
                field="community_declaration",
                operator="eq",
                expected="yes",
                missing_behavior=RuleOutcome.UNKNOWN,
                source_clause="NSFDC Mandate Directive Clause 2.1",
                explanation_template_en="Beneficiary self-declares Scheduled Caste eligibility, satisfying statutory affirmative mandate criteria.",
                explanation_template_hi="विद्यार्थी ने अनुसूचित जाति पात्रता की स्व-घोषणा की है, जो वैधानिक मानदंड को पूरा करता है।",
            ),
            RuleCondition(
                rule_id="EDU_INCOME_CEILING",
                field="annual_family_income",
                operator="lte",
                expected=500000.0,
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 8.2 (Family Income Ceiling)",
                explanation_template_en="Stated annual family income (₹{actual:,.0f}) is within the scheme ceiling limit of ₹{expected:,.0f}.",
                explanation_template_hi="पारिवारिक वार्षिक आय (₹{actual:,.0f}) योजना की अधिकतम सीमा ₹{expected:,.0f} के भीतर है।",
            ),
            RuleCondition(
                rule_id="EDU_OUTLAY_LIMIT",
                field="total_cost",
                operator="range",
                expected=[25000.0, 3000000.0],
                missing_behavior=RuleOutcome.FAIL,
                source_clause="NSFDC Policy Clause 8.3 (Course Cost Limits)",
                explanation_template_en="Estimated education cost (₹{actual:,.0f}) fits within the education financing ceiling (up to ₹30,00,000).",
                explanation_template_hi="अनुमानित शिक्षा लागत (₹{actual:,.0f}) शिक्षा ऋण की अधिकतम सीमा (₹30,00,000 तक) के अनुकूल है।",
            ),
            RuleCondition(
                rule_id="EDU_INSTITUTION_ACCREDITATION",
                field="institution_accredited",
                operator="eq",
                expected=True,
                missing_behavior=RuleOutcome.UNKNOWN,
                source_clause="NSFDC Policy Clause 8.4 (Approved Institution Recognition)",
                explanation_template_en="Course and institution accreditation must be verified against UGC/AICTE/National Board guidelines at the Channel Partner branch.",
                explanation_template_hi="पाठ्यक्रम और संस्थान की मान्यता की पुष्टि चैनल पार्टनर शाखा में यूजीसी/एआईसीटीई दिशानिर्देशों के अनुसार की जानी चाहिए।",
            ),
        ],
    ),

    # 4. Demonstration / State Special Grant Scheme (Clearly flagged as demonstration fixture)
    SchemePolicyRecord(
        scheme_id="sch-demo-mahila-04",
        code="SC_MAHILA_SAMRIDDHI",
        name_en="Mahila Samriddhi Special Women Scheme (Demonstration)",
        name_hi="महिला समृद्धि विशेष योजना (प्रदर्शनात्मक)",
        provider_en="State Channelising Agency (Demonstration Model)",
        provider_hi="राज्य चैनलाइजिंग एजेंसी (प्रदर्शनात्मक मॉडल)",
        purpose="business",
        description_en="Special concessional self-help assistance for women entrepreneurs establishing tailoring, handicraft, and micro-enterprises.",
        description_hi="सिलाई, हस्तशिल्प और सूक्ष्म उद्यम स्थापित करने वाली महिला उद्यमियों के लिए विशेष रियायती सहायता।",
        is_demonstration=True,
        version_id="DEMO-MS-2024.1",
        effective_from="2024-01-01",
        effective_to=None,
        min_outlay=10000.0,
        max_outlay=140000.0,
        max_loan_percentage=95.0,
        min_promoter_contribution=5.0,
        interest_rate_min=4.0,
        interest_rate_max=5.0,
        moratorium_months_min=6,
        moratorium_months_max=12,
        repayment_tenure_max_years=4,
        source_meta=PolicySourceMeta(
            title="State Specialized Affirmative Lending Guidelines (Demonstration Mode)",
            document_ref="DEMO-REF-SCA-01",
            clause="Demo Rule Appendix B",
            official_url="https://nsfdc.nic.in",
            publication_date="2024-01-01",
            effective_date="2024-01-01",
            source_checked_date="2024-09-01",
            verification_status="DEMONSTRATION",
            notes="Demonstration fixture illustrating multi-tier ranking and preferential interest concessions for specialized target sub-demographics.",
        ),
        conditions=[
            RuleCondition(
                rule_id="DEMO_PURPOSE_CHECK",
                field="purpose",
                operator="eq",
                expected="business",
                missing_behavior=RuleOutcome.FAIL,
                source_clause="Demo Scheme Rule 1.1",
                explanation_template_en="Matches business and micro-enterprise purpose.",
                explanation_template_hi="व्यवसाय और सूक्ष्म उद्यम उद्देश्य से मेल खाता है।",
            ),
            RuleCondition(
                rule_id="DEMO_COMMUNITY_DECLARATION",
                field="community_declaration",
                operator="eq",
                expected="yes",
                missing_behavior=RuleOutcome.UNKNOWN,
                source_clause="Demo Scheme Rule 1.2",
                explanation_template_en="Requires Scheduled Caste self-declaration.",
                explanation_template_hi="अनुसूचित जाति स्व-घोषणा आवश्यक है।",
            ),
            RuleCondition(
                rule_id="DEMO_OUTLAY_LIMIT",
                field="total_cost",
                operator="range",
                expected=[10000.0, 140000.0],
                missing_behavior=RuleOutcome.FAIL,
                source_clause="Demo Scheme Rule 1.3",
                explanation_template_en="Fits within the micro outlay threshold (₹10,000 to ₹1,40,000).",
                explanation_template_hi="सूक्ष्म लागत सीमा (₹10,000 से ₹1,40,000) के भीतर है।",
            ),
        ],
    ),
]
