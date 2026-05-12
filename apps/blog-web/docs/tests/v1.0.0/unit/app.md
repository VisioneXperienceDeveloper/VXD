# Unit Tests - App (v1.0.0)

> 작성일: 2026-01-18

---

## 개요

App 레벨 서버 액션 단위 테스트 문서입니다. 총 **1개** 테스트 파일이 있습니다.

---

## 테스트 커버리지

| 모듈 | 파일 | 테스트 수 | 커버리지 영역 |
|------|------|----------|-------------|
| Server Actions | `actions.test.ts` | 6 | fetchPosts 페이지네이션 |

---

## 주요 테스트 케이스

### `actions.test.ts` - fetchPosts 서버 액션

**테스트 대상**: 무한 스크롤을 위한 게시물 페칭 서버 액션

#### 테스트 케이스:

##### 1. 첫 페이지 조회
```typescript
it('should return first page of posts', async () => {
  const result = await fetchPosts({ page: 1 });
  expect(result.posts).toHaveLength(6);
  expect(result.hasMore).toBe(false);
});
```
- ✅ 6개 게시물 반환
- ✅ `hasMore` 플래그 정확성

##### 2. 페이지네이션 (hasMore = true)
```typescript
it('should return paginated posts with hasMore true', async () => {
  const result = await fetchPosts({ page: 1 });
  expect(result.posts).toHaveLength(6);
  expect(result.hasMore).toBe(true);
});
```
- ✅ 더 많은 게시물이 있을 때 `hasMore: true`
- ✅ 6개씩 페이지네이션

##### 3. 두 번째 페이지 조회
```typescript
it('should return second page of posts', async () => {
  const result = await fetchPosts({ page: 2 });
  expect(result.posts).toHaveLength(4);
  expect(result.hasMore).toBe(false);
});
```
- ✅ 두 번째 페이지 정확한 게시물 수
- ✅ 마지막 페이지 `hasMore: false`

##### 4. Null 처리
```typescript
it('should return empty posts when getPublishedPosts returns null', async () => {
  const result = await fetchPosts({ page: 1 });
  expect(result.posts).toEqual([]);
  expect(result.hasMore).toBe(false);
});
```
- ✅ API 실패 시 빈 배열 반환
- ✅ 에러 처리

##### 5. 필터 파라미터 전달
```typescript
it('should pass filter parameters to getPublishedPosts', async () => {
  await fetchPosts({ 
    page: 1, 
    tag: 'Tech', 
    search: 'test', 
    group: 'Group 1', 
    locale: 'en' 
  });
  
  expect(getPublishedPosts).toHaveBeenCalledWith({ 
    tag: 'Tech', 
    searchQuery: 'test', 
    group: 'Group 1', 
    locale: 'en' 
  });
});
```
- ✅ 태그 필터 전달
- ✅ 검색어 전달
- ✅ 그룹 필터 전달
- ✅ Locale 전달

##### 6. 기본 Locale
```typescript
it('should use default locale when not provided', async () => {
  await fetchPosts({ page: 1 });
  expect(getPublishedPosts).toHaveBeenCalledWith({ locale: 'ko' });
});
```
- ✅ Locale 미제공 시 'ko' 기본값

---

## Mock 전략

### Posts Service Mock
```typescript
vi.mock('@/lib/services/posts.service', () => ({
  getPublishedPosts: vi.fn(),
}));
```

### Fixture 사용
```typescript
import { mockBlogPosts } from '../../fixtures/notion-data';
```

---

## 페이지네이션 로직

```typescript
const POSTS_PER_PAGE = 6;
const startIndex = (page - 1) * POSTS_PER_PAGE;
const endIndex = startIndex + POSTS_PER_PAGE;
const paginatedPosts = allPosts.slice(startIndex, endIndex);
const hasMore = endIndex < allPosts.length;
```

---

## 테스트 실행

```bash
# App 테스트
pnpm test actions.test.ts
```

---

## 다음 단계

- [ ] 에러 시나리오 추가
- [ ] 성능 테스트 (대량 데이터)
- [ ] 캐싱 동작 검증
