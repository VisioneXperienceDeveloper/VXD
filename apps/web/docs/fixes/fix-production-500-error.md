# Fix: Production 500 Error

> 수정일: 2026-01-05

---

## 문제

프로덕션 환경(Vercel)에서 **500 Internal Server Error** 발생.

개발 환경에서는 정상 작동하나 배포 후 에러 발생.

---

## 원인

환경 변수 또는 API 연결 문제로 추정.

가능한 원인:
1. **환경 변수 미설정**: Vercel에 `NOTION_API_KEY`, `NOTION_DATA_SOURCE_ID` 미등록
2. **캐시 문제**: `unstable_cache` 관련 이슈
3. **API 호출 실패**: Notion API 연결 불안정

---

## 해결

1. Vercel 대시보드에서 환경 변수 확인 및 재설정
2. 재배포 실행

---

## 예방책

- 환경 변수 유효성 검증 로직 추가
- 에러 핸들링 강화 (`try-catch` 블록)
- Notion API 연결 실패 시 대체 UI 표시

---

## 관련 파일

- [notion.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/lib/notion.ts)
