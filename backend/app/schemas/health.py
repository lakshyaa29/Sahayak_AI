from pydantic import BaseModel, Field
from typing import Dict, Any


class HealthResponse(BaseModel):
    status: str = Field(default="ok", example="ok")
    app: str = Field(default="SAHAYAK AI API")
    version: str = Field(default="0.1.0")
    timestamp: str


class DatabaseReadiness(BaseModel):
    connected: bool
    postgisAvailable: bool
    message: str


class ReadyResponse(BaseModel):
    status: str = Field(description="'ready' when database and PostGIS are active, else 'not_ready'")
    database: DatabaseReadiness
    timestamp: str
