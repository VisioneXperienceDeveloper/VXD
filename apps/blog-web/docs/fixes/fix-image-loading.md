# Fix: Image Loading Issue

> 수정일: 2026-01-05

---

## 문제

일부 게시물에서 **커버 이미지가 로드되지 않는** 문제 발생.

이미지 영역이 비어있거나 깨진 이미지 아이콘 표시.

---

## 원인

Notion에서 제공하는 이미지 URL 문제:

1. **외부 URL (`external`)**: 제3자 이미지 호스팅 서비스 URL
2. **Notion 파일 URL (`file`)**: Notion 자체 CDN URL (만료될 수 있음)

Notion의 `file` 타입 이미지 URL은 **일정 시간 후 만료**됨.

---

## 해결

1. **`next.config.ts`에 이미지 도메인 추가**:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'www.notion.so' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      // 다른 필요한 도메인 추가
    ],
  },
};
```

2. **이미지 URL 파싱 로직 수정** (`notion.ts`):

```typescript
let cover: string | null = null;
if (p.cover?.type === 'external') {
  cover = p.cover.external.url;
} else if (p.cover?.type === 'file') {
  cover = p.cover.file.url;  // 만료될 수 있음
}
```

---

## 추가 고려사항

- Notion 이미지 URL 만료 문제 해결을 위해 **이미지 프록시** 또는 **CDN 캐싱** 고려
- 이미지 로드 실패 시 **대체 이미지(fallback)** 표시

---

## 관련 파일

- [next.config.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/next.config.ts)
- [notion.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/lib/notion.ts)
