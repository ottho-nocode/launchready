# STORY-6.1: Créer la modal d'export

## User Story

**En tant qu'** utilisateur,
**Je veux** une modal de confirmation avant export,
**Afin de** voir ce que je vais télécharger et configurer les options.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'ai généré des textes et mockups
When je clique sur "Exporter"
Then une modal s'ouvre
And je vois un récapitulatif (X textes, Y mockups)
And je vois les options d'export
And un bouton "Télécharger ZIP"
```

```gherkin
Given la modal est ouverte
When je clique en dehors ou sur X
Then la modal se ferme sans exporter
```

### Contenu de la modal

```
┌────────────────────────────────┐
│ Exporter les assets        [X] │
├────────────────────────────────┤
│ Récapitulatif:                 │
│ • 5 champs textuels            │
│ • 5 mockups iPhone 6.7"        │
│ • 3 mockups iPad 12.9"         │
│                                │
│ Options:                       │
│ [✓] iPhone 6.7"                │
│ [✓] iPhone 6.5"                │
│ [ ] iPad 12.9"                 │
│ [✓] Textes (JSON)              │
│ [✓] Textes (TXT séparés)       │
├────────────────────────────────┤
│      [Télécharger ZIP]         │
└────────────────────────────────┘
```

### Checklist technique

- [ ] Composant ExportModal avec Dialog shadcn
- [ ] Récapitulatif dynamique depuis le store
- [ ] Checkboxes pour options
- [ ] Bouton télécharger
- [ ] État disabled si rien à exporter

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-1.3 (Store)

## Definition of Done

- [ ] Modal fonctionnelle
- [ ] Récapitulatif correct
- [ ] Options sélectionnables
