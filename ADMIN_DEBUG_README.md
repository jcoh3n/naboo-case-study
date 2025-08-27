# Admin Debug Mode Feature

This feature allows administrators to view additional information about activities, specifically the **creation date** (`createdAt`). This information is only visible to users with the `admin` role and only when the debug mode is enabled.

---

## Objective

To conditionally expose the `createdAt` field of activities in the GraphQL schema and UI based on the user's role and debug mode status.

---

## Implementation Overview

### Backend

- **User Schema**:
  - Added `role` field with `@Field()` decorator to expose it in GraphQL.
  - Added `debugModeEnabled` field to track debug mode status.

- **Activity Resolver**:
  - Implemented a `ResolveField` for `createdAt` that checks:
    - User is authenticated.
    - User has `role === 'admin'`.
    - User has `debugModeEnabled === true`.
  - If all conditions are met, the `createdAt` date is returned; otherwise, `undefined`.

- **GraphQL Mutation**:
  - Added `toggleDebugMode(enabled: Boolean!)` mutation to allow admins to enable/disable debug mode.
  - Mutation is protected and only accessible to admins.

- **Seeding**:
  - The application automatically creates two default users on startup:
    - Regular user: `user1@test.fr` / `user1`
    - Admin user: `admin@test.fr` / `admin123`

---

### Frontend

- **DebugModeToggle Component**:
  - A toggle switch displayed only to admin users.
  - Sends a GraphQL mutation to update the user's `debugModeEnabled` status.
  - Updates the local user context to reflect the change.

- **Conditional Display**:
  - In `Activity` and `ActivityListItem` components, the `createdAt` date is displayed only if:
    - The current user is an admin.
    - The debug mode is enabled.
  - The date is formatted for better readability.

- **Affected Pages**:
  - `/profil`: Toggle switch in the user profile section.
  - `/discover`: Toggle at the top of the page.
  - `/my-activities`: Toggle at the top of the page.
  - `/activities/[id]`: Creation date displayed in the activity detail view.

---

## Testing

### Prerequisites

- Backend and frontend servers are running.
- MongoDB is accessible.

### Steps

1. **Login as Admin**:
   - Use credentials: `admin@test.fr` / `admin123`.

2. **Enable Debug Mode**:
   - Navigate to `/profil`.
   - Toggle the "Debug Mode" switch to "On".

3. **Verify Functionality**:
   - Go to `/discover` or `/my-activities`.
   - Observe that creation dates are now visible on activity cards.
   - Disable debug mode and verify that dates are hidden.

4. **Regular User Test**:
   - Login as `user1@test.fr` / `user1`.
   - Verify that the debug toggle is not visible and dates are never shown.

---

## GraphQL API

### Queries

```graphql
query GetMe {
  getMe {
    id
    firstName
    lastName
    email
    role
    debugModeEnabled
  }
}
```

### Mutations

```graphql
mutation ToggleDebugMode($input: ToggleDebugModeInput!) {
  toggleDebugMode(toggleDebugModeInput: $input) {
    id
    debugModeEnabled
  }
}
```

---

## Code Structure

### Backend

- `src/user/user.schema.ts`: Updated to expose `role` in GraphQL.
- `src/activity/activity.resolver.ts`: Added conditional `createdAt` resolver and `toggleDebugMode` mutation.
- `src/seed/seed.service.ts`: Handles automatic creation of default users.

### Frontend

- `src/components/Debug/DebugModeToggle.tsx`: Toggle component for admins.
- `src/components/Activity.tsx` & `src/components/ActivityListItem.tsx`: Conditional display of `createdAt`.
- `src/pages/profil.tsx`, `src/pages/discover.tsx`, etc.: Integration of the toggle component.
- `src/graphql/queries/auth/getUser.ts`: Updated to fetch `role` and `debugModeEnabled`.
- `src/graphql/mutations/debug/toggleDebugMode.ts`: GraphQL mutation for toggling debug mode.

---

## Security Considerations

- The `createdAt` field is **never exposed** to non-admin users.
- The `toggleDebugMode` mutation is **protected** and only accessible to admins.
- Debug mode is **user-specific** and stored in the database.

---

## Future Improvements

- Add audit logs for when debug mode is toggled.
- Extend debug mode to show more technical information (e.g., activity ID, owner details).