# STORY-2.1: Créer le formulaire de description

## User Story

**En tant qu'** utilisateur,
**Je veux** saisir une description de mon application,
**Afin de** fournir le contexte nécessaire à la génération des textes.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given je suis sur la page principale
When je vois le formulaire
Then il y a un champ textarea pour la description
And un placeholder explicatif
And un compteur de caractères (min 50 requis)
And un bouton "Générer" désactivé si < 50 chars
And un sélecteur de langue (FR, EN, ES, DE)
```

```gherkin
Given j'ai saisi une description de 100 caractères
When je clique sur "Générer"
Then un loader s'affiche
And le bouton est désactivé pendant le chargement
```

### Checklist technique

- [ ] Composant DescriptionForm
- [ ] Textarea avec validation (min 50 chars)
- [ ] Compteur de caractères dynamique
- [ ] Select pour la langue
- [ ] État loading pendant génération
- [ ] Intégration avec Zustand store
- [ ] Animations de transition

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-1.3 (Zustand store)
- STORY-1.4 (Layout)

## Definition of Done

- [ ] Formulaire fonctionnel et stylé
- [ ] Validation côté client
- [ ] État synchronisé avec le store
