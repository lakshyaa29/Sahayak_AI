from datetime import datetime, timezone
from fastapi import APIRouter
from backend.app.schemas.health import HealthResponse, ReadyResponse
from backend.app.db.session import check_db_readiness
from backend.app.core.config import settings

router = APIRouter(tags=["Health & Readiness"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """
    Liveness probe: verifies that the FastAPI application is up and running.
    """
    return HealthResponse(
        status="ok",
        app=settings.APP_NAME,
        version="0.1.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/ready", response_model=ReadyResponse)
def get_ready() -> ReadyResponse:
    """
    Readiness probe: verifies database connectivity and PostGIS spatial extension availability.
    """
    db_status = check_db_readiness()
    overall_status = "ready" if (db_status["connected"] and db_status["postgisAvailable"]) else "not_ready"

    return ReadyResponse(
        status=overall_status,
        database=db_status,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
