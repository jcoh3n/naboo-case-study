# 🎯 Système de Favoris - Documentation Technique Complète

## 📋 Vue d'ensemble

Système de favoris complet permettant aux utilisateurs de sauvegarder, organiser et réorganiser leurs activités préférées. Implémentation full-stack avec drag & drop, cache intelligent et interface utilisateur intuitive.

### **Fonctionnalités Principales**
- ✅ **Ajout/Suppression** : Toggle instantané avec feedback visuel
- ✅ **Réorganisation** : Drag & drop pour personnaliser l'ordre
- ✅ **Cache intelligent** : Synchronisation temps réel entre composants
- ✅ **Interface responsive** : Adaptation mobile/tablet/desktop
- ✅ **Notifications** : Feedback utilisateur pour chaque action

## 🏗️ Architecture Technique

### **Backend (NestJS + MongoDB)**
```
FavoritesModule
├── FavoritesService     # Logique métier et validation
├── FavoritesResolver    # API GraphQL avec authentification
└── Intégration         # User.favoriteActivities[] (MongoDB)
```

### **Frontend (Next.js + Apollo Client)**
```
Système de Favoris
├── FavoriteButton       # Composant cœur réutilisable
├── FavoritesList        # Liste avec drag & drop
├── FavoritesCacheProvider # Cache global Apollo
├── useFavoriteState     # Hook état individuel
└── GraphQL Operations   # Mutations et queries typées
```

## 🔧 Implémentation Détaillée

### **1. Backend - API GraphQL & Logique Métier**

#### **FavoritesService** (`favorites.service.ts`)
Service principal gérant toute la logique métier des favoris :

```typescript
// Méthodes principales
addToFavorites(userId, activityId)     // Ajouter aux favoris
removeFromFavorites(userId, activityId) // Retirer des favoris  
reorderFavorites(userId, activityIds)   // Réorganiser l'ordre
getFavorites(userId)                    // Récupérer la liste
isFavorite(userId, activityId)          // Vérifier le statut
```

**Validations automatiques** :
- ✅ Vérification existence utilisateur/activité
- ✅ Prévention doublons (ajout)
- ✅ Vérification présence (suppression)
- ✅ Validation cohérence (réorganisation)

#### **FavoritesResolver** (`favorites.resolver.ts`)
API GraphQL sécurisée avec authentification JWT :

```typescript
@Mutation(() => User)
addToFavorites(@Args('activityId') activityId: string)

@Mutation(() => User) 
removeFromFavorites(@Args('activityId') activityId: string)

@Mutation(() => User)
reorderFavorites(@Args('activityIds', {type: () => [String]}) activityIds: string[])

@Query(() => [Activity])
getFavorites() // Retourne les activités complètes

@Query(() => Boolean)
isFavorite(@Args('activityId') activityId: string)
```

#### **Modèle de Données**
```typescript
// Schema User (user.schema.ts)
@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
favoriteActivities: Activity[]; // Array ordonné d'ObjectIds
```

### **2. Frontend - Interface & Gestion d'État**

#### **FavoriteButton** - Composant Cœur
Bouton cœur intelligent avec états visuels :

```typescript
interface FavoriteButtonProps {
  activityId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onFavoriteChange?: (isFavorite: boolean) => void;
}
```

**Fonctionnalités** :
- 🎨 Animation hover (scale 1.1)
- 🔄 États de chargement
- 💝 Icônes adaptatives (heart/heart-filled)
- 🎯 Tooltips contextuels
- 📢 Notifications success/error

#### **FavoritesList** - Liste avec Drag & Drop
Composant avancé utilisant `@dnd-kit` :

```typescript
// Fonctionnalités principales
- Drag & Drop avec @dnd-kit/core
- Cartes responsives avec effet hover
- Prévention navigation pendant drag
- Animations fluides (cubic-bezier)
- Gestion états visuels (dragging/idle)
```

**Gestion du Drag & Drop** :
```typescript
const handleDragEnd = (event) => {
  const {active, over} = event;
  if (active.id !== over?.id) {
    const newOrder = arrayMove(favorites, oldIndex, newIndex);
    const newOrderIds = newOrder.map(fav => fav.id);
    reorderFavorites({ variables: { activityIds: newOrderIds } });
  }
};
```

#### **FavoritesCacheProvider** - Cache Global
Provider de contexte pour synchronisation globale :

```typescript
interface FavoritesCacheContextType {
  favorites: Activity[];      // Activités complètes
  favoriteIds: string[];     // IDs pour vérifications rapides
  isLoading: boolean;        // État de chargement
  refetch: () => void;       // Re-synchronisation
}
```

