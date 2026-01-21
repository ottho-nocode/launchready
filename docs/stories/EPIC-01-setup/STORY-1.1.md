# STORY-1.1: Initialiser le projet Next.js

## User Story

**En tant que** développeur,
**Je veux** un projet Next.js 14+ configuré avec TypeScript,
**Afin de** commencer le développement avec les bonnes bases.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given le repository est vide
When je clone et lance npm install && npm run dev
Then l'application démarre sur localhost:3000
And la page affiche "LaunchReady"
And TypeScript compile sans erreur
And ESLint ne remonte aucune erreur
```

### Checklist technique

- [ ] Next.js 14.x avec App Router
- [ ] TypeScript 5.x strict mode
- [ ] ESLint + Prettier configurés
- [ ] Structure de dossiers créée (app/, components/, lib/, types/)
- [ ] .env.example avec variables documentées
- [ ] README.md avec instructions de setup

## Points

**2 points** (S)

## Priorité

**P0** - Bloquant

## Dépendances

Aucune

## Notes techniques

```bash
npx create-next-app@latest launchready --typescript --tailwind --eslint --app --src-dir=false
```

## Definition of Done

- [ ] Code poussé sur main
- [ ] Build passe sans erreur
- [ ] Preview Vercel déployée
