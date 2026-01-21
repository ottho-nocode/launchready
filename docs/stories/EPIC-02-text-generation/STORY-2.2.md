# STORY-2.2: Implémenter l'API de génération de textes

## User Story

**En tant que** système,
**Je veux** une API qui génère les textes App Store via OpenAI,
**Afin de** fournir des textes optimisés et conformes aux contraintes Apple.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given une requête POST vers /api/generate-texts
When le body contient { description: "...", language: "fr" }
Then la réponse contient tous les champs :
  - appName (≤ 30 chars)
  - subtitle (≤ 30 chars)
  - promoText (≤ 170 chars)
  - description (≤ 4000 chars)
  - keywords (≤ 100 chars)
And le temps de réponse est < 10 secondes
And le format est JSON valide
```

```gherkin
Given une description trop courte (< 50 chars)
When je fais la requête
Then je reçois une erreur 400 avec message explicite
```

### Checklist technique

- [ ] Route API /api/generate-texts/route.ts
- [ ] Validation input avec Zod
- [ ] Configuration OpenAI client
- [ ] Prompts optimisés pour chaque champ
- [ ] Response format JSON strict
- [ ] Gestion des erreurs (rate limit, timeout)
- [ ] Logging pour debug

## Points

**5 points** (L)

## Priorité

**P0** - Feature critique

## Dépendances

- STORY-1.1 (projet initialisé)
- Variable OPENAI_API_KEY configurée

## Notes techniques

Prompts à créer dans `lib/prompts/` :

- `system-prompt.ts` - Instructions générales
- `app-name.ts` - Génération nom
- `description.ts` - Génération description longue
- `keywords.ts` - Génération mots-clés ASO

## Definition of Done

- [ ] API fonctionnelle et testée
- [ ] Temps de réponse < 10s
- [ ] Tous les champs respectent les limites
- [ ] Erreurs gérées proprement
