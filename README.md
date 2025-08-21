Here’s what we’re ideally looking for:
Code review: have a look through the existing codebase, highlight good practices and suggest areas for improvement.
“Favourites” feature: allow a user to add an activity to their favourites, view them on their profile, and reorder them.
“Debug” mode: display the creation date of activities on the cards, but only if the logged-in user is an admin.

Voici le récapitulatif complet de tout ce qu'il faut faire selon les demandes du sujet :
🎯 3 Objectifs Principaux

Code Review → Identifier et corriger les problèmes existants
Système de Favoris → Permettre d'ajouter, voir et réorganiser les favoris
Mode Debug Admin → Afficher les dates de création pour les admins

🚨 CORRECTIONS CRITIQUES (À faire en PREMIER)
1. Bug Authentification JWT (BLOQUANT)

Le frontend utilise localStorage mais Apollo Client cherche des cookies
Impact : L'authentification ne fonctionne probablement pas

2. Schéma User Incomplet

Champs debugModeEnabled et favoriteActivities manquants
Impact : Erreurs runtime quand le code essaie d'utiliser ces champs

3. Types TypeScript Incohérents

Interface ContextWithJWTPayload incomplète
Impact : Erreurs de compilation TypeScript

🎯 NOUVELLES FONCTIONNALITÉS À IMPLÉMENTER
Système de Favoris Complet
Backend :

4 nouvelles mutations GraphQL (add/remove/reorder/get favoris)
Service FavoritesService avec logique métier
Champs dans le schéma User pour stocker les favoris

Frontend :

Bouton "♥" sur chaque carte d'activité
Section "Mes Favoris" dans le profil utilisateur
Drag & drop pour réorganiser les favoris
Queries/mutations GraphQL correspondantes

Mode Debug Admin
Backend :

Logique conditionnelle pour exposer createdAt
Seulement si user.role === 'admin' ET user.debugModeEnabled
Mutation pour toggle le mode debug

Frontend :

Toggle switch pour les admins (activer/désactiver debug)
Affichage des dates de création sur les cartes d'activités
Visible uniquement en mode debug activé

📋 ORDRE DE DÉVELOPPEMENT

Phase 1 : Corrections critiques (sinon rien ne marche)
Phase 2 : Système de favoris (plus complexe)
Phase 3 : Mode debug admin (plus simple)
Phase 4 : Tests et optimisations

💻 Estimation de Travail

Corrections critiques : ~4h
Système favoris : ~8h (backend + frontend + UI)
Mode debug admin : ~3h
Tests & finition : ~3h

Total estimé : ~18h de développement