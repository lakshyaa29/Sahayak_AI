import sys
import os
import uuid
from datetime import date, datetime, timezone

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.db.session import SessionLocal, engine
from backend.app.models.schemes import Scheme, SchemeRuleVersion
from backend.app.models.partners import (
    PartnerOrganization,
    PartnerBranch,
    BranchSchemeSupport,
    PartnerOperationalSnapshot,
)
from backend.app.core.logging import logger


def seed_database():
    """
    Idempotent database seeding script for SAHAYAK AI.
    Populates official concessional schemes and fictional demonstration partner records.
    """
    db: Session = SessionLocal()
    try:
        logger.info("Starting database seeding...")

        # 1. Seed Schemes
        schemes_data = [
            {
                "code": "SC_MICRO_FINANCE",
                "name": "Micro Finance Scheme for SC Entrepreneurs",
                "scheme_type": "BUSINESS",
                "target_demographic": "Scheduled Caste individuals / self-help groups",
                "max_income_limit": 500000.0,
                "min_project_cost": 10000.0,
                "max_project_cost": 140000.0,
                "max_loan_percentage": 90.0,
                "min_promoter_contribution": 10.0,
                "interest_rate_min": 6.5,
                "interest_rate_max": 7.5,
                "moratorium_months_min": 3,
                "moratorium_months_max": 6,
                "repayment_tenure_max_years": 3,
                "description": "Rapid micro-credit assistance to marginalized individuals for tiny retail, artisanal, or service units.",
            },
            {
                "code": "SC_TERM_LOAN",
                "name": "Term Loan Scheme for Viable Projects",
                "scheme_type": "BUSINESS",
                "target_demographic": "Scheduled Caste entrepreneurs for medium self-employment ventures",
                "max_income_limit": 500000.0,
                "min_project_cost": 140001.0,
                "max_project_cost": 5000000.0,
                "max_loan_percentage": 90.0,
                "min_promoter_contribution": 10.0,
                "interest_rate_min": 7.0,
                "interest_rate_max": 8.0,
                "moratorium_months_min": 6,
                "moratorium_months_max": 12,
                "repayment_tenure_max_years": 5,
                "description": "Financial assistance for commercial enterprises, machinery purchase, small-scale manufacturing, and transport services.",
            },
            {
                "code": "SC_EDUCATION_LOAN",
                "name": "Concessional Educational Loan Scheme",
                "scheme_type": "EDUCATION",
                "target_demographic": "Scheduled Caste students pursuing recognized higher/professional courses",
                "max_income_limit": 500000.0,
                "min_project_cost": 50000.0,
                "max_project_cost": 2000000.0,
                "max_loan_percentage": 90.0,
                "min_promoter_contribution": 10.0,
                "interest_rate_min": 6.5,
                "interest_rate_max": 7.5,
                "moratorium_months_min": 6,
                "moratorium_months_max": 12,
                "repayment_tenure_max_years": 7,
                "description": "Supports tuition fees, books, and living expenses for professional degrees, engineering, medicine, and management.",
            },
        ]

        scheme_objects = {}
        for s_data in schemes_data:
            existing = db.query(Scheme).filter(Scheme.code == s_data["code"]).first()
            if not existing:
                scheme = Scheme(
                    id=str(uuid.uuid4()),
                    is_demonstration=True,
                    **s_data,
                )
                db.add(scheme)
                db.flush()
                # Add initial rule version
                rule_version = SchemeRuleVersion(
                    scheme_id=scheme.id,
                    version_number="v2024.1",
                    effective_date=date(2024, 4, 1),
                    source_reference="NSFDC Official Master Lending Circular FY24-25",
                    change_summary="Initial codified guideline parameter baseline.",
                    rule_parameters=s_data,
                    is_current=True,
                )
                db.add(rule_version)
                scheme_objects[s_data["code"]] = scheme
                logger.info(f"Seeded Scheme: {s_data['code']}")
            else:
                scheme_objects[s_data["code"]] = existing
                logger.info(f"Scheme already exists: {s_data['code']}")

        # 2. Seed Partner Organizations & Branches
        orgs_data = [
            {
                "name": "Mahatma Phule Backward Class Development Corp. (MPBCDC)",
                "partner_type": "SCA",
                "headquarters": "Mumbai, Maharashtra",
                "branch": {
                    "branch_code": "SCA-WRD-01",
                    "name": "MPBCDC Wardha District Office",
                    "district": "Wardha",
                    "state": "Maharashtra",
                    "latitude": 20.7453,
                    "longitude": 78.6022,
                    "contact_person": "District Manager, MPBCDC",
                    "contact_phone": "07152-241100",
                    "gross_npa": 3.20,
                    "overdues": False,
                    "status": "ACTIVE_ELIGIBLE",
                    "reason": "Direct State Channelizing nodal agency with active fund quota and sub-4% NPA ratio.",
                    "schemes": ["SC_MICRO_FINANCE", "SC_TERM_LOAN"],
                },
            },
            {
                "name": "Bank of India",
                "partner_type": "PSB",
                "headquarters": "Mumbai, Maharashtra",
                "branch": {
                    "branch_code": "BOI-SVG-401",
                    "name": "Bank of India - Sevagram Lead Bank Branch",
                    "district": "Wardha",
                    "state": "Maharashtra",
                    "latitude": 20.7291,
                    "longitude": 78.5835,
                    "contact_person": "Chief Manager (Priority Sector)",
                    "contact_phone": "07152-282200",
                    "gross_npa": 4.10,
                    "overdues": False,
                    "status": "ACTIVE_ELIGIBLE",
                    "reason": "Designated Lead Bank branch for concessional credit disbursement in the sector.",
                    "schemes": ["SC_MICRO_FINANCE", "SC_TERM_LOAN", "SC_EDUCATION_LOAN"],
                },
            },
            {
                "name": "Vidharbha Konkan Gramin Bank",
                "partner_type": "RRB",
                "headquarters": "Nagpur, Maharashtra",
                "branch": {
                    "branch_code": "VKGB-ARV-112",
                    "name": "Vidharbha Konkan Gramin Bank - Arvi Road Branch",
                    "district": "Wardha",
                    "state": "Maharashtra",
                    "latitude": 20.7511,
                    "longitude": 78.6189,
                    "contact_person": "Branch Head",
                    "contact_phone": "07152-253300",
                    "gross_npa": 4.80,
                    "overdues": False,
                    "status": "ACTIVE_ELIGIBLE",
                    "reason": "Regional rural partner specializing in local village cottage enterprises.",
                    "schemes": ["SC_MICRO_FINANCE"],
                },
            },
            {
                "name": "Central Rural Credit MFI (Fictional)",
                "partner_type": "NBFC_MFI",
                "headquarters": "Nagpur, Maharashtra",
                "branch": {
                    "branch_code": "MFI-DEMO-99",
                    "name": "Central Rural Credit MFI - Wardha Branch",
                    "district": "Wardha",
                    "state": "Maharashtra",
                    "latitude": 20.7601,
                    "longitude": 78.6301,
                    "contact_person": "Manager Operations",
                    "contact_phone": "07152-294400",
                    "gross_npa": 8.40,
                    "overdues": True,
                    "status": "HIGH_NPA_RESTRICTED",
                    "reason": "Disqualified due to excessive Gross NPA (>5.0%) and pending overdue accounts.",
                    "schemes": ["SC_MICRO_FINANCE"],
                },
            },
        ]

        for org_item in orgs_data:
            org = db.query(PartnerOrganization).filter(PartnerOrganization.name == org_item["name"]).first()
            if not org:
                org = PartnerOrganization(
                    id=str(uuid.uuid4()),
                    name=org_item["name"],
                    partner_type=org_item["partner_type"],
                    headquarters=org_item["headquarters"],
                    is_demonstration=True,
                )
                db.add(org)
                db.flush()
                logger.info(f"Seeded Partner Org: {org.name}")

            br_info = org_item["branch"]
            branch = db.query(PartnerBranch).filter(PartnerBranch.branch_code == br_info["branch_code"]).first()
            if not branch:
                branch = PartnerBranch(
                    id=str(uuid.uuid4()),
                    organization_id=org.id,
                    branch_code=br_info["branch_code"],
                    name=br_info["name"],
                    district=br_info["district"],
                    state=br_info["state"],
                    latitude=br_info["latitude"],
                    longitude=br_info["longitude"],
                    contact_person=br_info["contact_person"],
                    contact_phone=br_info["contact_phone"],
                    is_demonstration=True,
                )
                db.add(branch)
                db.flush()

                # Add PostGIS geometry if PostGIS is available
                try:
                    db.execute(
                        text(
                            "UPDATE partner_branches SET coordinates = ST_SetSRID(ST_MakePoint(:lng, :lat), 4326) WHERE id = :id"
                        ),
                        {"lng": br_info["longitude"], "lat": br_info["latitude"], "id": branch.id},
                    )
                except Exception:
                    pass  # If running in non-postgis mock environment

                # Add Scheme supports
                for s_code in br_info["schemes"]:
                    if s_code in scheme_objects:
                        db.add(
                            BranchSchemeSupport(
                                branch_id=branch.id,
                                scheme_id=scheme_objects[s_code].id,
                                is_supported=True,
                            )
                        )

                # Add Operational Snapshot
                db.add(
                    PartnerOperationalSnapshot(
                        branch_id=branch.id,
                        gross_npa_ratio=br_info["gross_npa"],
                        has_pending_overdues=br_info["overdues"],
                        operational_status=br_info["status"],
                        suitability_reason=br_info["reason"],
                        is_demonstration=True,
                    )
                )
                logger.info(f"Seeded Branch: {br_info['name']}")

        db.commit()
        logger.info("Database seeding completed successfully.")
    except Exception as exc:
        db.rollback()
        logger.error(f"Error during seeding: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
