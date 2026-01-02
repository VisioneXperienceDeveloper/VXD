# Project: VXD Blog
## Project Overview
This is a modern blog application built with Next.js, React, and Tailwind CSS. The blog posts are fetched from a Notion database, which serves as a headless CMS. The application supports light and dark modes, and it has a comprehensive testing setup with Vitest for unit/integration tests and Playwright for end-to-end tests.

**Main Technologies:**
*   **Framework:** Next.js 16
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS 4
*   **CMS:** Notion
*   **Unit/Integration Testing:** Vitest
*   **End-to-End Testing:** Playwright

## Building and Running
**1. Installation:**
```bash
pnpm install
```

**2. Environment Variables:**
Create a `.env.local` file in the root of the project and add the following environment variables:
```
NOTION_API_KEY=<your_notion_api_key>
NOTION_DATABASE_ID=<your_notion_database_id>
```

**3. Running the Development Server:**
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`.

**4. Building for Production:**
```bash
pnpm build
```

**5. Running in Production Mode:**
```bash
pnpm start
```

## Testing
**1. Running Unit/Integration Tests:**
```bash
pnpm test
```

**2. Running End-to-End Tests:**
```bash
pnpm test:e2e
```

**3. Running End-to-End Tests with UI:**
```bash
pnpm test:ui
```

## Development Conventions & Rules
### 1. Coding Standards
*   **Language:** Use TypeScript for all code. Avoid `any` type; define proper interfaces or types.
*   **React:** Use functional components with Hooks. Leverage React 19 features where appropriate.
*   **Styling:** Use Tailwind CSS 4. Follow the utility-first approach. Use `cn` (from `lib/utils.ts`) for conditional classes.
*   **State Management:** Prefer React's built-in state (useState, useReducer, Context API) unless a more complex solution is required.

### 2. Naming Conventions
*   **Components:** PascalCase (e.g., `PostCard.tsx`).
*   **Functions & Variables:** camelCase (e.g., `getPostData`).
*   **Files:** Match the export name or use kebab-case for utility files.
*   **Types/Interfaces:** PascalCase, prefixed with `T` or `I` if it helps clarity, though simple PascalCase is preferred.

### 3. Project Structure
*   `src/app`: Next.js App Router pages and layouts.
*   `src/components`: UI components. Group related components in subdirectories (e.g., `src/components/notion/`).
*   `src/lib`: Utility functions, API clients, and shared logic.
*   `__tests__`: All test files, mirroring the `src` structure.

### 4. Testing Strategy
*   **Unit Tests:** Every new utility function or logic-heavy component must have a corresponding `.test.ts` or `.test.tsx` file in `__tests__/unit`.
*   **E2E Tests:** Major user flows (Home, Search, Post Viewing) must be covered by Playwright tests in `__tests__/e2e`.
*   **CI/CD:** Ensure all tests pass (`pnpm test` and `pnpm test:e2e`) before committing significant changes.

### 5. Git & Commits
*   **Commit Message Format:** Use [Conventional Commits](https://www.conventionalcommits.org/):
    *   `feat:` A new feature.
    *   `fix:` A bug fix.
    *   `docs:` Documentation changes.
    *   `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc).
    *   `refactor:` A code change that neither fixes a bug nor adds a feature.
    *   `test:` Adding missing tests or correcting existing tests.
    *   `chore:` Changes to the build process or auxiliary tools and libraries.

### 6. Linting & Formatting
*   Run `pnpm lint` to check for code quality issues.
*   Use `pnpm lint:fix` to automatically fix common issues.
*   Adhere to the project's ESLint configuration.
