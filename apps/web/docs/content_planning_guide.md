# Chris Choi 포트폴리오 — 콘텐츠 적용 가이드

> `portfolio_planning_guide.md` (구조 기획)의 후속 문서
> 기존 VXD Blog 라우트·아키텍처에 맞춰 콘텐츠를 매핑한 실행 가이드
> 이력서(Chris_Choi_Resume.docx) 원문 기반 — 수치·링크 변경 금지

---

## 0. 전역 상수

```ts
// src/shared/lib/constants.ts (신규)

export const PERSON = {
  name:       'Chris Choi',
  role:       'Full Stack Developer',
  tagline:    '사용자 경험을 코드로 현실로 만드는 개발자',
  location:   'Sydney, NSW, Australia',
  email:      'visionexperiencedeveloper@gmail.com',
  phone:      '+61 431 373 323',
  linkedin:   'https://linkedin.com/in/vxdeveloper',
  github:     'https://github.com/VisioneXperienceDeveloper',
  github2:    'https://github.com/cjungwo',
  website:    'https://www.visionexperiencedeveloper.com',
  experience: '3+',
} as const;
```

---

## 1. 라우트 매핑 (원본 기획 → 실제 프로젝트)

| 원본 기획서 경로 | 실제 VXD 라우트 | 페이지 용도 |
|:---|:---|:---|
| `/ko/about` | **`/[locale]/`** (홈) | Parallax 스타일 메인 랜딩 (9개 섹션) |
| `/ko/change-log` | **`/[locale]/about`** | 개발 여정 타임라인 + 자기소개 |
| `/ko/pricing` | **`/[locale]/projects`** | 기술 역량 + 프로젝트 카드 + 비교표 |
| `/ko/iris-desktop` | **`/[locale]/projects/[slug]`** ⭐신규 | 대표 프로젝트 상세 |
| `/ko/blog` | **`/[locale]/blog`** (기존 유지) | Notion CMS 블로그 |
| - | **`/[locale]/contact`** (기존 유지) | 연락 폼 |

---

## 2. 홈 페이지 (`/[locale]/page.tsx`) — 9개 섹션

### 섹션 1: HeroSection

| 항목 | 값 |
|:---|:---|
| badge | `풀스택 개발자 · 시드니` |
| headline | `다르게 생각하고\n코드로 만듭니다.` |
| sub | `Next.js, Node.js, TypeScript, AWS로 실제 비즈니스 가치를 만드는 3년 경력의 풀스택 개발자` |
| CTA Primary | `프로젝트 보기` → `/projects` |
| CTA Ghost | `연락하기` → `mailto:visionexperiencedeveloper@gmail.com` |

### 섹션 2: FeatureSection — "핵심 역량"

| 항목 | 값 |
|:---|:---|
| badge | `핵심 역량` |
| title | `FullStack\nExpertise` |
| subtitle | `엔드투엔드를 책임지는 개발자` |
| description | `프론트부터 클라우드 인프라까지, 소프트웨어 개발 라이프사이클 전 과정을 직접 주도합니다. 클린 아키텍처와 AI 도구를 결합해 실질적인 비즈니스 임팩트를 만들어냅니다.` |
| reverse | `false` |

**bullets**
- `Next.js · Node.js · TypeScript End-to-End`
- `AWS · Docker · Kubernetes Cloud-Native`
- `AI-Driven Development with Claude & Gemini`

**stats**

| value | label |
|:---|:---|
| `3+` | years experience |
| `35%` | 오류 감소 (Wise Express) |
| `25%` | 전환율 향상 (CPR LMS) |

**features (4칸 그리드)**

| title | desc |
|:---|:---|
| 프론트엔드 | Next.js, React, TypeScript, SwiftUI로 반응형 UI 개발 |
| 백엔드 | Node.js, NestJS, Spring으로 확장 가능한 API 설계 |
| 클라우드 | AWS, Azure, GCP, Docker, Kubernetes로 인프라 운영 |
| AI 통합 | Claude Code, Gemini를 활용한 AI 드리븐 개발 워크플로우 |

**우측 비주얼**: 기술 스택 카드 3장 (Frontend / Backend / Cloud)

### 섹션 3: FeatureSection — "Chrome Extensions"

| 항목 | 값 |
|:---|:---|
| badge | `Chrome Extension` |
| title | `Tamago\nBot` |
| subtitle | `생산성 × 게이미피케이션` |
| description | `디지털 펫과 함께 태스크를 완수하는 크롬 확장 프로그램. React로 동적 UI 상태를 관리하며 Chrome Web Store에 실제 배포된 프로덕트입니다.` |
| reverse | `false` |

**stats**: `3개` 배포 / `실배포` Chrome Web Store / `Solo` 단독 개발

