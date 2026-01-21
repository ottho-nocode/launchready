# STORY-4.2: Implémenter le renderer de mockups

## User Story

**En tant que** système,
**Je veux** une API qui génère des mockups,
**Afin de** combiner screenshots et templates en images finales.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given une requête POST vers /api/generate-mockup
When le body contient screenshot (base64), template "frame", options
Then la réponse est une image PNG
And le screenshot est correctement positionné dans le frame
And les dimensions sont correctes pour App Store
And le temps de génération est < 2 secondes
```

```gherkin
Given le template "gradient"
When je génère un mockup
Then le fond est un dégradé de la couleur spécifiée
And le device est centré
```

### Checklist technique

- [ ] Route API /api/generate-mockup/route.ts
- [ ] Utiliser Sharp pour redimensionnement
- [ ] Utiliser node-canvas pour composition
- [ ] Fonction renderMockup(screenshot, template, options)
- [ ] Support des 3 templates
- [ ] Gestion mémoire (cleanup buffers)
- [ ] Error handling

## Points

**8 points** (XL)

## Priorité

**P0** - Feature critique

## Dépendances

- STORY-4.1 (Device frames)

## Notes techniques

```typescript
// Pseudo-code du renderer
async function renderMockup(
  screenshot: Buffer,
  template: 'frame' | 'gradient' | 'text-overlay',
  options: MockupOptions
): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Background
  // 2. Device frame
  // 3. Screenshot
  // 4. Optional text

  return canvas.toBuffer('image/png');
}
```

## Definition of Done

- [ ] API fonctionnelle
- [ ] 3 templates supportés
- [ ] Temps < 2s par mockup
- [ ] Tests avec différentes résolutions