**Stratégie de Cache** :
- 📡 `fetchPolicy: 'cache-and-network'`
- 🔄 Auto-refetch après mutations
- ⚡ Accès instantané via Context API

#### **useFavoriteState** - Hook État Individuel
Hook optimisé pour composants individuels :

```typescript
const { isFavorite, isLoading, refetch } = useFavoriteState(activityId);
```

### **3. Opérations GraphQL**

#### **Mutations**
```graphql
# Ajouter aux favoris
mutation AddToFavorites($activityId: String!) {
  addToFavorites(activityId: $activityId) {
    id
    favoriteActivities { ...ActivityFragment }
  }
}

# Retirer des favoris  
mutation RemoveFromFavorites($activityId: String!) {
  removeFromFavorites(activityId: $activityId) {
    id
    favoriteActivities { ...ActivityFragment }
  }
}

# Réorganiser les favoris
mutation ReorderFavorites($activityIds: [String!]!) {
  reorderFavorites(activityIds: $activityIds) {
    id
    favoriteActivities { ...ActivityFragment }
  }
}
```

#### **Queries**
```graphql
# Récupérer tous les favoris
query GetFavorites {
  getFavorites { ...ActivityFragment }
}

# Vérifier si favori
query IsFavorite($activityId: String!) {
  isFavorite(activityId: $activityId)
}
```

### **4. Intégration dans l'Application**

#### **Points d'Intégration**
- 🔗 **Backend** : Auto-importé dans `app.module.ts`
- 🔗 **Frontend** : Provider dans `_app.tsx`
- 🔗 **Composants** : Boutons sur toutes les cartes d'activités
- 🔗 **Pages** : Section dédiée dans le profil utilisateur

## 📱 Interface Utilisateur & UX

