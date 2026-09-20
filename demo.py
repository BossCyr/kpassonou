"""
Script de démo Kpassonou - Simule Totems + Caméras
Usage: python demo.py
"""
import requests
import time
import random

LARAVEL_URL = "http://localhost:8001/api"

def simulate_camera():
    """Simule une caméra privée"""
    try:
        response = requests.post(f"{LARAVEL_URL}/simulate", timeout=10)
        return response.json()
    except Exception as e:
        return {"success": False, "message": str(e)}

def simulate_totem():
    """Simule un Totem public"""
    try:
        response = requests.post(f"{LARAVEL_URL}/simulate/totem", timeout=10)
        return response.json()
    except Exception as e:
        return {"success": False, "message": str(e)}

def simulate_multiple(count=5):
    """Simule plusieurs caméras"""
    try:
        response = requests.post(
            f"{LARAVEL_URL}/simulate/multiple",
            json={"count": count},
            timeout=30
        )
        return response.json()
    except Exception as e:
        return {"success": False, "message": str(e)}

def get_alerts():
    """Récupère les alertes"""
    try:
        response = requests.get(f"{LARAVEL_URL}/alerts", timeout=10)
        return response.json()
    except Exception as e:
        return {"alerts": [], "summary": {}}

def demo_totem_sequence():
    """Démo séquentielle Totem → Dashboard"""
    print("\n" + "="*60)
    print("🎬 DÉMO KPASSONOU - TOTEM SIGNALÉTIQUE INTELLIGENT")
    print("="*60)
    
    # Étape 1: Simulation Totem
    print("\n📡 Étape 1: Simulation Totem (carrefour Zongo)...")
    time.sleep(1)
    result = simulate_totem()
    if result.get('success'):
        alert = result['alert']
        led = alert['totem_state']['led_color']
        status = alert['status']
        depth = alert['metrics']['water_depth_cm']
        print(f"   ✅ Totem {alert['camera_id']}")
        print(f"   🚦 LED: {led.upper()}")
        print(f"   💧 Profondeur: {depth} cm")
        print(f"   📊 Statut: {status}")
    else:
        print(f"   ❌ Erreur: {result.get('message')}")
    
    time.sleep(2)
    
    # Étape 2: Simulation Caméra
    print("\n📷 Étape 2: Simulation Caméra privée...")
    time.sleep(1)
    result = simulate_camera()
    if result.get('success'):
        alert = result['alert']
        print(f"   ✅ Caméra {alert['camera_id']}")
        print(f"   💧 Niveau eau: {alert['water_level']*100:.0f}%")
        print(f"   📊 Statut: {alert['status']}")
    else:
        print(f"   ❌ Erreur: {result.get('message')}")
    
    time.sleep(2)
    
    # Étape 3: Dashboard
    print("\n📊 Étape 3: Consultation Dashboard...")
    data = get_alerts()
    summary = data.get('summary', {})
    print(f"   📍 Total nœuds: {summary.get('total_nodes', 0)}")
    print(f"   🚏 Totems: {summary.get('total_totems', 0)}")
    print(f"   📷 Caméras: {summary.get('total_cameras', 0)}")
    print(f"   🚨 Alertes actives: {summary.get('active_alerts', 0)}")
    
    print("\n" + "="*60)
    print("✅ Démo terminée - Ouvrez http://localhost:3000")
    print("="*60)

def demo_stress():
    """Démo de charge - 10 alertes rapides"""
    print("\n⚡ Démo de charge: 10 alertes en 5 secondes...")
    result = simulate_multiple(10)
    if result.get('success'):
        print(f"   ✅ {result['count']}/10 alertes créées")
    else:
        print(f"   ❌ Erreur: {result.get('message')}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "stress":
        demo_stress()
    else:
        demo_totem_sequence()
