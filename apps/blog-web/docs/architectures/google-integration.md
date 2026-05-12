# Google Integrations

Google 관련 Third-party 서비스 통합 가이드입니다.

---

## 1. 통합 된 서비스 목록

| 서비스 | 용도 | 패키지/방식 |
|--------|------|-------------|
| **Google Analytics 4 (GA4)** | 사용자 방문 및 행동 트래킹 | `src/components/delegator/GoogleAnalytics.tsx` |
| **Google AdSense** | 광고 수익화 | `src/components/delegator/GoogleAdSense.tsx` |
| **Google Tag Manager (GTM)** | 마케팅 태그 관리 | `@next/third-parties/google` |
| **Google Fonts** | 타이포그래피 (Geist) | `next/font/google` |
| **Google Search Console** | 검색 엔진 최적화 | `sitemap.xml`, `robots.txt` |

---

## 2. 환경 변수 설정

`.env` 파일에 다음 키들이 설정되어야 합니다.

```bash
# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# Google AdSense Publisher ID
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

---

## 3. 구현 상세

### 3.1 Layout 통합 (`app/[locale]/layout.tsx`)

루트 레이아웃에서 모든 Google 서비스가 초기화됩니다.

```tsx
// Google Tag Manager (Body 상단)
<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />

// Google Analytics & AdSense (NextIntlProvider 내부)
<GoogleAnalytics />
<GoogleAdSense pId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID!} />
```

### 3.2 Google Tag Manager (GTM)

- **라이브러리**: Next.js 공식 `@next/third-parties/google` 사용
- **위치**: `<body>` 태그 바로 아래 등 최상위 레벨에 위치하여 페이지 로드 시 즉시 실행 보장

### 3.3 Google Analytics (GA4)

- **컴포넌트**: `src/components/delegator/GoogleAnalytics.tsx`
- **구현**: 클라이언트 컴포넌트 (`use client`)
- **특징**: `window.dataLayer` 또는 `gtag` 초기화 로직을 포함할 수 있음 (현재 파일 확인 필요)

### 3.4 Google AdSense

- **컴포넌트**: `src/components/delegator/GoogleAdSense.tsx`
- **검증 메타 태그**: `layout.tsx`의 `metadata`에 계정 정보 포함
  ```typescript
  other: {
    "google-adsense-account": "ca-pub-XXXXXXXXXXXXXXXX",
  },
  ```

### 3.5 Google Fonts (Geist)

- `next/font/google`을 사용하여 **Zero Layout Shift** 및 자동 최적화 적용
- `Geist Sans` 및 `Geist Mono` 폰트 사용

```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

---

## 4. 주의사항

- **Hydration Warning**: `body` 태그에 `suppressHydrationWarning`이 추가되어 있어, GTM 등의 스크립트 주입으로 인한 불일치 경고를 방지합니다.
- **성능 영향**: 타사 스크립트는 메인 스레드를 점유할 수 있으므로 `next/script`의 `strategy="afterInteractive"` 등을 사용하는 것이 권장됩니다 (현재 구현 확인 필요).
