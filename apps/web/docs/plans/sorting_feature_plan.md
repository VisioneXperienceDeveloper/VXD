# Post Sorting Feature Implementation Plan

## Overview
Implement flexible post sorting functionality to allow users to sort blog posts by multiple criteria: published date (default), view count, and comment count.

---

## Current State Analysis

### Current Sorting
**[CURRENT]** `src/lib/services/posts.service.ts`
```typescript
sorts: [
  {
    timestamp: "created_time",
    direction: "descending",
  },
]
```

**Issues:**
- Notion API의 `sorts`는 `timestamp` 필드만 지원 (`created_time`, `last_edited_time`)
- `property` 기반 정렬은 Notion API에서 직접 지원하지 않음
- 사용자 선택 가능한 정렬 옵션 없음
- 모든 정렬 로직이 하드코딩됨

**현재 아키텍처:**
1. Notion API에서 `created_time` 기준으로 정렬된 데이터 fetch
2. `unstable_cache`로 6시간 캐싱
3. 클라이언트에서 필터링만 수행

---

## Proposed Changes

### 1. Database Schema Requirements

> [!NOTE]
> Notion API의 `dataSources.query`는 `property` 기반 정렬을 지원하지 않습니다. 따라서 **모든 포스트를 fetch한 후 서버 측에서 정렬**해야 합니다.

#### Notion Properties Needed
다음 속성들이 Notion Posts 데이터베이스에 존재해야 합니다:

| Property | Type | Description | Status |
|----------|------|-------------|--------|
| `published_date` | Date | 발행일 (기본 정렬 기준) | ✅ 존재 |
| `view_count` | Number | 조회수 | ✅ 존재 |
| `comment_count` | Number | 댓글 수 | ⚠️ 확인 필요 |

> [!IMPORTANT]
> `comment_count` 속성이 없다면 Notion 데이터베이스에 추가해야 합니다.
> 
> **추가 방법:**
> 1. Notion Posts 데이터베이스 열기
> 2. 새 속성 추가: 이름 `comment_count`, 타입 `Number`
> 3. 기존 포스트의 값은 0으로 초기화

---

### 2. Backend Implementation

#### Update Types
**[NEW]** `src/types/sort.ts`

```typescript
export type SortOption = 'published_date' | 'view_count' | 'comment_count';
export type SortDirection = 'asc' | 'desc';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  group?: string;
  part?: string;
  cover: string | null;
  description: string;
  language: string;
  translationId: string | null;
  viewCount: number;
  commentCount?: number;     // NEW
}
```

#### Update Helper
**[MODIFY]** `src/lib/services/posts.helper.ts`

```typescript
export function extractBlogPostFromPage(p: PageObjectResponse): BlogPost {
  // ... existing code ...
  
  const viewCount = getNumberValue(p.properties.view_count);
  const commentCount = getNumberValue(p.properties.comment_count); // NEW

  const blogPost: BlogPost = {
    id: p.id,
    slug: generateSlug(title, p.id),
    title,
    date,
    tags,
    group: groupName,
    part,
    cover,
    description: '',
    language,
    translationId,
    viewCount,
    commentCount,   // NEW
  };

  return blogPost;
}
```

#### Update Service Options
**[MODIFY]** `src/lib/services/posts.service.ts`

```typescript
export interface GetPublishedPostsOptions {
  tag?: string;
  searchQuery?: string;
  group?: string;
  locale?: string;
  sortBy?: SortOption;        // NEW
  sortDirection?: SortDirection; // NEW
}

export const getPublishedPosts = async (options: GetPublishedPostsOptions = {}): Promise<BlogPost[] | null> => {
  const { 
    tag, 
    searchQuery, 
    group, 
    locale = 'ko',
    sortBy = 'published_date',     // NEW - default
    sortDirection = 'desc'          // NEW - default
  } = options;
  
  const posts = await getCachedAllPosts();
  if (!posts) return null;

  const now = new Date();

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (post.date && new Date(post.date) > now) return false;
    const targetLang = locale === 'ko' ? 'KR' : 'EN';
    if (post.language && post.language !== targetLang) return false;
    if (tag && !post.tags.includes(tag)) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (group && post.group !== group) return false;
    return true;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case 'published_date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'view_count':
        aValue = a.viewCount || 0;
        bValue = b.viewCount || 0;
        break;
      case 'comment_count':
        aValue = a.commentCount || 0;
        bValue = b.commentCount || 0;
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
    }

    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Format dates
  return sortedPosts.map(post => ({
    ...post,
    date: new Date(post.date).toLocaleDateString(),
  }));
};
```

