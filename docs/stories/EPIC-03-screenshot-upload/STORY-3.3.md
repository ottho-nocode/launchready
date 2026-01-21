# STORY-3.3: Gérer la liste et le réordonnancement

## User Story

**En tant qu'** utilisateur,
**Je veux** réordonner et supprimer mes screenshots,
**Afin de** les organiser dans l'ordre souhaité pour l'App Store.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'ai uploadé 5 screenshots
When je fais glisser le screenshot 3 avant le screenshot 1
Then l'ordre est mis à jour visuellement
And le store reflète le nouvel ordre
```

```gherkin
Given j'ai uploadé des screenshots
When je clique sur le bouton supprimer d'un screenshot
Then il est retiré de la liste
And les autres screenshots se réorganisent
```

```gherkin
Given j'ai uploadé 10 screenshots (max)
When j'essaie d'en ajouter un autre
Then un message indique que la limite est atteinte
And l'upload est bloqué
```

### Checklist technique

- [ ] Composant ScreenshotList avec drag to reorder
- [ ] Utiliser @dnd-kit/core ou similaire
- [ ] Bouton supprimer par screenshot
- [ ] Animation de réordonnancement fluide
- [ ] Compteur X/10 screenshots
- [ ] Message si limite atteinte

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-3.1 (Upload)
- STORY-3.2 (Détection)

## Definition of Done

- [ ] Drag to reorder fonctionnel
- [ ] Suppression fonctionnelle
- [ ] Animations fluides
- [ ] Limite respectée
