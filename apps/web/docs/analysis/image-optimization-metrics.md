# Image Optimization Improvement Analysis

## 1. Metric: Cache Writes
Vercel counts 1 "Cache Write" for every unique generated image variant.
**Formula**: `Source Image` × `Formats` × `Sizes` = Total Writes

## 2. Quantitative Comparison

### 2.1 Configuration Changes
| Setting | Before | After | Reduction Factor |
| :--- | :--- | :--- | :--- |
| **Formats** | 2 (`webp`, `avif`) | 1 (`webp`) | **50%** |
| **Device Sizes** | 6 `[640, 750, 828, 1080, 1200, 1920]` | 3 `[640, 1080, 1920]` | \- |
| **Image Sizes** | 8 `[16...384]` | 3 `[64, 128, 256]` | \- |
| **Total Sizes** | 14 | 6 | **~57%** |
| **Variants per Image** | **28** (14 × 2) | **6** (6 × 1) | **~79%** |

### 2.2 Component Changes (`BlockRenderer`)
| Component | Before | After | Reduction |
| :--- | :--- | :--- | :--- |
| **Blog Post Content** | Optimized (28 variants) | Unoptimized (0 variants) | **100%** |

## 3. Scenario Simulation

**Scenario**: A single blog post load containing **1 Cover Image** and **5 Body Images**.

| Item | Before (Writes) | After (Writes) | Improvement |
| :--- | :--- | :--- | :--- |
| **Cover Image** | 1 × 28 = **28** | 1 × 6 = **6** | 79% ↓ |
| **Body Images** (5) | 5 × 28 = **140** | 5 × 0 = **0** | 100% ↓ |
| **TOTAL** | **168 Writes** | **6 Writes** | **96.4% ↓** |

## 4. Conclusion
By applying these changes, we expect a **~96% reduction** in Image Optimization usage for blog post views.
-   **Cover Images**: Optimized efficiently (79% less overhead).
-   **Body Content**: Served directly from source (Zero overhead).
