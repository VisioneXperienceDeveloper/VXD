# Test Coverage Summary (v1.0.0)

> 작성일: 2026-01-18

---

## 전체 테스트 현황

| 테스트 유형 | 파일 수 | 테스트 케이스 수 (추정) | 상태 |
|------------|---------|----------------------|------|
| **Unit Tests** | 18 | ~120+ | ✅ |
| **E2E Tests** | 5 | ~15+ | ✅ |
| **Total** | **23** | **~135+** | ✅ |

---

## Unit Tests 상세

### Components (12 files)

| 파일 | 테스트 대상 | 주요 테스트 |
|------|-----------|-----------|
| `Footer.test.tsx` | Footer 컴포넌트 | 렌더링, 링크 |
| `GoogleAnalytics.test.tsx` | GA 통합 | 스크립트 로딩 |
| `LanguageToggle.test.tsx` | 언어 전환 | 토글 동작 |
| `ModeToggle.test.tsx` | 테마 전환 | 다크/라이트 모드 |
| `PostCard.test.tsx` | 게시물 카드 | 렌더링, 링크 |
| `PostEngagement.test.tsx` | 조회수 표시 | 숫자 포맷팅 |
| `PostList.test.tsx` | 무한 스크롤 | 페이지네이션, 로딩 |
| `Search.test.tsx` | 검색 기능 | 입력, 필터링 |
| `Sidebar.test.tsx` | 사이드바 | 태그 표시 |
| `ThemeProvider.test.tsx` | 테마 제공자 | Context 제공 |
| `ViewTracker.test.tsx` | 조회수 추적 | API 호출 |
| `notion/BlockRenderer.test.tsx` | Notion 블록 | 블록 렌더링 |
| `notion/TextRenderer.test.tsx` | Notion 텍스트 | 텍스트 렌더링 |

### Library (4 files)

| 파일 | 테스트 대상 | 주요 테스트 |
|------|-----------|-----------|
| `notion.test.ts` | Notion API 통합 | 데이터 페칭, 파싱 |
| `posts.helper.test.ts` | 게시물 헬퍼 | 데이터 추출, 변환 |
| `translator.test.ts` | 번역 유틸리티 | 언어 변환 |
| `utils.test.ts` | 유틸리티 함수 | cn 함수 |

### App (1 file)

| 파일 | 테스트 대상 | 주요 테스트 |
|------|-----------|-----------|
| `actions.test.ts` | 서버 액션 | fetchPosts 페이지네이션 |

---

## E2E Tests 상세

| 파일 | 시나리오 | 주요 검증 |
|------|---------|---------|
| `home.spec.ts` | 홈 페이지 | 게시물 목록, 검색, 필터 |
| `post.spec.ts` | 게시물 상세 | 내용 표시, 관련 게시물 |
| `search.spec.ts` | 검색 기능 | 검색 결과, 필터링 |
| `multilingual.spec.ts` | 다국어 지원 | 언어 전환, 번역 |
| `example.spec.ts` | 기본 예제 | Playwright 설정 확인 |

---

## 테스트 프레임워크

| 도구 | 용도 | 버전 |
|------|------|------|
| **Vitest** | Unit Testing | Latest |
| **Playwright** | E2E Testing | ^1.57.0 |
| **Testing Library** | React Testing | Latest |

---

## 테스트 실행 명령어

```bash
# Unit Tests
pnpm test

# E2E Tests
pnpm test:e2e

# E2E with UI
pnpm test:ui
```

---

## 커버리지 목표

| 영역 | 현재 상태 | 목표 |
|------|----------|------|
| Components | ✅ 높음 | 90%+ |
| Services | ✅ 높음 | 85%+ |
| Utils | ✅ 높음 | 95%+ |
| E2E Flows | ✅ 주요 흐름 | 핵심 시나리오 |

---

## 상세 문서

- [Unit Tests - Components](./unit/components.md)
- [Unit Tests - Library](./unit/lib.md)
- [Unit Tests - App](./unit/app.md)
- [E2E Tests - Scenarios](./e2e/scenarios.md)
