# Kpassonou — Cadrage MVP Hackathon (24h)

> **Hackathon Ibudo** — Thème Climat/Inondations au Bénin
> Objectif : MVP fonctionnel avec prototype physique, impressionnant pour le jury.

---

## 1. Périmètre Exact du MVP

### ✅ À CODER (fonctionnel)

- **Totem Signalétique Intelligent** : Maquette physique avec LED RGB + OLED
- Dashboard Next.js avec carte interactive
- API Laravel qui reçoit et stocke les alertes (Totems + Caméras)
- FastAPI qui analyse images et données capteurs
- Push temps réel des alertes (polling 5s)
- Seeders de données réalistes (Cotonou)

### 🎭 À SIMULER / MOCK

- Authentification → token mock
- Vrai modèle ML → mock avec données aléatoires
- Vrai capteur physique → LED RGB pilotée par script
- Base de données → SQLite

---

## 2. Contrat d'Interface — Payload JSON

### Source Types

| Type | `source_type` | `data_precision` | Source |
|------|---------------|------------------|--------|
| **Caméra Privée** | `camera` | `qualitative` | Edge AI sur image |
| **Totem Public** | `totem` | `quantitative` | Capteur physique |

### Caméra Privée → Laravel

```json
{
  "camera_id": "cam-001",
  "source_type": "camera",
  "timestamp": "2026-09-20T10:00:00Z",
  "location": { "lat": 6.3654, "lng": 2.4183, "address": "Quartier Zongo" },
  "water_level": 0.72,
  "status": "alert",
  "confidence": 0.89,
  "data_precision": "qualitative"
}
```

### Totem Public → Laravel

```json
{
  "camera_id": "totem-001",
  "source_type": "totem",
  "timestamp": "2026-09-20T10:00:00Z",
  "location": { "lat": 6.3690, "lng": 2.4100, "address": "Carrefour Zongo" },
  "water_level": 0.45,
  "status": "warning",
  "confidence": 0.98,
  "data_precision": "quantitative",
  "metrics": {
    "water_depth_cm": 45,
    "flow_speed_ms": 1.2,
    "rainfall_mm_h": 12.5,
    "temperature_c": 28.3
  },
  "totem_state": {
    "led_color": "orange",
    "battery_percent": 87,
    "signal_strength": 85
  }
}
```

### Statuts possibles

| `water_level` | `status` | `led_color` |
|---------------|----------|-------------|
| 0.0 - 0.3 | `safe` | `green` |
| 0.3 - 0.6 | `warning` | `orange` |
| 0.6 - 1.0 | `alert` | `red` |

---

## 3. Architecture Physique + Logique

```
┌─────────────────────────────────────────────────────────────────┐
│                    KPASSONOU - ARCHITECTURE COMPLÈTE             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   PHYSIQUE                    LOGIQUE                           │
│   ┌─────────┐                ┌─────────────┐                   │
│   │  TOTEM  │──JSON 200B────▶│   Laravel   │                   │
│   │ LED+OLED│                │   API REST  │                   │
│   └─────────┘                └──────┬──────┘                   │
│                                     │                           │
│   ┌─────────┐                ┌──────▼──────┐                   │
│   │CAMÉRAS  │──Edge AI──────▶│  PostgreSQL  │                   │
│   │ RPi/ESP │                │  / SQLite   │                   │
│   └─────────┘                └──────┬──────┘                   │
│                                     │                           │
│                              ┌──────▼──────┐                   │
│                              │   Next.js   │                   │
│                              │  Dashboard  │                   │
│                              │   Leaflet   │                   │
│                              └─────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Endpoints d'API

### Laravel (Port 8001)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/alerts` | Liste alertes (filtre `?source_type=totem`) |
| `POST` | `/api/alerts` | Crée alerte |
| `GET` | `/api/stats` | Stats (total_nodes, total_totems, total_cameras) |
| `POST` | `/api/simulate` | Simule caméra via FastAPI |
| `POST` | `/api/simulate/multiple` | Simule X caméras |
| `POST` | `/api/simulate/totem` | Simule Totem (direct, sans FastAPI) |

### FastAPI (Port 8000)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/health` | Healthcheck |
| `POST` | `/analyze` | Analyse camera ou totem |

---

## 5. Maquette Physique Totem

