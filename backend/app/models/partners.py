import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Numeric,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from backend.app.db.session import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class PartnerOrganization(Base):
    __tablename__ = "partner_organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    partner_type = Column(String(50), nullable=False)  # 'SCA', 'PSB', 'RRB', 'NBFC_MFI'
    headquarters = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_demonstration = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    branches = relationship("PartnerBranch", back_populates="organization", cascade="all, delete-orphan")


class PartnerBranch(Base):
    __tablename__ = "partner_branches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("partner_organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    branch_code = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    pincode = Column(String(10), nullable=True)
    
    # Coordinate storage for easy access
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS spatial geometry column with spatial GIST index
    # SRID 4326 = standard WGS84 GPS coordinates
    coordinates = Column(Geometry(geometry_type="POINT", srid=4326, spatial_index=True), nullable=True)

    contact_person = Column(String(100), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    is_demonstration = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    organization = relationship("PartnerOrganization", back_populates="branches")
    scheme_supports = relationship("BranchSchemeSupport", back_populates="branch", cascade="all, delete-orphan")
    operational_snapshots = relationship("PartnerOperationalSnapshot", back_populates="branch", cascade="all, delete-orphan")


class BranchSchemeSupport(Base):
    __tablename__ = "branch_scheme_supports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id = Column(String(36), ForeignKey("partner_branches.id", ondelete="CASCADE"), nullable=False, index=True)
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    is_supported = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    branch = relationship("PartnerBranch", back_populates="scheme_supports")
    scheme = relationship("backend.app.models.schemes.Scheme", back_populates="branch_supports")


class PartnerOperationalSnapshot(Base):
    __tablename__ = "partner_operational_snapshots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    branch_id = Column(String(36), ForeignKey("partner_branches.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Time-sensitive operational risk metrics
    snapshot_date = Column(DateTime(timezone=True), default=get_utc_now, index=True)
    gross_npa_ratio = Column(Numeric(5, 2), nullable=False)  # Disqualifies branch if above threshold
    has_pending_overdues = Column(Boolean, default=False)
    annual_quota_total = Column(Numeric(14, 2), default=10000000.00)
    quota_utilized = Column(Numeric(14, 2), default=6500000.00)
    
    operational_status = Column(String(50), default="ACTIVE_ELIGIBLE")  # 'ACTIVE_ELIGIBLE', 'HIGH_NPA_RESTRICTED', 'QUOTA_EXHAUSTED'
    suitability_reason = Column(Text, nullable=True)
    is_demonstration = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    branch = relationship("PartnerBranch", back_populates="operational_snapshots")
