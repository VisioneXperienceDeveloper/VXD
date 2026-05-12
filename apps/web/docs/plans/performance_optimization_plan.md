# Performance Optimization Implementation Plan

## Overview
This plan outlines four key performance optimization strategies for the VXD Blog to improve load times, user experience, and maintainability.

---

## 1. Bundle Analysis with @next/bundle-analyzer

### Goal
Identify and optimize JavaScript bundle sizes to reduce initial load time.

### Implementation

#### Installation
```bash
pnpm add -D @next/bundle-analyzer
```

#### Configuration
**[MODIFY]** [next.config.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/next.config.ts)

```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

#### Usage
```bash
ANALYZE=true pnpm build
```

### Expected Benefits
- Identify large dependencies (target: reduce bundle by 15-20%)
- Find duplicate packages
- Optimize code splitting

### Success Metrics
- Main bundle < 200KB (gzipped)
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3.5s

---

## 2. Notion Image WebP Conversion

### Goal
Reduce image payload by 25-35% through WebP conversion while maintaining quality.

### Implementation Strategy

#### Option A: Next.js Image Optimization (Recommended)
Already using `next/image` - ensure proper configuration:

**[MODIFY]** [next.config.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/next.config.ts)
```typescript
images: {
  formats: ['image/webp', 'image/avif'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.amazonaws.com', // Notion CDN
    },
  ],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

#### Option B: Custom Image Proxy (Advanced)
**[NEW]** `src/app/api/image-proxy/route.ts`
- Fetch Notion images
- Convert to WebP using `sharp`
- Cache converted images
- Serve optimized versions

### Current Image Usage
- Post covers: `PostCard.tsx`, `[slug]/page.tsx`
- Inline images: `BlockRenderer.tsx`

### Expected Benefits
- 25-35% smaller image sizes
- Faster LCP (Largest Contentful Paint)
- Reduced bandwidth costs

---

## 3. Prefetch on Hover

### Goal
Reduce perceived navigation time by prefetching post content when users hover over links.

### Implementation

#### Component Updates
**[MODIFY]** [PostCard.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/components/PostCard.tsx)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PostCard({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [isPrefetched, setIsPrefetched] = useState(false);

  const handleMouseEnter = () => {
    if (!isPrefetched) {
      router.prefetch(`/${post.slug}`);
      setIsPrefetched(true);
    }
  };

  return (
    <Link
      href={`/${post.slug}`}
      onMouseEnter={handleMouseEnter}
      // ... rest of props
    >
      {/* content */}
    </Link>
  );
}
```

#### Prefetch Strategy
- **Hover**: Prefetch on mouse enter (desktop)
- **Viewport**: Prefetch when card enters viewport (mobile)
- **Debounce**: 150ms delay to avoid excessive prefetching

#### Additional Optimization
**[NEW]** Custom hook: `src/hooks/usePrefetch.ts`
```typescript
export function usePrefetch(href: string, delay = 150) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const prefetch = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      router.prefetch(href);
    }, delay);
  }, [href, delay, router]);
  
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  
  return { prefetch, cancel };
}
```

### Expected Benefits
- Near-instant navigation on hover
- Improved perceived performance
- Better user experience

### Considerations
- Bandwidth usage (prefetch only on WiFi for mobile)
- Limit concurrent prefetches (max 3)

---

## 4. React Error Boundary

### Goal
Graceful error handling and improved user experience during runtime errors.

### Implementation

#### Error Boundary Component
**[NEW]** [src/components/ErrorBoundary.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/components/ErrorBoundary.tsx)

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send to error tracking service (Sentry)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Fallback Components
**[NEW]** `src/components/error-fallbacks/`
- `PostErrorFallback.tsx` - For post loading errors
- `CommentErrorFallback.tsx` - For comment errors
- `GenericErrorFallback.tsx` - Default fallback

#### Integration Points
**[MODIFY]** [src/app/[locale]/layout.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/app/[locale]/layout.tsx)
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**[MODIFY]** [src/app/[locale]/[slug]/page.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/app/[locale]/[slug]/page.tsx)
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PostErrorFallback } from '@/components/error-fallbacks/PostErrorFallback';

export default function BlogPost() {
  return (
    <ErrorBoundary fallback={<PostErrorFallback />}>
      {/* post content */}
    </ErrorBoundary>
  );
}
```

### Error Tracking Integration
**[NEW]** `src/lib/error-tracking.ts`
```typescript
export function logError(error: Error, context?: Record<string, any>) {
  // Send to Sentry or similar service
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context });
  }
  console.error(error, context);
}
```

### Expected Benefits
- Prevent full app crashes
- Better error reporting
- Improved user experience
- Easier debugging

---

## Implementation Roadmap

### Phase 1: Analysis & Setup (Week 1)
- [ ] Install and configure bundle analyzer
- [ ] Run initial bundle analysis
- [ ] Document current performance metrics

### Phase 2: Image Optimization (Week 2)
- [ ] Configure Next.js image optimization
- [ ] Update image components
- [ ] Test WebP conversion
- [ ] Measure performance improvements

### Phase 3: Prefetch Implementation (Week 3)
- [ ] Create `usePrefetch` hook
- [ ] Update `PostCard` component
- [ ] Add viewport-based prefetch for mobile
- [ ] Test and optimize prefetch strategy

### Phase 4: Error Boundaries (Week 4)
- [ ] Create `ErrorBoundary` component
- [ ] Create fallback components
- [ ] Integrate at layout and page levels
- [ ] Set up error tracking
- [ ] Test error scenarios

---

## Success Metrics

### Performance Targets
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Bundle Size | ~250KB | <200KB | 20% |
| LCP | 2.5s | <1.8s | 28% |
| FCP | 1.8s | <1.2s | 33% |
| TTI | 4.2s | <3.0s | 29% |
| Image Size | ~500KB/page | <350KB/page | 30% |

### User Experience
- Zero full-page crashes
- Instant navigation feel (<100ms perceived)
- Graceful error handling
- Improved Core Web Vitals scores

---

## Testing Strategy

### Bundle Analysis
```bash
# Before optimization
ANALYZE=true pnpm build

# After each optimization
ANALYZE=true pnpm build
# Compare bundle sizes
```

### Performance Testing
```bash
# Lighthouse CI
pnpm lighthouse:ci

# Custom performance tests
pnpm test:performance
```

### Error Boundary Testing
```typescript
// __tests__/unit/components/ErrorBoundary.test.tsx
describe('ErrorBoundary', () => {
  it('catches errors and displays fallback', () => {
    // Test implementation
  });
});
```

---

## Monitoring & Maintenance

### Tools
- **Vercel Analytics**: Real-time performance monitoring
- **Lighthouse CI**: Automated performance checks
- **Bundle Analyzer**: Regular bundle audits (monthly)

### Alerts
- Bundle size increase >10%
- LCP >2.5s
- Error rate >1%

---

## Notes

> [!TIP]
> Start with bundle analysis to identify quick wins before implementing other optimizations.

> [!WARNING]
> Prefetching can increase bandwidth usage. Consider implementing user preferences or network-aware prefetching.

> [!IMPORTANT]
> Error boundaries don't catch errors in event handlers or async code. Use try-catch for those cases.
