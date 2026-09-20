# Maquette Physique - Totem Signalétique Intelligent

## Dimensions
- **Hauteur totale** : 60 cm (miniature réaliste)
- **Largeur** : 15 cm
- **Profondeur** : 15 cm

## Matériaux (coût total ~$5-10)

| Composant | Matériau | Prix |
|-----------|----------|------|
| Structure principale | Carton double face / Papier cartonné | $0 (récup) |
| Pied | Tube carton ou bouteille plastique | $0 (récup) |
| LED 3 couleurs | LED RGB clignotante USB | $2 |
| Écran LCD mini | Afficheur OLED 0.96" I2C | $3 |
| Alimentation | Batterie USB ou adaptateur | $0 (récup) |
| Peinture / Marquages | Feutres + papier coloré | $1 |

## Structure

```
         ┌─────────────────┐
         │  ☀️  TOTEM     │  ← Panneau solaire simulé (carton doré)
         │   KPASSONOU     │
         ├─────────────────┤
         │   🚦 LED RGB   │  ← LED verte/orange/rouge
         │   [  ████  ]   │  ← Mini écran OLED (profondeur eau)
         │   💧 45 cm     │
         │   🔋 87%       │
         ├─────────────────┤
         │   CARREFOUR     │  ← Adresse du carrefour
         │    ZONGO        │
         ├─────────────────┤
         │                 │
         │    (Pied)       │  ← Structure tubulaire
         │                 │
         └─────────────────┘
              ▓▓▓▓▓▓▓▓       ← Base stabilisatrice
```

## Fabrication pas à pas

### Étape 1 : Structure (15 min)
1. Découper 2 rectangles de carton 15x60 cm
2. Plier en U pour former le boîtier
3. Découper une fenêtre pour l'écran (3x2 cm)
4. Fixer le pied (tube carton 30 cm)

### Étape 2 : Électronique (10 min)
1. Connecter la LED RGB (rouge/orange/vert)
2. Fixer l'écran OLED sur la fenêtre
3. Relier à une batterie USB
4. Programmer un Arduino/ESP32 pour piloter LED + écran

### Étape 3 : Finitions (10 min)
1. Peindre en bleu ciel (couleur eau)
2. Ajouter logo Kpassonou (imprimé)
3. Marquer "CARREFOUR ZONGO"
4. Ajouter le panneau solaire simulé

## Script Arduino (LED + Écran)

```cpp
// Pilotage LED RGB + OLED Totem
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define LED_ROUGE 9
#define LED_ORANGE 10
#define LED_VERT 11

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  pinMode(LED_ROUGE, OUTPUT);
  pinMode(LED_ORANGE, OUTPUT);
  pinMode(LED_VERT, OUTPUT);
  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
}

void setLED(String color) {
  digitalWrite(LED_ROUGE, color == "red" ? HIGH : LOW);
  digitalWrite(LED_ORANGE, color == "orange" ? HIGH : LOW);
  digitalWrite(LED_VERT, color == "green" ? HIGH : LOW);
}

void updateDisplay(float depth, String status, int battery) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("KPASSONOU TOTEM");
  display.println("----------------");
  display.print("Eau: ");
  display.print(depth);
  display.println(" cm");
  display.print("Statut: ");
  display.println(status);
  display.print("Batterie: ");
  display.print(battery);
  display.println("%");
  display.display();
}

void loop() {
  // Simulation
  float depth = random(0, 100);
  String status;
  String color;
  
  if (depth < 30) {
    status = "SUR";
    color = "green";
  } else if (depth < 60) {
    status = "ATTENTION";
    color = "orange";
  } else {
    status = "ALERTE";
    color = "red";
  }
  
  setLED(color);
  updateDisplay(depth, status, 87);
  
  delay(3000);
}
```

## Présentation au jury

### Script de démonstration physique

1. **Montrer le totem** : "Voici notre Totem Signalétique Intelligent"
2. **Allumer la LED** : "Regardez, la LED passe de vert à orange"
3. **Montrer l'écran** : "L'afficheur montre la profondeur d'eau en temps réel"
4. **Lancer la démo** : "Je lance maintenant la simulation sur l'ordinateur"
5. **Cliquer sur "Simuler Totem"** : La LED change, l'écran se met à jour
6. **Montrer le dashboard** : "Vous voyez l'alerte apparaître sur la carte"

### Argumentaire

> "Ce totem coûte $10 à fabriquer. Il est installé aux carrefours clés de Cotonou. Les passants voient instantanément si la zone est sûre (vert), en attention (orange) ou en alerte (rouge). Pas besoin d'application mobile, pas besoin d'internet. C'est un signal visuel simple et efficace."

## Checklist stand hackathon

- [ ] Totem physique sur la table
- [ ] LED RGB fonctionnelle
- [ ] Écran OLED allumé
- [ ] Ordinateur avec dashboard Next.js
- [ ] Script de démo prêt
- [ ] FastAPI + Laravel lancés
- [ ] Badge "KPASSONOU" pour le jury