### Spécifications
- **Hauteur** : 60 cm
- **Largeur** : 15 cm
- **Coût** : ~$5-10
- **Matériaux** : Carton, LED RGB, OLED 0.96", Arduino/ESP32

### Composants

| Composant | Rôle | Prix |
|-----------|------|------|
| Carton double face | Structure | $0 (récup) |
| LED RGB | Signal visuel vert/orange/rouge | $2 |
| Écran OLED 0.96" | Affichage profondeur eau | $3 |
| ESP32/Arduino Mini | Pilotage LED + écran | $3 |
| Batterie USB | Alimentation | $0 (récup) |

Voir [TOTEM-PHYSIQUE.md](./TOTEM-PHYSIQUE.md) pour le plan complet.

---

## 6. Scénario Démo (5 min)

| Étape | Action | Résultat |
|-------|--------|----------|
| 1 | Montrer Totem physique | Jury touche la maquette |
| 2 | Lancer `python demo.py` | Simulation démarre |
| 3 | LED Totem change de couleur | Signal visuel fonctionne |
| 4 | Dashboard se met à jour | Carte + alertes temps réel |
| 5 | Expliquer Totem vs Caméra | Différence qualitative/quantitative |

---

## 7. Ordre de Codage Recommandé (24h)

| Période | Tâche |
|---------|-------|
| Heure 0-2 | Setup projets + migration Totem |
| Heure 2-4 | FastAPI : `/analyze` camera + totem |
| Heure 4-7 | Laravel : endpoints + seeders |
| Heure 7-12 | Next.js : Dashboard + carte |
| Heure 12-16 | Intégration Totem → Dashboard |
| Heure 16-20 | Maquette physique Totem |
| Heure 20-22 | Démo + polish UI |
| Heure 22-24 | Slide + répétition pitch |

---

## 8. Tech Stack

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Laravel 13 (PHP) |
| IA | FastAPI (Python) |
| BDD | SQLite (dev) / PostgreSQL (prod) |
| Carte | Leaflet |
| Totem | ESP32 + LED RGB + OLED |
| Edge | Raspberry Pi Zero / ESP32-CAM |

---

*Dernière mise à jour : 20 septembre 2026*

### Laravel (`kpassonou-api/`)

```
app/
├── Http/
│   ├── Controllers/
│   │   └── AlertController.php
│   └── Requests/
│       └── StoreAlertRequest.php
├── Models/
│   └── Alert.php
├── Services/
│   └── AlertService.php
└── database/
    └── seeders/
        └── AlertSeeder.php
```

### FastAPI (`kpassonou-ai/`)

```
├── main.py                    # App FastAPI
├── services/
│   └── detector.py            # Logique de détection (mock)
├── models/
│   └── schemas.py             # Pydantic models
└── tests/
    └── test_detector.py
```

---

## 4. Endpoints d'API Stricts

### FastAPI (Port 8000)

| Méthode | Route      | Description                          |
|---------|------------|--------------------------------------|
| `POST`  | `/analyze` | Reçoit image/mock → retourne payload détection |
| `GET`   | `/health`  | Healthcheck                          |

### Laravel (Port 8000)

| Méthode | Route        | Description                                    |
|---------|--------------|------------------------------------------------|
| `POST`  | `/api/alerts` | Enregistre une alerte (depuis FastAPI)        |
| `GET`   | `/api/alerts` | Liste les alertes (pour Next.js)             |
| `GET`   | `/api/stats`  | Résumé stats (nb caméras, alertes actives)   |

### Next.js (Port 3000)

Pas d'API exposing — uniquement client-side.

---

## 5. Ordre de Codage Recommandé (24h)

| Période    | Tâche                                                |
|------------|------------------------------------------------------|
| Heure 0-2  | Setup des 3 projets + seeders Laravel                |
| Heure 2-5  | FastAPI `/analyze` avec mock                         |
| Heure 5-10 | Laravel CRUD alerts + seeders                        |
| Heure 10-16| Next.js Dashboard + carte                            |
| Heure 16-20| Intégration complète + WebSocket/polling             |
| Heure 20-24| Polish UI, démo, slides                              |

---

## 6. Règles d'Or

