# Project Memory
## Project Overview
This is a modern blog application built with Next.js, React, and Tailwind CSS. The blog posts are fetched from a Notion database, which serves as a headless CMS. The application supports light and dark modes, and it has a comprehensive testing setup with Vitest for unit/integration tests and Playwright for end-to-end tests.

## Project Architecture
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library:** React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, `class-variance-authority`, `clsx`, `lucide-react`
- **CMS/Database**: Notion API (`@notionhq/client`)
- **Testing**: Vitest (Unit), Playwright (E2E), Testing Library

## Project Structure
*   `src/app`: Next.js App Router pages and layouts.
*   `src/components`: UI components. Group related components in subdirectories (e.g., `src/components/notion/`).
*   `src/lib`: Utility functions, API clients, and shared logic.
*   `__tests__`: All test files, mirroring the `src` structure.

## Coding Standards
- **Language:** Use TypeScript for all code. Avoid `any` type; define proper interfaces or types.
- **React:** Use functional components with Hooks. Leverage React 19 features where appropriate.
- **Style Guide**: Follow ESLint configuration (`eslint.config.mjs`).
- **Formatting**: Prettier (implied), 2 spaces indentation.
- **Components**: Use functional components. Place reusable components in `src/components`.
- **CSS**: Use Tailwind CSS 4. Follow the utility-first approach. Use `cn` (from `lib/utils.ts`) for conditional classes. Avoid inline styles.
- **State Management:** Prefer React's built-in state (useState, useReducer, Context API) unless a more complex solution is required.
- **Error Handling:** Implement proper error handling using try-catch blocks and error boundaries.
- **Performance:** Optimize performance by using React's built-in features (e.g., memoization, lazy loading, code splitting).
  - **Caching:** Notion API calls are cached for 6 hours (21600s) using `unstable_cache` to minimize API usage and improve load times.
- **Accessibility:** Follow WCAG 2.1 guidelines for accessibility.
- **Version Control:** Use Git for version control.
- **Code Review:** Use GitHub for code review.
- **Deployment:** Use Vercel for deployment.
- **CI/CD:** Use GitHub Actions for CI/CD.
- **Monitoring:** Use Sentry for monitoring.
- **Analytics:** Use Google Analytics (GA4) for analytics.
- **SEO:** Dynamic metadata, `sitemap.xml`, and `robots.txt` are generated automatically.
- **RSS:** An RSS 2.0 feed is available at `/feed.xml`.
- **Localization:** Use i18n for localization.

## Naming Conventions
- **Components:** PascalCase (e.g., `PostCard.tsx`).
- **Functions & Variables:** camelCase (e.g., `getPostData`).
- **Files:** Match the export name or use kebab-case for utility files.
- **Types/Interfaces:** PascalCase, prefixed with `T` or `I` if it helps clarity, though simple PascalCase is preferred.

## Bash Commands
### Installation
- Command: `pnpm install`

### Running
- Command: `pnpm dev`
- The application will be available at `http://localhost:3000`.

### Build
- Command: `pnpm build`
- Output: `.next` directory

### Test
- Unit Tests: `pnpm test` (Vitest)
- E2E Tests: `pnpm test:e2e` (Playwright)
- UI Mode: `pnpm test:ui`

### Deploy
- Platform: Vercel (Recommended for Next.js)
- Build Command: `next build`
- Install Command: `pnpm install`

## Testing Strategy
- **Unit Tests:** Every new utility function or logic-heavy component must have a corresponding `.test.ts` or `.test.tsx` file in `__tests__/unit`.
- **E2E Tests:** Major user flows (Home, Search, Post Viewing) must be covered by Playwright tests in `__tests__/e2e`.
- **CI/CD:** Ensure all tests pass (`pnpm test` and `pnpm test:e2e`) before committing significant changes.

## Repository Etiquette
- **Branching**: Use feature branches (e.g., `feature/new-component`, `fix/bug-fix`).
- **Commit Message Format**: Use [Conventional Commits](https://www.conventionalcommits.org/):
    *   `feat:` A new feature.
    *   `fix:` A bug fix.
    *   `docs:` Documentation changes.
    *   `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc).
    *   `refactor:` A code change that neither fixes a bug nor adds a feature.
    *   `test:` Adding missing tests or correcting existing tests.
    *   `chore:` Changes to the build process or auxiliary tools and libraries.
- **Commits**: Use conventional commits (e.g., `feat: add header`, `fix: resolve crash`).
- **Merge**: Squash and merge PRs to keep history clean.
- **Rebase**: Rebase on `main` before merging if necessary.

## Unexpected Behaviors / Warnings
- (Add any known project-specific quirks here)

## Common Libraries
- `clsx` & `tailwind-merge`: For conditional class names.
- `lucide-react`: For icons.
