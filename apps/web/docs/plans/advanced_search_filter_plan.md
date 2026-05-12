# Advanced Search & Filter Features Implementation Plan

> **작성일**: 2026-01-21  
> **작성자**: Planning Agent  
> **우선순위**: MUST  
> **예상 구현 기간**: 4일

## 📋 목표

블로그의 검색 및 필터링 UX를 개선하여 사용자가 더 효율적으로 콘텐츠를 찾을 수 있도록 합니다.

**핵심 기능**:
1. ✅ 다중 태그 선택 (Multi-Tag Selection)
2. ✅ 태그 선택 해제 (Tag Deselection)
3. ✅ 검색 기능 개선 (Search Enhancement)
4. ✅ URL 파라미터 중복 제거 (Parameter Deduplication)

---

## 🔍 현재 상태 분석

### 기존 구조의 문제점

#### 1. URL 파라미터 처리
```typescript
// 현재: 단일 값만 추출
const selectedTag = typeof resolvedSearchParams.tag === 'string' 
  ? resolvedSearchParams.tag 
  : undefined;
```

**문제**:
- `tag=React&tag=TypeScript` 형태의 다중 태그 미지원
- 배열 형태 파라미터 처리 로직 없음

#### 2. 필터링 로직
```typescript
// 현재: 단일 tag 필터링만 가능
if (tag && !post.tags.includes(tag)) return false;
```

**문제**:
- 다중 태그 AND/OR 조건 처리 불가
- `tags` 배열 파라미터 지원 필요

#### 3. UI 컴포넌트
```typescript
// 현재: 단일 선택만 가능
<Link href={`/?tag=${tag}`}>
```

**문제**:
- 태그 클릭 시 기존 선택 모두 초기화
- 선택된 태그 표시 및 해제 UI 없음
- 다중 선택 피드백 부재

---

## 🎯 제안 기능

### 1. Multi-Tag Selection

**요구사항**:
- 여러 태그 동시 선택 가능
- **AND 조건** 필터링 (모든 선택 태그를 포함한 포스트만 표시)
- URL: `?tag=React&tag=TypeScript` 형태
- 선택된 태그 시각적 구분

**사용 시나리오**:
```
1. 사용자가 "React" 태그 클릭
2. "TypeScript" 태그 추가 클릭
3. → React AND TypeScript를 모두 포함한 포스트만 표시
```

### 2. Tag Deselection

**요구사항**:
- 개별 태그 해제 가능
- 전체 태그 일괄 해제 (Clear All)
- URL 자동 업데이트

**UI 디자인**:
- 선택된 태그에 "×" 아이콘
- Sidebar 상단에 "Clear All Filters" 버튼
- Active Filters 섹션 추가

### 3. Search Enhancement

**요구사항**:
- 검색어 + 태그 필터 동시 사용
- Part/Group 필터와도 조합 가능
- 모든 필터 조합이 올바르게 작동

### 4. URL Parameter Deduplication

**요구사항**:
- 동일 태그 중복 선택 방지
- URL 중복 파라미터 자동 제거
- 잘못된 파라미터 조합 처리

**예시**:
```
잘못된: /?tag=React&tag=React&tag=TypeScript
정리됨: /?tag=React&tag=TypeScript
```

---

## 🛠 구현 계획

### Backend Changes

#### 1. 타입 정의 업데이트

**[NEW]** `src/types/filter.ts`

```typescript
/**
 * Filter operation types for multi-tag filtering
 */
export type FilterOperation = 'AND' | 'OR';

/**
 * Extended filter options for posts
 */
export interface PostFilterOptions {
  tags?: string[];
  searchQuery?: string;
  group?: string;
  locale?: string;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
  tagOperation?: FilterOperation;
}
```

#### 2. Service 로직 업데이트

**[MODIFY]** `src/lib/services/posts.service.ts`

핵심 변경사항:
- `tag?: string` → `tags?: string[]`
- 다중 태그 AND 필터링 로직 구현

```typescript
// Multi-tag AND filtering
if (tags.length > 0) {
  const hasAllTags = tags.every(selectedTag => 
    post.tags.includes(selectedTag)
  );
  if (!hasAllTags) return false;
}
```

### Frontend Changes

#### 1. Page Component 업데이트

**[MODIFY]** `src/app/[locale]/page.tsx`

```typescript
// 다중 태그 처리 + 중복 제거
const rawTags = resolvedSearchParams.tag;
const selectedTags: string[] = Array.isArray(rawTags) 
  ? [...new Set(rawTags)]
  : rawTags ? [rawTags] : [];
```

#### 2. Active Filters Component

**[NEW]** `src/components/utils/ActiveFilters.tsx`

기능:
- 선택된 태그/그룹 표시
- 개별 태그 해제 (× 버튼)
- 전체 필터 해제 (Clear All)

#### 3. Sidebar Component 업데이트

**[MODIFY]** `src/components/utils/Sidebar.tsx`

변경사항:
- Server Component → **Client Component**
- 단일 선택 Link → 버튼 기반 토글
- 다중 선택 상태 관리

