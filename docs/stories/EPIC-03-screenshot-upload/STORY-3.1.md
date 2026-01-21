# STORY-3.1: Créer la zone de drag & drop

## User Story

**En tant qu'** utilisateur,
**Je veux** déposer mes screenshots par drag & drop,
**Afin de** les uploader facilement.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given je suis sur la page de génération
When je fais glisser des images sur la zone de drop
Then la zone s'illumine pour indiquer qu'elle accepte le drop
And les images sont ajoutées après le drop
And je vois un thumbnail pour chaque image
```

```gherkin
Given je clique sur la zone de drop
When le dialogue de fichier s'ouvre
Then je peux sélectionner plusieurs images
And elles sont ajoutées après sélection
```

```gherkin
Given j'essaie d'uploader un fichier non-image
When je drop le fichier
Then un message d'erreur s'affiche
And le fichier est rejeté
```

### Checklist technique

- [ ] Composant Dropzone avec react-dropzone
- [ ] Accept uniquement PNG/JPEG
- [ ] Limite de 10 images max
- [ ] Limite de 10MB par image
- [ ] Feedback visuel au hover/drag
- [ ] Gestion des erreurs (type, taille)
- [ ] Preview thumbnail instantané

## Points

**3 points** (M)

## Priorité

**P0**

## Dépendances

- STORY-1.3 (Store)

## Definition of Done

- [ ] Drag & drop fonctionnel
- [ ] Click to upload fonctionnel
- [ ] Validation des fichiers
- [ ] Thumbnails affichés
