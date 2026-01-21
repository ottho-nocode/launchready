# STORY-5.1: Créer le composant de preview App Store

## User Story

**En tant qu'** utilisateur,
**Je veux** voir un aperçu réaliste de ma page App Store,
**Afin de** vérifier le rendu final avant export.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'ai généré des textes et des mockups
When je regarde la section preview
Then je vois une simulation de page App Store
And le nom de l'app est affiché
And le sous-titre est affiché
And la description est affichée (tronquée avec "Plus")
And les mockups sont visibles en carousel
```

```gherkin
Given je regarde le preview
When je clique sur "Plus" dans la description
Then le texte complet s'affiche
And je peux le replier
```

### Layout du preview

```
┌────────────────────────────────┐
│ [Icon] App Name                │
│         Subtitle               │
│ ⭐⭐⭐⭐⭐ 4.8 (1.2K)            │
├────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐          │
│  │Mock│ │Mock│ │Mock│ →        │
│  │ 1  │ │ 2  │ │ 3  │          │
│  └────┘ └────┘ └────┘          │
├────────────────────────────────┤
│ Description text here...       │
│ ... Plus ▼                     │
└────────────────────────────────┘
```

### Checklist technique

- [ ] Composant AppStorePreview
- [ ] Layout fidèle à l'App Store
- [ ] Placeholder pour icon (upload futur)
- [ ] Faux rating (statique)
- [ ] Description expand/collapse
- [ ] Responsive (card style sur mobile)

## Points

**5 points** (L)

## Priorité

**P0**

## Dépendances

- STORY-2.3 (Textes affichés)
- STORY-4.3 (Mockups affichés)

## Definition of Done

- [ ] Preview réaliste
- [ ] Tous les éléments présents
- [ ] Responsive
