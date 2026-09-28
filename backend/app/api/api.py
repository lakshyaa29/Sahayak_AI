from fastapi import APIRouter
from backend.app.api.routers import (
    health,
    schemes,
    partners,
    assessments,
    calculations,
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(schemes.router)
api_router.include_router(partners.router)
api_router.include_router(assessments.router)
api_router.include_router(calculations.router)
