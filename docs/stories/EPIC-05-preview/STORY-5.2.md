# STORY-5.2: Implémenter le carousel de mockups

## User Story

**En tant qu'** utilisateur,
**Je veux** naviguer dans mes mockups via un carousel,
**Afin de** voir tous les écrans de mon app.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'ai 5 mockups générés
When je regarde le carousel
Then je vois 2-3 mockups à la fois
And des flèches de navigation sont visibles
And des indicateurs de position (dots) sont présents
```

```gherkin
Given je suis sur le premier mockup
When je clique sur la flèche droite
Then le carousel scrolle au mockup suivant
And l'animation est fluide
```

```gherkin
Given je suis sur mobile
When je swipe le carousel
Then il se déplace naturellement
```

### Checklist technique

- [ ] Composant MockupCarousel
- [ ] Utiliser embla-carousel ou swiper
- [ ] Flèches de navigation
- [ ] Dots indicateurs
- [ ] Support touch/swipe
- [ ] Lazy loading des images
- [ ] Click pour zoom

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-4.2 (Mockups générés)

## Definition of Done

- [ ] Navigation fluide
- [ ] Touch support
- [ ] Responsive
