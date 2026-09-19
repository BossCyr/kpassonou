import requests
import random
from datetime import datetime

# FastAPI endpoint
FASTAPI_URL = "http://localhost:8000/analyze"

# Laravel endpoint
LARAVEL_URL = "http://localhost:8001/api/alerts"

# Sample cameras in Cotonou
cameras = [
    {
        "camera_id": "cam-001",
        "location": {
            "lat": 6.3654,
            "lng": 2.4183,
            "address": "Quartier Zongo, Cotonou"
        }
    },
    {
        "camera_id": "cam-002",
        "location": {
            "lat": 6.3754,
            "lng": 2.3983,
            "address": "Quartier Ganhi, Cotonou"
        }
    },
    {
        "camera_id": "cam-003",
        "location": {
            "lat": 6.3554,
            "lng": 2.4383,
            "address": "Quartier Haie Vive, Cotonou"
        }
    },
]


def analyze_and_send():
    """Analyze a random camera and send alert to Laravel"""
    camera = random.choice(cameras)
    
    # Call FastAPI
    payload = {
        "camera_id": camera["camera_id"],
        "image_url": f"https://storage.example.com/{camera['camera_id']}/latest.jpg",
        "location": camera["location"]
    }
    
    try:
        response = requests.post(FASTAPI_URL, json=payload)
        response.raise_for_status()
        detection = response.json()
        
        # Send to Laravel
        alert_payload = {
            "camera_id": detection["camera_id"],
            "lat": detection["location"]["lat"],
            "lng": detection["location"]["lng"],
            "water_level": detection["water_level"],
            "status": detection["status"],
            "timestamp": detection["timestamp"],
            "address": detection["location"]["address"],
            "confidence": detection["confidence"],
            "image_url": detection.get("image_url")
        }
        
        laravel_response = requests.post(LARAVEL_URL, json=alert_payload)
        laravel_response.raise_for_status()
        
        print(f"✅ Alert sent for {camera['camera_id']}: {detection['status']} (water: {detection['water_level']})")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Starting alert simulation...")
    for i in range(10):
        analyze_and_send()
