# STORY-2.4: Ajouter la régénération par champ

## User Story

**En tant qu'** utilisateur,
**Je veux** régénérer un seul champ sans tout refaire,
**Afin de** obtenir une alternative si le texte ne me convient pas.

## Critères d'acceptance

### Given/When/Then

```gherkin
Given les textes sont générés
When je clique sur "Régénérer" à côté du champ "Nom"
Then seul ce champ est regénéré
And les autres champs restent inchangés
And un loader s'affiche sur ce champ uniquement
And le nouveau texte remplace l'ancien
```

### Checklist technique

- [ ] Bouton "Régénérer" par champ
- [ ] API call ciblé (ou réutilisation avec param)
- [ ] Loading state par champ
- [ ] Animation de remplacement
- [ ] Historique des versions (optionnel)

## Points

**3 points** (M)

## Priorité

**P1** - Enhancement

## Dépendances

- STORY-2.2 (API génération)
- STORY-2.3 (Affichage textes)

## Definition of Done

- [ ] Régénération fonctionne pour chaque champ
- [ ] UX claire (loading visible)
- [ ] Pas de perte des autres champs
