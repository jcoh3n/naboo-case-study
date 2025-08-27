# Favorites Feature - Technical Documentation

This document provides a comprehensive technical overview of the **Favorites System**, covering both backend and frontend implementations, architecture, and integration details.

---

## Overview

The Favorites feature allows users to:

- Add or remove activities from their favorites list.
- View their favorite activities in their profile.
- Reorder favorites using drag-and-drop.

The implementation is full-stack, leveraging MongoDB for persistence, NestJS for the backend API, and Next.js with Apollo Client for the frontend.

---

## Backend Implementation

### Architecture

- **Module**: `FavoritesModule`
- **Service**: `FavoritesService` – Handles business logic.
- **Resolver**: `FavoritesResolver` – Exposes GraphQL API.
- **Data Model**: `User.favoriteActivities` (array of ObjectIds in MongoDB).

### FavoritesService

Core methods:

```ts
addToFavorites(userId: string, activityId: string): Promise<User>
removeFromFavorites(userId: string, activityId: string): Promise<User>
reorderFavorites(userId: string, activityIds: string[]): Promise<User>
getFavorites(userId: string): Promise<Activity[]>
isFavorite(userId: string, activityId: string): Promise<boolean>
```

**Key Features**:
- Validates user and activity existence.
- Prevents duplicate additions.
- Ensures activity exists before removal.
- Validates order consistency during reordering.

### FavoritesResolver

GraphQL API with JWT authentication:

```graphql
type Mutation {
  addToFavorites(activityId: String!): User!
  removeFromFavorites(activityId: String!): User!
  reorderFavorites(activityIds: [String!]!): User!
}

type Query {
  getFavorites: [Activity!]!
  isFavorite(activityId: String!): Boolean!
}
```

**Security**:
- All mutations are protected with `AuthGuard`.
- User context is extracted from JWT.

### Data Model

```ts
// user.schema.ts
@Field(() => [Activity], { nullable: true })
@Prop({ type: [{ type: 'ObjectId', ref: 'Activity' }], default: [] })
favoriteActivities?: Activity[];
```

---

## Frontend Implementation

### Components

- **`FavoriteButton`**:
  - Toggle button (♥) for adding/removing favorites.
  - Displays loading state during mutations.
  - Uses `useFavoriteState` hook for individual state management.

- **`FavoritesList`**:
  - Displays user's favorites.
  - Implements drag-and-drop reordering using `@dnd-kit`.
  - Uses `SortableContext` and `useSortable` for smooth UX.

- **`FavoritesCacheProvider`**:
  - Global context provider for favorites state.
  - Syncs with Apollo Client cache.
  - Provides `favorites`, `favoriteIds`, and `isLoading` to children.

### Hooks

- **`useFavoriteState(activityId: string)`**:
  - Returns `{ isFavorite, isLoading, refetch }`.
  - Centralized state for individual favorite buttons.

### GraphQL Operations

#### Mutations

```ts
// addToFavorites
mutation AddToFavorites($activityId: String!) {
  addToFavorites(activityId: $activityId) {
    id
    favoriteActivities { ...ActivityFragment }
  }
}

// removeFromFavorites
mutation RemoveFromFavorites($activityId: String!) {
  removeFromFavorites(activityId: $activityId) {
    id
    favoriteActivities { ...ActivityFragment }
  }
}

// reorderFavorites
mutation ReorderFavorites($activityIds: [String!]!) {
  reorderFavorites(activityIds: $activityIds) {
    id
    favoriteActivities { ...ActivityFragment }
  }
}
```

#### Queries

```ts
// getFavorites
query GetFavorites {
  getFavorites { ...ActivityFragment }
}

// isFavorite
query IsFavorite($activityId: String!) {
  isFavorite(activityId: $activityId)
}
```

---

## Integration

### Backend

- Automatically registered in `AppModule`.
- Requires `UserService` for user validation.

### Frontend

- Wrap `_app.tsx` with `FavoritesCacheProvider`.
- Use `FavoriteButton` on activity cards.
- Display `FavoritesList` in `/profil`.

---

## User Experience

- **Toggle Feedback**: Instant visual feedback (♥ icon changes).
- **Reordering**: Drag-and-drop with smooth animations.
- **Notifications**: Success/error messages via Mantine notifications.
- **Loading States**: Buttons disabled during API calls.
- **Responsive Design**: Works on mobile, tablet, and desktop.

---

## Data Flow

1. **User Action** (click/drag)
2. **GraphQL Mutation** sent to backend
3. **Database Update** in MongoDB
4. **Cache Synchronization** in Apollo Client
5. **UI Re-render** across all components
6. **User Notification** (success/error)

---

## Testing

### Backend

- Unit tests for `FavoritesService`.
- Integration tests for `FavoritesResolver`.
- E2E tests covering full CRUD scenarios.

### Frontend

- Component tests for `FavoriteButton`, `FavoritesList`.
- Hook tests for `useFavoriteState`.
- Cypress E2E tests for user workflows.

---

## Dependencies

### Backend

```json
{
  "@nestjs/mongoose": "^10.0.0",
  "@nestjs/graphql": "^12.0.0",
  "mongoose": "^7.0.0"
}
```

### Frontend

```json
{
  "@apollo/client": "^3.8.0",
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/sortable": "^7.0.0",
  "@mantine/core": "^6.0.0",
  "@mantine/notifications": "^6.0.0"
}
```

---

## Future Improvements

- **Custom Collections**: Group favorites by themes.
- **Sharing**: Public links to favorite lists.
- **Recommendations**: AI-powered suggestions based on favorites.

---

## Key Files

```
📂 Backend
├── src/favorites/favorites.service.ts
├── src/favorites/favorites.resolver.ts
├── src/favorites/favorites.module.ts
└── src/user/user.schema.ts

📂 Frontend
├── components/FavoriteButton.tsx
├── components/FavoritesList.tsx
├── components/FavoritesCacheProvider.tsx
├── hooks/useFavoriteState.ts
└── graphql/favorites.ts
```