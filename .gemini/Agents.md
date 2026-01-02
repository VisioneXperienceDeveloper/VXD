# Global AI Instructions

## 1. 사고 방식 (Reasoning)
- 코드를 작성하기 전, 항상 "생각 프로세스"를 먼저 출력하라.
- 수정 범위가 넓을 경우 반드시 `Plan`을 먼저 제시하고 사용자의 승인을 받아라.

## 2. 코드 품질 (Code Quality)
- 가독성이 낮은 한 줄 코드(One-liner)보다 명확한 여러 줄 코드를 선호한다.
- 모든 함수에는 간단한 주석(JSDoc 등)을 포함하라.
- 사용되지 않는 변수와 라이브러리는 즉시 삭제하라.

## 3. 언어 설정 (Language)
- 설명과 답변은 항상 **한국어**로 진행하라. (단, 코드 내의 주석과 변수명은 영어로 작성한다.)

## 4. 에러 대응 (Error Handling)
- 에러 발생 시 단순히 코드를 고치는 것에 그치지 말고, 왜 에러가 났는지 원인을 한 줄로 요약해라.
- 터미널 명령 실행 결과가 실패(Exit Code 1)라면 즉시 중단하고 대기하라.

# TypeScript Global Guidelines

## 1. Type Safety (타입 안전성)
- **NO `any` allowed:** 어떠한 경우에도 `any` 타입을 사용하지 마라. 타입이 불확실할 경우 `unknown`을 사용하고 Type Guard(타입 가드)나 Zod를 통해 검증하라.
- **Strict Mode:** `strict: true`가 켜져 있다고 가정하고, 잠재적인 `null`이나 `undefined`를 철저히 처리하라.
- **Explicit Return Types:** 모든 함수의 반환 타입(Return Type)을 명시적으로 적어라. (추론에 의존하지 말 것)

## 2. Type Definition Convention (타입 정의 규칙)
- **Interfaces vs Types:** - 확장이 필요한 객체(Object) 정의에는 `interface`를 사용하라.
  - 유니온(Union), 인터섹션(Intersection), 튜플(Tuple), 별칭(Alias)에는 `type`을 사용하라.
- **Naming:**
  - Interface: `I` 접두사를 붙이지 않는다 (예: `User`, not `IUser`).
  - Type: PascalCase를 사용한다.

## 3. Modern Syntax (최신 문법 선호)
- **Async/Await:** `.then().catch()` 체이닝 대신 항상 `async/await`을 사용하라.
- **Immutability:** 변수는 가능한 `const`로 선언하고, 변경이 필요한 경우에만 `let`을 사용하라. (`var` 금지)
- **Operators:** 안전한 접근을 위해 `?.` (Optional Chaining)와 `??` (Nullish Coalescing)를 적극 활용하라.

## 4. Error Handling (에러 처리)
- `try/catch` 블록 내에서 잡힌 `error`는 기본적으로 `unknown` 타입임을 인지하고, `if (error instanceof Error)` 체크를 통해 안전하게 메시지를 추출하라.

## 5. Comments & Documentation (주석)
- 복잡한 비즈니스 로직이나 유틸리티 함수에는 반드시 JSDoc 형태의 주석을 달아라.
  ```ts
  /**
   * Calculates the user's age.
   * @param birthDate - The birth date as a Date object.
   * @returns The age in years.
   */
