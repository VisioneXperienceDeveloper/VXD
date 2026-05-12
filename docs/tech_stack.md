# Tech Stack

This project leverages a modern, scalable tech stack designed for high performance and developer productivity.

## Core Frameworks

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Monorepo** | [Turborepo](https://turbo.build/repo) | Managing multiple apps and packages with efficient caching. |
| **Package Manager** | [Pnpm](https://pnpm.io/) | Fast, disk space efficient package management. |
| **Frontend (Web)** | [Next.js 15+](https://nextjs.org/) | App Router, React Server Components, and optimized rendering. |
| **Frontend (Landing)** | [Astro](https://astro.build/) | Static site generation for maximum performance marketing pages. |
| **Backend** | [Convex](https://www.convex.dev/) | Real-time backend with transactional functions and automatic scaling. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety across the entire stack. |

## UI & Styling

- **Tailwind CSS v4**: Utility-first CSS for rapid UI development with a custom design system.
- **Radix UI**: Unstyled, accessible UI primitives for building high-quality components.
- **Lucide React**: Beautiful & consistent icon set.
- **Next-Intl**: Internationalization for multi-language support.

## Services & Integrations

- **Authentication**: [Clerk](https://clerk.com/) / [Slack Auth](packages/slack-auth).
- **CMS**: [Notion API](https://developers.notion.com/) for blog content management.
- **Storage**: Convex File Storage for message attachments and profile images.

## Development Tools

- **ESLint**: Standardized linting rules across the monorepo.
- **Prettier**: Consistent code formatting.
- **Vercel**: Deployment and hosting for web applications.
