# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.15.0] - 2026-03-30

### Changed
-   **Architecture**: Refactored the blog into a comprehensive personal portfolio / resume website.
-   **Routing**: Moved existing blog posts from `/` to `/blog` and `/[slug]` to `/blog/[slug]`.
-   **Navigation**: Implemented a global fixed Header containing Home, About, Projects, Blog, and Contact links, replacing the floating right-side toggles on the blog page.
-   **Pages**:
    - Created a new landing page (`/`) with a Resume/Hero style design.
    - Created a new Projects page (`/projects`) to showcase portfolio items.
    - Created a new Contact page (`/contact`) with a functional contact form mockup.
-   **i18n**: Added global Header navigation translations to `ko.json` and `en.json`.

## [0.14.1] - 2026-03-29

### Fixed
-   **Performance**: Disabled Vercel Image Optimization for Notion images to prevent exceeding the "Cache Writes" quota (`unoptimized={true}`).
-   **Tests**: Resolved unit test failures by fixing module aliasing for `next/navigation` and `next-intl`.

## [0.14.0] - 2026-01-27

### Fixed
- **Stability**: Notion Client 타임아웃을 60초에서 3분으로 증설하여 `500 Internal Server Error` 해결
- **AdSense Compliance**: 구글 애드센스 필수 정책 충족을 위한 연락처 정보 추가
  - About 페이지: 이메일 문의 버튼 추가
  - Footer: 문의하기(Contact) 링크 추가
  - i18n: 관련 다국어 번역 추가

## [0.13.2] - 2026-01-27

### Added
- **Shared Cover Image**: 번역된 게시물 간 커버 이미지 공유 기능 추가
  - 번역본(예: 영어)에 커버 이미지가 없으면 원본(예: 한국어)의 커버 이미지를 자동으로 사용
  - Notion에서 중복 이미지 업로드 불필요

## [0.13.1] - 2026-01-27

### Fixed
- **Image Optimization**: Vercel 이미지 최적화 사용량 감소를 위한 설정 변경
  - `next.config.ts`: `deviceSizes`, `imageSizes` 축소 및 `avif` 포맷 제거
  - `BlockRenderer.tsx`: 블로그 본문 이미지 `unoptimized={true}` 적용 (Vercel 최적화 우회)

## [0.13.0] - 2026-01-26

### Added
- **Syntax Highlighting**: 코드 블록에 구문 강조 기능 추가 (Syntax Highlighting)
  - `react-syntax-highlighter` 도입 및 `Atom Dark` 테마 적용
  - 언어별 구문 강조 및 가독성 개선
  - 기존 복사 버튼 위치 및 디자인 최적화

## [0.12.0] - 2026-01-24

### Fixed
- **E2E Tests**: `home.spec.ts`의 "No Internet Connection" 상태 처리 로직 추가로 테스트 안정성 확보
- **Type Safety**: Core Layer, Components, Utils (Translator, i18n) 및 Test Code 전반에서 `any` 타입을 제거하고 Strict Type 적용 (`Locale`, `BlockObjectResponse` 등)

### Testing
- **Coverage**: Unit Test (Entity, UseCase, Repository) 및 E2E Test (87 tests) 전체 통과
- **Build**: Production Build (SSG) 검증 완료

---

## [0.11.0] - 2026-01-24

### Refactor
- **Clean Architecture Migration**: 전체 아키텍처를 Clean Architecture (Use Cases, Entities, Repositories)로 전환
  - **Dependency Injection**: `di/container.ts`를 통한 의존성 주입 중앙화
  - **Layers**:
    - **Domain Layer**: Entity & Interface 정의
    - **Application Layer**: Use Cases 구현
    - **Infrastructure Layer**: Repository & Mapper 구현
  - **Legacy Code Removal**: 기존 service layer (`posts.service.ts`, `comments.service.ts`) 제거
  - **Testing**: Actions 테스트를 DI mock 방식으로 마이그레이션

### Performance
- **Caching Strategy**: Notion API 응답 캐싱으로 전환 (Entity 메서드 보존 및 직렬화 문제 해결)

---

## [0.10.0] - 2026-01-23

### Added
- **코드 블록 복사 기능 (Code Block Copy Button)**: 코드 블록에 원클릭 복사 기능 추가
  - `CodeBlock` 컴포넌트: Clipboard API 기반 복사 기능
  - 호버 시 언어 배지 및 복사 버튼 표시
  - 복사 성공 시 시각적 피드백 (체크마크 아이콘)
  - 다크 모드 지원 및 반응형 디자인

