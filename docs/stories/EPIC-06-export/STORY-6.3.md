# STORY-6.3: Ajouter les options d'export

## User Story

**En tant qu'** utilisateur,
**Je veux** choisir ce que j'inclus dans l'export,
**Afin de** ne télécharger que ce dont j'ai besoin.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'ai des mockups iPhone et iPad
When je décoche "iPad 12.9"" dans les options
Then l'export ne contient que les mockups iPhone
```

```gherkin
Given j'exporte
When je coche "Textes (JSON)" uniquement
Then le ZIP contient all-texts.json
And les fichiers .txt individuels ne sont pas présents
```

### Options disponibles

| Option      | Default | Description                       |
| ----------- | ------- | --------------------------------- |
| iPhone 6.7" | ✓       | Inclure mockups iPhone 14 Pro Max |
| iPhone 6.5" | ✓       | Inclure mockups iPhone 11 Pro Max |
| iPhone 5.5" | ✗       | Inclure mockups iPhone 8 Plus     |
| iPad 12.9"  | ✗       | Inclure mockups iPad              |
| Textes JSON | ✓       | Fichier JSON consolidé            |
| Textes TXT  | ✓       | Fichiers texte séparés            |
| README      | ✓       | Instructions d'utilisation        |

### Checklist technique

- [ ] Checkboxes dans ExportModal
- [ ] État des options dans le store
- [ ] Passer options à l'API export
- [ ] Filtrage côté serveur
- [ ] UI désactivée si aucun device sélectionné

## Points

**3 points** (M)

## Priorité

**P1** - Enhancement

## Dépendances

- STORY-6.1 (Modal)
- STORY-6.2 (ZIP generation)

## Definition of Done

- [ ] Toutes les options fonctionnelles
- [ ] Export filtré correctement
- [ ] UX claire
