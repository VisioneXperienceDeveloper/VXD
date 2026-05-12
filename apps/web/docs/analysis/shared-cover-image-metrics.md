# Shared Cover Image Efficiency Analysis

## 1. Metric: Vercel Image Optimization (Cache Writes)
Vercel treats every unique source URL as a distinct image to be optimized.
-   **Before**: KR Post has `Usage_A.jpg` (S3 URL A), EN Post has `Usage_B.jpg` (S3 URL B).
    -   Even if the image is visually identical, the URLs are different.
    -   Vercel optimizations: **2x** (Once for KR, Once for EN).
-   **After**: KR Post has `Usage_A.jpg`, EN Post uses `Usage_A.jpg`.
    -   Source URL is identical.
    -   Vercel optimizations: **1x** (Optimized once, served for both).
-   **Improvement**: **50% Reduction** in Cache Writes for translated posts.

## 2. Metric: Client-Side Browser Caching
-   **Scenario**: A user switches language from Korean to English on the same post.
-   **Before**: Browser downloads `Image A` (KR) then `Image B` (EN).
    -   Total Transfer: 2x Image Size.
-   **After**: Browser downloads `Image A` (KR). When switching to EN, `Image A` is already in disk cache.
    -   Total Transfer: 1x Image Size.
-   **Improvement**: **100% Hit Rate** on language switch, **50% Data Saving** for bilingual readers.

## 3. Metric: Notion Storage
-   **Before**: User uploads 5MB image to KR page, and another 5MB to EN page.
-   **After**: User uploads 5MB image to KR page only.
-   **Improvement**: **50% Storage Saving** in Notion workspace.

## Summary
| Metric | Improvement |
| :--- | :--- |
| **Vercel Cache Writes** | **50% Reduction** |
| **Bandwidth (User)** | **50% Saving** (on language switch) |
| **Notion Storage** | **50% Saving** |
