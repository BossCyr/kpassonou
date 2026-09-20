import random
from datetime import datetime
from models.schemas import DetectionResult, Location, TotemMetrics, TotemState


def analyze_image(camera_id: str, image_url: str, location: Location, source_type: str = 'camera') -> DetectionResult:
    """
    Mock detector for demo purposes.
    In production, this would use a real ML model.
    """
    if source_type == 'totem':
        return analyze_totem(camera_id, location)
    
    # Simulate water level detection (camera/ML)
    water_level = round(random.uniform(0.0, 1.0), 2)
    
    # Determine status based on water level
    if water_level < 0.3:
        status = "safe"
    elif water_level < 0.6:
        status = "warning"
    else:
        status = "alert"
    
    # Simulate confidence (ML is less precise)
    confidence = round(random.uniform(0.70, 0.95), 2)
    
    return DetectionResult(
        camera_id=camera_id,
        source_type='camera',
        timestamp=datetime.utcnow(),
        location=location,
        water_level=water_level,
        status=status,
        confidence=confidence,
        image_url=image_url,
        data_precision='qualitative'
    )


def analyze_totem(camera_id: str, location: Location) -> DetectionResult:
    """
    Simulate Totem sensor data (more precise).
    In production, this comes from physical sensors.
    """
    # More precise water level from sensor
    water_level = round(random.uniform(0.0, 1.0), 2)
    
    # Determine status
    if water_level < 0.3:
        status = "safe"
        led_color = "green"
    elif water_level < 0.6:
        status = "warning"
        led_color = "orange"
    else:
        status = "alert"
        led_color = "red"
    
    # High confidence from physical sensor
    confidence = round(random.uniform(0.95, 0.99), 2)
    
    # Real metrics from sensors
    metrics = TotemMetrics(
        water_depth_cm=round(water_level * 100, 1),
        flow_speed_ms=round(random.uniform(0.5, 3.0), 1),
        rainfall_mm_h=round(random.uniform(0, 25), 1),
        temperature_c=round(random.uniform(25, 32), 1)
    )
    
    # Totem hardware state
    totem_state = TotemState(
        led_color=led_color,
        battery_percent=random.randint(70, 100),
        signal_strength=random.randint(60, 100)
    )
    
    return DetectionResult(
        camera_id=camera_id,
        source_type='totem',
        timestamp=datetime.utcnow(),
        location=location,
        water_level=water_level,
        status=status,
        confidence=confidence,
        data_precision='quantitative',
        metrics=metrics,
        totem_state=totem_state
    )
