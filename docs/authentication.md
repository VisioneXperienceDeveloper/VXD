# Authentication

The monorepo uses a unified authentication strategy, primarily powered by **Clerk** and integrated with **Convex**.

## Identity Providers

- **Clerk**: Handles user sign-up, sign-in, and session management.
- **Convex Auth**: Synchronizes Clerk identities into the Convex database for real-time features and access control.

## Flow

1.  **Client-side**: The user authenticates via Clerk's `<SignIn />` or `<SignUp />` components in the `web` or `slack-web` apps.
2.  **JWT Handling**: Clerk provides a JWT that is automatically passed to Convex via the `ConvexProviderWithClerk`.
3.  **Identity Mapping**: The `users.ts` Convex functions use `ctx.auth.getUserIdentity()` to map the external Clerk ID to an internal Convex user ID.
4.  **Syncing**: On first login, a new record is created in the `users` table.

## Access Control

Access control is implemented at the database level using Convex functions. Each function verifies the user's role and workspace membership before performing operations.

```typescript
// Example permission check in Convex
const member = await ctx.db
  .query("members")
  .withIndex("by_userId_and_workspaceId", (q) =>
    q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
  )
  .unique();

if (!member) {
  throw new Error("Unauthorized");
}
```
