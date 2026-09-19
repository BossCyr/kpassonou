from services.detector import analyze_image
from models.schemas import Location


def test_analyze_image():
    location = Location(
        lat=6.3654,
        lng=2.4183,
        address="Quartier Zongo, Cotonou"
    )
    
    result = analyze_image(
        camera_id="cam-001",
        image_url="https://example.com/image.jpg",
        location=location
    )
    
    assert result.camera_id == "cam-001"
    assert 0.0 <= result.water_level <= 1.0
    assert result.status in ["safe", "warning", "alert"]
    assert 0.0 <= result.confidence <= 1.0


if __name__ == "__main__":
    test_analyze_image()
    print("Test passed!")