```typescript
const toggleTag = (tag: string) => {
  const params = new URLSearchParams(searchParams.toString());
  const existingTags = params.getAll('tag');
  
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

#### 4. 번역 파일

**[MODIFY]** `messages/ko.json`, `messages/en.json`

```json
{
  "Filters": {
    "activeFilters": "활성 필터 / Active Filters",
    "clearAll": "전체 해제 / Clear All",
    "noFilters": "적용된 필터가 없습니다 / No filters applied"
  }
}
```

---

## 📅 구현 로드맵

### Phase 1: Backend (Day 1)
- [ ] `src/types/filter.ts` 생성
- [ ] `posts.service.ts` 다중 태그 로직 구현
- [ ] Unit 테스트 작성
- [ ] 로컬 테스트

### Phase 2: Frontend Components (Day 2)
- [ ] `ActiveFilters.tsx` 생성
- [ ] `Sidebar.tsx` Client Component 전환
- [ ] `page.tsx` URL 파라미터 배열 처리
- [ ] 번역 파일 업데이트

### Phase 3: URL Enhancement (Day 3)
- [ ] 중복 제거 유틸리티
- [ ] Edge case 처리
- [ ] 파라미터 정규화

### Phase 4: Testing & Docs (Day 4)
- [ ] E2E 테스트
- [ ] 모바일 반응형 테스트
- [ ] 문서화 업데이트

---

## ✅ 검증 계획

### Unit Tests

**[NEW]** `src/lib/services/__tests__/posts.service.multi-tag.test.ts`

```typescript
describe('Multi-tag filtering', () => {
  it('단일 태그 필터링', async () => {
    const posts = await getPublishedPosts({ tags: ['React'] });
    posts?.forEach(post => {
      expect(post.tags).toContain('React');
    });
  });

  it('다중 태그 AND 필터링', async () => {
    const posts = await getPublishedPosts({ 
      tags: ['React', 'TypeScript'] 
    });
    posts?.forEach(post => {
      expect(post.tags).toContain('React');
      expect(post.tags).toContain('TypeScript');
    });
  });
});
```

### E2E Tests

**[NEW]** `e2e/multi-tag-filter.spec.ts`

테스트 시나리오:
1. 다중 태그 선택 및 해제
2. 전체 필터 해제
3. URL 중복 파라미터 처리
4. 필터 조합 (search + tags + group)

### Manual Testing

#### Scenario 1: Multi-Tag Selection
1. `pnpm dev` 실행
2. "React" 태그 클릭 → URL 확인
3. "TypeScript" 추가 클릭 → 다중 태그 URL 확인
4. 포스트 목록이 올바르게 필터링되는지 확인

#### Scenario 2: Tag Deselection
1. Active Filters의 "×" 클릭
2. URL에서 해당 태그 제거 확인
3. "전체 해제" 클릭 → 모든 필터 제거 확인

---

## ⚠️ 주의사항

### Critical Issues

> [!WARNING]
> **Sidebar Component 변경**
> - Server Component → Client Component 전환 필요
> - SEO 영향 최소화를 위해 초기 렌더링은 Server에서 수행
> - `'use client'` 추가 필수

> [!WARNING]
> **하위 호환성**
> - 기존 `?tag=React` 형태 URL도 정상 작동해야 함
> - 북마크된 링크 깨지지 않도록 주의

### Performance

- 다중 태그 필터링은 메모리 내에서 수행
- 예상 성능: 100개 포스트 기준 < 20ms
- 태그 수 제한: 최대 10개 (합리적 UX)

### Security

```typescript
// XSS 방지를 위한 파라미터 정제
function sanitizeTagParam(tag: string): string {
  return tag
    .trim()
    .replace(/[<>'"]/g, '')
    .slice(0, 50);
}
```

---

## 🚀 Future Enhancements

### Phase 2 (Optional)
- [ ] OR 조건 필터링 (`React OR Vue`)
- [ ] 태그별 포스트 개수 표시 (`React (12)`)
- [ ] 저장된 필터 프리셋 (localStorage)
- [ ] 필터 히스토리

### Phase 3 (Optional)
- [ ] 고급 검색 모달
- [ ] 필터 공유 기능
- [ ] 연관 태그 추천

---

## 📝 체크리스트

### 구현 전 확인사항
- [ ] Notion Posts 데이터베이스에 충분한 태그 데이터 존재
- [ ] 다중 태그를 가진 포스트가 충분히 있는지 확인
- [ ] 기존 북마크/링크 목록 백업

### 구현 후 확인사항
- [ ] 모든 Unit 테스트 통과
- [ ] 모든 E2E 테스트 통과
- [ ] 모바일/데스크톱 반응형 확인
- [ ] 접근성 검증 (키보드, 스크린 리더)
- [ ] 성능 테스트 (100+ 포스트)
- [ ] `/docs/architectures` 문서 업데이트
- [ ] `CHANGELOG.md` 업데이트

---

## 📚 참고 자료

- [Next.js URL Params](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [React Router Query Params](https://reactrouter.com/en/main/hooks/use-search-params)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
