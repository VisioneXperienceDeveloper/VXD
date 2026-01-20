# Project Guidelines & Rules

## 1. Project Overview & Tech Stack
- **Description:** A modern blog application using a Notion database as a Headless CMS, built with Next.js.
- **Framework:** Next.js 16.1.1 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS 4, `class-variance-authority`, `clsx`, `lucide-react`. (**Do not create .css files**; use utility classes).
- **CMS/Database:** Notion API (`@notionhq/client`) serving as the primary data source.
- **Testing:** Vitest (Unit), Playwright (E2E), Testing Library.
- **Package Manager:** `pnpm`

## 2. AI Behavior Guidelines
- **Language:** Always provide explanations and responses in **Korean**. However, write code comments, variable names, and commit messages in **English**.
- **Reasoning:** Before writing code, always output the **"Reasoning Process"**. If the modification is extensive, present a **"Plan"** first and await user approval.
- **Code Quality:** Prefer clear, multi-line code over unreadable one-liners. Remove unused variables and imports immediately.
- **Error Handling:** When an error occurs, do not just fix it; summarize the **root cause** in one line. If a terminal command fails, stop the process immediately.
- **Documentation:** Every works must be documented in /docs folder. There are 3 types of documents: 
  - **/architectures** 
  - **/fixes** 
  - **/plans** 
  - **/tests** 
  - ... (if you need to add more documents, add them and save them in /docs folder)
  - **CHANGELOG.md** (always update this file when you make a change)
- **Workflow Automation Rule:**
  - When a task is deemed complete or the user indicates completion, do not commit immediately; **always initiate the `@finish` workflow.**
  - Enforce the **[Code Review] -> [Request Approval] -> [Commit]** procedure. Do not suggest `git commit` directly.

## 3. Server vs. Client Strategy (Architecture)
- **Default to Server:** All components are **Server Components** by default.
- **Client Boundary:** Use `'use client'` only when interactivity (`useState`, `onClick`, `useEffect`) is strictly needed.
- **Data Fetching:** - Fetch data directly in Server Components using `async/await`. 
  - **Do not** use `useEffect` for data fetching unless absolutely necessary.
  - **Caching:** Notion API calls must be cached for **6 hours (21600s)** using `unstable_cache` to minimize API usage.
- **Mutations:** Use **Server Actions** for any data mutations or form submissions. Do not use `pages/api` (API Routes).

## 4. Coding Standards

### 4.1 Naming & Structure
- **Components:** `PascalCase` (e.g., `PostCard.tsx`).
- **Functions/Variables:** `camelCase` (e.g., `getPostData`).
- **Files:** Match the export name or use `kebab-case` for utility files/folders (e.g., `app/dashboard/settings`).
- **Imports:** Use **absolute imports** (`@/components/...`) instead of relative paths.
- **Co-location:** Group related components in subdirectories (e.g., `src/components/notion/`).

### 4.2 Type Safety
- **No `any`:** The use of `any` is strictly prohibited. Use `unknown` with Type Guards (or Zod) for validation.
- **Strict Mode:** Assume `strict: true`; handle `null` or `undefined` rigorously.
- **Explicit Returns:** Explicitly define the return type for all functions (do not rely on inference).
- **Definitions:** Use `interface` for extensible objects; use `type` for unions/intersections.

### 4.3 State Management Hierarchy
1. **Server State:** Prefer fetching fresh data on the server (React Query/SWR if client-side fetching is needed).
2. **URL State:** Store filter/search params in the URL (`useSearchParams`) for shareability.
3. **Global State:** Use Context API or Zustand only if prop drilling exceeds 3 levels.

### 4.4 Error Handling Pattern
- **Server Actions:** Handle errors gracefully using `try/catch` and return structured objects:
  ```ts
  try {
    // logic
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return { success: false, error: "Friendly error message" };
  }
  ```

## 5. Workflows to AVOID 🚫
- No API Routes: Do not use pages/api; use Server Actions.
- No Hardcoded Secrets: Always use process.env.
- No Huge Components: Break down components if they exceed 200 lines.
- No New Packages: Do not install new npm packages without asking for approval first.
- No Prop Drilling: Avoid passing props more than 3 levels deep.

## 6. Environment & Commands
- Environment Variables: NOTION_API_KEY, NOTION_POSTS_DATA_SOURCE_ID, NOTION_COMMENTS_DATA_SOURCE_ID.
- Commands:
    - pnpm dev: Start dev server (http://localhost:3000).
    - pnpm build: Production build.
    - pnpm test: Run unit tests.
    - pnpm test:e2e: Run E2E tests.

## 7. Documentation Etiquette
- Code Comments: When writing complex logic, write a brief comment explaining "Why" (intent), not "What" (syntax).
- JSDoc: Mandatory for all utility functions.
