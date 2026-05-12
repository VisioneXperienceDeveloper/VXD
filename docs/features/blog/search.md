# Blog Search Feature

The Search feature allows users to quickly find blog posts by content, title, or tags.

## Implementation

- **Search UI**: A real-time search bar that filters the post list as the user types.
- **Notion Integration**: Search queries are translated into Notion API filter objects.
- **Caching**: Search results are cached locally to improve subsequent search performance.

## Usage

Users can access the search bar at the top of the post list. It supports:
- Keyword search.
- Tag filtering (combined with the `filter-by-tag` feature).
- Sorting (combined with the `sort-posts` feature).
