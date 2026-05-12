# VXD Portfolio — Parallax-Style 리디자인 기획서

> parallax.kr 디자인 시스템을 기존 VXD Blog 프로젝트에 적용하는 실행 가이드
> 작성일: 2026년 5월

---

## 0. 현재 프로젝트 상태 분석

### 이미 갖추고 있는 것 (건드리지 않는다)
| 항목 | 현재 상태 |
|------|----------|
| **프레임워크** | Next.js 16 (App Router) + TypeScript |
| **스타일링** | Tailwind CSS **v4** (oklch 컬러 시스템) |
| **아키텍처** | Feature-Sliced Design (FSD) |
| **i18n** | `next-intl` (ko/en, defaultLocale: ko) |
| **라우팅** | `app/[locale]/` 기반 (`/about`, `/projects`, `/blog`, `/contact`) |
| **CMS** | Notion API (`@notionhq/client`) |
| **테스트** | Vitest + Playwright |
| **배포** | Vercel + GA4 + AdSense |
| **기존 위젯** | Header, Footer, Resume (HeroIntro, SkillShowcase, ExperienceTimeline), PostList, CommentSection |

### 핵심 차이점: 원본 기획서 vs 현실
| 원본 기획서 | 현 프로젝트 현실 | 결정 |
|------------|----------------|------|
| Tailwind v3 + hex 색상 | Tailwind **v4** + oklch | **v4 유지**, oklch 토큰 확장 |
| `/ko/about`, `/ko/pricing` 경로 | `[locale]/about`, `[locale]/projects` | **기존 라우트 구조 유지** |
| 새 프로젝트 생성 | 이미 운영 중인 사이트 | **점진적 리디자인** |
| Framer Motion 추가 | 미설치 | **신규 설치** |
| `@radix-ui/react-accordion` | 미설치 | **신규 설치** |
| Pretendard 폰트 | Geist Sans/Mono | **Geist 유지** (이미 충분히 모던) |
| 다크 모드 우선 | 라이트/다크 토글 | **기존 토글 유지** |

---

## 1. 적용 전략: "점진적 프리미엄화"

새 프로젝트를 만드는 것이 아니라, **기존 페이지를 하나씩 Parallax 수준으로 업그레이드**한다.

### 페이지 매핑

| Parallax 원본 | VXD 적용 대상 | 설명 |
|--------------|-------------|------|
| `/about` (Hero + 4 Feature Sections) | **`/` (홈)** | 현재 HeroIntro + SkillShowcase + ExperienceTimeline → Parallax 스타일로 전면 리디자인 |
| `/pricing` (비교 테이블) | **`/projects`** | 단순 카드 그리드 → 프로젝트 상세 + 기술 비교표 |
| `/iris-desktop` (제품 상세) | **`/projects/[slug]`** (신규) | 대표 프로젝트 전용 상세 페이지 |
| `/change-log` (타임라인) | **`/about`** | 현재 간단한 소개 → 경력 타임라인 + 개발 여정 |
| `/blog` | **`/blog`** (기존 유지) | 이미 Notion CMS로 잘 구축됨, 스타일만 보강 |

---

## 2. 신규 패키지 (2개만 추가)

```bash
pnpm add framer-motion @radix-ui/react-accordion
```

> 기존 `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`는 이미 설치됨.

---

## 3. 디자인 토큰 확장

### globals.css에 Parallax 테마 토큰 추가

기존 oklch 시스템을 유지하면서 accent 색상만 확장한다.

```css
/* globals.css — 기존 :root / .dark 블록에 추가 */
:root {
  /* 기존 토큰 유지 */
  --accent-brand: oklch(0.55 0.2 275);       /* 보라 포인트 */
  --accent-brand-soft: oklch(0.35 0.12 275);  /* 뱃지 배경 */
  --accent-brand-text: oklch(0.75 0.15 275);  /* 뱃지 텍스트 */
}

.dark {
  /* 기존 토큰 유지 */
  --accent-brand: oklch(0.65 0.2 275);
  --accent-brand-soft: oklch(0.3 0.1 275);
  --accent-brand-text: oklch(0.8 0.15 275);
}
```

### Tailwind v4 @theme 확장

