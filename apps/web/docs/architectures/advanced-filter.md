# Advanced Search & Filter Architecture

## Overview
블로그 포스트의 다중 태그 선택 및 필터링 기능을 구현하여 사용자가 여러 태그를 동시에 선택하고 AND 조건으로 포스트를 필터링할 수 있도록 합니다.

## Architectural Decisions

### 1. Client-Side vs Server-Side Rendering
**Decision:** Sidebar를 Server Component에서 Client Component로 전환

**Reasoning:**
- 다중 태그 선택은 인터랙티브한 기능이 필요
- `useRouter`, `useSearchParams` 등 Client-side hook 사용 필수
- SEO 영향 최소화: 태그 목록은 여전히 서버에서 props로 전달

### 2. URL-Based State Management
**Decision:** URL search parameters (`?tag=...&tag=...`)를 사용한 상태 관리

**Reasoning:**
- 공유 가능: 특정 필터 상태를 URL로 공유 가능
- 북마크 가능: 자주 사용하는 필터 조합 저장
- 브라우저 히스토리: 뒤로가기/앞으로가기 지원
- SSR 호환: 초기 렌더링 시 서버에서 필터 적용

### 3. AND 조건 필터링
**Decision:** 선택된 모든 태그를 포함한 포스트만 표시 (AND 조건)

**Reasoning:**
- 더 정확한 검색 결과
- 사용자 의도에 부합 (React AND TypeScript)
- OR 조건은 향후 확장으로 고려 가능

### 4. 하위 호환성
**Decision:** 기존 `tag` 파라미터와 새로운 `tags` 파라미터 모두 지원

**Implementation:**
```typescript
// posts.service.ts
const selectedTags = tags || (tag ? [tag] : []);
```

**Reasoning:**
- 기존 북마크/링크 깨지지 않음
- 점진적 마이그레이션 가능

## Technical Implementation

### Backend (Service Layer)
**File:** `src/lib/services/posts.service.ts`

```typescript
export interface GetPublishedPostsOptions {
  tag?: string;          // Backward compatibility
  tags?: string[];       // New multi-tag support
  searchQuery?: string;
  group?: string;
  locale?: string;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
}

// Multi-tag AND filtering
if (selectedTags.length > 0) {
  const hasAllTags = selectedTags.every(selectedTag => 
    post.tags.includes(selectedTag)
  );
  if (!hasAllTags) return false;
}
```

### Frontend (UI Components)

#### ActiveFilters Component
**File:** `src/components/utils/ActiveFilters.tsx`
- Client Component
- 선택된 태그 칩 표시
- 개별/전체 해제 기능
- URL 업데이트 로직

#### Sidebar Component  
**File:** `src/components/utils/Sidebar.tsx`
- Client Component로 전환 (`'use client'`)
- 버튼 기반 토글 (`Link` → `button`)
- Multi-tag 선택 상태 관리

```typescript
const toggleTag = (tag: string): void => {
  const params = new URLSearchParams(searchParams.toString());
  const existingTags= params.getAll('tag');
  
  if (existingTags.includes(tag)) {
    // Remove tag
    params.delete('tag');
    existingTags
      .filter(t => t !== tag)
      .forEach(t => params.append('tag', t));
  } else {
    // Add tag
    params.append('tag', tag);
  }
  
  router.push(`${pathname}?${params.toString()}`);
};
```

## Performance Considerations

### Deduplication
URL 파라미터 중복 자동 제거:
```typescript
const selectedTags: string[] = Array.isArray(rawTags)
  ? [...new Set(rawTags)]  // Remove duplicates
  : rawTags ? [rawTags] : [];
```

### Caching
- 포스트 데이터는 6시간 캐싱 (`unstable_cache`)
- 필터링은 메모리 내에서 수행 (빠른 응답)

## Future Enhancements

### Phase 2 (Optional)
- OR 조건 필터링 추가
- 태그별 포스트 개수 표시
- 필터 프리셋 저장 (localStorage)
- 필터 히스토리

### Phase 3 (Optional)
- 고급 검색 모달
- 필터 공유 기능
- 연관 태그 추천
