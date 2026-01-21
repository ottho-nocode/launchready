# STORY-2.3: Afficher et éditer les textes générés

## User Story

**En tant qu'** utilisateur,
**Je veux** voir et modifier les textes générés,
**Afin de** les ajuster avant export.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given les textes ont été générés
When je regarde la section des résultats
Then je vois chaque champ avec son label et sa limite
And chaque champ a un compteur de caractères
And les champs dépassant la limite sont en rouge
And je peux éditer directement chaque champ
```

```gherkin
Given je modifie le champ "Description"
When je tape du texte
Then le compteur se met à jour en temps réel
And l'état est sauvegardé dans le store
And un indicateur "modifié" apparaît
```

### Checklist technique

- [ ] Composant TextEditor pour chaque champ
- [ ] Compteur de caractères avec couleur conditionnelle
- [ ] Édition inline (contenteditable ou textarea)
- [ ] Bouton "Copier" par champ
- [ ] Synchronisation bidirectionnelle avec store
- [ ] Animation de transition quand textes arrivent
- [ ] Indicateur de modification

## Points

**5 points** (L)

## Priorité

**P0**

## Dépendances

- STORY-2.2 (API génération)
- STORY-1.3 (Store)

## Definition of Done

- [ ] Tous les champs affichés et éditables
- [ ] Compteurs précis et en temps réel
- [ ] Copie fonctionne sur tous navigateurs
- [ ] UX fluide sans lag
