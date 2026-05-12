# Slack Chat Feature

The Chat feature is the core communication module of the Slack clone, handling real-time messaging, threads, and reactions.

## Components

- **MessageList**: Displays messages for a specific channel or DM conversation. Uses virtualization for high performance with large message counts.
- **MessageInput**: Rich text editor for sending messages. Supports markdown, emoji, and file attachments.
- **ThreadSidebar**: Dedicated view for threaded replies to a parent message.
- **ReactionPicker**: Allows users to add emoji reactions to messages.

## Data Flow

1.  **Sending**: `MessageInput` calls the `messages:send` Convex mutation.
2.  **Streaming**: `MessageList` uses the `messages:get` query to subscribe to real-time updates.
3.  **Updating**: Reactions and message edits trigger optimistic UI updates for a lag-free experience.

## Backend (Convex)

- **`messages.ts`**: Contains functions for sending, editing, deleting, and fetching messages.
- **`reactions.ts`**: Handles adding and removing emoji reactions.
- **`conversations.ts`**: Manages the lifecycle of Direct Message (DM) threads.
