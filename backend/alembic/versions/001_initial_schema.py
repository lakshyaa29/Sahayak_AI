"""Initial schema with schemes, partners, operational snapshots, and PostGIS

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-17 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry

revision = "001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Enable PostGIS extension
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # 2. Create schemes table
    op.create_table(
        "schemes",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("code", sa.String(length=50), nullable=False, unique=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("scheme_type", sa.String(length=50), nullable=False),
        sa.Column("target_demographic", sa.String(length=255), nullable=False),
        sa.Column("max_income_limit", sa.Numeric(12, 2), nullable=False, server_default="500000.00"),
        sa.Column("min_project_cost", sa.Numeric(12, 2), nullable=False),
        sa.Column("max_project_cost", sa.Numeric(12, 2), nullable=False),
        sa.Column("max_loan_percentage", sa.Numeric(5, 2), nullable=False, server_default="90.00"),
        sa.Column("min_promoter_contribution", sa.Numeric(5, 2), nullable=False, server_default="10.00"),
        sa.Column("interest_rate_min", sa.Numeric(5, 2), nullable=False),
        sa.Column("interest_rate_max", sa.Numeric(5, 2), nullable=False),
        sa.Column("moratorium_months_min", sa.Integer(), server_default="3"),
        sa.Column("moratorium_months_max", sa.Integer(), server_default="12"),
        sa.Column("repayment_tenure_max_years", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_demonstration", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_schemes_code", "schemes", ["code"])

    # 3. Create scheme_rule_versions table
    op.create_table(
        "scheme_rule_versions",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("scheme_id", sa.String(length=36), sa.ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("version_number", sa.String(length=50), nullable=False),
        sa.Column("effective_date", sa.Date(), nullable=False),
        sa.Column("source_reference", sa.String(length=255), nullable=False),
        sa.Column("change_summary", sa.Text(), nullable=True),
        sa.Column("rule_parameters", sa.JSON(), nullable=True),
        sa.Column("is_current", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_scheme_rule_versions_scheme_id", "scheme_rule_versions", ["scheme_id"])

    # 4. Create partner_organizations table
    op.create_table(
        "partner_organizations",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("partner_type", sa.String(length=50), nullable=False),
        sa.Column("headquarters", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_demonstration", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )

    # 5. Create partner_branches table with PostGIS geometry
    op.create_table(
        "partner_branches",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("organization_id", sa.String(length=36), sa.ForeignKey("partner_organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("branch_code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("district", sa.String(length=100), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("pincode", sa.String(length=10), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("coordinates", Geometry(geometry_type="POINT", srid=4326), nullable=True),
        sa.Column("contact_person", sa.String(length=100), nullable=True),
        sa.Column("contact_phone", sa.String(length=50), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_demonstration", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_partner_branches_org_id", "partner_branches", ["organization_id"])
    op.create_index("ix_partner_branches_district", "partner_branches", ["district"])
    op.create_index("ix_partner_branches_state", "partner_branches", ["state"])

    # 6. Create branch_scheme_supports table
    op.create_table(
        "branch_scheme_supports",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("branch_id", sa.String(length=36), sa.ForeignKey("partner_branches.id", ondelete="CASCADE"), nullable=False),
        sa.Column("scheme_id", sa.String(length=36), sa.ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("is_supported", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_branch_scheme_supports_branch_id", "branch_scheme_supports", ["branch_id"])
    op.create_index("ix_branch_scheme_supports_scheme_id", "branch_scheme_supports", ["scheme_id"])

    # 7. Create partner_operational_snapshots table
    op.create_table(
        "partner_operational_snapshots",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("branch_id", sa.String(length=36), sa.ForeignKey("partner_branches.id", ondelete="CASCADE"), nullable=False),
        sa.Column("snapshot_date", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("gross_npa_ratio", sa.Numeric(5, 2), nullable=False),
        sa.Column("has_pending_overdues", sa.Boolean(), server_default="false"),
        sa.Column("annual_quota_total", sa.Numeric(14, 2), server_default="10000000.00"),
        sa.Column("quota_utilized", sa.Numeric(14, 2), server_default="6500000.00"),
        sa.Column("operational_status", sa.String(length=50), server_default="ACTIVE_ELIGIBLE"),
        sa.Column("suitability_reason", sa.Text(), nullable=True),
        sa.Column("is_demonstration", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_partner_snapshots_branch_id", "partner_operational_snapshots", ["branch_id"])


def downgrade() -> None:
    op.drop_table("partner_operational_snapshots")
    op.drop_table("branch_scheme_supports")
    op.drop_table("partner_branches")
    op.drop_table("partner_organizations")
    op.drop_table("scheme_rule_versions")
    op.drop_table("schemes")
