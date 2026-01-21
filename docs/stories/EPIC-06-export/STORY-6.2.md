# STORY-6.2: Implémenter la génération du ZIP

## User Story

**En tant que** système,
**Je veux** générer un fichier ZIP avec tous les assets,
**Afin de** permettre le téléchargement en un seul fichier.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given une requête POST vers /api/export
When le body contient texts, mockups, et options
Then la réponse est un fichier ZIP
And le ZIP contient la structure correcte
And tous les fichiers sont présents et valides
And le temps de génération est < 10 secondes
```

### Structure du ZIP

```
launchready-export-2026-01-21/
├── texts/
│   ├── app-name.txt
│   ├── subtitle.txt
│   ├── promo-text.txt
│   ├── description.txt
│   ├── keywords.txt
│   └── all-texts.json
├── mockups/
│   ├── iphone-6.7/
│   │   ├── screen-1.png
│   │   ├── screen-2.png
│   │   └── ...
│   ├── iphone-6.5/
│   │   └── ...
│   └── ipad-12.9/
│       └── ...
└── README.txt
```

### Checklist technique

- [ ] Route API /api/export/route.ts
- [ ] Utiliser Archiver pour créer ZIP
- [ ] Générer tous les mockups finaux
- [ ] Créer les fichiers texte
- [ ] Créer le JSON consolidé
- [ ] Générer README avec instructions
- [ ] Streaming response pour gros fichiers

## Points

**5 points** (L)

## Priorité

**P0** - Feature critique

## Dépendances

- STORY-4.2 (Mockup renderer)
- STORY-6.1 (Modal export)

## Notes techniques

```typescript
// Pseudo-code
import archiver from 'archiver';

export async function POST(request: Request) {
  const { texts, screenshots, options } = await request.json();

  const archive = archiver('zip', { zlib: { level: 9 } });

  // Add texts
  archive.append(texts.appName, { name: 'texts/app-name.txt' });
  // ...

  // Add mockups
  for (const screenshot of screenshots) {
    const mockup = await renderMockup(screenshot, options);
    archive.append(mockup, { name: `mockups/${device}/${name}.png` });
  }

  archive.finalize();

  return new Response(archive, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=launchready-export.zip'
    }
  });
}
```

## Definition of Done

- [ ] ZIP généré correctement
- [ ] Structure conforme
- [ ] Temps < 10s pour 10 mockups
- [ ] Download fonctionne sur tous navigateurs
