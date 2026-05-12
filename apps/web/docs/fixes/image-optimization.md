# Vercel Image Optimization Usage Fix

## 1. Issue
Vercel's "Image Optimization - Cache Writes" limit (Screening Tier) was reaching 75% usage.
This was primarily caused by:
1.  **Notion Signed URLs**: Notion image URLs expire every hour, causing Vercel to treat them as new images and re-optimize them frequently.
2.  **Excessive Variants**: Default Next.js configuration and AVIF formats multiplied the number of generated cache writes.

## 2. Solution
We implemented a two-part strategy to reduce usage:

### 2.1 Configuration Optimization (`next.config.ts`)
Reduced the number of generated image variants:
-   **Removed `image/avif`**: AVIF is expensive and adds another set of variants. WebP is sufficient.
-   **Reduced `deviceSizes`**: [640, 1080, 1920] (Standard breakpoints).
-   **Reduced `imageSizes`**: [64, 128, 256] (Small assets).

### 2.2 Content Image Bypass (`BlockRenderer.tsx`)
Images inside blog posts (rendered by `BlockRenderer`) are now passed with `unoptimized={true}`.
-   **Effect**: Next.js will NOT optimize these images through Vercel.
-   **Result**: 0 "Cache Writes" for blog content images. Users will download the image directly from Notion's S3 URL.
-   **Trade-off**: Larger file sizes for users if original images are large.

## 3. Verification
-   `pnpm build` passed successfully.
-   Images in `PostCard` (Cover images) are still optimized (critical for LCP).
-   Images in Blog Posts are served directly (acceptable for content).
