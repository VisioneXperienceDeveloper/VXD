# Testing Strategy

Vitest와 Playwright를 활용한 테스트 전략 문서입니다.

---

## 1. 개요

| 테스트 유형 | 도구 | 디렉토리 |
|-------------|------|----------|
| **Unit** | Vitest | `__tests__/unit/` |
| **E2E** | Playwright | `__tests__/e2e/` |
| **Mocks** | - | `__tests__/__mocks__/` |
| **Fixtures** | - | `__tests__/fixtures/` |

---

## 2. 명령어

```bash
pnpm test        # Unit 테스트 실행
pnpm test:e2e    # E2E 테스트 실행
pnpm test:ui     # Playwright UI 모드
```

---

## 3. Unit 테스트 (Vitest)

### 설정 (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['__tests__/unit/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### 테스트 파일 현황

| 파일 | 테스트 대상 |
|------|-------------|
| `LanguageToggle.test.tsx` | 언어 전환 버튼 |
| `ModeToggle.test.tsx` | 테마 전환 버튼 |
| `PostCard.test.tsx` | 게시물 카드 |
| `Search.test.tsx` | 검색 컴포넌트 |
| `Sidebar.test.tsx` | 사이드바 |

---

## 4. E2E 테스트 (Playwright)

### 설정 (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
```

### 테스트 파일 현황

| 파일 | 테스트 시나리오 |
|------|-----------------|
| `home.spec.ts` | 홈페이지 로딩, 네비게이션 |
| `search.spec.ts` | 검색 기능 |
| `post.spec.ts` | 게시물 상세 페이지 |

---

## 5. 추가 권장 테스트

- [ ] `notion.ts` 단위 테스트 (API 파싱 로직)
- [ ] `PostList.tsx` 테스트 (무한 스크롤)
- [ ] E2E 다국어 테스트 (`/en` 경로)
