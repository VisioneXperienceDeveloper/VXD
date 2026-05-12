# Shared Cover Image for Translated Posts

## 1. Feature Description
When a blog post has a translated version (e.g., Korean original and English translation), it is redundant to upload the same cover image to both Notion pages.
This feature allows the system to automatically fallback to the translated post's cover image if the current post lacks one.

## 2. Logic
Implemented in `src/lib/services/posts.service.ts`:
1.  Fetch all posts from Notion.
2.  Create a `Map` of all posts indexed by ID.
3.  Iterate through each post:
    -   **Condition**: `!post.cover` AND `post.translationId` exists.
    -   **Action**: Look up the post linked by `translationId`.
    -   **Result**: If the linked post has a cover, assign it to the current post.

## 3. Usage
-   **Scenario**: You have a Korean post with a cover image and an English translation.
-   **Action**: You can delete the cover image property from the English Notion page.
-   **Result**: The English blog post will automatically display the Korean post's cover image.

## 4. Benefit
-   **Storage Efficiency**: Reduces duplicated image storage in Notion/S3.
-   **Management**: Update cover image in one place (original post) and it reflects on all translations.
