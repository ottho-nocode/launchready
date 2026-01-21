# STORY-3.2: Implémenter la détection de device

## User Story

**En tant que** système,
**Je veux** détecter automatiquement le type de device depuis la résolution,
**Afin de** appliquer le bon template de mockup.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given j'uploade une image de 1290x2796 pixels
When l'image est traitée
Then elle est identifiée comme "iPhone 6.7""
And un badge "iPhone 6.7"" s'affiche sur le thumbnail
```

```gherkin
Given j'uploade une image de résolution inconnue
When l'image est traitée
Then elle est marquée comme "Unknown device"
And un warning s'affiche
And l'utilisateur peut choisir manuellement le device
```

### Mapping des résolutions

| Résolution | Device |
|------------|--------|
| 1290 x 2796 | iPhone 6.7" |
| 1242 x 2688 | iPhone 6.5" |
| 1242 x 2208 | iPhone 5.5" |
| 2048 x 2732 | iPad Pro 12.9" |
| 2048 x 2732 | iPad Pro 12.9" |

### Checklist technique

- [ ] Fonction detectDevice(width, height)
- [ ] Support portrait et landscape
- [ ] Badge device sur thumbnail
- [ ] Sélecteur manuel si non détecté
- [ ] Types TypeScript pour devices

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-3.1 (Upload)

## Definition of Done

- [ ] Détection correcte pour tous les formats Apple officiels
- [ ] Fallback pour formats inconnus
- [ ] Tests unitaires pour la fonction de détection
