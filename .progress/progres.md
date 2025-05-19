# Résumé de la progression du projet Invoify

## 1. Structure du projet
- Mise en place d'une architecture Next.js avec une organisation claire des dossiers (`app/`, `components/`, `services/`, `contexts/`, `hooks/`, `lib/`, `public/`, etc.).
- Ajout de la gestion multilingue avec des fichiers de traduction dans `i18n/locales/`.
- Intégration de Tailwind CSS pour le style et la personnalisation de l'interface.

## 2. Fonctionnalités principales
- Création de composants réutilisables pour l'UI (boutons, formulaires, dialogues, etc.).
- Développement de la gestion des factures (création, export, génération PDF, envoi par email).
- Mise en place de contextes React pour la gestion des données (factures, signatures, thèmes, etc.).

## 3. Génération de PDF
- Intégration de Puppeteer pour la génération de PDF à partir des factures.
- Gestion des erreurs liées à l'installation de Chrome pour Puppeteer et configuration du cache.

## 4. Personnalisation
- Ajout de la possibilité de personnaliser les templates de factures et d'emails.
- Documentation sur la personnalisation dans les fichiers dédiés.

## 5. Problèmes rencontrés
- Problèmes de dépendances critiques avec `yargs` lors de l'import de Puppeteer.
- Erreurs liées à l'absence de Chrome pour Puppeteer, nécessitant une installation manuelle ou une configuration du cache.

## 6. Documentation
- Rédaction de plusieurs fichiers de documentation pour expliquer le fonctionnement, la personnalisation et l'architecture du projet.

---

Ce fichier sera mis à jour au fur et à mesure de l'avancement du projet.
