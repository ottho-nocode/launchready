# PRD - LaunchReady

**Version:** 1.0
**Date:** 2026-01-21
**Status:** Draft
**Mode:** FULL

---

## 1. Executive Summary

### Vision

LaunchReady est une application web qui automatise la préparation des assets pour la soumission sur l'App Store. En quelques minutes, les développeurs peuvent générer tous les textes marketing et créer des mockups professionnels à partir de leurs screenshots.

### Proposition de valeur

> "Préparez votre soumission App Store en 5 minutes au lieu de 1 heure"

### Objectifs clés

| Objectif      | Métrique             | Target            |
| ------------- | -------------------- | ----------------- |
| Gain de temps | Temps de préparation | < 5 min vs 60 min |
| Qualité       | Taux de rejet Apple  | < 5%              |
| Adoption      | Utilisateurs actifs  | 1000 MAU à 3 mois |

---

## 2. Contexte & Problème

### Situation actuelle

Les développeurs iOS doivent remplir de nombreux champs pour soumettre une app sur l'App Store :

**Champs textuels :**

- Nom de l'app (30 caractères)
- Sous-titre (30 caractères)
- Texte promotionnel (170 caractères)
- Description (4000 caractères)
- Mots-clés (100 caractères)
- URL d'assistance
- URL marketing
- Copyright

**Assets visuels :**

- Screenshots iPhone 6.7" (1290 x 2796 px)
- Screenshots iPhone 6.5" (1242 x 2688 px)
- Screenshots iPhone 5.5" (1242 x 2208 px)
- Screenshots iPad Pro 12.9" (2048 x 2732 px)
- App Preview videos (optionnel)

### Pain Points

1. **Temps** : 30-60 min par soumission/mise à jour
2. **Créativité** : Difficile d'écrire des textes marketing percutants
3. **Mots-clés** : Optimisation ASO complexe
4. **Mockups** : Outils payants ou résultats amateur
5. **Multi-format** : Plusieurs tailles de screenshots à gérer
6. **Répétition** : Mêmes tâches à chaque mise à jour

### Utilisateurs cibles

| Persona    | Caractéristiques              | Besoins                     |
| ---------- | ----------------------------- | --------------------------- |
| Indie Dev  | Solo, budget limité, 1-5 apps | Rapidité, gratuité/low-cost |
| Small Team | 2-5 devs, plusieurs apps      | Collaboration, templates    |
| Agency     | Gère apps clients             | Volume, branding custom     |

---

## 3. Solution proposée

### Concept

Une application web en 3 étapes :

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. INPUT   │ →  │  2. GÉNÈRE  │ →  │  3. EXPORT  │
│             │    │             │    │             │
│ Description │    │ Textes      │    │ ZIP avec    │
│ Screenshots │    │ Mockups     │    │ tous assets │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Workflow utilisateur

1. **Décrire l'app** : Saisir une description en langage naturel
2. **Uploader screenshots** : Drag & drop des captures d'écran
3. **Personnaliser** : Ajuster les textes générés, choisir templates mockups
4. **Prévisualiser** : Voir le rendu final en temps réel
5. **Exporter** : Télécharger un ZIP prêt pour App Store Connect

---

## 4. Fonctionnalités détaillées

### 4.1 Génération de textes (P0)

**Input :**

- Description de l'app en langage naturel (min 50 caractères)
- Catégorie de l'app (optionnel)
- Langue cible (défaut: français)

**Output généré :**

| Champ       | Limite     | Exemple                         |
| ----------- | ---------- | ------------------------------- |
| Nom         | 30 chars   | "ZenMind - Méditation"          |
| Sous-titre  | 30 chars   | "Réduisez votre stress"         |
| Texte promo | 170 chars  | "Découvrez la sérénité..."      |
| Description | 4000 chars | Description complète structurée |
| Mots-clés   | 100 chars  | "méditation,stress,zen,calme"   |

**Règles :**

- Respecter strictement les limites de caractères
- Optimiser pour l'ASO (App Store Optimization)
- Ton professionnel mais engageant
- Structure description : hook → features → CTA

**UX :**

- Édition inline de chaque champ
- Compteur de caractères en temps réel
- Bouton "Régénérer" par champ
- Copier en 1 clic

### 4.2 Upload de screenshots (P0)

**Formats acceptés :**

- PNG, JPEG
- Toutes tailles (détection automatique du device)

**Détection automatique :**

| Résolution  | Device                   |
| ----------- | ------------------------ |
| 1290 x 2796 | iPhone 6.7" (14 Pro Max) |
| 1242 x 2688 | iPhone 6.5" (11 Pro Max) |
| 1242 x 2208 | iPhone 5.5" (8 Plus)     |
| 2048 x 2732 | iPad Pro 12.9"           |

**UX :**

