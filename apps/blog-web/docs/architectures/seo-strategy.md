# SEO Strategy

검색 엔진 최적화(SEO) 전략 문서입니다.

---

## 1. 구현된 SEO 기능

| 기능 | 파일 | 상태 |
|------|------|------|
| 동적 메타데이터 | `[id]/page.tsx` | ✅ |
| Sitemap | `app/sitemap.ts` | ✅ |
| Robots.txt | `app/robots.ts` | ✅ |
| RSS Feed | `app/feed.xml/route.ts` | ✅ |
| Open Graph | Layout/Page | ✅ |
| Twitter Card | Layout/Page | ✅ |

---

## 2. 동적 메타데이터

### 게시물 상세 페이지 (`[id]/page.tsx`)

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostById(params.id);
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      images: post.cover ? [post.cover] : [],
    },
  };
}
```

---

## 3. Sitemap (`app/sitemap.ts`)

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  
  return [
    { url: 'https://example.com', lastModified: new Date() },
    ...posts.map(post => ({
      url: `https://example.com/${post.id}`,
      lastModified: new Date(post.date),
    })),
  ];
}
```

---

## 4. Robots.txt (`app/robots.ts`)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

---

## 5. RSS Feed (`app/feed.xml/route.ts`)

- **형식**: RSS 2.0
- **경로**: `/feed.xml`
- **내용**: 모든 발행된 게시물
