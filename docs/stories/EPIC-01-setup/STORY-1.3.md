# STORY-1.3: Mettre en place le store Zustand

## User Story

**En tant que** développeur,
**Je veux** un store Zustand configuré avec l'état de l'application,
**Afin de** gérer l'état global de manière simple et typée.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given le projet est configuré
When j'utilise le hook useAppStore()
Then j'accède à l'état global (description, screenshots, texts, options)
And les actions modifient l'état correctement
And les types TypeScript sont stricts
```

### Checklist technique

- [ ] Zustand installé
- [ ] Store créé dans store/app-store.ts
- [ ] Types définis pour tout l'état
- [ ] Actions implémentées :
  - setAppDescription
  - addScreenshots / removeScreenshot / reorderScreenshots
  - setGeneratedTexts / updateText
  - setMockupOptions
  - reset
- [ ] Persist middleware (optionnel) pour localStorage

## Points

**3 points** (M)

## Priorité

**P0** - Bloquant

## Dépendances

- STORY-1.1 (projet initialisé)

## Notes techniques

```typescript
// Exemple de structure
interface AppState {
  appDescription: string;
  screenshots: Screenshot[];
  generatedTexts: GeneratedTexts | null;
  mockupOptions: MockupOptions;
  // ... actions
}
```

## Definition of Done

- [ ] Store fonctionnel avec tous les types
- [ ] Tests unitaires pour les actions principales
- [ ] Hook utilisable dans les composants
