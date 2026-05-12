# Unit Tests - Library (v1.0.0)

> 작성일: 2026-01-18

---

## 개요

라이브러리 및 유틸리티 함수 단위 테스트 문서입니다. 총 **4개** 테스트 파일이 있습니다.

---

## 테스트 커버리지

| 모듈 | 파일 | 테스트 수 | 커버리지 영역 |
|------|------|----------|-------------|
| Notion API | `notion.test.ts` | ~25 | API 통합, 데이터 파싱 |
| Posts Helper | `posts.helper.test.ts` | ~15 | 데이터 추출, 변환 |
| Translator | `translator.test.ts` | ~8 | 번역 ID 추출 |
| Utils | `utils.test.ts` | ~3 | cn 함수 |

---

## 주요 테스트 케이스

### 1. Notion API (`notion.test.ts`)

**테스트 대상**: Notion API 통합 및 데이터 처리

#### 주요 테스트:
- ✅ `getCachedAllPosts`: 전체 게시물 조회
- ✅ `getPublishedPosts`: 필터링된 게시물
  - 미래 게시물 필터링
  - Locale 필터링 (KR/EN)
  - 태그 필터링
  - 검색 쿼리 필터링
  - 그룹 필터링
- ✅ `getAllTags`: 모든 태그 추출
- ✅ `getAllGroups`: 모든 그룹 추출
- ✅ `getTopTags`: 상위 5개 태그
- ✅ `groupPosts`: 그룹별 게시물 분류
- ✅ `getPageContent`: 페이지 콘텐츠 조회
- ✅ `getPostById`: ID로 게시물 조회
- ✅ `getPostBySlug`: Slug로 게시물 조회
- ✅ `incrementViewCount`: 조회수 증가

#### 커버리지:
- API 호출 성공/실패
- 데이터 파싱
- 캐싱 동작
- 에러 처리

---

### 2. Posts Helper (`posts.helper.test.ts`)

**테스트 대상**: 게시물 데이터 추출 및 변환 헬퍼 함수

#### 주요 테스트:
- ✅ `extractBlogPostFromPage`: Notion 페이지 → BlogPost 변환
  - Title 추출
  - Date 추출
  - Tags 추출
  - Cover 이미지 추출
  - Description 추출
  - Group, Part 추출
  - Language 추출
  - Translation ID 추출
  - View Count 추출
- ✅ `getTextValue`: 텍스트 속성 추출
- ✅ `getDateValue`: 날짜 속성 추출
- ✅ `getMultiSelectValue`: 다중 선택 속성 추출
- ✅ `getSelectValue`: 선택 속성 추출
- ✅ `getNumberValue`: 숫자 속성 추출
- ✅ `getRelationValue`: 관계 속성 추출

#### 커버리지:
- 모든 Notion 속성 타입
- null/undefined 처리
- 기본값 처리

---

### 3. Translator (`translator.test.ts`)

**테스트 대상**: 번역 ID 추출 유틸리티

#### 주요 테스트:
- ✅ `extractTranslationId`: 번역 ID 추출
  - 유효한 ID 추출
  - 잘못된 형식 처리
  - null/undefined 처리
  - 빈 문자열 처리
- ✅ `getTranslatedSlug`: 번역된 Slug 조회
  - 번역 존재 시
  - 번역 없을 시
  - 에러 처리

#### 커버리지:
- 정규식 매칭
- 에지 케이스
- 에러 처리

---

### 4. Utils (`utils.test.ts`)

**테스트 대상**: 유틸리티 함수

#### 주요 테스트:
- ✅ `cn`: 클래스명 병합
  - 기본 병합
  - Tailwind 충돌 해결
  - 조건부 클래스

#### 커버리지:
- clsx + tailwind-merge 통합
- 다양한 입력 형식

---

## 테스트 실행

```bash
# 모든 라이브러리 테스트
pnpm test lib

# 특정 모듈
pnpm test notion.test.ts
pnpm test posts.helper.test.ts
```

---

## Mock 전략

### Notion API Mock
```typescript
vi.mock('@notionhq/client', () => ({
  Client: vi.fn(() => ({
    dataSources: {
      query: vi.fn(),
    },
    pages: {
      retrieve: vi.fn(),
      update: vi.fn(),
    },
    blocks: {
      children: {
        list: vi.fn(),
      },
    },
  })),
}));
```

### Fixture 데이터
- `fixtures/notion-data.ts`: Mock 게시물 데이터

---

## 다음 단계

- [ ] Comments Service 테스트 추가
- [ ] 에러 시나리오 확대
- [ ] 성능 테스트 추가