**features (4칸 그리드)**

| title | desc |
|:---|:---|
| Tamago-bot | 디지털 펫 기반 생산성 확장 — React UI 상태 관리 |
| Canvas-sync | Canvas LMS 마감 자동 추적 — Chrome Extension API |
| YT Sub Mgr | YouTube 구독 커스텀 필터링 — JavaScript 로직 설계 |
| Solo 개발 | 기획 → 개발 → 스토어 배포 전 과정 단독 수행 |

**실제 링크**
- Tamago: `https://chromewebstore.google.com/detail/tamago-bot/egjdcglbmfnpdbabandhhhfiidpdcloa`
- Canvas: `https://chromewebstore.google.com/detail/canvas-sync/inbkbgggdjajapchnhnjcjebegfkbjoh`
- YT Sub: `https://chromewebstore.google.com/detail/youtube-subscription-mana/lkbjekehgecekjacleibhmaiahfnlbpf`

### 섹션 4: FeatureSection — "VXD Blog"

| 항목 | 값 |
|:---|:---|
| badge | `Solo Study Project` |
| title | `VXD\nBlog` |
| subtitle | `Notion API × Next.js 콘텐츠 플랫폼` |
| description | `Notion을 헤드리스 CMS로 연동한 개인 블로그 겸 튜터링 플랫폼. SSR로 SEO를 최적화하고 Gemini CLI로 개발 생산성을 높였습니다.` |
| reverse | `true` |

**stats**: `SSR` 서버사이드 렌더링 / `Notion` 헤드리스 CMS / `오픈소스` GitHub 공개

**실제 링크**
- Live: `https://www.visionexperiencedeveloper.com/en/blog`
- GitHub: `https://github.com/VisioneXperienceDeveloper/VXD_Blog`

### 섹션 5: FeatureSection — "MindTap Vision Pro"

| 항목 | 값 |
|:---|:---|
| badge | `Lead Developer` |
| title | `MindTap\nVision Pro` |
| subtitle | `BCI × VisionOS 리얼타임 파이프라인` |
| description | `뇌-컴퓨터 인터페이스(BCI) 데이터를 실시간으로 Apple Vision Pro에 스트리밍하는 앱. Python 데이터 파이프라인과 Firebase 동기화를 결합한 멀티플랫폼 시스템.` |
| reverse | `false` |

**stats**: `Real-time` BCI 데이터 스트리밍 / `VisionOS` Apple Vision Pro / `Firebase` 실시간 동기화

### 섹션 6: ToolsBanner — 무한 롤링 배너 (25개 기술)

```ts
const TOOLS = [
  'TypeScript', 'JavaScript', 'Java', 'Swift',
  'Next.js', 'React', 'Node.js', 'NestJS', 'Spring',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Vercel', 'GitHub Actions',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Supabase',
  'GraphQL', 'WordPress', 'Notion', 'Jira',
];
```

### 섹션 7: ApproachMockup — 개발 접근 방식 (3칸 카드)

| name | icon | response |
|:---|:---|:---|
| Clean Architecture | 🏗️ | 확장 가능하고 유지보수 쉬운 코드를 우선합니다. |
| AI-Driven Dev | 🤖 | Claude Code, Gemini로 개발 사이클을 가속합니다. |
| Business Value | 📈 | 35% 오류 감소, 25% 전환율 향상 — 측정 가능한 결과. |

### 섹션 8: CollaborationPlans — 협업 플랜 (3칸 카드)

| name | price | highlighted | features | CTA |
|:---|:---|:---|:---|:---|
| 오픈소스 | 무료 | false | 공개 레포 기여 환영 / 이슈 & PR 리뷰 / 코드 리뷰 요청 | GitHub 방문 |
| 프리랜서 | 협의 | **true** | Next.js·Node.js 풀스택 / AWS 인프라 / AI 통합 / 아키텍처 컨설팅 | 이메일 보내기 |
| 풀타임 | 재직 중 | false | Coding Instructor @ The Robot Coding / UTS IT 학사 / 시드니 기반 | LinkedIn 연결 |

### 섹션 9: FAQSection — 아코디언

| 질문 | 답변 요약 |
|:---|:---|
| 어떤 기술 스택을 주로 사용하시나요? | Next.js + TypeScript + Node.js, AWS, Claude Code & Gemini |
| 프리랜서는 어떤 분야? | 웹앱, API, AWS, AI 통합, 리팩토링. Wise Express·The Varai·CPR 등 |
| 연락은 어떻게? | 이메일 또는 LinkedIn, 24시간 이내 답장 |
| 현재 구직 중? | The Robot Coding 재직 중, 풀스택·AI 포지션 열린 마음으로 검토 |
| 어떤 AI 도구 활용? | Claude Code (코드 리뷰·아키텍처), Gemini CLI (자동화·워크플로우) |

