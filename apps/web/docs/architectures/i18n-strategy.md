# i18n Strategy (Internationalization)

This document outlines the strategy for implementing Korean (ko) and English (en) support for the blog.

## 1. Architecture Overview

We will use **`next-intl`** for handling internationalization in the Next.js App Router.

### Routing
- **Structure**: `/[locale]/...` (e.g., `/ko/post-1`, `/en/post-1`)
- **Default Locale**: `ko` (Korean)
- **Supported Locales**: `['ko', 'en']`
- **Middleware**: Automatically detects the user's preferred language from headers/cookies and redirects to the appropriate locale.

### Directory Structure Changes
```
src/
  app/
    [locale]/          <-- New dynamic route segment
      page.tsx         <-- Moved from app/page.tsx
      [id]/page.tsx    <-- Moved from app/[id]/page.tsx
      layout.tsx       <-- Root layout with NextIntlClientProvider
    api/               <-- API routes remain global (or moved if needed)
  messages/            <-- Translation files
    ko.json
    en.json
  middleware.ts        <-- Locale detection logic
  i18n.ts              <-- next-intl configuration
```

---

## 2. Translation Layers

### Layer 1: UI Translation (Static Text)
Static text in the interface (buttons, headers, footers) will be managed using JSON files.

**Example (`messages/en.json`):**
```json
{
  "Navigation": {
    "back": "Back to Garden",
    "moreIn": "More in {part}"
  },
  "Search": {
    "placeholder": "Search..."
  }
}
```

### Layer 2: Content Translation (Dynamic Notion Content)
Since the source content in Notion is in Korean, we need a strategy to serve English content.

**Strategy: On-the-fly Translation with Caching**
1.  **Fetcher**: When `getPublishedPosts` or `getPageContent` is called with `locale === 'en'`, we intercept the response.
2.  **Translator Service**: Pass the Korean text (Title, Blocks) to a translation service.
3.  **Caching**: The translated result is cached using `unstable_cache` (6 hours), just like the original content. This minimizes API costs and latency.

**Translation Provider Options:**
1.  **DeepL / Google Cloud Translation API** (Recommended for quality, requires API Key).
2.  **Mock/Prefix** (For development without keys): Appends `[EN]` to text.

*Note: For this implementation, we will set up the infrastructure. If an API key is not provided, we will use a mock translator or a placeholder message.*

---

## 3. Implementation Steps

1.  **Setup**: Install `next-intl` and configure middleware.
2.  **Refactor**: Move page components into `[locale]` directory.
3.  **UI i18n**: Extract static strings to `messages/*.json` and replace with `useTranslations`.
4.  **Content i18n**:
    -   Modify `lib/notion.ts` to accept a `locale` parameter.
    -   Implement `lib/translator.ts` service.
    -   Integrate translation logic into data fetching functions.

## 4. SEO Considerations
-   **Hreflang Tags**: `next-intl` or manual metadata generation to link `ko` and `en` versions of pages.
-   **Canonical URLs**: Ensure proper canonical tags for each locale.


**Option B (Notion 데이터베이스 구조를 활용한 수동/AI 번역 관리)**는 가장 확실하고 안전한 방법입니다.

이 방식의 핵심은 **"하나의 글 = 하나의 Notion 페이지"**라는 원칙을 유지하는 것입니다. 즉, 한글 글과 영어 글을 **별도의 페이지(Row)**로 만들고, 이 둘을 **관계형(Relation) 속성**으로 연결하는 구조가 베스트입니다.

이렇게 하면 API로 데이터를 가져올 때 구조가 매우 깔끔해지고, SEO(검색 엔진 최적화)를 위한 URL 설정(Slug)도 언어별로 따로 가져갈 수 있습니다.

추천하는 DB 설계와 운영 프로세스를 단계별로 설명해 드릴게요.

---

### 1. Notion 데이터베이스 속성(Properties) 설계

기존 블로그 DB에 아래의 **3가지 핵심 속성**을 추가해야 합니다.

