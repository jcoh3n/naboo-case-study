# Naboo Case Study - Technical Project

Here's what we're ideally looking for:
- Code review: have a look through the existing codebase, highlight good practices and suggest areas for improvement.
- "Favorites" feature: allow a user to add an activity to their favorites, view them on their profile, and reorder them.
- "Debug" mode: display the creation date of activities on the cards, but only if the logged-in user is an admin.

---

## 🎯 3 Main Objectives

- [x] **Code Review** → Identify and fix existing problems
- [x] **Favorites System** → Allow adding, viewing and reordering favorites
- [x] **Admin Debug Mode** → Display creation dates for admins

---

## 🚨 CRITICAL FIXES (Resolved)

### [x] JWT Authentication Bug (BLOCKING)
- **Issue**: Frontend used localStorage but Apollo Client looked for cookies.
- **Impact**: Authentication probably wasn't working.
- **Solution**: Implemented consistent JWT authentication between frontend and backend.
- **Documentation**: See `back-end/src/auth/` and `front-end/src/contexts/authContext.tsx`.

---

### [x] Incomplete User Schema
- **Issue**: Missing `debugModeEnabled` and `favoriteActivities` fields.
- **Impact**: Runtime errors when code tried to use these fields.
- **Solution**: Added fields in `back-end/src/user/user.schema.ts` with GraphQL decorators.
- **Documentation**: See [ADMIN_DEBUG_README.md](./ADMIN_DEBUG_README.md) and [FAVORITES_README.md](./FAVORITES_README.md).

---

### [x] Inconsistent TypeScript Types
- **Issue**: `ContextWithJWTPayload` interface was incomplete.
- **Impact**: TypeScript compilation errors.
- **Solution**: Updated interface in `back-end/src/auth/types/context.ts`.
- **Documentation**: See typing files in `back-end/src/auth/types/`.

---

### [x] Environment Variables Configuration for Tests
- **Issue**: JWT and MongoDB variables were hardcoded in test modules.
- **Impact**: Difficult to manage different environments.
- **Solution**: Migration to `.env.test`. Variables are now loaded via this file.
- **Documentation**: See `back-end/.env.test` and `back-end/test/jest-e2e.json`.

---

## 🎯 NEW FEATURES IMPLEMENTED

### ✅ Complete Favorites System

#### Backend:
- [x] 4 new GraphQL mutations (`addToFavorites`, `removeFromFavorites`, `reorderFavorites`, `getFavorites`)
- [x] `FavoritesService` with business logic
- [x] `favoriteActivities` field in User schema

#### Frontend:
- [x] "♥" button on each activity card
- [x] "My Favorites" section in user profile
- [x] Drag & drop to reorder favorites
- [x] Corresponding GraphQL queries/mutations

📚 **Technical documentation**: [FAVORITES_README.md](./FAVORITES_README.md)

---

### ✅ Admin Debug Mode

#### Backend:
- [x] Conditional logic to expose `createdAt`
  - Only if `user.role === 'admin'` AND `user.debugModeEnabled === true`
- [x] `toggleDebugMode(enabled: Boolean!)` mutation to enable/disable mode

#### Frontend:
- [x] Toggle switch for admins (enable/disable debug)
- [x] Display creation dates on activity cards
- [x] Visible only when debug mode is enabled

📚 **Technical documentation**: [ADMIN_DEBUG_README.md](./ADMIN_DEBUG_README.md)

---

## 📋 DEVELOPMENT ORDER FOLLOWED

1. ✅ **Phase 1**: Critical fixes (otherwise nothing works)
2. ✅ **Phase 2**: Favorites system (more complex)
3. ✅ **Phase 3**: Debug admin mode (simpler)
4. ✅ **Phase 4**: Tests and optimizations

---

## 🧪 Tests

- ✅ Backend unit tests (`npm run test`)
- ✅ Frontend build successful (`npm run build`)
- ✅ Manual functional tests (add/remove/reorder favorites, debug mode)

---

## 🚀 Running the Project

### Backend
```bash
cd back-end
npm install
npm run start:dev
```

### Frontend
```bash
cd front-end
npm install
npm run dev
```

👉 **Default Accounts**:
- **User**: `user1@test.fr` / `user1`
- **Admin**: `admin@test.fr` / `admin123`

---

## 📚 Technical Documentation

- [FAVORITES_README.md](./FAVORITES_README.md) - Complete documentation of the favorites system
- [ADMIN_DEBUG_README.md](./ADMIN_DEBUG_README.md) - Complete documentation of the debug admin mode