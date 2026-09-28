import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Numeric,
    Integer,
    Boolean,
    Text,
    DateTime,
    Date,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


def get_utc_now():
    return datetime.now(timezone.utc)


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    scheme_type = Column(String(50), nullable=False)  # 'BUSINESS', 'EDUCATION', 'EQUIPMENT'
    target_demographic = Column(String(255), nullable=False)
    
    # Financial thresholds
    max_income_limit = Column(Numeric(12, 2), nullable=False, default=500000.00)
    min_project_cost = Column(Numeric(12, 2), nullable=False)
    max_project_cost = Column(Numeric(12, 2), nullable=False)
    max_loan_percentage = Column(Numeric(5, 2), nullable=False, default=90.00)
    min_promoter_contribution = Column(Numeric(5, 2), nullable=False, default=10.00)
    
    # Concession interest & tenure
    interest_rate_min = Column(Numeric(5, 2), nullable=False)
    interest_rate_max = Column(Numeric(5, 2), nullable=False)
    moratorium_months_min = Column(Integer, default=3)
    moratorium_months_max = Column(Integer, default=12)
    repayment_tenure_max_years = Column(Integer, nullable=False)
    
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    is_demonstration = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    rule_versions = relationship("SchemeRuleVersion", back_populates="scheme", cascade="all, delete-orphan")
    branch_supports = relationship("BranchSchemeSupport", back_populates="scheme", cascade="all, delete-orphan")


class SchemeRuleVersion(Base):
    __tablename__ = "scheme_rule_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_id = Column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(String(50), nullable=False)
    effective_date = Column(Date, nullable=False)
    source_reference = Column(String(255), nullable=False)  # Circular number / gazette notification
    change_summary = Column(Text, nullable=True)
    rule_parameters = Column(JSON, nullable=True)
    is_current = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    scheme = relationship("Scheme", back_populates="rule_versions")