| 속성 이름 (Name) | 속성 타입 (Type) | 설명 및 용도 | 예시 데이터 |
| --- | --- | --- | --- |
| **Language** | Select (선택) | 현재 글의 언어를 구분합니다. | `🇰🇷 KR`, `🇺🇸 EN` |
| **Slug** | Text (텍스트) | URL 주소로 쓰일 고유 ID입니다. 언어별로 다르게 설정합니다. | `/kr/react-hook`, `/en/react-hook` |
| **Translation** | **Relation (관계형)** | **가장 중요!** 이 글의 번역본 페이지를 연결합니다. (자기 자신 DB와 연결) | `(연결된 영어 페이지 제목)` |

#### 💡 실제 DB 모습 예시

| 제목 (Title) | Language | Slug | Translation (관계형) | 상태 (Status) |
| --- | --- | --- | --- | --- |
| 리액트 훅 완벽 정리 | 🇰🇷 KR | `react-hook-guide` | `Mastering React Hooks` | Published |
| Mastering React Hooks | 🇺🇸 EN | `react-hook-guide` | `리액트 훅 완벽 정리` | Published |

---

### 2. 글 작성 및 번역 워크플로우 (운영 방법)

이 구조를 잡았다면, 글을 작성하는 순서는 다음과 같이 진행하면 됩니다.

1. **한글 글 작성:** 평소처럼 한글로 글을 씁니다. (`Language`: KR, `Status`: Draft)
2. **페이지 복제:** 작성이 완료되면 해당 페이지를 Notion 내에서 **복제(Duplicate)**합니다.
3. **영어 변환:**
* 복제된 페이지의 제목을 영어로 바꿉니다.
* `Language` 속성을 **EN**으로 변경합니다.
* **본문 번역:** Notion AI 기능(스페이스바 누르고 "Translate to English")을 쓰거나, 본문 내용을 긁어서 ChatGPT/DeepL에 넣고 번역된 내용을 붙여넣습니다. (이때 문맥 검수 가능)


4. **관계 연결 (Pairing):**
* 한글 페이지의 `Translation` 속성을 클릭하여, 방금 만든 영어 페이지를 찾아 연결합니다.
* (Notion 관계형 속성은 양방향 동기화가 되므로 한쪽만 연결하면 됩니다.)



---

### 3. API 및 프론트엔드 처리 로직 (개발 가이드)

블로그 코드(Next.js 등)에서는 데이터를 이렇게 처리하면 됩니다.

#### A. 게시글 목록 가져올 때 (List Page)

기본적으로 사용자가 한국어 사용자라면 `Language`가 `KR`인 글만 필터링해서 가져옵니다.

```javascript
// Notion API Filter 예시
const filter = {
  and: [
    { property: 'Status', status: { equals: 'Published' } },
    { property: 'Language', select: { equals: 'KR' } } // 혹은 'EN'
  ]
}

```

#### B. 게시글 상세 페이지 및 언어 전환 버튼 (Detail Page)

사용자가 글을 읽다가 "English" 버튼을 눌렀을 때의 시나리오입니다.

1. 현재 보고 있는 글(예: 한글 글)의 `Translation` 속성(Relation ID)을 확인합니다.
2. `Translation` 필드에 연결된 페이지 ID가 있다면, 그 페이지의 `Slug`를 찾아서 라우팅(`router.push`)해줍니다.
3. 만약 연결된 글이 없다면(번역본이 아직 없는 경우), 버튼을 비활성화하거나 "번역 준비 중"이라고 띄웁니다.

---

### 4. 이 구조의 장점

1. **완벽한 격리:** 한글 글과 영어 글이 완전히 다른 페이지이므로, 영어 글에는 영어권 문화에 맞는 "밈(meme)"이나 "예시"를 따로 추가해도 한글 글에 영향을 주지 않습니다.
2. **강력한 SEO:**
* 한글 페이지: `mysite.com/kr/my-post` (메타 태그도 한글)
* 영어 페이지: `mysite.com/en/my-post` (메타 태그도 영어)
* 구글이 서로 다른 페이지로 인식하여 각 언어 검색 결과 상단에 노출될 확률이 높습니다.


3. **유지보수:** 나중에 일본어(`JP`)를 추가하고 싶다면? `Language` 옵션에 JP만 추가하고 똑같이 연결하면 됩니다.

### 요약

> **Option B**는 **DB에 `Language` 속성과 `Translation`(자기참조 관계형) 속성 두 개만 추가**하면 됩니다. 글을 쓸 때는 **"복제 -> 번역 -> 연결"** 과정을 거치면 됩니다.
