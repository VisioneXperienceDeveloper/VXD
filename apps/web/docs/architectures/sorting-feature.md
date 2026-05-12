# Post Sorting Architecture

## Overview
Implement post sorting functionality on the server side to maintain SEO benefits while providing a fast and interactive user experience.

## Decisions

### 1. Server-Side In-Memory Sorting
- **Decision:** Perform sorting in the Server Component after fetching and filtering posts.
- **Reasoning:** 
  - Notion API's `property` based sorting is not available via `dataSources.query`.
  - Fetching all posts and sorting in memory is highly efficient for the current scale (<1000 posts).
  - Keeps the sorting logic centralized in the service layer.

### 2. URL-Based State Management
- **Decision:** Use URL search parameters (`?sort=...`) to track the current sorting option.
- **Reasoning:** 
  - Allows users to share specific sorted views.
  - Supports browser history (back/forward buttons).
  - Consistent with existing filtering patterns (tags, search).

## Technical Implementation

### Backend
- **Types:** Added `SortOption` and `SortDirection` in `src/lib/types/Sort.ts`.
- **Services:**
  - `posts.helper.ts`: Extracts `comment_count` from Notion properties.
  - `posts.service.ts`: Implements sorting logic in `getPublishedPosts` using a switch-case on `sortBy`.

### Frontend
- **Components:**
  - `SortDropdown.tsx`: A client component that manages the dropdown UI and updates the URL.
  - Responsive design: Shows icon + label on desktop, icon-only on mobile.
- **Translations:** Added Sort namespace in `ko.json` and `en.json`.

## Performance Considerations
- **Caching:** The base post data is cached for 6 hours (`21600s`) using `unstable_cache`.
- **Latency:** Sorting 100 posts in memory takes less than 1ms, resulting in zero visible latency for the user.
