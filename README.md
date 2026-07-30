# Quranic Bloom

Crée un site web moderne d'apprentissage et de révision du Coran

Je veux un site web complet, moderne, responsive et très fluide, avec un design épuré (vert, blanc, noir, doré), inspiré des applications premium.

Objectif

Aider l'utilisateur à mémoriser le Coran, suivre sa progression, planifier ses révisions et s'entraîner grâce à des défis intelligents.

Tableau de bord

Afficher :

Progression globale (% du Coran appris)

Nombre de sourates commencées

Nombre de versets mémorisés

Série de jours d'apprentissage (streak)

Temps passé aujourd'hui

Objectifs du jour

Barre de progression

Suivi des sourates

Liste complète des 114 sourates.

Pour chaque sourate :

Nom arabe

Nom français

Nombre de versets

Barre de progression

Dernier verset appris

Dernière révision

Statut :

Non commencée

En cours

Terminée

Exemple :

Sourate 100

Nombre de versets : 11

Progression :

Versets 1 → 7 appris

Je suis actuellement au verset 8

Une barre montre la progression.

Pour une autre sourate :

Sourate 2

286 versets

Progression :

Je suis arrivé au verset 25.

Marquer les versets appris

Chaque verset possède une case.

Je peux cliquer :

✅ appris

🔄 à réviser

❌ pas encore appris

Le site sauvegarde automatiquement.

To-do quotidien

Je peux créer mes tâches.

Exemple :

Apprendre les versets 26 à 35 de la sourate 2

Réviser le Juzz 30

Réviser la sourate Al-Mulk

Réviser les sourates apprises cette semaine

Les tâches peuvent être cochées.

Afficher une progression quotidienne.

Gestion des Juzz

Afficher les 30 Juzz.

Pour chacun :

Progression

Dernière révision

Niveau de maîtrise

Calendrier de révision

Créer automatiquement des révisions selon la répétition espacée.

Par exemple :

Aujourd'hui :

Sourate 67

Juzz 30

Sourate 2 versets 1 à 25

Demain :

Sourate 36

Sourate 55

Le calendrier s'adapte selon les apprentissages.

Défis (Gamification)

Créer plusieurs modes.

Défi 1 : Trouver la suite

Le site affiche un verset.

L'utilisateur doit réciter ou écrire le verset suivant.

Puis le site affiche la correction.

Défi 2 : Retrouver la sourate

Le site affiche un verset aléatoire.

L'utilisateur doit répondre :

Nom de la sourate

Numéro de la sourate

Défi 3 : Les 5 versets suivants

Le site affiche un verset.

L'utilisateur doit réciter les 5 versets qui suivent.

Défi 4 : Compléter le verset

Le site masque plusieurs mots.

Exemple :

"Bismillahi ____ Ar-Rahim"

L'utilisateur complète.

Défi 5 : Quel est le verset précédent ?

Le site affiche un verset.

L'utilisateur doit dire celui juste avant.

Défi 6 : Quel est le numéro ?

Le site affiche un verset.

L'utilisateur répond :

Numéro du verset

Numéro de la sourate

Défi 7 : Difficulté Facile

Le site affiche :

Le verset

Son numéro

Le nom de la sourate

Il faut réciter la suite.

Défi 8 : Difficulté Moyenne

Le site affiche uniquement :

Le verset

L'utilisateur doit trouver :

La sourate

Le numéro

Puis réciter la suite.

Défi 9 : Difficulté Difficile

Le site affiche uniquement un verset.

Aucune indication.

L'utilisateur doit :

Trouver la sourate

Trouver le numéro

Donner les 5 versets suivants.

Défi 10 : Défi Chrono

60 secondes.

Répondre au maximum de questions.

Score final.

Classement personnel.

Statistiques

Afficher :

Nombre total de versets appris

Nombre de sourates terminées

Temps d'étude

Révisions effectuées

Défis réussis

Pourcentage de réussite

Historique quotidien

Graphiques d'évolution

Profil

Afficher :

Niveau

XP

Badges

Série de jours

Objectif hebdomadaire

Objectif mensuel

Exemples de badges :

Première sourate terminée

100 versets appris

1000 révisions

30 jours de suite

Juzz terminé

Notifications

Le site rappelle :

Les révisions du jour

Les tâches non terminées

Les nouveaux objectifs

Recherche

Permet de rechercher :

Une sourate

Un verset

Un mot

Sauvegarde

Toutes les données sont enregistrées automatiquement.

Possibilité d'exporter et d'importer les données.

Technologies

Utiliser :

React

Next.js

TypeScript

Tailwind CSS

Framer Motion

Firebase ou Supabase pour l'authentification et la base de données

PWA pour fonctionner comme une application mobile

Mode sombre et mode clair

Créer une interface premium, rapide, intuitive, avec de belles animations, des cartes modernes, des graphiques et une excellente expérience utilisateur.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://quran-path-master.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e3b4ada0-ae02-450e-a910-0d90acb5ff06).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
