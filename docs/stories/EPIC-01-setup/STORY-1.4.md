# STORY-1.4: Créer le layout principal et navigation

## User Story

**En tant qu'** utilisateur,
**Je veux** voir un layout clair avec header et footer,
**Afin de** naviguer facilement dans l'application.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given je suis sur n'importe quelle page
When je regarde l'écran
Then je vois un header avec le logo "LaunchReady"
And je vois un footer avec les liens légaux
And le contenu est centré et responsive
And sur mobile, le layout s'adapte correctement
```

### Checklist technique

- [ ] Composant Header avec logo et navigation
- [ ] Composant Footer avec liens (Privacy, Terms, Contact)
- [ ] Composant Container pour centrer le contenu
- [ ] Layout appliqué dans app/layout.tsx
- [ ] Responsive : mobile, tablet, desktop
- [ ] Favicon et metadata configurés

## Points

**3 points** (M)

## Priorité

**P0** - Bloquant

## Dépendances

- STORY-1.2 (shadcn/ui configuré)

## Notes techniques

Structure des composants :

```
components/
└── layout/
    ├── header.tsx
    ├── footer.tsx
    └── container.tsx
```

## Definition of Done

- [ ] Layout visible sur toutes les pages
- [ ] Responsive testé sur 3 breakpoints
- [ ] Lighthouse accessibility > 90
