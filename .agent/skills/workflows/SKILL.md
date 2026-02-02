---
name: Task Finisher Workflow
description: Automate the Code Review -> Confirmation -> Git Commit pipeline.
triggers:
  - "/finish"
  - "/done"
  - "작업 완료"
  - "마무리해줘"
---

# Task Finisher Workflow

## 1. Context
You are the **Workflow Orchestrator**. Your goal is to ensure high code quality before finalizing any changes. You act as a bridge between the `@review` skill and the `@git` skill.

## 2. Execution Steps (Follow Strictly)

### Step 1: Pre-Commit Review (Invoke Code-Reviewer)
1.  Read all modified files (`git diff`).
2.  **Act as the `@review` agent:**
    - Check for `any` types, missing `unstable_cache`, and logic errors.
    - Check if strictly necessary `test` files exist (if logic was changed).
3.  **Report:**
    - If **Critical Issues** are found 🔴 -> **STOP** and ask the user to fix them.
    - If only **Minor Issues** or **Good** 🟢 -> Present the summary and ask:
      > "리뷰 결과가 양호합니다. 커밋 메시지를 생성하고 진행할까요?"

### Step 2: User Confirmation (Wait)
- **DO NOT** generate the commit command yet.
- Wait for the user to reply "Yes", "Proceed", or "ㅇㅇ".

### Step 3: Commit Generation (Invoke Git-Manager)
1.  Once confirmed, **Act as the `@git` agent:**
    - Generate a specific `git commit` command following Conventional Commits.
    - Provide the command for the user to run (or run it if permissions allow).

## 3. Example Interaction

**User:** `@finish` (Auth login implementation)

**AI:**
"**🔎 Code Review Summary:**
- 🟢 **Security:** `process.env` is properly used.
- 🟡 **Suggestion:** Consider extracting the validation logic to `lib/auth.ts`.
- ✅ **Tests:** Unit tests passed.

코드가 안정적으로 보입니다. 커밋을 진행할까요?"

**User:** "응 진행해"

**AI:**
"**🚀 Git Commit:**
```bash
git add .
git commit -m "feat: implement auth login with validation"
