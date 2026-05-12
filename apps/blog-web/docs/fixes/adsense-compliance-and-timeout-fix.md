# AdSense Compliance & Notion API Timeout Fix

**Date:** 2026-01-27  
**Author:** AI Assistant  
**Status:** ✅ Applied

## 1. 개요 (Overview)
구글 애드센스(Google AdSense) 승인을 위해 사이트 상태를 분석한 결과, 치명적인 서버 오류(500 Error)와 필수 정보(연락처) 부재가 발견되었습니다. 이를 해결하여 사이트 안정성을 확보하고 애드센스 정책을 충족시켰습니다.

## 2. 문제점 (Problems)

### 2.1 Notion API 타임아웃 (500 Internal Server Error)
- **증상:** 블로그 상세 페이지 접근 시 간헐적으로 `500 Internal Server Error` 발생.
- **원인:** `@notionhq/client`의 기본 타임아웃(60초)이 Vercel Serverless Function 또는 느린 Notion API 응답을 기다리다 초과되어 연결이 끊김. 이로 인해 크롤러가 사이트를 "동작하지 않음"으로 판단.

### 2.2 연락처 정보 부재 (AdSense Violation)
- **증상:** 사이트에 GitHub 링크 외에 직접적인 연락 수단(이메일, 문의 폼)이 없음.
- **원인:** 애드센스 "콘텐츠 정책"은 운영자에게 연락할 수 있는 명확한 수단을 요구함.

## 3. 해결 방안 (Solutions)

### 3.1 Notion Client 타임아웃 증설
`src/lib/notion.ts`에서 클라이언트 설정 수정.

```typescript
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  timeoutMs: 180000, // 60s -> 180s (3분)으로 증설
});
```

### 3.2 UI 개선 및 연락처 추가
사용자가 쉽게 찾을 수 있는 위치에 이메일 연락처 추가.

1.  **About 페이지 (`src/app/[locale]/about/page.tsx`)**:
    *   GitHub 아이콘 옆에 `이메일 보내기` (mailto:) 버튼 추가.
2.  **Footer (`src/components/utils/Footer.tsx`)**:
    *   `개인정보처리방침` 옆에 `문의하기` (Contact) 링크 추가.
3.  **다국어 지원 (`ko.json`, `en.json`)**:
    *   해당 레이블에 대한 한국어/영어 번역 추가.

## 4. 검증 결과 (Verification)
- **로컬 테스트:** `http://localhost:3000`에서 500 에러 없이 모든 포스트가 정상 로딩됨을 확인.
- **UI 확인:** About 페이지 및 Footer에 연락처 링크가 정상적으로 노출되고 동작함.

## 5. 결론 및 향후 계획
- 기술적인 결격 사유는 제거됨.
- 현재 포스트 수(약 15개)를 20개 이상으로 늘린 후 애드센스 신청 권장.
