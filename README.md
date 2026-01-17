# VXD Blog

> A modern, feature-rich blog platform powered by Notion as a headless CMS.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC)](https://tailwindcss.com/)

---

## ✨ Features

### Core Features
- 📝 **Notion CMS Integration**: Manage blog posts directly from Notion
- 🌐 **Internationalization (i18n)**: Full support for Korean (KR) and English (EN)
- 🎨 **Theme Support**: Dark, Light, and System modes
- 🔍 **Search & Filter**: Search by title, filter by tags and groups
- ♾️ **Infinite Scroll**: Smooth pagination with 6 posts per page
- 💬 **Comment System**: Notion-based comments with rate limiting and validation
- 👁️ **View Counter**: Track post views with Notion integration
- 🔗 **Slug-based Routing**: SEO-friendly URLs

### SEO & Performance
- 🎯 **Dynamic Metadata**: Automatic Open Graph and Twitter Card generation
- 🗺️ **Sitemap & Robots.txt**: Auto-generated for search engines
- 📡 **RSS Feed**: RSS 2.0 feed at `/feed.xml`
- ⚡ **Caching Strategy**: 1-hour server-side caching with Next.js
- 🚀 **Speed Insights**: Vercel Speed Insights integration

### Developer Experience
- 🧪 **Testing**: Vitest (unit) + Playwright (E2E)
- 🔄 **CI/CD**: GitHub Actions → Vercel deployment
- 📊 **Analytics**: Google Analytics (GA4), Google Tag Manager
- 💰 **Monetization**: Google AdSense integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm (or npm/yarn)
- Notion account with API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vxd-blog/client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```bash
   # Notion API
   NOTION_API_KEY=secret_xxx
   NOTION_POSTS_DATA_SOURCE_ID=xxx
   NOTION_COMMENTS_DATA_SOURCE_ID=xxx

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Google Services (Optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXX
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **UI Library** | React 19.2.3 |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 4.x |
| **CMS** | Notion API (`@notionhq/client`) |
| **i18n** | next-intl |
| **Testing** | Vitest, Playwright, Testing Library |
| **Deployment** | Vercel |

---

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── [slug]/          # Blog post pages
│   │   └── layout.tsx       # Root layout
│   └── api/                 # API routes
│       └── comments/        # Comment endpoints
├── components/              # React components
│   ├── comments/           # Comment system
│   ├── delegator/          # Third-party integrations
│   └── notion/             # Notion block renderers
├── lib/                    # Utilities and services
│   ├── services/           # Business logic layer
│   │   ├── posts.service.ts
│   │   └── comments.service.ts
│   └── types/              # TypeScript types
└── i18n/                   # Internationalization config

docs/                       # Documentation (unpublished)
├── architecture/           # Architecture docs
│   ├── notion-api-integration.md
│   ├── comment-system.md
│   ├── i18n-strategy.md
│   └── ...
└── CHANGELOG.md           # Version history
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# E2E with UI
pnpm test:ui
```

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

- [Notion API Integration](./docs/architecture/notion-api-integration.md)
- [Comment System](./docs/architecture/comment-system.md)
- [i18n Strategy](./docs/architecture/i18n-strategy.md)
- [SEO Strategy](./docs/architecture/seo-strategy.md)
- [CI/CD Pipeline](./docs/architecture/cicd-strategy.md)
- [CHANGELOG](./docs/CHANGELOG.md)

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Manual Build

```bash
pnpm build
pnpm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes

---

## 📄 License

This project is private and proprietary.

---

## 👤 Author

**Vision eXperience Developer (VXD)**

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Notion](https://www.notion.so/) - Headless CMS
- [Vercel](https://vercel.com/) - Deployment Platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
