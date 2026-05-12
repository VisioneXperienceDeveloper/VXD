# Database Schema

The project uses **Convex** as its primary database. The schema is defined in `packages/slack-backend/convex/schema.ts`.

## Core Tables

### Users
Stores user profile information, synced from Clerk.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string (opt) | Display name |
| `image` | string (opt) | Avatar URL |
| `externalId` | string | Clerk's unique user ID (indexed) |
| `email` | string | User's email address |
| `lastSeen` | number (opt) | Timestamp of last activity |

### Workspaces
Logical grouping for channels and members.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Workspace name |
| `ownerId` | id("users") | User who created the workspace |
| `joinCode` | string | 6-digit invite code (indexed) |

### Channels
Communication hubs within a workspace.

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Channel name |
| `workspaceId` | id("workspaces") | Reference to parent workspace |
| `isPrivate` | boolean | Privacy flag |
| `type` | "channel" \| "dm" | Type of communication |

### Messages
The heart of communication.

| Field | Type | Description |
| :--- | :--- | :--- |
| `body` | string | Content of the message |
| `authorId` | id("users") | Message author |
| `channelId` | id("channels") | Target channel |
| `parentMessageId` | id("messages") (opt) | For threaded replies |

## Additional Tables

- **Members**: Links users to workspaces with roles (`owner`, `admin`, `member`).
- **Reactions**: Emoji reactions attached to messages.
- **Conversations**: Metadata for Direct Messages (DMs).
- **Notifications**: User-specific alerts for mentions and messages.