#### Keep Initial Fetch Unchanged
**[NO CHANGE]** `src/lib/services/posts.service.ts`

> [!NOTE]
> Notion API는 `timestamp` 기반 정렬만 지원하므로, `getCachedAllPosts`는 변경하지 않습니다.
> 대신 `getPublishedPosts` 함수에서 정렬을 수행합니다.

```typescript
// 기존 코드 유지
const getCachedAllPosts = unstable_cache(async (): Promise<BlogPost[] | null> => {
  const dataSourceId = getPostsDataSourceId();
  
  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [
        {
          timestamp: "created_time",  // Notion API 제약으로 인해 유지
          direction: "descending",
        },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return null;
  }

  const posts = response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(extractBlogPostFromPage);

  return posts;
}, ['all-posts-v4'], { revalidate: 21600 }); // 6시간 캐싱 유지
```

---

### 3. Frontend Implementation

#### Sort Dropdown Component
**[NEW]** `src/components/utils/SortDropdown.tsx`

```typescript
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SortOption } from '@/lib/types';

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: 'published_date', labelKey: 'publishedDate' },
  { value: 'view_count', labelKey: 'viewCount' },
  { value: 'comment_count', labelKey: 'comments' },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Sort');
  const [isOpen, setIsOpen] = useState(false);

  const currentSort = (searchParams.get('sort') as SortOption) || 'published_date';

  const handleSortChange = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortBy === 'published_date') {
      params.delete('sort'); // Default, no need to add to URL
    } else {
      params.set('sort', sortBy);
    }
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        aria-label={t('sortBy')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">
          {t(SORT_OPTIONS.find(opt => opt.value === currentSort)?.labelKey || 'publishedDate')}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg z-20">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentSort === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

#### Update Home Page
**[MODIFY]** `src/app/[locale]/page.tsx`

```typescript
import { SortDropdown } from "@/components/utils/SortDropdown";
import { SortOption } from "@/lib/types";

export default async function Home({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;
  const t = await getTranslations('Common');

  const selectedTag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : undefined;
  const selectedGroup = typeof resolvedSearchParams.group === 'string' ? resolvedSearchParams.group : undefined;
  const searchQuery = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const sortBy = (typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'published_date') as SortOption; // NEW
  
  const allPosts = await getPublishedPosts({ 
    tag: selectedTag, 
    searchQuery, 
    group: selectedGroup, 
    locale,
    sortBy  // NEW
  });

  // ... rest of the component

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
          <Search />
          <SortDropdown />  {/* NEW */}
          <ModeToggle />
          <LanguageToggle />
        </div>
        
        {/* ... rest of the page */}
      </div>
    </main>
  );
}
```

#### Translation Files
**[MODIFY]** `messages/ko.json`

```json
{
  "Sort": {
    "sortBy": "정렬",
    "publishedDate": "최신순",
    "viewCount": "조회수",
    "comments": "댓글수"
  }
}
```

**[MODIFY]** `messages/en.json`

```json
{
  "Sort": {
    "sortBy": "Sort by",
    "publishedDate": "Latest",
    "viewCount": "Views",
    "comments": "Comments"
  }
}
```

---

## Implementation Roadmap

> [!TIP]
> 이 기능은 비교적 간단하므로 **2-3일 내 구현 가능**합니다.

### Phase 1: 준비 단계 (Day 1 오전)
- [ ] Notion 데이터베이스에 `comment_count` 속성 추가 확인
- [ ] 기존 포스트의 `comment_count` 값 초기화 (0으로 설정)
- [ ] 현재 프로젝트 구조 파악 (`src/lib/services`, `src/types` 등)

### Phase 2: 백엔드 구현 (Day 1 오후)
- [ ] `src/types/sort.ts` 생성 (타입 정의)
- [ ] `posts.helper.ts` 업데이트 (`commentCount` 추출)
- [ ] `posts.service.ts` 업데이트:
  - `GetPublishedPostsOptions` 인터페이스에 `sortBy`, `sortDirection` 추가
  - `getPublishedPosts` 함수에 정렬 로직 구현
- [ ] 로컬에서 테스트 (`pnpm dev`)

### Phase 3: 프론트엔드 구현 (Day 2)
- [ ] `SortDropdown.tsx` 컴포넌트 생성
- [ ] 번역 파일 업데이트 (`messages/ko.json`, `messages/en.json`)
- [ ] 홈 페이지에 `SortDropdown` 통합
- [ ] URL 상태 관리 테스트
- [ ] 반응형 디자인 테스트 (모바일/데스크톱)

### Phase 4: 테스트 & 문서화 (Day 3)
- [ ] Unit 테스트 작성 (`posts.service.test.ts`)
- [ ] E2E 테스트 작성 (`sorting.spec.ts`)
- [ ] 모든 정렬 옵션 조합 테스트
- [ ] 성능 테스트 (100+ 포스트)
- [ ] `/docs/architectures/sorting-feature.md` 문서 작성
- [ ] `CHANGELOG.md` 업데이트

---

## Success Metrics

### Functional Requirements
- ✅ Default sort by `published_date` (descending)
- ✅ User can sort by: published_date, view_count, comment_count
- ✅ Sort selection persists in URL
- ✅ Sort works with filters (tag, group, search)
- ✅ Responsive design (mobile & desktop)

### Performance
- Sort operation < 100ms for 100 posts
- No layout shift when changing sort
- Smooth dropdown animation

### UX
- Clear visual indication of current sort
- Accessible keyboard navigation
- Mobile-friendly dropdown

---

## Testing Strategy

### Unit Tests
**[NEW]** `src/lib/services/__tests__/posts.service.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { getPublishedPosts } from '../posts.service';

