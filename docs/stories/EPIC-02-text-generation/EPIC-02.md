# EPIC-02: Génération de textes

## Description

Génération automatique des textes marketing App Store (nom, sous-titre, description, mots-clés, texte promotionnel) via l'API OpenAI.

## Valeur métier

Feature principale de l'application. Permet aux utilisateurs de générer tous les textes nécessaires en quelques secondes au lieu de plusieurs minutes.

## Stories

- [STORY-2.1](./STORY-2.1.md) - Créer le formulaire de description
- [STORY-2.2](./STORY-2.2.md) - Implémenter l'API de génération de textes
- [STORY-2.3](./STORY-2.3.md) - Afficher et éditer les textes générés
- [STORY-2.4](./STORY-2.4.md) - Ajouter la régénération par champ

## Critères d'acceptance (Epic)

- [ ] L'utilisateur peut saisir une description de son app
- [ ] L'IA génère tous les textes en < 5 secondes
- [ ] Tous les textes respectent les limites de caractères Apple
- [ ] L'utilisateur peut éditer chaque texte
- [ ] L'utilisateur peut régénérer un texte spécifique

## Dépendances

- EPIC-01 (Setup)

## Points totaux

**16 points**
