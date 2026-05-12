# Architecture Refactoring Plan

> **작성일**: 2026-01-24  
> **우선순위**: HIGH  
> **예상 기간**: 3-4주

## 🎯 목표

**Frontend**: FSD(Feature-Sliced Design) 도입  
**Backend**: Clean Architecture 도입

확장성, 유지보수성, 테스트 가능성 향상

---

## 📊 현재 vs 목표 구조

### 현재 구조 문제점
- ❌ 컴포넌트 분류 모호
- ❌ 비즈니스 로직과 UI 혼재
- ❌ Notion API 강결합
- ❌ 테스트 어려움

### 목표 구조

#### FSD Layers
```
Frontend:
├── app/         # 앱 초기화
├── widgets/     # 페이지 블록 (Header, Sidebar)
├── features/    # 기능 (Search, Filter, Sort)
├── entities/    # 비즈니스 엔티티 (Post, Comment)
└── shared/      # 공용 코드 (UI, Utils)
```

#### Clean Architecture Layers
```
Backend (src/core/):
├── domain/          # 비즈니스 규칙
│   ├── entities/   
│   └── repositories/ (인터페이스)
├── application/     # Use Cases
│   └── use-cases/  
└── infrastructure/  # 외부 연동
    ├── repositories/ (Notion 구현)
    └── mappers/
```

---

## 🛠 핵심 변경사항

### Frontend (FSD)

#### Before → After
```typescript
// Before: components/utils/Search.tsx
import { Search } from '@/components/utils/Search';

// After: features/search-posts/ui/SearchInput
import { SearchInput } from '@/features/search-posts';
```

#### 주요 마이그레이션
- `components/utils/` → `shared/ui/`
- `components/posts/` → `entities/post/ui/`
- `components/utils/Sidebar.tsx` → `widgets/sidebar/`
- `lib/services/` → `entities/*/api/`

### Backend (Clean Architecture)

#### Before → After
```typescript
// Before: lib/services/posts.service.ts
export const getPublishedPosts = async (options) => {
  const response = await notion.dataSources.query(...);
  // 직접 Notion API 호출
}

// After: core/application/use-cases/GetPublishedPosts.ts
export class GetPublishedPosts {
  constructor(private repository: IPostRepository) {}
  
  async execute(options): Promise<Post[]> {
    const posts = await this.repository.findAll();
    // 비즈니스 로직만 포함
  }
}
```

#### 계층 분리
1. **Domain**: `Post`, `Comment` 엔티티 + Repository 인터페이스
2. **Application**: Use Cases (GetPublishedPosts, CreateComment 등)
3. **Infrastructure**: Notion API 어댑터 (구현체)

---

## 📅 4주 로드맵

### Week 1: Shared Layer
- [ ] `src/shared/` 생성
- [ ] 공용 컴포넌트 마이그레이션
- [ ] TypeScript Path Mapping 설정

### Week 2: Entities + Domain
- [ ] `src/entities/` 생성
- [ ] `src/core/domain/` 생성
- [ ] Post, Comment 엔티티 분리

### Week 3: Features + Use Cases
- [ ] `src/features/` 생성
- [ ] `src/core/application/` 생성
- [ ] Search, Filter, Sort 기능 분리

### Week 4: Widgets + Infrastructure
- [ ] `src/widgets/` 생성
- [ ] `src/core/infrastructure/` 생성
- [ ] Notion 어댑터 구현
- [ ] 통합 테스트

---

## ⚠️ 핵심 주의사항

> [!WARNING]
> **점진적 마이그레이션 필수**
> - Big Bang 방식은 고위험
> - Strangler Fig Pattern 사용 (신규는 새 구조, 레거시 점진적 전환)

> [!IMPORTANT]
> **TypeScript Path Mapping 설정**
> ```json
> {
>   "paths": {
>     "@/features/*": ["src/features/*"],
>     "@/entities/*": ["src/entities/*"],
>     "@/shared/*": ["src/shared/*"],
>     "@/core/*": ["src/core/*"]
>   }
> }
> ```

> [!TIP]
> **의존성 방향 규칙**
> - Shared ← Entities ← Features ← Widgets ← App
> - Infrastructure → Application → Domain

---

## ✅ 성공 기준

### 구조적 개선
- ✅ 순환 의존성 0개
- ✅ 각 레이어 책임 명확

### 비즈니스 영향
- ✅ Notion → 다른 CMS 교체 가능
- ✅ 신규 기능 개발 30% 빠름
- ✅ 유지보수 비용 50% 감소

### 개발자 경험
- ✅ "어디에 코드 작성?" 질문 사라짐
- ✅ 테스트 작성 쉬워짐
- ✅ 온보딩 시간 단축

---

## 📚 참고 자료

- [FSD 공식 문서](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js with FSD](https://feature-sliced.design/docs/guides/tech/with-nextjs)

---

## 🎯 예상 효과 타임라인

**1개월 후**: 코드 가독성 향상  
**3개월 후**: 버그 발생률 30% 감소  
**6개월 후**: 신규 기능 개발 속도 30% 향상  
**1년 후**: 기술 부채 대부분 해소
