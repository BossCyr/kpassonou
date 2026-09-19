import random
from datetime import datetime
from models.schemas import DetectionResult, Location


def analyze_image(camera_id: str, image_url: str, location: Location) -> DetectionResult:
    """
    Mock detector for demo purposes.
    In production, this would use a real ML model.
    """
    # Simulate water level detection
    water_level = round(random.uniform(0.0, 1.0), 2)
    
    # Determine status based on water level
    if water_level < 0.3:
        status = "safe"
    elif water_level < 0.6:
        status = "warning"
    else:
        status = "alert"
    
    # Simulate confidence
    confidence = round(random.uniform(0.7, 0.95), 2)
    
    return DetectionResult(
        camera_id=camera_id,
        timestamp=datetime.utcnow(),
        location=location,
        water_level=water_level,
        status=status,
        confidence=confidence,
        image_url=image_url
    )
