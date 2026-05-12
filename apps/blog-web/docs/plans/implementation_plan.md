# Implementation Plan - Notion Blog

This document outlines the plan for implementing a Notion-style blog using Next.js, Notion API, and Shadcn/ui.

## Goal Description
Build a personal blog where content is managed in Notion and displayed on a Next.js website with a clean, Notion-like aesthetic.

## User Review Required
- [x] **Notion API Version**: Updated to support v2025-09-03 (Data Sources).
- [x] **Routing**: Switched to ID-based routing (`/[id]`) due to missing Slug property.

## Proposed Changes

### Setup & Configuration
- [x] Initialize Next.js project with TypeScript and Tailwind CSS.
- [x] Install `shadcn/ui` and initialize.
- [x] Install `@notionhq/client` and renderer dependencies.
- [x] Configure `.env.local` with `NOTION_API_KEY` and `NOTION_DATABASE_ID`.

### Core Features
- [x] **Notion Service (`lib/notion.ts`)**:
    - [x] Implement `getPublishedPosts` using `dataSources.query`.
    - [x] Implement `getPostById`.
    - [x] Implement `getPageContent`.
- [x] **Blog List Page (`app/page.tsx`)**:
    - [x] Fetch and display posts in a grid layout.
    - [x] Implement card design with cover images and metadata.
- [x] **Blog Post Page (`app/[id]/page.tsx`)**:
    - [x] Fetch post content and metadata.
    - [x] Render blocks using `BlockRenderer`.
    - [x] Style with `prose` for readability.
- [x] **Block Renderer (`components/notion/BlockRenderer.tsx`)**:
    - [x] Support Paragraph, Headings, Lists, To-do, Toggle, Quote, Callout, Code, Image, Divider.

### UI/UX Polish
- [x] Apply Shadcn/ui theme (Neutral).
- [x] Add responsive design.
- [x] Optimize images with `next/image`.

### New Features (TDD)
- [x] **Scheduled Publishing**:
    - [x] Setup Vitest.
    - [x] Implement Date filter (Date <= Now).
- [x] **Category Support**:
    - [x] Implement Tag filtering.
- [x] **Grouping & Sorting**:
    - [x] Implement Group by property.
- [x] **Theme Support**:
    - [x] Implement Dark/Light mode.
- [x] **Search**:
    - [x] Implement Search bar.
- [x] **UI Refinement**:
    - [x] Implement Expanding Search Bar.

### Layout Refactor (New)
- [x] **Data Fetching (`lib/notion.ts`)**:
    - [x] `getAllGroups`: Fetch unique values from 'Group' property.
    - [x] `getTopTags`: Fetch tags and sort by usage count (limit 5).
    - [x] `getPostsByGroup`: Helper to fetch posts for a specific group (can reuse `getPublishedPosts` with filter).
- [x] **Components**:
    - [x] `Sidebar`: Component to display Categories (Groups).
    - [x] `TagFilter`: Update to show "All" + Top 5.
- [x] **Pages**:
    - [x] `app/page.tsx`: Switch to 2-column layout. Main column = Flat list. Sidebar = Categories.
    - [x] `app/[id]/page.tsx`: Add Sidebar showing posts from the same group.

### Performance Optimization
- [x] **Caching (`lib/notion.ts`)**:
    - [x] Use `unstable_cache` for `getPublishedPosts`, `getPageContent`, `getPostById`.
    - [x] Set revalidation time to 6 hours (21600 seconds).

### SEO & Metadata
- [x] **Metadata**:
    - [x] Implement dynamic metadata in `app/[id]/page.tsx`.
    - [x] Update default metadata in `app/layout.tsx`.
- [x] **Files**:
    - [x] Create `app/sitemap.ts`.
    - [x] Create `app/robots.ts`.

### Analytics & Feeds
- [x] **Google Analytics**:
    - [x] Create `components/GoogleAnalytics.tsx`.
    - [x] Add to `app/layout.tsx`.
- [x] **RSS Feed**:
    - [x] Create `app/feed.xml/route.ts`.
    - [x] Generate RSS 2.0 XML from posts.

### E2E Testing
- [x] **Setup**:
    - [x] Install and configure Playwright.
- [x] **Tests**:
    - [x] `home.spec.ts`: Verify post list, sidebar, and filtering.
    - [x] `search.spec.ts`: Verify search functionality.
    - [x] `post.spec.ts`: Verify post content and related posts sidebar.

### Part Property Support
- [x] **Notion Service (`lib/notion.ts`)**:
    - [x] Update `BlogPost` type to include `part`.
    - [x] Update `getCachedAllPosts` and `getPostById` to extract `part` property.
- [x] **Components**:
    - [x] Update `Sidebar` to accept `part` instead of `group` (or handle both if needed, but user requested change).
    - [x] Update `app/[id]/page.tsx` to display `part` in header and use `part` for related posts sidebar.

### i18n Support (Notion-based)
#### [MODIFY] [notion.ts](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/lib/notion.ts)
- Update `BlogPost` type to include `language` and `translation` (relation ID).
- Update `getPublishedPosts` to filter by `Language` property based on locale.
- Update `getPostById` to fetch `Translation` relation.

#### [MODIFY] [LanguageToggle.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/components/LanguageToggle.tsx)
- Accept optional `translationId` prop.
- If `translationId` is present, switch to that ID when toggling language.

#### [MODIFY] [page.tsx](file:///Users/cjungwo/Documents/Project/DEV/vxd/vxd-blog/client/src/app/[locale]/[id]/page.tsx)
- Pass `translationId` to `LanguageToggle`.
- Handle cases where translation is missing (optional: show warning).
## Verification Plan
### Automated Tests
- [x] `pnpm build` passes without errors.
- [x] Static generation works for all pages.
- [x] Vitest unit tests pass for Notion service.
- [x] Playwright E2E tests pass for core flows.

### Manual Verification
- [x] Verify Notion connection and data fetching.
- [x] Verify block rendering accuracy.
