# Stories - LaunchReady

**Version:** 1.0
**Date:** 2026-01-21
**PRD:** `docs/planning/prd/PRD-launchready.md`
**Architecture:** `docs/planning/architecture/ARCH-launchready.md`

---

## Vue d'ensemble

### Epics

| # | Epic | Stories | Priorité | Complexité |
|---|------|---------|----------|------------|
| 1 | Setup & Infrastructure | 4 | P0 | M |
| 2 | Génération de textes | 4 | P0 | M |
| 3 | Upload de screenshots | 3 | P0 | S |
| 4 | Génération de mockups | 5 | P0 | L |
| 5 | Preview | 3 | P0 | M |
| 6 | Export | 3 | P0 | M |

**Total : 6 Epics, 22 Stories**

---

## EPIC-01: Setup & Infrastructure

> Mise en place du projet, configuration et infrastructure de base.

### Stories

| ID | Story | Points | Priorité |
|----|-------|--------|----------|
| 1.1 | Initialiser le projet Next.js | 2 | P0 |
| 1.2 | Configurer shadcn/ui et Tailwind | 2 | P0 |
| 1.3 | Mettre en place le store Zustand | 3 | P0 |
| 1.4 | Créer le layout principal et navigation | 3 | P0 |

**Total : 10 points**

---

## EPIC-02: Génération de textes

> Génération automatique des textes App Store via IA.

### Stories

| ID | Story | Points | Priorité |
|----|-------|--------|----------|
| 2.1 | Créer le formulaire de description | 3 | P0 |
| 2.2 | Implémenter l'API de génération de textes | 5 | P0 |
| 2.3 | Afficher et éditer les textes générés | 5 | P0 |
| 2.4 | Ajouter la régénération par champ | 3 | P1 |

**Total : 16 points**

---

## EPIC-03: Upload de screenshots

> Upload et gestion des screenshots utilisateur.

### Stories

| ID | Story | Points | Priorité |
|----|-------|--------|----------|
| 3.1 | Créer la zone de drag & drop | 3 | P0 |
| 3.2 | Implémenter la détection de device | 3 | P0 |
| 3.3 | Gérer la liste et le réordonnancement | 3 | P0 |

**Total : 9 points**

---

## EPIC-04: Génération de mockups

> Création des mockups à partir des screenshots et templates.

### Stories

| ID | Story | Points | Priorité |
|----|-------|--------|----------|
| 4.1 | Créer les templates de device frames | 5 | P0 |
| 4.2 | Implémenter le renderer de mockups | 8 | P0 |
| 4.3 | Créer le sélecteur de templates | 3 | P0 |
| 4.4 | Ajouter les options de personnalisation | 5 | P0 |
| 4.5 | Implémenter le template text-overlay | 5 | P1 |

**Total : 26 points**

---

## EPIC-05: Preview

> Prévisualisation du rendu final style App Store.

### Stories

| ID | Story | Points | Priorité |
|----|-------|--------|----------|
| 5.1 | Créer le composant de preview App Store | 5 | P0 |
| 5.2 | Implémenter le carousel de mockups | 3 | P0 |
| 5.3 | Ajouter le mode plein écran | 2 | P1 |

**Total : 10 points**

---

## EPIC-06: Export

> Export des assets au format App Store Connect.

### Stories

| ID | Story | Points | Priorité |
|----|-------|--------|----------|
| 6.1 | Créer la modal d'export | 3 | P0 |
| 6.2 | Implémenter la génération du ZIP | 5 | P0 |
| 6.3 | Ajouter les options d'export | 3 | P1 |

**Total : 11 points**

---

## Résumé

| Métrique | Valeur |
|----------|--------|
| Total Epics | 6 |
| Total Stories | 22 |
| Total Points | 82 |
| Stories P0 | 18 |
| Stories P1 | 4 |

### Ordre d'implémentation suggéré

1. **Sprint 1** (Setup + Textes) : EPIC-01, EPIC-02 → 26 pts
2. **Sprint 2** (Upload + Mockups) : EPIC-03, EPIC-04 → 35 pts
3. **Sprint 3** (Preview + Export) : EPIC-05, EPIC-06 → 21 pts

---

## Implementation Readiness Check

| Critère | Score | Max |
|---------|-------|-----|
| Stories atomiques | 3 | 3 |
| Critères d'acceptance clairs | 3 | 3 |
| Dépendances identifiées | 2 | 3 |
| Estimation cohérente | 2 | 3 |
| Priorités définies | 3 | 3 |

**Score total : 13/15** ✅ Ready for implementation

---

*Généré automatiquement - RALPH Mode*
