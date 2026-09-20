# Kpassonou

> Surveillance des inondations en temps reel a Cotonou via Edge AI + Totems Signalétiques

## Presentation

**Kpassonou** combine :
1. **Totem Signalétique Intelligent** : Borne physique (Vert/Orange/Rouge) aux carrefours
2. **Maillage Prive** : cameras privees analysees par Edge AI
3. **Dashboard Web** : donnees temps reel pour citoyens, secours, mairies

## Architecture

```
TOTEM PUBLIC          CAMERAS PRIVEES         SERVEUR
(Capteurs)            (Edge AI)
  LED RGB               RPi/ESP32             Laravel API
  OLED                                       PostgreSQL
    |                      |                      |
    +------ JSON 200B -----+------>           Next.js Dashboard
```

## Tech Stack

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Laravel 13 |
| IA | FastAPI (Python) |
| BDD | SQLite (dev) / PostgreSQL (prod) |
| Carte | Leaflet |
| Totem | ESP32 + LED RGB + OLED |
| Edge | Raspberry Pi / ESP32-CAM |

## Installation

```bash
# Backend
cd kpassonou-api && composer install && php artisan migrate --seed && php artisan serve --port=8001

# FastAPI
cd kpassonou-ai && pip install -r requirements.txt && python main.py

# Frontend
cd kpassonou-frontend && npm install && npm run dev
```

## API Endpoints

### Laravel (8001)

| Methode | Route | Description |
|---------|-------|-------------|
| GET | /api/alerts | Liste alertes (filtre source_type) |
| POST | /api/alerts | Cree alerte |
| GET | /api/stats | Stats totems + cameras |
| POST | /api/simulate | Simule camera |
| POST | /api/simulate/multiple | Simule X cameras |
| POST | /api/simulate/totem | Simule Totem |

### FastAPI (8000)

| Methode | Route | Description |
|---------|-------|-------------|
| GET | /health | Healthcheck |
| POST | /analyze | Analyse camera ou totem |

## Payload JSON

### Camera Privee (qualitatif)
```json
{
  "camera_id": "cam-001",
  "source_type": "camera",
  "water_level": 0.72,
  "status": "alert",
  "confidence": 0.89,
  "data_precision": "qualitative"
}
```

### Totem Public (quantitatif)
```json
{
  "camera_id": "totem-001",
  "source_type": "totem",
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

## Demo

```bash
python demo.py           # Demo guidée Totem + Camera
python demo.py stress    # 10 alertes en 5 secondes
```

## Maquette Totem

Voir [TOTEM-PHYSIQUE.md](./TOTEM-PHYSIQUE.md)

## Fichiers

```
kpassonou/
├── kpassonou-frontend/   # Next.js Dashboard
├── kpassonou-api/        # Laravel API
├── kpassonou-ai/         # FastAPI IA
├── demo.py               # Script de demo
├── TOTEM-PHYSIQUE.md     # Plan maquette
├── CADRAGE-MVP.md        # Documentation projet
├── DEMO-SCRIPT.md        # Script jury
└── docker-compose.yml    # Setup Docker
```

## License

MIT
