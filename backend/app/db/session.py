from typing import Generator, Dict, Any
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import settings
from backend.app.core.logging import logger

Base = declarative_base()

# SQLAlchemy 2 Engine configuration
# If postgresql is unreachable, engine is created lazily on connection attempt
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields an active database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_readiness() -> Dict[str, Any]:
    """
    Verifies database connectivity and PostGIS extension status.
    Returns diagnostic dict without raising unhandled exceptions.
    """
    result = {
        "connected": False,
        "postgisAvailable": False,
        "message": "Database not checked yet",
    }
    try:
        with engine.connect() as conn:
            # 1. Check basic ping
            conn.execute(text("SELECT 1"))
            result["connected"] = True

            # 2. Check PostGIS extension
            postgis_check = conn.execute(
                text("SELECT extname, extversion FROM pg_extension WHERE extname = 'postgis'")
            ).fetchone()

            if postgis_check:
                result["postgisAvailable"] = True
                result["message"] = f"PostgreSQL connected with PostGIS extension version {postgis_check[1]} active."
            else:
                result["message"] = "PostgreSQL connected, but PostGIS extension is not installed/enabled in this database."
    except Exception as exc:
        logger.warning(f"Database readiness check failed: {type(exc).__name__}")
        result["connected"] = False
        result["postgisAvailable"] = False
        result["message"] = f"Unable to establish connection to PostgreSQL at {settings.DATABASE_URL.split('@')[-1]}: {str(exc)}"

    return result
