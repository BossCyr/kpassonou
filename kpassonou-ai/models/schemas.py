from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Location(BaseModel):
    lat: float
    lng: float
    address: str


class DetectionResult(BaseModel):
    camera_id: str
    timestamp: datetime
    location: Location
    water_level: float
    status: str
    confidence: float
    image_url: Optional[str] = None


class AnalysisRequest(BaseModel):
    camera_id: str
    image_url: str
    location: Location