- Drag & drop zone
- Upload multiple (jusqu'à 10 images)
- Preview thumbnails
- Réordonner par drag
- Supprimer individuel

### 4.3 Génération de mockups (P0)

**Templates MVP :**

| Template     | Description                           |
| ------------ | ------------------------------------- |
| Device Frame | Screenshot dans cadre iPhone/iPad     |
| Gradient BG  | Device + fond dégradé personnalisable |
| Text Overlay | Device + titre/sous-titre au-dessus   |

**Options de personnalisation :**

- Couleur de fond (picker ou presets)
- Couleur du device (noir/blanc/or)
- Texte optionnel (headline)
- Police du texte (3 options)

**Output :**

- Format PNG
- Résolution App Store (ex: 1242 x 2688)
- Optimisé pour le web (< 500KB)

### 4.4 Preview temps réel (P0)

**Affichage :**

- Simulation page App Store
- Toggle iPhone/iPad view
- Carousel des mockups
- Section textes formatés

**Interactions :**

- Zoom sur mockup
- Mode plein écran
- Comparaison avant/après

### 4.5 Export (P0)

**Contenu du ZIP :**

```
launchready-export/
├── texts/
│   ├── app-name.txt
│   ├── subtitle.txt
│   ├── promo-text.txt
│   ├── description.txt
│   ├── keywords.txt
│   └── all-texts.json
├── screenshots/
│   ├── iphone-6.7/
│   │   ├── mockup-1.png
│   │   ├── mockup-2.png
│   │   └── ...
│   ├── iphone-6.5/
│   └── ipad-12.9/
└── README.txt
```

**Options d'export :**

- Sélection des formats (iPhone/iPad)
- Qualité images (web/print)
- Inclure textes bruts / JSON

---

## 5. Exigences non-fonctionnelles

### Performance

| Métrique                | Target               |
| ----------------------- | -------------------- |
| Temps génération textes | < 5s                 |
| Temps génération mockup | < 2s/image           |
| Temps chargement page   | < 2s (LCP)           |
| Export ZIP              | < 10s pour 10 images |

### Sécurité

- Pas de stockage permanent des images uploadées
- Images supprimées après session (ou 1h max)
- HTTPS obligatoire
- Pas de données personnelles collectées (MVP)

### Accessibilité

- WCAG 2.1 niveau AA
- Navigation clavier
- Labels ARIA
- Contraste suffisant

### Compatibilité

| Navigateur | Version min |
| ---------- | ----------- |
| Chrome     | 90+         |
| Safari     | 14+         |
| Firefox    | 90+         |
| Edge       | 90+         |

---

## 6. Contraintes techniques

### Limites connues

| Contrainte             | Impact                    | Mitigation         |
| ---------------------- | ------------------------- | ------------------ |
| API OpenAI rate limits | Génération lente si pic   | Queue, cache       |
| Upload size max        | Limite navigateur/serveur | Compression client |
| Vercel timeout (10s)   | Génération longue         | Edge functions     |

### Dépendances externes

| Service    | Usage            | Risque              |
| ---------- | ---------------- | ------------------- |
| OpenAI API | Génération texte | Coût, disponibilité |
| Vercel     | Hosting          | Vendor lock-in      |

---

## 7. Hors scope (MVP)

Les features suivantes sont explicitement exclues du MVP :

- ❌ Comptes utilisateurs / authentification
- ❌ Sauvegarde de projets
- ❌ Multi-localisation automatique
- ❌ Intégration App Store Connect API
- ❌ App Preview (vidéos)
- ❌ Analyse concurrence / suggestions mots-clés avancées
- ❌ Templates mockups personnalisés
- ❌ Mode hors-ligne

---

## 8. Métriques de succès

### KPIs MVP

| Métrique                          | Baseline | Target 3 mois |
| --------------------------------- | -------- | ------------- |
| Visiteurs uniques                 | 0        | 5000          |
| Taux conversion (visite → export) | -        | > 20%         |
| Exports générés                   | 0        | 2000          |
| NPS                               | -        | > 40          |

### Feedback qualitatif

- Interviews utilisateurs post-launch (10 users)
- Formulaire feedback in-app
- Monitoring erreurs (Sentry)

---

## 9. Timeline indicative

| Phase             | Durée           | Livrables             |
| ----------------- | --------------- | --------------------- |
| Setup & Infra     | 2-3j            | Projet Next.js, CI/CD |
| Génération textes | 3-4j            | API + UI formulaire   |
| Upload & Preview  | 2-3j            | Drag-drop, thumbnails |
| Mockups           | 4-5j            | Templates, rendering  |
| Export            | 1-2j            | ZIP generation        |
| Polish & Tests    | 2-3j            | QA, perf, responsive  |
| **Total MVP**     | **~3 semaines** | -                     |

---

## 10. Risques & Mitigations

| Risque                          | Probabilité | Impact  | Mitigation                    |
| ------------------------------- | ----------- | ------- | ----------------------------- |
| Qualité textes IA insuffisante  | Moyenne     | Haute   | Prompts itérés, review humain |
| Coûts API élevés                | Moyenne     | Moyenne | Freemium, limites usage       |
| Templates mockups trop basiques | Haute       | Moyenne | Feedback users, itérations    |
| Concurrence (AppLaunchpad)      | Basse       | Moyenne | UX supérieure, pricing        |

---

## 11. Appendices

### A. Référence champs App Store Connect

Source: Screenshot fourni par l'utilisateur

**Champs identifiés :**

- Aperçus et captures d'écran (iPhone, iPad, Apple Watch)
- Texte promotionnel
- Description
- Mots-clés
- URL de l'assistance
- URL marketing
- Version
- Copyright
- Extrait d'app (App Clip)

### B. Concurrence

| Concurrent   | Points forts           | Points faibles        |
| ------------ | ---------------------- | --------------------- |
| AppLaunchpad | Complet, templates pro | Payant ($99+)         |
| Placeit      | Large choix mockups    | Subscription          |
| MockuPhone   | Gratuit, simple        | Limité, pas de textes |
| Previewed    | App native             | macOS only            |

### C. Références design

- App Store Connect UI (screenshot fourni)
- Apple Human Interface Guidelines
- Material Design 3 pour inspiration

---

## Checklist PRD

| Critère                            | Status |
| ---------------------------------- | ------ |
| Problème clairement défini         | ✅     |
| Solution décrite                   | ✅     |
| Features détaillées avec priorités | ✅     |
| Exigences non-fonctionnelles       | ✅     |
| Scope MVP délimité                 | ✅     |
| Hors scope explicite               | ✅     |
| Métriques de succès                | ✅     |

**Score : 7/7** → Prêt pour Architecture

---

_Généré automatiquement - RALPH Mode_
