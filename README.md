# 🌊 Kpassonou

> Surveillance des inondations en temps réel à Cotonou, Bénin via Edge AI décentralisé

[![Hackathon Ibudo 2026](https://img.shields.io/badge/Hackathon-Ibudo%202026-blue)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]()

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [API Endpoints](#-api-endpoints)
- [Structure du projet](#-structure-du-projet)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Présentation

**Kpassonou** est une plateforme de surveillance des inondations qui transforme les caméras de surveillance privées (boutiques, banques) à Cotonou en stations météo virtuelles via Edge AI décentralisé.

### Le problème
- Les inondations font des dégâts considérables au Bénin chaque année
- Les citoyens n'ont pas accès à des données en temps réel
- Les caméras de surveillance existent mais ne sont pas connectées

### La solution
- Un réseau **Waze-like** de caméras
- Chaque caméra analyse l'eau localement via **Edge AI**
- Un payload JSON léger est envoyé à la plateforme
- Centralisation des alertes pour la mairie et les secours

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Caméras Privée │────▶│   Edge Device    │────▶│    Laravel      │
│  (Boutique/Bank)│     │  (RPi/ESP32)     │     │   API REST      │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐                            ┌─────────────────┐
│    Next.js      │◀───────────────────────────│    PostgreSQL    │
│   Dashboard     │         Polling 5s         │    (SQLite dev)  │
└─────────────────┘                            └─────────────────┘
```

---

## 💻 Tech Stack

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | Next.js + Tailwind CSS | 14.x |
| **Backend API** | Laravel | 11.x |
| **IA / Analyse** | FastAPI (Python) | 0.109+ |
| **Base de données** | SQLite (dev) / PostgreSQL (prod) | - |
| **Carte** | Leaflet | 1.9.x |
| **Edge Device** | Raspberry Pi / ESP32-CAM | - |

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) 18+
- [PHP](https://php.net/) 8.1+
- [Composer](https://getcomposer.org/)
- [Python](https://python.org/) 3.10+

### 1. Cloner le dépôt

```bash
git clone https://github.com/VOTRE_USER/kpassonou.git
cd kpassonou
```

### 2. Backend Laravel (API)

```bash
cd kpassonou-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8001
```

### 3. Service IA (FastAPI)

```bash
cd kpassonou-ai
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

### 4. Frontend (Next.js)

```bash
cd kpassonou-frontend
npm install
npm run dev
```

---

## 📖 Utilisation

1. **Démarrer les 3 services** ( voir Installation )
2. **Ouvrir** http://localhost:3000
3. **Simuler une alerte** : Cliquer sur "🔄 Simuler"
4. **Mode démo** : Cliquer sur "▶️ Démo" pour des alertes automatiques

### URLs des services

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:3000 | Interface utilisateur |
| API Laravel | http://localhost:8001/api | API REST |
| FastAPI | http://localhost:8000 | Service IA |

---

## 📡 API Endpoints

### Laravel (Port 8001)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/alerts` | Liste toutes les alertes |
| `POST` | `/api/alerts` | Crée une alerte |
| `GET` | `/api/stats` | Statistiques |
| `POST` | `/api/simulate` | Simule une alerte via FastAPI |
| `POST` | `/api/simulate/multiple` | Simule X alertes |

### FastAPI (Port 8000)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/health` | Healthcheck |
| `POST` | `/analyze` | Analyse une image |

---

## 📁 Structure du projet

```
kpassonou/
├── kpassonou-frontend/      # Next.js Dashboard
│   ├── src/
│   │   ├── app/             # Pages
│   │   ├── components/      # Composants React
│   │   ├── lib/             # Utilitaires
│   │   └── types/           # Types TypeScript
│   └── package.json
│
├── kpassonou-api/           # Laravel API
│   ├── app/
│   │   ├── Http/Controllers
│   │   └── Models
│   ├── database/seeders
│   └── routes/api.php
│
├── kpassonou-ai/            # FastAPI Service
│   ├── models/
│   ├── services/
│   └── main.py
│
├── CADRAGE-MVP.md           # Documentation projet
├── DEMO-SCRIPT.md           # Script de démo
└── docker-compose.yml       # Setup Docker
```

---

## 🎬 Démonstration

Voir [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) pour le script de démo du hackathon.

---

## 🛠️ Développement

### Seeders

```bash
cd kpassonou-api
php artisan migrate:fresh --seed
```

### Simulation rapide

```bash
cd kpassonou-ai
python simulate.py
```

---

## 📄 License

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---

## 🙏 Auteurs

- **Kpassonou Team** - Hackathon Ibudo 2026

---

## 🔗 Liens

- [Presentation (PDF)](#)
- [Vidéo démo](#)
- [Edge Device Script](#)

---

*Fait avec ❤️ pour le Bénin 🇧🇯*
