# Fix Image Optimization Quota Usage

## Issue
The project exceeded Vercel's free tier Image Optimization limit (100,000 writes).
-   **Cause**: Notion-hosted images (used in Post Cards and Post Pages) use signed S3 URLs that expire and rotate frequently (approx. every hour).
-   **Result**: Each URL rotation causes Vercel to treat the image as "new", triggering a new optimization and cache write. This leads to exponential consumption of the quota.

## Solution
Disabled Vercel Image Optimization for Notion-hosted images by adding the `unoptimized={true}` prop to the `Next.js <Image>` component.
-   **File 1**: `src/entities/post/ui/PostCard.tsx` (Post Covers on list pages)
-   **File 2**: `src/app/[locale]/[slug]/page.tsx` (Post Cover on detail page)

## Impact
-   **Performance**: Images are now served directly from Notion's S3 CDN. They may be larger in file size compared to Vercel-optimized webp/avif versions, but this eliminates the cache write usage.
-   **Quota**: "Cache Writes" will no longer increase for these images.

## Related Files
-   `src/entities/post/ui/PostCard.tsx`
-   `src/app/[locale]/[slug]/page.tsx`
