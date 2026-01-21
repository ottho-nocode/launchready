# STORY-4.1: Créer les templates de device frames

## User Story

**En tant que** développeur,
**Je veux** des images de device frames (iPhone, iPad),
**Afin de** les utiliser comme base pour les mockups.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given le projet est configuré
When je charge un device frame depuis /templates/device-frames/
Then l'image est en haute résolution (PNG transparent)
And elle correspond aux dimensions exactes du device
And les variantes de couleur sont disponibles (noir, blanc)
```

### Assets requis

| Device | Couleurs | Résolution |
|--------|----------|------------|
| iPhone 14 Pro Max | black, white | 1290x2796 |
| iPhone 11 Pro Max | black, white | 1242x2688 |
| iPhone 8 Plus | black, white | 1242x2208 |
| iPad Pro 12.9" | black, white | 2048x2732 |

### Checklist technique

- [ ] Sourcer ou créer les device frames (PNG transparent)
- [ ] Organiser dans /templates/device-frames/
- [ ] Définir les constantes de position (inset, screen area)
- [ ] Fichier JSON de mapping device → frame
- [ ] Optimiser le poids des images

## Points

**5 points** (L)

## Priorité

**P0**

## Dépendances

- STORY-1.1 (projet initialisé)

## Notes techniques

Sources possibles pour device frames :
- Facebook Design (free)
- Mockup World
- Créés sur mesure si nécessaire

## Definition of Done

- [ ] Tous les device frames présents
- [ ] Toutes les couleurs disponibles
- [ ] JSON de mapping créé
- [ ] Images optimisées (< 500KB chaque)