describe('getPublishedPosts sorting', () => {
  it('기본값으로 published_date 내림차순 정렬', async () => {
    const posts = await getPublishedPosts();
    
    if (!posts || posts.length < 2) return;
    
    const firstDate = new Date(posts[0].date).getTime();
    const secondDate = new Date(posts[1].date).getTime();
    
    expect(firstDate).toBeGreaterThanOrEqual(secondDate);
  });

  it('view_count 내림차순 정렬', async () => {
    const posts = await getPublishedPosts({ sortBy: 'view_count' });
    
    if (!posts || posts.length < 2) return;
    
    expect(posts[0].viewCount).toBeGreaterThanOrEqual(posts[1].viewCount);
  });

  it('comment_count 내림차순 정렬', async () => {
    const posts = await getPublishedPosts({ sortBy: 'comment_count' });
    
    if (!posts || posts.length < 2) return;
    
    const firstCount = posts[0].commentCount || 0;
    const secondCount = posts[1].commentCount || 0;
    
    expect(firstCount).toBeGreaterThanOrEqual(secondCount);
  });

  it('tag 필터와 정렬 조합', async () => {
    const posts = await getPublishedPosts({ 
      tag: 'React', 
      sortBy: 'view_count' 
    });
    
    if (!posts) return;
    
    // 모든 포스트가 React 태그를 가지고 있는지 확인
    posts.forEach(post => {
      expect(post.tags).toContain('React');
    });
    
    // 조회수 순으로 정렬되어 있는지 확인
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].viewCount).toBeGreaterThanOrEqual(posts[i + 1].viewCount);
    }
  });
});
```

### E2E Tests
**[NEW]** `e2e/sorting.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Post Sorting', () => {
  test('기본값으로 최신순 정렬', async ({ page }) => {
    await page.goto('/');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await expect(sortButton).toBeVisible();
    
    // 첫 번째 포스트가 보이는지 확인
    const firstPost = page.locator('[data-testid="post-card"]').first();
    await expect(firstPost).toBeVisible();
  });

  test('정렬 드롭다운 클릭 시 옵션 표시', async ({ page }) => {
    await page.goto('/');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await sortButton.click();
    
    // 정렬 옵션들이 보이는지 확인
    await expect(page.locator('text=최신순, text=Latest')).toBeVisible();
    await expect(page.locator('text=조회수, text=Views')).toBeVisible();
    await expect(page.locator('text=댓글수, text=Comments')).toBeVisible();
  });

  test('조회수 정렬 선택 시 URL 변경', async ({ page }) => {
    await page.goto('/');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await sortButton.click();
    
    await page.locator('text=조회수, text=Views').click();
    
    await expect(page).toHaveURL(/sort=view_count/);
  });

  test('댓글수 정렬 선택 시 URL 변경', async ({ page }) => {
    await page.goto('/');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await sortButton.click();
    
    await page.locator('text=댓글수, text=Comments').click();
    
    await expect(page).toHaveURL(/sort=comment_count/);
  });

  test('필터와 정렬 조합 유지', async ({ page }) => {
    await page.goto('/?tag=React');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await sortButton.click();
    
    await page.locator('text=조회수, text=Views').click();
    
    // tag와 sort 파라미터 모두 유지되는지 확인
    await expect(page).toHaveURL(/tag=React/);
    await expect(page).toHaveURL(/sort=view_count/);
  });

  test('기본 정렬로 돌아갈 때 URL에서 sort 제거', async ({ page }) => {
    await page.goto('/?sort=view_count');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await sortButton.click();
    
    await page.locator('text=최신순, text=Latest').click();
    
    // sort 파라미터가 URL에서 제거되었는지 확인
    await expect(page).not.toHaveURL(/sort=/);
  });

  test('모바일에서 정렬 드롭다운 동작', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const sortButton = page.locator('[aria-label*="정렬"], [aria-label*="Sort"]');
    await sortButton.click();
    
    await expect(page.locator('text=최신순, text=Latest')).toBeVisible();
  });
});
```

---

## Edge Cases & Considerations

### Missing Data
- `comment_count`가 없는 포스트는 0으로 처리
- `published_date`가 없는 포스트는 `created_time`으로 폴백
- `viewCount`가 없는 포스트는 0으로 처리

### Performance
- **현재 접근법**: 메모리 내 정렬 (이미 캐시된 포스트)
- **예상 성능**: 100개 포스트 기준 < 10ms
- **확장성**: 포스트 수가 1000개 이상이 되면 페이지네이션 고려 필요

### URL State
- 기본 정렬(`published_date`)은 URL에 추가하지 않음 (깨끗한 URL)
- 정렬 파라미터는 네비게이션 간 유지
- 기존 필터(tag, group, search)와 호환

### Cache Strategy
- 현재: 단일 캐시 `all-posts-v4` (6시간)
- 정렬은 캐시된 데이터에서 수행
- 정렬 옵션별 별도 캐시 불필요 (메모리 내 정렬이 충분히 빠름)

### Accessibility
- 키보드 네비게이션 지원 (Tab, Enter, Escape)
- ARIA 레이블 추가 (`aria-label="Sort by"`)
- 스크린 리더 지원

---

## Future Enhancements

### Phase 2 (Optional)
- [ ] Sort direction toggle (asc/desc)
- [ ] Multi-level sorting (e.g., date then views)
- [ ] Save user's sort preference (localStorage)
- [ ] Sort animation/transition effects

### Phase 3 (Optional)
- [ ] Server-side sorting for better performance
- [ ] Sort by relevance (search results)
- [ ] Custom sort orders per user

---

## Architecture Decisions

### Why Server-Side Sorting?

**결정**: 모든 정렬을 Server Component에서 수행

**이유**:
1. **SEO 친화적**: 정렬된 콘텐츠가 초기 HTML에 포함
2. **성능**: 서버에서 한 번만 정렬, 클라이언트는 렌더링만 수행
3. **캐시 효율성**: 이미 캐시된 데이터 활용
4. **코드 단순성**: 클라이언트 상태 관리 불필요

**대안 고려**:
- ❌ Client-side sorting: 초기 로드 시 SEO 불리, 불필요한 자바스크립트
- ❌ Notion API sorting: `property` 기반 정렬 미지원
- ✅ Server-side in-memory sorting: 최적의 균형

### Why URL State for Sort?

**결정**: 정렬 옵션을 URL 파라미터로 관리

**이유**:
1. **공유 가능**: 사용자가 정렬된 URL 공유 가능
2. **북마크 친화적**: 특정 정렬 상태 저장 가능
3. **브라우저 히스토리**: 뒤로가기/앞으로가기 지원
4. **기존 패턴 일관성**: tag, group, search와 동일한 패턴

**대안 고려**:
- ❌ localStorage: 공유 불가, SEO 불리
- ❌ Context API: 새로고침 시 상태 손실
- ✅ URL params: 가장 적합한 방법

---

## Notes

> [!TIP]
> **구현 순서 추천**:
> 1. Notion 데이터베이스에 `comment_count` 속성 추가
> 2. 백엔드 타입 및 로직 구현
> 3. 로컬에서 테스트 (API 호출 확인)
> 4. 프론트엔드 UI 구현
> 5. 테스트 및 문서화

> [!WARNING]
> **주의사항**:
> - Notion API는 `property` 기반 정렬을 지원하지 않습니다.
> - `getCachedAllPosts` 함수는 변경하지 마세요.
> - 정렬은 반드시 `getPublishedPosts`에서 수행해야 합니다.

> [!IMPORTANT]
> **필수 확인 사항**:
> - 모든 포스트에 `published_date` 속성이 설정되어 있는지 확인
> - `comment_count` 속성이 없는 기존 포스트는 0으로 초기화
> - 캐시 버전은 변경하지 않아도 됨 (`all-posts-v4` 유지)
