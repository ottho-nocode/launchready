# STORY-5.3: Ajouter le mode plein écran

## User Story

**En tant qu'** utilisateur,
**Je veux** voir mes mockups en plein écran,
**Afin de** les examiner en détail.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given je clique sur un mockup dans le carousel
When la modal s'ouvre
Then le mockup s'affiche en plein écran
And je peux naviguer entre les mockups
And je peux fermer avec ESC ou bouton X
```

```gherkin
Given je suis en mode plein écran
When j'utilise les flèches clavier gauche/droite
Then je navigue entre les mockups
```

### Checklist technique

- [ ] Modal/Lightbox pour plein écran
- [ ] Navigation clavier (←/→/ESC)
- [ ] Zoom in/out (optionnel)
- [ ] Compteur X/N
- [ ] Animation d'ouverture/fermeture
- [ ] Backdrop click to close

## Points

**2 points** (S)

## Priorité

**P1** - Enhancement

## Dépendances

- STORY-5.2 (Carousel)

## Definition of Done

- [ ] Modal fonctionnelle
- [ ] Navigation clavier
- [ ] UX fluide