---

## [0.9.0] - 2026-01-21

### Added
- **고급 필터 기능 (Advanced Search & Filter)**: 다중 태그 선택 및 필터링 구현
  - 다중 태그 동시 선택 가능 (AND 조건 필터링)
  - `ActiveFilters` 컴포넌트: 선택된 필터 표시 및 관리
  - Sidebar Client Component 전환: 인터랙티브한 태그 토글
  - URL 파라미터 중복 제거 및 상태 관리
  - 개별 태그 해제 (× 버튼) 및 전체 해제 기능
  - 하위 호환성 유지: 기존 단일 태그 URL 지원

---

## [0.8.0] - 2026-01-20

### Added
- **정렬 기능 (Post Sorting)**: 발행일, 조회수, 댓글수 기준 정렬 구현
  - 서버 측 정렬 로직 (`posts.service.ts`)
  - URL 파라미터를 통한 상태 관리 (`?sort=...`)
  - `SortDropdown` 컴포넌트 추가 및 다국어 지원
  - Notion API 호출 캐싱 최적화 (6시간)

---

## [0.7.0] - 2026-01-16

### Added
- **댓글 시스템**: Notion 기반 댓글 기능 구현
  - 댓글 작성 및 조회 (CommentSection, CommentForm, CommentList)
  - 서버 측 검증 (길이 제한, URL 차단)
  - Rate Limiting (10분당 3개 제한)
  - 1분 캐싱 적용
  - 다국어 지원 (i18n)

---

## [0.6.0] - 2026-01-14

### Refactor
- **Service Pattern**: `notion.ts`를 `services/posts.service.ts` 등으로 리팩토링하여 유지보수성 향상
- **Routing**: ID 기반 라우팅에서 Slug 기반 라우팅 (`/app/[slug]`)으로 변경

### Added
- **Comments Infrastructure**: 댓글 기능을 위한 `comments.service.ts` 추가 (기반 작업)
- **Slug Support**: `BlogPost` 타입에 slug 추가 및 `getPostBySlug` 함수 구현

---

## [0.5.0] - 2026-01-10

### Added
- **개인정보처리방침 (Privacy Policy)**: 방문자 데이터 처리 명시
- **연락처/About 페이지**: 블로그 운영 주체 정보 제공
- **저작권/면책조항**: 법적 책임 명확화

---

## [0.4.0] - 2026-01-07

### Added
- **조회수 기능**: 게시물별 조회 카운트 표시

---

## [0.3.0] - 2026-01-06

### Fixed
- **무한 스크롤 locale 문제**: 항상 한국어 게시물만 로드되던 문제 수정

---

## [0.2.0] - 2026-01-05

### Added
- **i18n 지원**: 한국어(ko), 영어(en) 다국어 지원 (`next-intl`)
- **Part 속성**: Notion에서 Part 속성 가져오기
  - 게시물 상세 사이드바: Group → Part로 변경
  - 게시물 상세 헤더: Tags → Part로 변경
- **CI/CD**: GitHub Actions → Vercel 배포 자동화

### Fixed
- **프로덕션 500 에러**: 서버 에러 수정
- **이미지 크기 문제**: 반응형 sizes 값 적용
- **이미지 로딩 문제**: 이미지가 로드되지 않는 문제 수정

---

## [0.1.0] - 2026-01-02

### Added
- **예약 발행**: 발행일 이후에만 게시물 노출
- **카테고리**: 태그 기반 카테고리 필터링
- **그룹 정렬**: 그룹별 정렬 및 발행일 기준 정렬
- **테마 지원**: 다크/라이트/시스템 모드 전환
- **검색 기능**: 제목 기반 검색
- **캐싱**: Next.js 캐싱 적용
- **무한 스크롤**: 6개씩 게시물 로딩

---

## [0.0.1] - Initial Release

### Added
- Next.js 16.1.1 프로젝트 초기 설정
- Notion API 연동 (`@notionhq/client`)
- Tailwind CSS 4 스타일링
- 블로그 목록 페이지
- 블로그 상세 페이지
- Notion 블록 렌더러 (Paragraph, Headings, Lists, Code, Image 등)
