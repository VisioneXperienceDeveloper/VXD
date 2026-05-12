# Code Block Copy Button Feature Plan

> **작성일**: 2026-01-21  
> **우선순위**: COULD  
> **예상 구현 기간**: 1-2일

## 📋 목표

블로그 포스트의 코드 블록에 **복사 버튼**을 추가하여 사용자가 코드를 쉽게 복사할 수 있도록 UX를 개선합니다.

---

## ✅ Notion API 지원 여부

### 결론: 완전히 구현 가능합니다! 🎉

Notion API는 코드 블록에 필요한 모든 정보를 제공합니다:

```typescript
{
  type: "code",
  code: {
    rich_text: RichTextItemResponse[],  // 코드 내용 (복사용)
    language: string,                    // 프로그래밍 언어
    caption: RichTextItemResponse[]     // 선택적 캡션
  }
}
```

**제공 데이터**:
- ✅ `value.rich_text`: 복사할 코드 전체 내용
- ✅ `value.language`: 프로그래밍 언어 (JavaScript, Python 등)
- ✅ Plain text 형태로 추출 가능 (들여쓰기 보존)

---

## 🔍 현재 상태

### 기존 코드 블록 렌더링

**[현재]** `src/components/notion/BlockRenderer.tsx`

```typescript
case "code":
  return (
    <pre className="...">
      <code className="language-{value.language}">
        <TextRenderer text={value.rich_text} />
      </code>
    </pre>
  );
```

**문제점**:
- 복사 버튼 없음
- 언어 정보 UI 미표시
- 사용자가 수동으로 선택 후 복사 필요

---

## 🎯 제안 기능

### 1. Copy Button
- 코드 블록 우측 상단에 배치
- 호버 시만 표시 (깔끔한 UI)
- 클릭 시 클립보드에 복사
- 복사 성공: 체크마크 + "Copied!" (2초간)

### 2. Language Badge (선택사항)
- 좌측 상단에 언어 표시
- 예: `JavaScript`, `Python`

### 3. Visual Feedback
- 복사 성공: 녹색 체크마크 아이콘
- 부드러운 페이드 애니메이션

---

## 🛠 구현 방법

### 1. 새 컴포넌트 생성

**[NEW]** `src/components/notion/CodeBlock.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ code, language, richText }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      {/* Language Badge */}
      {language && (
        <div className="absolute top-2 left-4 px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-800 rounded">
          {language}
        </div>
      )}
      
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="text-green-600" /> : <Copy />}
      </button>
      
      {/* Code Block */}
      <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 pt-10 rounded-md">
        <code>{/* rendered code */}</code>
      </pre>
    </div>
  );
}
```

### 2. BlockRenderer 업데이트

**[MODIFY]** `src/components/notion/BlockRenderer.tsx`

```typescript
case "code":
  const codeText = value.rich_text
    .map(rt => rt.plain_text)
    .join('');
  
  return (
    <CodeBlock 
      code={codeText}
      language={value.language}
      richText={value.rich_text}
    />
  );
```

---

## 📅 구현 로드맵

### Day 1
- [ ] `CodeBlock.tsx` 컴포넌트 생성
- [ ] 복사 버튼 UI 구현
- [ ] Clipboard API 통합
- [ ] 언어 배지 추가

### Day 2
- [ ] `BlockRenderer.tsx` 통합
- [ ] 스타일 및 애니메이션 개선
- [ ] 브라우저 호환성 테스트
- [ ] 문서화

---

## ✅ 검증 계획

### Manual Testing
1. 코드 블록 호버 → 복사 버튼 표시 확인
2. 클릭 → "Copied!" 피드백 확인
3. 붙여넣기 → 코드 정확히 복사 확인
4. 다양한 언어 (JavaScript, Python 등) 테스트

### Browser Compatibility
- Chrome, Firefox, Safari, Edge
- iOS Safari, Chrome Mobile

### Accessibility
- 키보드 네비게이션 (Tab → Enter)
- 스크린 리더 지원
- ARIA labels 추가

---

## ⚠️ 주의사항

> [!WARNING]
> **HTTPS 필수**
> - Clipboard API는 HTTPS 환경에서만 작동
> - 로컬 개발(`localhost`)은 예외

> [!TIP]
> **Plain Text 추출**
> ```typescript
> const code = value.rich_text
>   .map(rt => rt.plain_text)
>   .join('');
> ```
> 이 방법으로 들여쓰기가 정확히 보존됩니다.

---

## 🚀 Future Enhancements

- [ ] 구문 강조 (Syntax Highlighting)
- [ ] 줄 번호 표시
- [ ] 코드 다운로드 기능
- [ ] 복사 통계 추적

---

## 📚 참고 자료

- [Clipboard API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Notion API - Code Block](https://developers.notion.com/reference/block#code)

---

## 📊 예상 영향

### 긍정적 영향
- ✅ 코드 복사 시간 단축 (수동 → 원클릭)
- ✅ 모바일 UX 크게 개선
- ✅ 프로페셔널한 블로그 이미지

### 기술적 영향
- ⚠️ Client Component 사용 (약간의 JS 증가)
- ✅ 성능 영향 미미 (< 5KB)
