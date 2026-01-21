# Brainstorm - App Store Assets Generator

**Date:** 2026-01-21
**Mode:** RALPH Auto-Discovery

---

## 1. Problème identifié

### Pain Points des développeurs iOS

1. **Temps perdu** : Remplir tous les champs App Store Connect prend 30-60 min par app/mise à jour
2. **Créativité limitée** : Difficile de trouver les bons mots-clés, descriptions accrocheuses
3. **Mockups coûteux** : Outils comme Mockuphone, Placeit sont payants ou limités
4. **Formats multiples** : iPhone 6.5", iPhone 5.5", iPad... plusieurs tailles à gérer
5. **Localisation** : Traduire et adapter pour chaque marché est fastidieux

### Qui souffre le plus ?

- **Développeurs indépendants** : Pas de budget pour designer/copywriter
- **Petites équipes** : Veulent automatiser les tâches répétitives
- **Agences** : Gèrent plusieurs apps, besoin d'efficacité

---

## 2. Solutions explorées

### Direction A : CLI Tool (Simple)

```
asgen "App de méditation pour débutants" --screenshots ./screens/
```

**Avantages :**

- Rapide à développer
- Intégrable dans CI/CD
- Pas de UI à maintenir

**Inconvénients :**

- Moins accessible aux non-devs
- Pas de preview en temps réel
- UX limitée

### Direction B : Web App (Recommandée) ✅

Interface web intuitive avec :

- Formulaire de description
- Upload drag & drop des screenshots
- Preview en temps réel des mockups
- Export ZIP avec tous les assets

**Avantages :**

- Accessible à tous
- Preview immédiat
- Expérience utilisateur riche

**Inconvénients :**

- Plus complexe à développer
- Hébergement nécessaire

### Direction C : Extension Xcode

Plugin Xcode qui remplit App Store Connect directement.

**Avantages :**

- Intégré au workflow existant

**Inconvénients :**

- Très complexe (API Apple)
- Maintenance difficile
- Audience limitée

### Direction D : App macOS native

**Avantages :**

- Offline possible
- Performance native

**Inconvénients :**

- Distribution limitée
- Plus long à développer

---

## 3. Direction choisie : Web App (B)

### Justification

1. **Accessibilité maximale** : Tout navigateur, tout OS
2. **Itérations rapides** : Déploiement continu facile
3. **Monétisation flexible** : Freemium, subscription
4. **Preview temps réel** : Essentiel pour les mockups

---

## 4. Features explorées

### Core Features (MVP)

| Feature                     | Priorité | Complexité |
| --------------------------- | -------- | ---------- |
| Génération titre/sous-titre | P0       | Faible     |
| Génération description      | P0       | Faible     |
| Génération mots-clés        | P0       | Moyenne    |
| Upload screenshots          | P0       | Faible     |
| Génération mockups basiques | P0       | Moyenne    |
| Export assets               | P0       | Faible     |

### Features avancées (v2)

| Feature                           | Priorité | Complexité |
| --------------------------------- | -------- | ---------- |
| Templates mockups variés          | P1       | Moyenne    |
| Multi-localisation                | P1       | Haute      |
| Historique/projets sauvegardés    | P1       | Moyenne    |
| A/B testing descriptions          | P2       | Haute      |
| Analyse concurrence keywords      | P2       | Haute      |
| Intégration App Store Connect API | P2       | Très haute |

---

## 5. Approche technique explorée

### Stack envisagé

**Frontend :**

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend :**

- Next.js API Routes (serverless)
- OpenAI/Claude API pour génération texte
- Sharp/Canvas pour manipulation images

**Infra :**

- Vercel (deploy)
- Pas de BDD pour MVP (stateless)

### Génération de texte

```
Input: "App de méditation guidée pour réduire le stress"

Output:
- Titre (30 chars): "ZenMind - Méditation"
- Sous-titre (30 chars): "Réduisez votre stress"
- Description (4000 chars): [généré]
- Mots-clés (100 chars): "méditation,stress,relaxation,zen,calme,sommeil"
- Texte promo (170 chars): [généré]
```

### Génération de mockups

```
Input: screenshot.png (1242x2688)

Process:
1. Détecter le ratio → iPhone 6.5"
2. Appliquer template (frame iPhone)
3. Ajouter fond dégradé/couleur
4. Optionnel: ajouter titre/texte

Output: mockup.png (1242x2688)
```

---

## 6. Risques identifiés

| Risque                           | Impact | Mitigation                       |
| -------------------------------- | ------ | -------------------------------- |
| Qualité génération IA            | Haut   | Prompts optimisés, review humain |
| Coûts API OpenAI                 | Moyen  | Caching, limites usage           |
| Templates mockups limités        | Moyen  | Commencer simple, itérer         |
| Concurrence (AppLaunchpad, etc.) | Moyen  | Focus UX, pricing agressif       |

---

## 7. Nom de l'application

### Options explorées

1. **StoreKit** ❌ (déjà utilisé par Apple)
2. **AppStore Assets Generator** ❌ (trop long)
3. **LaunchReady** ✅ (évoque "prêt à lancer")
4. **StorePrep** ✅ (préparation store)
5. **AppShip** ✅ (ship = expédier)
6. **Storefronter** (façade de store)

**Choix recommandé : LaunchReady** ou **StorePrep**

---

## 8. Synthèse

### Ce qu'on construit

**LaunchReady** - Une web app qui génère automatiquement tous les assets nécessaires pour soumettre une app sur l'App Store :

1. **Input minimal** : Description de l'app + screenshots
2. **Output complet** : Tous les textes + mockups formatés
3. **Experience** : Preview temps réel, export en 1 clic

### Proposition de valeur

> "Préparez votre soumission App Store en 5 minutes au lieu de 1 heure"

### MVP Scope

- [x] Génération textes (titre, sous-titre, description, mots-clés, promo)
- [x] Upload screenshots (drag & drop)
- [x] 3 templates mockups de base
- [x] Preview temps réel
- [x] Export ZIP

---

## Checklist Brainstorm

| Critère                        | Status |
| ------------------------------ | ------ |
| Problème clairement identifié  | ✅     |
| Plusieurs directions explorées | ✅     |
| Direction choisie justifiée    | ✅     |
| Features priorisées            | ✅     |
| Risques identifiés             | ✅     |

**Score : 5/5** → Prêt pour PRD

---

_Généré automatiquement - RALPH Mode_
