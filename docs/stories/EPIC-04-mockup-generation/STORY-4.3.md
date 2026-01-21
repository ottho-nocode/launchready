# STORY-4.3: Créer le sélecteur de templates

## User Story

**En tant qu'** utilisateur,
**Je veux** choisir parmi plusieurs templates de mockup,
**Afin de** obtenir le style visuel que je préfère.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'ai uploadé des screenshots
When je regarde la section mockups
Then je vois 3 options de templates
And chaque template a un preview visuel
And le template sélectionné est mis en évidence
```

```gherkin
Given je sélectionne un template différent
When je clique dessus
Then les mockups se regénèrent avec ce template
And le preview se met à jour
```

### Templates

| Template     | Description                  | Preview     |
| ------------ | ---------------------------- | ----------- |
| Device Frame | Screenshot dans cadre iPhone | Simple, pro |
| Gradient BG  | Device sur fond dégradé      | Moderne     |
| Text Overlay | Device + titre au-dessus     | Marketing   |

### Checklist technique

- [ ] Composant TemplatePicker
- [ ] Preview thumbnail pour chaque template
- [ ] Sélection visuelle (border/highlight)
- [ ] Déclenchement auto de la regénération
- [ ] Animation de transition

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-4.2 (Renderer)

## Definition of Done

- [ ] 3 templates sélectionnables
- [ ] Preview visuels clairs
- [ ] Changement de template fluide