```css
@theme inline {
  /* 기존 토큰 유지 + 추가 */
  --color-accent-brand: var(--accent-brand);
  --color-accent-brand-soft: var(--accent-brand-soft);
  --color-accent-brand-text: var(--accent-brand-text);

  /* 애니메이션 키프레임 */
  --animate-scroll: scroll 20s linear infinite;
  --animate-carousel: carousel 30s linear infinite;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes carousel {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## 4. FSD 기반 파일 구조 (변경분만)

```
src/
├── app/[locale]/
│   ├── page.tsx                    # 홈 (Parallax About 스타일로 리디자인)
│   ├── about/page.tsx              # 경력 여정 (change-log 스타일)
│   ├── projects/
│   │   ├── page.tsx                # 프로젝트 목록 (pricing 스타일)
│   │   └── [slug]/page.tsx         # ⭐ 신규: 프로젝트 상세 (iris-desktop 스타일)
│   ├── blog/                       # 기존 유지
│   └── contact/page.tsx            # 기존 유지
│
├── widgets/
│   ├── header/ui/Header.tsx        # 리디자인 (Parallax 네비 스타일)
│   ├── footer/ui/Footer.tsx        # 리디자인 (멀티 컬럼 그리드)
│   ├── resume/ui/                  # ⭐ 전면 리디자인
│   │   ├── HeroSection.tsx         # Parallax Hero 스타일
│   │   ├── FeatureSection.tsx      # 4개 핵심 역량 섹션
│   │   ├── ToolsBanner.tsx         # ⭐ 신규: 무한 롤링 배너
│   │   ├── ProjectCarousel.tsx     # ⭐ 신규: 스크린샷 캐러셀
│   │   ├── ApproachMockup.tsx      # ⭐ 신규: 기술 접근법 비교
│   │   ├── CollaborationPlans.tsx  # ⭐ 신규: 협업 플랜 카드
│   │   └── FAQSection.tsx          # ⭐ 신규: FAQ 아코디언
│   └── project-detail/            # ⭐ 신규 위젯
│       └── ui/
│           ├── ProjectHero.tsx
│           ├── FeatureGrid.tsx
│           └── DemoVideo.tsx
│
├── shared/
│   └── ui/
│       ├── Badge.tsx               # ⭐ 신규
│       ├── SectionContainer.tsx    # ⭐ 신규: 공통 섹션 래퍼
│       └── AnimatedSection.tsx     # ⭐ 신규: Framer Motion 래퍼
```

---

## 5. 페이지별 구현 명세

### 5-1. 홈 페이지 (`/`) — Parallax About 스타일

현재 `HeroIntro + SkillShowcase + ExperienceTimeline` 3개 위젯을 **9개 섹션**으로 확장.

```tsx
// app/[locale]/page.tsx
import { HeroSection, FeatureSection, ToolsBanner,
         ProjectCarousel, ApproachMockup, CollaborationPlans,
         FAQSection } from '@/widgets/resume';

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <HeroSection />
      <FeatureSection id="core-competency" reverse={false} />
      <FeatureSection id="project-a" reverse={true} />
      <FeatureSection id="project-b" reverse={false} />
      <FeatureSection id="project-c" reverse={true} />
      <ToolsBanner />
      <ApproachMockup />
      <CollaborationPlans />
      <FAQSection />
    </div>
  );
}
```

#### 공통 AnimatedSection 컴포넌트

```tsx
// shared/ui/AnimatedSection.tsx
'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function AnimatedSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

#### FeatureSection 재사용 구조

```tsx
// widgets/resume/ui/FeatureSection.tsx
interface FeatureSectionProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  stats: { value: string; label: string }[];
  features: { title: string; desc: string }[];
  visual: ReactNode;
  reverse?: boolean;
}
```

콘텐츠는 `messages/ko.json`과 `messages/en.json`에서 관리 (기존 i18n 패턴 유지).

### 5-2. About 페이지 (`/about`) — Change-log 스타일 타임라인

현재 간단한 소개 텍스트 → **분기별 개발 여정 타임라인**으로 확장.

```tsx
// 세로 선 + 점 패턴 타임라인
<div className="relative">
  <div className="absolute left-[7px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
  {TIMELINE.map((quarter) => (
    <AnimatedSection key={quarter.period} className="relative pl-8 mb-12">
      <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-accent-brand ring-4 ring-background" />
      <h3 className="text-muted-foreground text-sm font-medium mb-4">{quarter.period}</h3>
      <ul className="space-y-2">
        {quarter.items.map((item, i) => (
          <li key={i} className="text-foreground flex gap-2">
            <span className="text-accent-brand mt-1">•</span>{item}
          </li>
        ))}
      </ul>
    </AnimatedSection>
  ))}
</div>
```

### 5-3. Projects 페이지 (`/projects`) — Pricing 스타일

현재 단순 카드 그리드 → **기술 스택 티어 카드 + 비교표** 추가.

- **상단**: 기존 프로젝트 카드 그리드 유지 (호버 리프트 애니메이션 추가)
- **중단**: 기술 숙련도 비교 테이블 (필터 탭: 전체/프론트엔드/백엔드/DevOps)
- **하단**: FAQ 아코디언

### 5-4. 프로젝트 상세 (`/projects/[slug]`) — iris-desktop 스타일 (⭐ 신규)

