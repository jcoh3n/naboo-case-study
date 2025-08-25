# 🎯 Système de Favoris - Documentation Technique

## 📋 Vue d'ensemble

Système de favoris complet permettant aux utilisateurs de sauvegarder et organiser leurs activités préférées. Intégration transparente dans l'écosystème Naboo.

## 🏗️ Architecture

### **Backend (NestJS)**
- **Module** : `FavoritesModule` avec service et resolver
- **Base de données** : Relation User ↔ Activity via `favoriteActivities[]`
- **API GraphQL** : Mutations (add/remove/reorder) + Queries (get/isFavorite)

### **Frontend (Next.js)**
- **Composants** : `FavoriteButton`, `FavoritesList`, `FavoritesCacheProvider`
- **Hooks** : `useFavoriteState`, `useFavoritesCache`
- **Cache** : État global centralisé pour cohérence des données

## 🔧 Implémentation

### **Structure des Fichiers**
```
back-end/src/favorites/
├── favorites.module.ts      # Module NestJS
├── favorites.service.ts     # Logique métier
└── favorites.resolver.ts    # API GraphQL

front-end/src/
├── components/
│   ├── FavoriteButton.tsx   # Bouton cœur réutilisable
│   ├── FavoritesList.tsx    # Liste des favoris
│   └── FavoritesCacheProvider.tsx # Cache global
├── hooks/
│   └── useFavoriteState.ts  # État individuel
└── graphql/
    └── favorites.ts         # Opérations GraphQL
```

### **Intégration**
- **Backend** : Auto-intégré via `app.module.ts`
- **Frontend** : Provider global dans `_app.tsx`
- **Composants** : Boutons sur toutes les cartes d'activités

## 📱 Interface Utilisateur

### **Design**
- **Couleurs** : Rouge (favoris), Rose (ville), Jaune (prix)
- **Responsive** : Adaptation mobile/tablet/desktop
- **Cohérence** : Intégration visuelle avec le thème existant

### **Fonctionnalités**
- Toggle favori sur toutes les cartes d'activités
- Section dédiée dans la page profil
- État persistant à travers l'application
- Notifications de succès/erreur

## 🔄 Flux de Données

```
User Action → GraphQL Mutation → Backend Service → Database
     ↓
Frontend Cache Update → UI Re-render → State Persistence
```

## 🚀 Installation

### **Dépendances**
```bash
# Frontend
npm install @mantine/notifications@6

# Backend
# Aucune installation supplémentaire requise
```

### **Configuration**
- **Backend** : Module auto-intégré
- **Frontend** : Provider dans `_app.tsx`
- **GraphQL** : Types auto-générés via codegen

## 🧪 Tests

### **Backend**
- ✅ Service FavoritesService
- ✅ Resolver GraphQL
- ✅ Intégration User/Activity

### **Frontend**
- ✅ Composants UI
- ✅ Hooks personnalisés
- ✅ Cache et état global

## 🔮 Évolutions

- **Phase 2.1** : Drag & Drop pour réorganisation
- **Phase 2.2** : Collections personnalisées
- **Phase 2.3** : Synchronisation multi-appareils

## 📚 Références

### **Fichiers Clés**
- `back-end/src/favorites/` : API et logique
- `front-end/src/components/FavoriteButton.tsx` : Composant principal
- `front-end/src/hooks/useFavoriteState.ts` : Gestion d'état
- `front-end/src/graphql/favorites.ts` : Opérations GraphQL

### **Dépendances**
- **Backend** : `@nestjs/mongoose`, `@nestjs/graphql`
- **Frontend** : `@mantine/core`, `@apollo/client`

---

**Version** : 0.1 **Dernière mise à jour** : Aout 2025