1. **Règle du jury** : Si ça ne contribue pas à la démo visible par le jury dans les 24h, ça n'existe pas.
2. **Pas de perfection** : Un mock qui fonctionne vaut mieux qu'un vrai algorithme à moitié fini.
3. **Data realism** : Les seeders doivent refléter la réalité de Cotonou (quartiers, rues, lat/lng réels).
4. **UI first** : Le jury regarde l'écran. Une belle interface avec des données mockées impressionne plus qu'un backend parfait sans frontend.
5. **Temps réel** : Le polling toutes les 5 secondes suffit pour la démo. Pas besoin de WebSocket complexe.

---

## 7. Tech Stack

| Composant     | Technologie                |
|---------------|----------------------------|
| Frontend      | Next.js + Tailwind CSS     |
| Backend API   | Laravel (PHP)              |
| IA / Analyse  | FastAPI (Python)           |
| Base de données| SQLite (Laravel)          |
| Carte         | Leaflet ou Mapbox          |
| Détection     | Mock / règle simple        |

---

## Annexe A : Modélisation Edge Device (Raspberry Pi)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EDGE DEVICE (Raspberry Pi)               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Caméra    │───▶│  Capture    │───▶│  Modèle ML      │ │
│  │  (USB/RTSP) │    │  (OpenCV)   │    │  (TFLite/ONNX)  │ │
│  └─────────────┘    └─────────────┘    └────────┬────────┘ │
│                                                  │          │
│                                          ┌──────▼──────┐   │
│                                          │  Payload    │   │
│                                          │  JSON       │   │
│                                          └──────┬──────┘   │
└─────────────────────────────────────────────────┼──────────┘
                                                  │
                                          ┌───────▼───────┐
                                          │   FastAPI     │
                                          │   /analyze    │
                                          └───────────────┘
```

### Script Edge Device (`edge_device.py`)

```python
import cv2
import requests
import time
import json
from datetime import datetime

# Configuration
FASTAPI_URL = "http://YOUR_SERVER:8000/analyze"
CAMERA_ID = "cam-001"
LOCATION = {
    "lat": 6.3654,
    "lng": 2.4183,
    "address": "Quartier Zongo, Cotonou"
}
INTERVAL = 30  # secondes entre chaque analyse

def capture_frame():
    """Capture une frame de la caméra"""
    cap = cv2.VideoCapture(0)  # ou URL RTSP
    ret, frame = cap.read()
    cap.release()
    if ret:
        _, buffer = cv2.imencode('.jpg', frame)
        return buffer.tobytes()
    return None

def analyze_locally(image_bytes):
    """
    Simulation du modèle ML local.
    Dans la vraie vie : TFLite/ONNX inference
    """
    import random
    water_level = round(random.uniform(0.0, 1.0), 2)
    confidence = round(random.uniform(0.7, 0.95), 2)
    return water_level, confidence

def send_to_server(water_level, confidence):
    """Envoie le payload au serveur FastAPI"""
    if water_level < 0.3:
        status = "safe"
    elif water_level < 0.6:
        status = "warning"
    else:
        status = "alert"
    
    payload = {
        "camera_id": CAMERA_ID,
        "image_url": f"https://storage.example.com/{CAMERA_ID}/latest.jpg",
        "location": LOCATION
    }
    
    try:
        response = requests.post(FASTAPI_URL, json=payload, timeout=10)
        response.raise_for_status()
        print(f"✅ [{datetime.now()}] Sent: {status} (water: {water_level})")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print(f"🚀 Edge Device {CAMERA_ID} started")
    print(f"📍 Location: {LOCATION['address']}")
    print(f"⏱️  Interval: {INTERVAL}s")
    
    while True:
        image = capture_frame()
        if image:
            water_level, confidence = analyze_locally(image)
            send_to_server(water_level, confidence)
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()
```

### Déploiement

```bash
# Sur la Raspberry Pi
pip install opencv-python requests tflite-runtime
python edge_device.py
```

### Production (vraie vie)

| Composant | Choix technique |
|-----------|-----------------|
| Caméra | USB ou RTSP (Hikvision, Dahua) |
| Capture | OpenCV ou GStreamer |
| Modèle ML | TensorFlow Lite, ONNX Runtime |
| Communication | HTTP REST (ou MQTT pour IoT) |
| Alimentation | PoE ou secteur |

---

*Dernière mise à jour : 19 septembre 2026*
