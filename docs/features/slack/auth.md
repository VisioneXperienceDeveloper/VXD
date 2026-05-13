# Slack Authentication

Secure authentication system for the Slack clone.

## Overview

We use **Clerk** for identity management and **Convex** for backend authorization. The integration ensures that users are authenticated before accessing sensitive workspace data.

## Implementation Details

- **Provider**: Clerk
- **Integration**: `@vxd/slack-auth` package.
- **Identity Mapping**: Clerk user IDs are mapped to Convex user records.

## Auth Flow

1.  **Sign In**: User signs in via Clerk UI.
2.  **JWT Verification**: Clerk issues a JWT.
3.  **Convex Sync**: A webhook or initialization logic ensures the user exists in the Convex `users` table.
4.  **Session**: Convex uses the JWT to identify the user in backend functions.

## Shared Package

The `@vxd/slack-auth` package provides:
- `ConvexClientProvider`: Wraps the app with Clerk and Convex providers.
- `useAuth`: Common hooks for checking auth status.
