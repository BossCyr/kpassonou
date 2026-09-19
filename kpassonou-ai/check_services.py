import requests
import sys

def check_services():
    """Check if FastAPI and Laravel are running"""
    services = {
        "FastAPI": "http://localhost:8000/health",
        "Laravel": "http://localhost:8001/api/stats"
    }
    
    all_ok = True
    for name, url in services.items():
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            print(f"✅ {name} is running")
        except requests.exceptions.RequestException as e:
            print(f"❌ {name} is not running: {e}")
            all_ok = False
    
    return all_ok


if __name__ == "__main__":
    print("🔍 Checking services...")
    if check_services():
        print("\n✅ All services are running!")
        sys.exit(0)
    else:
        print("\n❌ Some services are not running")
        sys.exit(1)