```tsx
// app/[locale]/projects/[slug]/page.tsx
export default function ProjectDetailPage() {
  return (
    <>
      <ProjectHero />      {/* 제목 + GitHub/Demo/Docs 버튼 3개 */}
      <DemoVideo />         {/* 데모 영상 플레이어 */}
      <FeatureGrid />       {/* 12개 기능 카드 그리드 */}
      <ScreenshotMockup />  {/* 실제 UI 스크린샷 */}
      <TechStackTabs />     {/* 기술 스택 / 주요 기능 / 아키텍처 탭 */}
    </>
  );
}
```

### 5-5. Header 리디자인

```tsx
// 변경 포인트만 요약
// 1. 스크롤 시 backdrop-blur 강화
// 2. 모바일: 현재 하단 가로 나열 → 풀스크린 드로어 오버레이
// 3. 우측 CTA 버튼 추가: "주요 프로젝트" + "연락하기"
// 4. 기존 Search, ModeToggle, LanguageToggle 유지
```

### 5-6. Footer 리디자인

```tsx
// 현재: 단순 1줄 링크 + 저작권
// 변경: 4컬럼 그리드 + 대형 로고 + 저작권
const FOOTER_COLS = [
  { title: '개발', links: [{ label: 'GitHub', href: '...' }, { label: 'npm', href: '...' }] },
  { title: '탐색', links: [{ label: '소개', href: '/about' }, { label: '프로젝트', href: '/projects' }] },
  { title: '콘텐츠', links: [{ label: '블로그', href: '/blog' }] },
  { title: '연락', links: [{ label: '이메일', href: 'mailto:...' }, { label: 'LinkedIn', href: '...' }] },
];
```

---

## 6. i18n 메시지 확장

`messages/ko.json`과 `messages/en.json`에 새 섹션 추가:

```json
{
  "Home": {
    "heroBadge": "포트폴리오",
    "heroTitle": "다르게 생각하고\n다르게 만듭니다.",
    "heroSubtitle": "사용자 경험을 중심에 두는 프로덕트를 만듭니다.",
    "viewProjects": "프로젝트 보기",
    "contactMe": "연락하기"
  },
  "FAQ": {
    "q1": "어떤 개발을 주로 하시나요?",
    "a1": "...",
    "q2": "협업 가능한 분야는?",
    "a2": "...",
    "q3": "연락은 어떻게 하나요?",
    "a3": "..."
  }
}
```

---

## 7. 구현 우선순위

| 순서 | 작업 | 영향 범위 | 예상 소요 |
|------|------|----------|---------|
| 1 | `pnpm add framer-motion @radix-ui/react-accordion` | 패키지 | 5분 |
| 2 | globals.css 토큰 확장 + 키프레임 추가 | 전역 스타일 | 0.5일 |
| 3 | `AnimatedSection`, `Badge`, `SectionContainer` 공용 컴포넌트 | shared/ui | 0.5일 |
| 4 | **홈 페이지 전면 리디자인** (Hero → FAQ, 9개 섹션) | widgets/resume | 2일 |
| 5 | Header 리디자인 (드로어 + CTA) | widgets/header | 0.5일 |
| 6 | Footer 리디자인 (멀티 컬럼) | widgets/footer | 0.5일 |
| 7 | About 페이지 → 타임라인 리디자인 | app/about | 0.5일 |
| 8 | Projects 페이지 → 비교표 + 호버 애니메이션 | app/projects | 0.5일 |
| 9 | `/projects/[slug]` 상세 페이지 신규 구축 | 신규 라우트 | 1일 |
| 10 | i18n 메시지 추가 (ko/en) | messages/ | 0.5일 |
| 11 | 반응형 QA + 접근성 검수 | 전체 | 0.5일 |
| **합계** | | | **약 7일** |

---

## 8. 주의사항

> [!IMPORTANT]
> - **Tailwind v4 문법 준수**: `@theme inline`, `@custom-variant` 등 v4 문법 사용. `tailwind.config.ts`가 아닌 CSS에서 설정.
> - **FSD 아키텍처 준수**: 새 컴포넌트는 반드시 `widgets/`, `shared/ui/` 계층에 배치.
> - **next-intl 패턴 준수**: 모든 텍스트는 `useTranslations()` / `getTranslations()`로 관리.
> - **기존 Notion 블로그 손대지 않기**: `/blog` 라우트와 `entities/post`, `entities/notion`은 변경하지 않는다.
> - **Geist 폰트 유지**: Pretendard로 교체하지 않는다. 이미 모던한 폰트.
> - **oklch 컬러 시스템 유지**: hex 값 직접 사용 금지, CSS 변수로 관리.

---

*이 문서는 기존 VXD Portfolio 프로젝트의 아키텍처, 기술 스택, 디자인 시스템을 보존하면서 parallax.kr의 프리미엄 디자인 패턴을 적용하기 위한 실행 가이드입니다.*
