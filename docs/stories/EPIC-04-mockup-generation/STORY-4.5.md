# STORY-4.5: Implémenter le template text-overlay

## User Story

**En tant qu'** utilisateur,
**Je veux** ajouter un titre/headline sur mes mockups,
**Afin de** mettre en avant les features de mon app.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given je sélectionne le template "Text Overlay"
When je regarde les options
Then je vois un champ pour saisir le headline
And un sélecteur de police (3 options)
And un sélecteur de couleur de texte
```

```gherkin
Given j'ai saisi un headline "Gérez votre budget"
When je génère le mockup
Then le texte apparaît au-dessus du device
And il est centré et lisible
And la police et couleur correspondent à mes choix
```

### Options text-overlay

| Option | Values |
|--------|--------|
| Headline | string (max 50 chars) |
| Font family | Inter, SF Pro, Poppins |
| Text color | hex color |
| Text position | top, bottom |

### Checklist technique

- [ ] Input pour headline
- [ ] Sélecteur de police
- [ ] Color picker pour texte
- [ ] Position toggle (top/bottom)
- [ ] Rendu texte dans le renderer (canvas)
- [ ] Gestion des fonts côté serveur

## Points

**5 points** (L)

## Priorité

**P1** - Enhancement

## Dépendances

- STORY-4.2 (Renderer)
- STORY-4.4 (Options)

## Notes techniques

Pour les fonts côté serveur, utiliser :
- @fontsource/inter
- Fonts embarquées dans canvas

## Definition of Done

- [ ] Headline affiché correctement
- [ ] 3 fonts disponibles
- [ ] Couleur personnalisable
- [ ] Rendu lisible et esthétique
