# Fix: Infinite Scroll Locale Issue

> 수정일: 2026-01-06

---

## 문제

무한 스크롤에서 항상 **한국어(KR) 게시물만 로드**되는 문제 발생.

영어 페이지(`/en`)에서 스크롤해도 한국어 게시물이 추가로 로드됨.

---

## 원인

`fetchPosts` 서버 액션 호출 시 **`locale` 파라미터가 전달되지 않음**.

```typescript
// Before (문제 코드)
const result = await fetchPosts({
  page: nextPage,
  tag,
  search,
  group,
  // locale 누락!
});
```

---

## 해결

`PostList` 컴포넌트에서 `locale` prop을 `fetchPosts` 액션에 전달하도록 수정.

```typescript
// After (수정된 코드)
const result = await fetchPosts({
  page: nextPage,
  tag,
  search,
  group,
  locale,  // locale 추가
});
```

---

## 관련 파일

- [PostList.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/components/PostList.tsx)
- [actions.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/app/actions.ts)
