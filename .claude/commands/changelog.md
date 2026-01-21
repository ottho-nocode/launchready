---
description: Génère ou met à jour le CHANGELOG.md à partir des commits et issues GitHub. Usage: /changelog [version] [--since tag] [--format conventional|keep-a-changelog]
---

# Changelog Generator 📝

## Mode activé : Changelog

Je vais analyser les commits et issues pour générer un changelog structuré.

---

## 📥 Contexte chargé

```bash
# Dernier tag
!`git describe --tags --abbrev=0 2>/dev/null || echo "No tags"`

# Commits depuis le dernier tag
!`git log $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~20")..HEAD --oneline 2>/dev/null | head -30`

# CHANGELOG existant
!`head -50 CHANGELOG.md 2>/dev/null || echo "No CHANGELOG.md"`
```

---

## Arguments

| Argument          | Default        | Description                     |
| ----------------- | -------------- | ------------------------------- |
| `[version]`       | Auto-detect    | Version à générer (ex: `1.2.0`) |
| `--since <tag>`   | Dernier tag    | Depuis quel tag                 |
| `--format <type>` | `conventional` | Format du changelog             |
| `--dry-run`       | false          | Prévisualiser sans écrire       |

### Formats supportés

**conventional** (default) :

```markdown
## [1.2.0] - 2024-01-20

### Added

- feat(auth): add OAuth2 support (#123)

### Fixed

- fix(api): resolve timeout issue (#124)
```

**keep-a-changelog** :

```markdown
## [1.2.0] - 2024-01-20

### Added

- OAuth2 authentication support

### Fixed

- API timeout issue resolved
```

---

## Process

### 1. Analyse des commits

Je parse les commits avec le format Conventional Commits :

```
type(scope): description

Types reconnus:
- feat     → Added
- fix      → Fixed
- docs     → Documentation
- style    → (ignoré)
- refactor → Changed
- perf     → Performance
- test     → (ignoré sauf si significatif)
- chore    → (ignoré sauf breaking)
- revert   → Reverted
- BREAKING CHANGE → ⚠️ Breaking Changes
```

### 2. Récupération des issues/PRs

Pour chaque commit avec `#123` ou `Closes #123` :

- Récupérer le titre de l'issue/PR
- Ajouter le lien vers GitHub

### 3. Catégorisation

```markdown
### ⚠️ Breaking Changes

- Description du breaking change

### ✨ Added (feat)

- Nouvelles fonctionnalités

### 🐛 Fixed (fix)

- Corrections de bugs

### 🔄 Changed (refactor, perf)

- Modifications

### 📚 Documentation (docs)

- Mises à jour de documentation

### 🗑️ Deprecated

- Fonctionnalités dépréciées

### 🔒 Security

- Correctifs de sécurité
```

### 4. Génération du changelog

**⏸️ STOP** - Valider le changelog avant écriture

---

## Output Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD

### ⚠️ Breaking Changes

- **[BREAKING]** Description ([#123](link))

### ✨ Added

- feat(scope): description ([#123](link))

### 🐛 Fixed

- fix(scope): description ([#124](link))

### 🔄 Changed

- refactor(scope): description ([#125](link))

### 📚 Documentation

- docs: description ([#126](link))

### 🔒 Security

- security: description ([#127](link))

---

## [X.Y.Z-1] - YYYY-MM-DD

[Previous entries...]

---

[Unreleased]: https://github.com/owner/repo/compare/vX.Y.Z...HEAD
[X.Y.Z]: https://github.com/owner/repo/compare/vX.Y.Z-1...vX.Y.Z
[X.Y.Z-1]: https://github.com/owner/repo/releases/tag/vX.Y.Z-1
```

---

## Exemples

### Générer le changelog pour la prochaine version

```bash
/changelog 2.8.0
```

### Prévisualiser sans écrire

```bash
/changelog --dry-run
```

### Depuis un tag spécifique

```bash
/changelog 2.8.0 --since v2.7.0
```

### Format Keep a Changelog

```bash
/changelog --format keep-a-changelog
```

---

## Détection automatique de version

Si pas de version spécifiée, je détecte automatiquement :

| Commits                   | Version bump              |
| ------------------------- | ------------------------- |
| `BREAKING CHANGE` ou `!:` | **Major** (1.0.0 → 2.0.0) |
| `feat:`                   | **Minor** (1.0.0 → 1.1.0) |
| `fix:`, `docs:`, etc.     | **Patch** (1.0.0 → 1.0.1) |

---

## Intégration CI/CD

Pour générer automatiquement le changelog dans GitHub Actions :

```yaml
# .github/workflows/release.yml
- name: Generate changelog
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    output-file: 'CHANGELOG.md'
```

---

## Démarrage 🚀

**Arguments reçus :** $ARGUMENTS

Je vais maintenant :

1. Analyser les commits depuis le dernier tag
2. Récupérer les issues/PRs liées
3. Générer le changelog structuré
4. Te présenter pour validation

---

### Analyse en cours...