---

## 3. About 페이지 (`/[locale]/about/page.tsx`) — 개발 여정

### 상단: 자기소개 블록

기존 소개 텍스트 유지 + 이력서 기반 강화.

### 하단: 타임라인

| 시기 | 라벨 | 항목 |
|:---|:---|:---|
| 2026 Q1–현재 | 재직 중 | Coding Instructor @ The Robot Coding / 포트폴리오 사이트 제작 |
| 2025 Q4–2026 Q1 | 인턴십 | Meyd.it 풀스택 인턴 / SEO·반응형 UI / ACC x Code Club 봉사 |
| 2024–2025 | 프리랜서 & 프로젝트 | Wise Express(35% 오류 감소) / The Varai / CPR LMS(25% 전환율) / MindTap / VXD Blog / Chrome Extensions 3종 |
| 2024 Q1 | 학교·커뮤니티 | 프리랜서 본격 시작 / UTS God's People 리더 / 한국 클라이언트 다수 |
| 2022–2023 | 학업 시작 | UTS Bachelor of IT 입학 / HD 다수 취득 / 개발 여정 시작 |

---

## 4. Projects 페이지 (`/[locale]/projects/page.tsx`) — 기술 역량 + 프로젝트

### 4-1. 기존 프로젝트 카드 그리드 (기존 유지 + 호버 애니메이션 강화)

기존 7개 프로젝트 카드를 유지하되, Framer Motion 호버 리프트 추가.

### 4-2. 기술 티어 카드 (신규 섹션 추가)

| 티어 | 아이콘 | level | 기술 목록 |
|:---|:---|:---|:---|
| Frontend | ⚛️ | 주력 | TypeScript, JavaScript, Next.js, React, SwiftUI, Tailwind |
| Backend | ⚙️ | **주력 (강조)** | Node.js, Express.js, NestJS, Java, Spring, WordPress/PHP |
| Cloud & DevOps | ☁️ | 경험 | AWS, Azure, GCP, Docker, Kubernetes, GitHub Actions, Vercel |
| Database & AI | 🗄️ | 경험 | PostgreSQL, MySQL, MongoDB, Firebase, Supabase, Claude, Gemini |

### 4-3. 클라이언트 프로젝트 비교표 (신규 섹션 추가)

| 클라이언트 | 분야 | 기술 | 역할 | 임팩트 |
|:---|:---|:---|:---|:---|
| Wise Express | 물류 | Node.js · REST API | 설계 & 배포 | 예약 오류 35% 감소 |
| The Varai | 이커머스 | 웹 풀스택 | 브랜드 사이트 개발 | 브랜드 아이덴티티 온라인화 |
| CPR Learning | 에듀테크 | WordPress · PHP · React · MySQL | 백엔드 Co-lead | 전환율 25% 향상 |
| Meyd.it | SaaS | 모던 프레임워크 | 풀스택 인턴 | 메인 웹사이트 SEO 개선 |
| 한국 클라이언트 | 복합 | 풀스택 | 프리랜서 | The imagine · LOE Korea · Overdam |

### 4-4. 개발 철학 (1단락)

> 화려한 기술 스택보다 실질적인 비즈니스 가치를 우선합니다. 코드는 동작해야 하고, 측정 가능한 결과로 증명되어야 합니다. Agile·TDD·클린 아키텍처는 목표가 아닌 도구입니다.

---

## 5. 프로젝트 상세 (`/[locale]/projects/[slug]/page.tsx`) — ⭐ 신규

### Chrome Extensions Suite (slug: `chrome-extensions`)

**Hero**

| 항목 | 값 |
|:---|:---|
| badge | `Chrome Web Store · 3 Extensions` |
| title | `Chrome Extensions Suite` |
| subtitle | `Solo Project · React · JavaScript · Chrome API` |
| desc | `생산성 향상과 워크플로우 자동화를 위해 단독으로 기획·개발·배포한 크롬 확장 프로그램 3종.` |

**CTA 버튼 3개** (원본 Win/Mac/Linux → 3개 확장 설치)

| icon | label | sub | href |
|:---|:---|:---|:---|
| 🥚 | Tamago-bot | Chrome에 추가 | `https://chromewebstore.google.com/detail/tamago-bot/...` |
| 🎓 | Canvas-sync | Chrome에 추가 | `https://chromewebstore.google.com/detail/canvas-sync/...` |
| 📺 | YT Sub Manager | Chrome에 추가 | `https://chromewebstore.google.com/detail/youtube-subscription-mana/...` |

**기능 카드 그리드 (8개)**

