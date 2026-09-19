# Kpassonou — Cadrage MVP Hackathon (24h)

> **Hackathon Ibudo** — Thème Climat/Inondations au Bénin
> Objectif : MVP fonctionnel, impressionnant pour le jury, codable en 24h chrono.

---

## 1. Périmètre Exact du MVP

### ✅ À CODER (fonctionnel)

- Dashboard Next.js avec carte interactive des zones inondées
- API Laravel qui reçoit et stocke les alertes d'inondation
- FastAPI qui reçoit une image et retourne un niveau d'eau (Mock ML)
- Push temps réel des alertes (WebSocket ou polling simple)
- Seeders de données réalistes (Cotonou)

### 🎭 À SIMULER / MOCK

- Authentification → un token mock en header
- Intégration multi-caméras → 2-3 caméras de démo
- Vrai modèle ML → algorithme de détection simple ou mock
- Gestion d'erreurs avancée
- Base de données persistante → SQLite ou en mémoire

---

## 2. Contrat d'Interface — Payload JSON

### FastAPI → Laravel (Détection)

```json
{
  "camera_id": "cam-001",
  "timestamp": "2026-09-19T14:30:00Z",
  "location": {
    "lat": 6.3654,
    "lng": 2.4183,
    "address": "Quartier Zongo, Cotonou"
  },
  "water_level": 0.72,
  "status": "alert",
  "confidence": 0.89,
  "image_url": "https://storage.example.com/cam-001/latest.jpg"
}
```

### Laravel → Next.js (Dashboard)

```json
{
  "alerts": [
    {
      "id": "uuid-1234",
      "camera_id": "cam-001",
      "lat": 6.3654,
      "lng": 2.4183,
      "water_level": 0.72,
      "status": "alert",
      "timestamp": "2026-09-19T14:30:00Z",
      "address": "Quartier Zongo, Cotonou"
    }
  ],
  "summary": {
    "total_cameras": 3,
    "active_alerts": 2,
    "last_update": "2026-09-19T14:31:00Z"
  }
}
```

### Statuts possibles

| `water_level` | `status`   |
|---------------|------------|
| 0.0 - 0.3    | `safe`     |
| 0.3 - 0.6    | `warning`  |
| 0.6 - 1.0    | `alert`    |

---

## 3. Architecture des Dossiers Minimaliste

### Next.js (`kpassonou-frontend/`)

```
src/
├── app/
│   ├── page.tsx              # Dashboard principal
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Map.tsx               # Carte Leaflet/Mapbox
│   ├── AlertCard.tsx          # Carte d'alerte
│   └── StatusBadge.tsx        # Badge coloré par statut
├── lib/
│   └── api.ts                 # Fetch Laravel API
└── types/
    └── alert.ts               # Types TypeScript
```

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
