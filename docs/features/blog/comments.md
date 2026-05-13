# Comments Feature

Real-time commenting system for blog posts.

## Overview

The comments feature allows users to engage with blog posts through real-time discussions. It leverages Convex for instant updates and transactional consistency.

## Implementation Details

- **Backend**: Convex mutations and queries.
- **Frontend Component**: `CommentsSection` widget.
- **Data Model**: `comments` table in Convex.

## Data Flow

1.  **Fetching**: `useQuery(api.comments.get, { postId })` retrieves all comments for a post.
2.  **Posting**: `useMutation(api.comments.create)` adds a new comment.
3.  **Real-time**: Convex automatically pushes updates to all connected clients when a new comment is added.

## Security

- **Authentication**: Users must be authenticated to post comments.
- **Access Control**: RLS policies (or Convex function validation) ensure users can only delete their own comments.
