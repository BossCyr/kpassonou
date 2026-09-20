# Script de Demonstration - Kpassonou
## Hackathon Ibudo 2026

---

## Ordre de passage (5 minutes)

### 1. Introduction (30 secondes)
> "Kpassonou transforme les cameras privees ET installe des Totems intelligents pour alerter Cotonou des inondations."

### 2. Le physique : Totem (1 minute)
> "Voici notre Totem Signalétique Intelligent. Il coute $10 a fabriquer."
> [Montrer la maquette physique]
> "La LED verte signifie zone sure. Orange = attention. Rouge = alerte inondation."
> [Allumer la LED -> elle change de couleur]
> "L'ecran OLED affiche la profondeur d'eau en temps reel."

### 3. Le logique : Dashboard (2 minutes)
> "Maintenant, je lance la simulation."
> [Executer `python demo.py`]

#### Etape 1 : Totem
> "Le totem du carrefour Zongo detecte 45cm d'eau. La LED passe orange."
> [Montrer le dashboard - le totem apparait sur la carte]

#### Etape 2 : Camera
> "En parallele, une camera privee analyse une image via Edge AI."
> [Montrer la difference : qualitative vs quantitative]

#### Etape 3 : Carte
> "Sur la carte, vous voyez les deux types de nœuds :"
> - Totems = marqueurs carres (donnees precises)
> - Cameras = marqueurs ronds (estimation ML)

### 4. Le maillage (30 secondes)
> "Les totems sont nos points fixes precis. Les cameras privées sont notre reseau dense a moindre cout."
> "1 totem = 1 carrefour. 100 cameras = toute la ville."

### 5. Impact (30 secondes)
> "Resultat : alerte 2h avant, secours cibles, donnees pour la mairie."
> "Cout total : $15 par camera, $10 par totem. Abonnement $5/mois."

---

## Commandes de demo

```bash
# Lancer les services
cd kpassonou-ai && python main.py
cd kpassonou-api && php artisan serve --port=8001
cd kpassonou-frontend && npm run dev

# Demo guidée
python demo.py

# Demo de charge
python demo.py stress
```

## Checklist stand

- [ ] Totem physique sur la table
- [ ] LED RGB fonctionnelle
- [ ] Ecran OLED allume
- [ ] Ordinateur avec dashboard
- [ ] FastAPI + Laravel en cours
- [ ] Script demo.py pret
- [ ] Badge KPASSONOU

## Questions du jury

**Q : Totem vs Camera ?**
> "Totem = capteur physique precis ($10). Camera = Edge AI qualitatif ($5). On combine les deux."

**Q : Pas de surveillance ?**
> "On ne filme pas. L'image est detruite apres analyse. Seul le niveau d'eau est envoye."

**Q : Cout par ville ?**
> "10 totems = $100. 100 cameras = $500. Total $600 pour couvrir Cotonou."
