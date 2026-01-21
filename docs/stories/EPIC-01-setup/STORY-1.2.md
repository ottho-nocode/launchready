# STORY-1.2: Configurer shadcn/ui et Tailwind

## User Story

**En tant que** développeur,
**Je veux** shadcn/ui installé avec les composants de base,
**Afin de** construire l'UI rapidement avec des composants accessibles.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given le projet Next.js est initialisé
When j'importe un composant Button depuis @/components/ui
Then le composant s'affiche correctement stylé
And le thème respecte les couleurs définies
And les composants sont accessibles (ARIA)
```

### Checklist technique

- [ ] shadcn/ui initialisé (npx shadcn@latest init)
- [ ] Composants installés : Button, Input, Textarea, Card, Dialog, Tabs, Progress
- [ ] Tailwind config avec custom colors
- [ ] CSS variables pour theming
- [ ] Dark mode supporté (optionnel MVP)

## Points

**2 points** (S)

## Priorité

**P0** - Bloquant

## Dépendances

- STORY-1.1 (projet initialisé)

## Notes techniques

```bash
npx shadcn@latest init
npx shadcn@latest add button input textarea card dialog tabs progress
```

## Definition of Done

- [ ] Tous les composants listés installés
- [ ] Page de test avec tous les composants
- [ ] Pas de warning Tailwind
