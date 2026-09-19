# Script de Démonstration - Kpassonou
## Hackathon Ibudo 2026 - Thème Climat/Inondations

---

## 🎯 Ordre de passage (5 minutes)

### 1. Introduction (30 secondes)
> "Kpassonou transforme les caméras de surveillance privées de Cotonou en stations météo virtuelles pour les inondations, via Edge AI décentralisé."

### 2. Problème (30 secondes)
> "Au Bénin, les inondations font chaque année des dégâts considérables. Les citoyens n'ont pas accès à des données en temps réel sur les zones inondées. Les caméras de surveillance existent, mais ne sont pas connectées entre elles."

### 3. Solution (1 minute)
> "Notre solution : un réseau Waze-like de caméras. Chaque caméra分析 l'eau localement via Edge AI, envoie un payload JSON léger à notre plateforme, qui centralise les alertes pour la mairie et les secours."

### 4. Démonstration Live (2 minutes)

#### Étape 1 : Montrer la carte
> "Voici la carte de Cotonou avec nos 7 caméras connectées. Chaque point représente une caméra de surveillance privée."

#### Étape 2 : Simuler une alerte
> "Je vais maintenant simuler une détection d'inondation sur la caméra du quartier Zongo."

*(Cliquer sur "Simuler")*

> "Vous voyez immédiatement l'alerte apparaître en rouge sur la carte, avec le niveau d'eau détecté à 87%."

#### Étape 3 : Montrer le temps réel
> "Le dashboard se met à jour automatiquement toutes les 5 secondes. Si je clique sur 'x5 Alertes', nous simulons une crise multiple."

*(Cliquer sur "x5 Alertes")*

> "En quelques secondes, 5 nouvelles alertes apparaissent sur différentes zones de Cotonou."

#### Étape 4 : Montrer les détails
> "En cliquant sur un marqueur, vous voyez les détails : camera_id, adresse, niveau d'eau, confiance du modèle, et horodatage."

### 5. Architecture Technique (1 minute)
> "Notre stack :
> - **Frontend** : Next.js avec carte Leaflet
> - **Backend** : Laravel avec API REST
> - **IA** : FastAPI avec mock de détection ML
> - **Edge** : Chaque caméra a un Raspberry Pi qui analyse localement
>
> Le payload JSON fait moins de 200 octets, idéal pour des connexions 3G au Bénin."

### 6. Impact et Scalabilité (30 secondes)
> "Scalable à toutes les villes du Bénin. Coût minimal : un Raspberry Pi par caméra. Les données sont open pour la recherche climatique."

---

## 🚀 Commandes de lancement

```bash
# Terminal 1 - FastAPI (IA)
cd kpassonou-ai
.\venv\Scripts\python.exe main.py

# Terminal 2 - Laravel (API)
cd kpassonou-api
php artisan serve --port=8001

# Terminal 3 - Next.js (Frontend)
cd kpassonou-frontend
npm run dev
```

## 🌐 URLs
- Dashboard : http://localhost:3000
- API Laravel : http://localhost:8001/api/alerts
- FastAPI : http://localhost:8000/health

---

## 💡 Questions fréquentes du jury

**Q : Comment les caméras envoient-elles les données ?**
> "Chaque caméra a un Edge Device (Raspberry Pi) qui capture l'image, analyse le niveau d'eau localement via un modèle TFLite, et envoie un payload JSON léger à notre API."

**Q : Quelle est la précision du modèle ?**
> "En phase de démo, nous utilisons un mock avec des valeurs aléatoires. En production, nous utiliserions un modèle YOLO ou DeepLabV3 entraîné sur des images de Cotonou."

**Q : Comment vous financez-vous ?**
> "Modèle freemium pour les propriétaires de caméras. Vente de données anonymisées aux mairies et ONG."

**Q : Pourquoi pas un drone ?**
> "Les caméras sont déjà installées, alimentées, et connectées. Coût marginal zéro. Les drones nécessitent une logistique lourde."

---

*Script de démo - Kpassonou - Hackathon Ibudo 2026*
