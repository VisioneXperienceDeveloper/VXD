# Fix: Image Sizing Issue

> 수정일: 2026-01-05

---

## 문제

게시물 카드의 커버 이미지가 **비효율적인 크기로 로드**되는 문제.

브라우저에서 불필요하게 큰 이미지를 다운로드하여 성능 저하 발생.

---

## 원인

`PostCard.tsx`에서 `next/image`의 `sizes` 속성이 `"100%"`로 설정되어 있었음.

```tsx
// Before (문제 코드)
<Image
  src={post.cover}
  fill
  sizes="100%"  // 비효율적
/>
```

`sizes="100%"`는 유효한 값이 아니며, 브라우저가 가장 큰 이미지를 선택하게 함.

---

## 해결

반응형 레이아웃에 맞는 `sizes` 값으로 수정:

```tsx
// After (수정된 코드)
<Image
  src={post.cover}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

- **모바일 (≤640px)**: 100vw (전체 너비)
- **태블릿 (≤1024px)**: 50vw (화면의 절반)
- **데스크톱**: 33vw (3컬럼 그리드)

---

## 효과

- 불필요한 대용량 이미지 다운로드 방지
- 페이지 로딩 속도 개선
- Core Web Vitals (LCP) 향상

---

## 관련 파일

- [PostCard.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/components/PostCard.tsx)
