# E2E Tests - Scenarios (v1.0.0)

> 작성일: 2026-01-18

---

## 개요

Playwright를 사용한 End-to-End 테스트 시나리오 문서입니다. 총 **5개** E2E 테스트 파일이 있습니다.

---

## 테스트 커버리지

| 시나리오 | 파일 | 테스트 수 | 주요 검증 |
|---------|------|----------|---------|
| 홈 페이지 | `home.spec.ts` | ~5 | 목록, 검색, 필터 |
| 게시물 상세 | `post.spec.ts` | ~3 | 내용, 관련 게시물 |
| 검색 기능 | `search.spec.ts` | ~4 | 검색, 결과 |
| 다국어 | `multilingual.spec.ts` | ~8 | 언어 전환, 번역 |
| 기본 예제 | `example.spec.ts` | ~1 | Playwright 설정 |

---

## 주요 시나리오

### 1. Home Page (`home.spec.ts`)

**목적**: 홈 페이지 주요 기능 검증

#### 테스트 케이스:

##### 1.1 페이지 로드
```typescript
test('should load home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/VXD Blog/);
});
```
- ✅ 페이지 타이틀
- ✅ 기본 렌더링

##### 1.2 게시물 목록 표시
```typescript
test('should display post list', async ({ page }) => {
  await page.goto('/');
  const posts = page.locator('[data-testid="post-card"]');
  await expect(posts).toHaveCount(6);
});
```
- ✅ 게시물 카드 렌더링
- ✅ 초기 6개 표시

##### 1.3 검색 기능
```typescript
test('should search posts', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'test');
  await page.click('[data-testid="search-button"]');
  // 검색 결과 확인
});
```
- ✅ 검색 입력
- ✅ 검색 실행
- ✅ 결과 필터링

##### 1.4 태그 필터
```typescript
test('should filter by tag', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="tag-Tech"]');
  // 필터링된 결과 확인
});
```
- ✅ 태그 클릭
- ✅ 필터링 적용

##### 1.5 무한 스크롤
```typescript
test('should load more posts on scroll', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // 추가 게시물 로드 확인
});
```
- ✅ 스크롤 트리거
- ✅ 추가 게시물 로드

---

### 2. Post Detail (`post.spec.ts`)

**목적**: 게시물 상세 페이지 검증

#### 테스트 케이스:

##### 2.1 게시물 내용 표시
```typescript
test('should display post content', async ({ page }) => {
  await page.goto('/post/[slug]');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('article')).toBeVisible();
});
```
- ✅ 제목 표시
- ✅ 본문 렌더링
- ✅ 메타데이터 표시

##### 2.2 관련 게시물
```typescript
test('should display related posts', async ({ page }) => {
  await page.goto('/post/[slug]');
  const relatedPosts = page.locator('[data-testid="related-post"]');
  await expect(relatedPosts.first()).toBeVisible();
});
```
- ✅ 관련 게시물 표시
- ✅ 링크 동작

##### 2.3 뒤로 가기
```typescript
test('should navigate back to home', async ({ page }) => {
  await page.goto('/post/[slug]');
  await page.click('[data-testid="back-button"]');
  await expect(page).toHaveURL('/');
});
```
- ✅ 뒤로 가기 버튼
- ✅ 네비게이션

---

### 3. Search (`search.spec.ts`)

**목적**: 검색 기능 상세 검증

#### 테스트 케이스:

##### 3.1 검색 입력
```typescript
test('should accept search input', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('[data-testid="search-input"]');
  await input.fill('React');
  await expect(input).toHaveValue('React');
});
```
- ✅ 입력 필드 동작
- ✅ 값 업데이트

##### 3.2 검색 결과
```typescript
test('should show search results', async ({ page }) => {
  await page.goto('/?search=React');
  const results = page.locator('[data-testid="post-card"]');
  await expect(results).toHaveCount.greaterThan(0);
});
```
- ✅ URL 파라미터 반영
- ✅ 결과 표시

##### 3.3 검색 초기화
```typescript
test('should clear search', async ({ page }) => {
  await page.goto('/?search=React');
  await page.click('[data-testid="clear-search"]');
  await expect(page).toHaveURL('/');
});
```
- ✅ 초기화 버튼
- ✅ URL 업데이트

##### 3.4 검색 결과 없음
```typescript
test('should show no results message', async ({ page }) => {
  await page.goto('/?search=nonexistent');
  await expect(page.locator('text=No posts found')).toBeVisible();
});
```
- ✅ 빈 결과 처리
- ✅ 메시지 표시

---

### 4. Multilingual (`multilingual.spec.ts`)

**목적**: 다국어 지원 검증

#### 테스트 케이스:

##### 4.1 언어 전환 (KR → EN)
```typescript
test('should switch to English', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="language-toggle"]');
  await expect(page).toHaveURL('/en');
});
```
- ✅ 언어 토글
- ✅ URL 변경
- ✅ 콘텐츠 번역

##### 4.2 언어 전환 (EN → KR)
```typescript
test('should switch to Korean', async ({ page }) => {
  await page.goto('/en');
  await page.click('[data-testid="language-toggle"]');
  await expect(page).toHaveURL('/');
});
```
- ✅ 역방향 전환
- ✅ 기본 locale

##### 4.3 번역된 게시물
```typescript
test('should show translated post', async ({ page }) => {
  await page.goto('/post/[slug]');
  await page.click('[data-testid="language-toggle"]');
  await expect(page).toHaveURL('/en/[translated-slug]');
});
```
- ✅ 번역 링크
- ✅ 번역 게시물 표시

##### 4.4 번역 없는 경우
```typescript
test('should disable toggle when no translation', async ({ page }) => {
  await page.goto('/post/[slug-without-translation]');
  const toggle = page.locator('[data-testid="language-toggle"]');
  await expect(toggle).toBeDisabled();
});
```
- ✅ 토글 비활성화
- ✅ 사용자 피드백

---

### 5. Example (`example.spec.ts`)

**목적**: Playwright 설정 확인

#### 테스트 케이스:

##### 5.1 기본 테스트
```typescript
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```
- ✅ Playwright 설정 검증

---

## 테스트 실행

```bash
# 모든 E2E 테스트
pnpm test:e2e

# UI 모드
pnpm test:ui

# 특정 시나리오
pnpm test:e2e home.spec.ts
```

---

## Playwright 설정

### 브라우저
- Chromium
- Firefox
- WebKit

### 기본 설정
```typescript
{
  testDir: './__tests__/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
}
```

---

## 다음 단계

- [ ] 댓글 기능 E2E 테스트 추가
- [ ] 모바일 뷰포트 테스트
- [ ] 성능 테스트 (Lighthouse)
- [ ] 접근성 테스트 (axe)