### **Design System**
- 🎨 **Couleurs** : Rouge (#ff5252) pour favoris, transitions fluides
- 📱 **Responsive** : Adaptation mobile/tablet/desktop automatique
- 🎯 **Cohérence** : Intégration parfaite avec le thème Mantine existant
- ✨ **Animations** : Micro-interactions pour feedback utilisateur

### **Expérience Utilisateur**
- 💖 **Toggle Instantané** : Feedback immédiat sur clic
- 🎯 **Drag & Drop** : Réorganisation intuitive par glisser-déposer
- 🔔 **Notifications** : Confirmation success/error avec Mantine
- 🔄 **États de Chargement** : Spinners pendant les opérations
- 🚫 **Prévention Erreurs** : Désactivation pendant les actions

### **Points d'Accès**
- 📍 Bouton cœur sur chaque carte d'activité
- 📋 Section dédiée "Mes Favoris" dans le profil
- 🔄 Synchronisation instantanée entre tous les composants

## 🔄 Flux de Données Détaillé

### **Architecture de l'Information**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  GraphQL Client  │───▶│   Backend API   │
│  (Click/Drag)   │    │   (Apollo)       │    │   (NestJS)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        │                        │
         │                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Update     │◀───│  Cache Update    │◀───│   Database      │
│ (Re-render)     │    │  (Apollo Cache)  │    │   (MongoDB)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Cycle de Vie d'une Action**

#### **1. Ajout aux Favoris**
```typescript
1. Clic sur FavoriteButton (état: false → loading)
2. Mutation addToFavorites envoyée
3. Backend: validation + ajout en base
4. Response: User avec favoriteActivities mis à jour
5. Cache Apollo mis à jour automatiquement
6. Re-render de tous les composants concernés
7. Notification success + état final (loading → true)
```

#### **2. Réorganisation (Drag & Drop)**
```typescript
1. Drag start: état visuel "dragging"
2. Drag end: calcul nouvel ordre (arrayMove)
3. Mutation reorderFavorites avec nouveaux IDs
4. Backend: validation cohérence + mise à jour
5. Cache synchronisé avec nouvel ordre
6. UI mise à jour avec nouvel arrangement
7. Notification success + retour état normal
```

### **Gestion d'État Optimisée**
- 🏪 **Cache Centralisé** : Apollo Cache comme source unique de vérité
- ⚡ **Optimistic Updates** : UI mise à jour avant confirmation serveur
- 🔄 **Auto-Refetch** : Re-synchronisation après chaque mutation
- 📦 **Context Provider** : Distribution efficace des données

## 🚀 Installation & Configuration

### **Dépendances Requises**
```bash
# Frontend - Dépendances principales
npm install @mantine/core @mantine/notifications @apollo/client
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @tabler/icons-react

# Backend - Déjà incluses dans NestJS
@nestjs/mongoose @nestjs/graphql mongoose
```

### **Configuration Étape par Étape**

#### **1. Backend Setup**
```typescript
// app.module.ts - Auto-intégration
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    // ... autres modules
    FavoritesModule, // ← Ajouté automatiquement
  ],
})
export class AppModule {}
```

#### **2. Frontend Setup**
```typescript
// _app.tsx - Provider global
import { FavoritesCacheProvider } from '../components/FavoritesCacheProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <FavoritesCacheProvider> {/* ← Cache global favoris */}
          <Component {...pageProps} />
        </FavoritesCacheProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
```

#### **3. Utilisation dans Composants**
```typescript
// Exemple d'intégration dans une carte d'activité
import { FavoriteButton } from '../components/FavoriteButton';

const ActivityCard = ({ activity }) => (
  <Card>
    <FavoriteButton 
      activityId={activity.id} 
      size="md"
      onFavoriteChange={(isFavorite) => console.log('Favori:', isFavorite)}
    />
    {/* ... reste du contenu */}
  </Card>
);
```

## 🧪 Tests & Validation

### **Backend - Tests Unitaires**
```bash
# Tests du service
npm run test -- favorites.service.spec.ts

# Tests d'intégration
npm run test:e2e -- favorites
```

**Couverture** :
- ✅ **FavoritesService** : Toutes les méthodes CRUD
- ✅ **FavoritesResolver** : Mutations et queries GraphQL  
- ✅ **Validations** : Gestion erreurs et edge cases
- ✅ **Authentification** : Sécurité JWT sur toutes les routes

### **Frontend - Tests Composants**
```bash
# Tests unitaires composants
npm run test -- FavoriteButton.test.tsx
npm run test -- useFavoriteState.test.ts

# Tests d'intégration
npm run test -- FavoritesList.test.tsx
```

**Couverture** :
- ✅ **FavoriteButton** : États, interactions, animations
- ✅ **FavoritesList** : Drag & drop, réorganisation
- ✅ **Hooks** : Logique métier et cache
- ✅ **Cache Provider** : Synchronisation globale

### **Tests E2E (Cypress)**
```typescript
// Scénarios testés
describe('Favorites System', () => {
  it('should add/remove favorites', () => { /* ... */ });
  it('should reorder favorites with drag & drop', () => { /* ... */ });
  it('should sync across components', () => { /* ... */ });
});
```

## 🔮 Roadmap & Évolutions

### **Phase 1 - ✅ Complétée**
- [x] CRUD complet (Add/Remove/Reorder)
- [x] Interface drag & drop
- [x] Cache intelligent Apollo
- [x] Notifications utilisateur
- [x] Tests complets

### **Phase 2 - 🚧 En Cours**
- [ ] **Collections Personnalisées** : Organiser par thèmes
- [ ] **Partage de Favoris** : URLs publiques
- [ ] **Recommandations** : IA basée sur favoris

### **Phase 3 - 🔮 Futur**
- [ ] **Synchronisation Multi-Appareils** : Cloud sync
- [ ] **Favoris Collaboratifs** : Listes partagées
- [ ] **Analytics** : Statistiques d'usage

## 📚 Documentation Technique

### **Architecture Patterns Utilisés**
- 🏗️ **Repository Pattern** : Service layer pour logique métier
- 🎯 **Observer Pattern** : Cache réactif Apollo
- 🔄 **Command Pattern** : Mutations GraphQL
- 📦 **Provider Pattern** : Context API pour état global

### **Fichiers Sources Clés**
```
📂 Backend
├── src/favorites/favorites.service.ts     # Logique métier CRUD
├── src/favorites/favorites.resolver.ts    # API GraphQL sécurisée  
├── src/favorites/favorites.module.ts      # Configuration module
└── src/user/user.schema.ts               # Modèle données (favoriteActivities[])

📂 Frontend  
├── components/FavoriteButton.tsx          # Bouton cœur réutilisable
├── components/FavoritesList.tsx           # Liste drag & drop
├── components/FavoritesCacheProvider.tsx  # Provider cache global
├── hooks/useFavoriteState.ts             # Hook état individuel
└── graphql/favorites.ts                  # Opérations GraphQL typées
```

### **Dépendances Techniques**
```json
{
  "backend": {
    "@nestjs/mongoose": "^10.0.0",
    "@nestjs/graphql": "^12.0.0", 
    "mongoose": "^7.0.0"
  },
  "frontend": {
    "@mantine/core": "^6.0.0",
    "@mantine/notifications": "^6.0.0",
    "@apollo/client": "^3.8.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0"
  }
}
```

---

**Version** : 2.0 | **Dernière mise à jour** : Décembre 2024 | **Auteur** : Équipe Naboo
