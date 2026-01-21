# STORY-4.4: Ajouter les options de personnalisation

## User Story

**En tant qu'** utilisateur,
**Je veux** personnaliser les couleurs et options de mes mockups,
**Afin de** les adapter à ma marque.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given je suis sur la personnalisation des mockups
When je regarde les options
Then je vois un sélecteur de couleur de device (noir/blanc)
And un color picker pour le fond (template gradient)
And des presets de couleurs populaires
```

```gherkin
Given je change la couleur de fond
When je sélectionne une nouvelle couleur
Then le preview se met à jour en temps réel
And le store est mis à jour
```

### Options disponibles

| Option             | Values              | Templates concernés    |
| ------------------ | ------------------- | ---------------------- |
| Device color       | black, white        | Tous                   |
| Background color   | hex color           | gradient, text-overlay |
| Gradient direction | to-bottom, to-right | gradient               |

### Checklist technique

- [ ] Composant OptionsPanel
- [ ] Sélecteur device color (toggle noir/blanc)
- [ ] Color picker pour background
- [ ] Presets de couleurs (5-10 couleurs)
- [ ] Preview temps réel
- [ ] Synchronisation avec store

## Points

**5 points** (L)

## Priorité

**P0**

## Dépendances

- STORY-4.3 (Template picker)

## Definition of Done

- [ ] Toutes les options fonctionnelles
- [ ] Preview temps réel
- [ ] Presets attractifs
