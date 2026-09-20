from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class Location(BaseModel):
    lat: float
    lng: float
    address: str


class TotemMetrics(BaseModel):
    water_depth_cm: Optional[float] = None
    flow_speed_ms: Optional[float] = None
    rainfall_mm_h: Optional[float] = None
    temperature_c: Optional[float] = None


class TotemState(BaseModel):
    led_color: Optional[Literal['green', 'orange', 'red']] = None
    battery_percent: Optional[int] = None
    signal_strength: Optional[int] = None


class DetectionResult(BaseModel):
    camera_id: str
    source_type: Literal['camera', 'totem'] = 'camera'
    timestamp: datetime
    location: Location
    water_level: float
    status: str
    confidence: float
    image_url: Optional[str] = None
    data_precision: Literal['qualitative', 'quantitative'] = 'qualitative'
    metrics: Optional[TotemMetrics] = None
    totem_state: Optional[TotemState] = None


class AnalysisRequest(BaseModel):
    camera_id: str
    image_url: Optional[str] = None
    location: Location
    source_type: Literal['camera', 'totem'] = 'camera'
