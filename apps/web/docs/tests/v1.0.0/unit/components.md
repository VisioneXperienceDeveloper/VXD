# Unit Tests - Components (v1.0.0)

> 작성일: 2026-01-18

---

## 개요

컴포넌트 단위 테스트 문서입니다. 총 **13개** 컴포넌트 테스트 파일이 있습니다.

---

## 테스트 커버리지

| 컴포넌트 | 파일 | 테스트 수 | 커버리지 영역 |
|---------|------|----------|-------------|
| Footer | `Footer.test.tsx` | ~5 | 렌더링, 링크, 다국어 |
| GoogleAnalytics | `GoogleAnalytics.test.tsx` | ~4 | 스크립트 주입, 환경변수 |
| LanguageToggle | `LanguageToggle.test.tsx` | ~6 | 토글, 번역 링크 |
| ModeToggle | `ModeToggle.test.tsx` | ~8 | 테마 전환, 아이콘 |
| PostCard | `PostCard.test.tsx` | ~4 | 렌더링, 이미지, 링크 |
| PostEngagement | `PostEngagement.test.tsx` | ~7 | 조회수 포맷팅, 다국어 |
| PostList | `PostList.test.tsx` | ~15 | 무한 스크롤, 페이지네이션 |
| Search | `Search.test.tsx` | ~10 | 검색 입력, 필터링 |
| Sidebar | `Sidebar.test.tsx` | ~3 | 태그 표시 |
| ThemeProvider | `ThemeProvider.test.tsx` | ~4 | Context 제공 |
| ViewTracker | `ViewTracker.test.tsx` | ~6 | API 호출, useEffect |
| BlockRenderer | `notion/BlockRenderer.test.tsx` | ~20 | 블록 타입별 렌더링 |
| TextRenderer | `notion/TextRenderer.test.tsx` | ~10 | 텍스트 스타일, 링크 |

---

## 주요 테스트 케이스

### 1. Footer (`Footer.test.tsx`)
- ✅ Footer 렌더링
- ✅ 저작권 텍스트 표시
- ✅ 링크 정확성
- ✅ 다국어 지원

### 2. GoogleAnalytics (`GoogleAnalytics.test.tsx`)
- ✅ GA 스크립트 로딩
- ✅ 환경변수 확인
- ✅ dataLayer 초기화
- ✅ 클라이언트 컴포넌트 동작

### 3. LanguageToggle (`LanguageToggle.test.tsx`)
- ✅ 언어 토글 버튼 렌더링
- ✅ 번역 링크 생성
- ✅ 번역 없을 때 처리
- ✅ 아이콘 표시

### 4. ModeToggle (`ModeToggle.test.tsx`)
- ✅ 테마 전환 버튼 렌더링
- ✅ 다크/라이트/시스템 모드 전환
- ✅ 드롭다운 메뉴
- ✅ 아이콘 변경

### 5. PostCard (`PostCard.test.tsx`)
- ✅ 게시물 카드 렌더링
- ✅ 커버 이미지 표시
- ✅ 태그 표시
- ✅ 링크 정확성

### 6. PostEngagement (`PostEngagement.test.tsx`)
- ✅ 조회수 표시
- ✅ 숫자 포맷팅 (1K, 1M)
- ✅ 다국어 레이블
- ✅ 0 조회수 처리

### 7. PostList (`PostList.test.tsx`)
- ✅ 게시물 목록 렌더링
- ✅ 무한 스크롤 트리거
- ✅ 로딩 상태
- ✅ hasMore 플래그
- ✅ 필터 변경 시 초기화
- ✅ IntersectionObserver 동작

### 8. Search (`Search.test.tsx`)
- ✅ 검색 입력 렌더링
- ✅ 검색어 입력
- ✅ 검색 제출
- ✅ 검색 초기화
- ✅ URL 파라미터 업데이트

### 9. Sidebar (`Sidebar.test.tsx`)
- ✅ 사이드바 렌더링
- ✅ 태그 목록 표시
- ✅ 그룹 표시

### 10. ThemeProvider (`ThemeProvider.test.tsx`)
- ✅ Provider 렌더링
- ✅ Context 제공
- ✅ children 렌더링

### 11. ViewTracker (`ViewTracker.test.tsx`)
- ✅ 컴포넌트 마운트
- ✅ API 호출 (조회수 증가)
- ✅ useEffect 동작
- ✅ 에러 처리

### 12. BlockRenderer (`notion/BlockRenderer.test.tsx`)
- ✅ Paragraph 블록
- ✅ Heading 블록 (h1, h2, h3)
- ✅ Bulleted List
- ✅ Numbered List
- ✅ Code 블록
- ✅ Image 블록
- ✅ Quote 블록
- ✅ Divider 블록
- ✅ Unsupported 블록

### 13. TextRenderer (`notion/TextRenderer.test.tsx`)
- ✅ 일반 텍스트
- ✅ Bold, Italic, Underline
- ✅ Strikethrough, Code
- ✅ 링크
- ✅ 복합 스타일

---

## 테스트 실행

```bash
# 모든 컴포넌트 테스트
pnpm test components

# 특정 컴포넌트
pnpm test PostList.test.tsx
```

---

## 다음 단계

- [ ] 댓글 컴포넌트 테스트 추가
- [ ] 커버리지 90% 달성
- [ ] 스냅샷 테스트 추가
