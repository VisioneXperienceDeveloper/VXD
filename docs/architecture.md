# Architecture

The project follows a modular, feature-oriented architecture designed to scale across multiple applications.

## Monorepo Structure

We use **Turborepo** to manage applications and shared packages.

```text
.
├── apps/
│   ├── web/               # Main portfolio & blog (Next.js)
│   ├── slack-web/         # Slack clone web app (Next.js)
│   ├── slack-landing/     # Slack clone landing page (Astro)
│   ├── slack-mobile/      # Mobile version (Capacitor/WebView)
│   └── blog-web/          # Dedicated blog app (Next.js)
├── packages/
│   ├── ui/                # Shared UI component library
│   ├── slack-backend/     # Shared Convex backend logic
│   ├── slack-auth/        # Shared authentication logic
│   ├── notion-client/     # Notion CMS integration client
│   ├── config-eslint/     # Shared ESLint configuration
│   └── config-typescript/ # Shared TypeScript configuration
└── docs/                  # Project documentation
```

## Frontend: Feature-Sliced Design (FSD)

All Next.js applications follow the **Feature-Sliced Design** methodology to ensure code maintainability and clear boundaries.

### Layers

1.  **App**: Global setup (providers, global styles, layout).
2.  **Pages**: Route views (Next.js App Router).
3.  **Widgets**: Large-scale components composed of multiple features/entities (e.g., `Header`, `Sidebar`).
4.  **Features**: User actions with business value (e.g., `SearchPosts`, `SendChannelMessage`).
5.  **Entities**: Domain-specific objects and state (e.g., `User`, `Message`).
6.  **Shared**: Low-level utilities, UI primitives, and common hooks.

## Backend: Real-time with Convex

The backend logic is centralized in `packages/slack-backend/convex`. It uses:
- **Queries**: Real-time reactive data fetching.
- **Mutations**: Atomic, transactional data updates.
- **Actions**: Side-effect management (e.g., calling external APIs).