| icon | title | desc |
|:---|:---|:---|
| ⚛️ | React UI | 동적 상태 관리로 반응형 팝업 UI 구현 |
| 🔌 | Chrome API | Extension API·Background Script 활용 |
| 🔄 | LMS 동기화 | Canvas 마감일 자동 추적·캘린더 연동 |
| 🎮 | 게이미피케이션 | 디지털 펫으로 태스크 완수 동기 부여 |
| 🔍 | 커스텀 필터링 | JavaScript 로직으로 콘텐츠 탐색 최적화 |
| 📦 | 스토어 배포 | Chrome Web Store 실 배포 · 공개 서비스 |
| 🛠️ | Solo 풀사이클 | 기획 → 개발 → QA → 배포 전 과정 단독 |
| 🌐 | 크로스 플랫폼 | 모든 Chromium 기반 브라우저 지원 |

---

## 6. 공통 레이아웃 콘텐츠

### Header 네비게이션

```ts
const NAV_ITEMS = [
  { label: t('home'),     href: '/' },
  { label: t('about'),    href: '/about' },
  { label: t('projects'), href: '/projects' },
  { label: t('blog'),     href: '/blog' },
  { label: t('contact'),  href: '/contact' },
];
// 기존 네비 구조 유지, 스타일만 Parallax 수준으로 강화
```

### Footer 멀티 컬럼 (4열)

| 개발 | 탐색 | 콘텐츠 | 연락 |
|:---|:---|:---|:---|
| GitHub (VXD) | 소개 (`/about`) | 블로그 (`/blog`) | 이메일 |
| GitHub (cjungwo) | 프로젝트 (`/projects`) | LinkedIn | LinkedIn |
| Chrome Extensions | 연락처 (`/contact`) | | |

**하단 정보**: `Chris Choi · Sydney, NSW, Australia · visionexperiencedeveloper@gmail.com`

---

## 7. i18n 메시지 추가분 (`messages/ko.json`)

```json
{
  "Home": {
    "heroBadge": "풀스택 개발자 · 시드니",
    "heroTitle": "다르게 생각하고\n코드로 만듭니다.",
    "heroSub": "Next.js, Node.js, TypeScript, AWS로 실제 비즈니스 가치를 만드는 3년 경력의 풀스택 개발자",
    "viewProjects": "프로젝트 보기",
    "contactMe": "연락하기"
  },
  "FAQ": {
    "q1": "어떤 기술 스택을 주로 사용하시나요?",
    "a1": "주로 Next.js + TypeScript + Node.js 풀스택을 사용합니다...",
    "q2": "프리랜서 프로젝트는 어떤 분야를 맡으시나요?",
    "a2": "웹 애플리케이션 개발, 백엔드 API 설계, AWS 인프라 구성...",
    "q3": "연락은 어떻게 하면 되나요?",
    "a3": "이메일 또는 LinkedIn으로 연락주세요. 24시간 이내 답장합니다.",
    "q4": "현재 구직 중인가요?",
    "a4": "The Robot Coding에서 재직하면서, 풀스택·AI 포지션을 열린 마음으로 검토 중입니다.",
    "q5": "어떤 AI 도구를 활용하시나요?",
    "a5": "Claude Code로 코드 리뷰와 아키텍처 설계를, Gemini CLI로 자동화를 보조합니다."
  }
}
```

> `messages/en.json`에도 동일 키로 영문 버전 추가.

---

## 8. 에셋 준비 목록

```
public/
├── screenshots/
│   ├── tamago-bot.png          # TODO: 실제 스크린샷 촬영
│   ├── canvas-sync.png         # TODO
│   ├── yt-sub-manager.png      # TODO
│   ├── vxd-blog.png            # TODO
│   └── mindtap.png             # TODO
├── logo/tools/                 # Simple Icons CDN 사용 시 불필요
└── og-image.png                # TODO: 1200×630
```

---

## 9. 에이전트 지시사항

1. **수치 변경 금지**: `35%`, `25%`, `3+` 등은 이력서 원문 그대로 사용
2. **실제 URL만 사용**: 이 문서에 명시된 URL만. 없으면 `href="#"` + `// TODO: 실제 URL 교체`
3. **졸업 표기**: `UTS IT 학사`로만 표기 + `// TODO: 졸업 여부 확인`
4. **MindTap GitHub**: `href="#"` + TODO
5. **FSD 준수**: `widgets/resume/ui/`에 섹션 컴포넌트, `shared/ui/`에 공용 컴포넌트
6. **next-intl 준수**: 모든 사용자 노출 텍스트는 `useTranslations()` / `getTranslations()`
7. **Tailwind v4 + oklch 준수**: hex 직접 사용 금지, CSS 변수로 관리

---

*이력서 원문 기반 — 모든 수치·링크·이름은 원문 발췌. 과장·변경 금지.*
