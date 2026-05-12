<<<<<<< Updated upstream
# VXD Blog

> A modern, feature-rich blog platform powered by Notion as a headless CMS.
=======
![VXD Portfolio Header](/Users/cjungwo/.gemini/antigravity/brain/b4215118-f238-4de2-b374-7b231e05c4f6/vxd_portfolio_header_1777883817425.png)

# 🚀 VXD Portfolio
>>>>>>> Stashed changes

> **Vision eXperience Developer (VXD)** — A premium, high-performance portfolio and blog platform built with the latest web technologies. Powered by **Next.js 16**, **Notion CMS**, and **Tailwind CSS v4**.

---

## 🌟 Overview

<<<<<<< Updated upstream
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
=======
This project is a state-of-the-art developer portfolio designed to showcase projects, skills, and insights with a focus on **aesthetic excellence** and **technical precision**. It leverages Notion as a headless CMS, allowing for seamless content management without the need for a dedicated backend.

### ⚡ Key Highlights
- **Framework**: Next.js 16 (App Router)
- **CMS**: Notion API (Headless)
- **Styling**: Tailwind CSS v4 (Glassmorphism & Fluid UI)
- **Architecture**: Feature-Sliced Design (FSD)
- **i18n**: Multi-language support (KR/EN)
>>>>>>> Stashed changes

---

## ✨ Premium Features

<<<<<<< Updated upstream
### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm (or npm/yarn)
- Notion account with API access
=======
### 🎨 Visual & Experience
- **Fluid Design System**: A meticulously crafted UI using Tailwind CSS v4, featuring glassmorphism, smooth gradients, and interactive micro-animations.
- **Dark/Light Mode**: First-class support for system-preferred and manual theme switching via `next-themes`.
- **Responsive Mastery**: Tailored experiences for every device, from ultra-wide monitors to mobile screens.
- **Framer Motion**: Dynamic transitions and scroll-based animations for an immersive browsing experience.
>>>>>>> Stashed changes

### 📝 Headless Blog (Notion)
- **Dynamic Content**: Posts are fetched in real-time from Notion databases with optimized caching.
- **Rich Text Support**: Full rendering of Notion blocks including code syntax highlighting, callouts, and images.
- **Infinite Scrolling**: Performance-optimized pagination for a seamless reading experience.
- **Integrated Comments**: A custom comment system using Notion as a persistent data store.
- **Post Metrics**: Real-time view tracking and engagement analytics.

<<<<<<< Updated upstream
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
   GA_ID=G-XXXXXX
   GTM_ID=GTM-XXXXXX
   GOOGLE_ADSENSE_ACCOUNT=ca-pub-XXXXXXXXXXXXXXXX
   GOOGLE_ADSENSE_ID=pub-XXXXXXXXXXXXXXXX
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
=======
### 🛠️ Technical Excellence
- **SEO Mastery**: Automated generation of sitemaps, robots.txt, and dynamic Open Graph images.
- **RSS Integration**: Stay connected with an auto-generated RSS 2.0 feed.
- **Analytics & Tracking**: Seamless integration with Google Analytics (GA4) and Tag Manager.
- **Performance Optimized**: Server-side caching (1h TTL) and Vercel Speed Insights for sub-second load times.

---

## 🏗️ Architecture: Feature-Sliced Design (FSD)

The project follows the **FSD** methodology to ensure high scalability and strict isolation of concerns.

```mermaid
graph TD
    A[app] --> B[features]
    A --> C[widgets]
    B --> D[entities]
    C --> D
    D --> E[shared]
    B --> E
    C --> E
```

- **`app/`**: Application logic, routing, and global providers.
- **`features/`**: User-facing functionalities (e.g., Search, Commenting).
- **`widgets/`**: Complex compositional components (e.g., Header, PostGrid).
- **`entities/`**: Domain-specific business logic and data structures (e.g., Post, Category).
- **`shared/`**: Reusable UI components, hooks, and utility functions.

---

## 📦 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Core** | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **CMS** | [Notion API](https://developers.notion.com/) |
| **Localization** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Testing** | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |
| **Monitoring** | [Vercel Analytics](https://vercel.com/analytics), [GA4](https://analytics.google.com/) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **Package Manager**: `pnpm`
- **Notion**: An integration token and database ID

### Installation

1. **Clone & Navigate**
   ```bash
    git clone https://github.com/cjungwo/vxd-blog.git
    cd vxd-blog/feature
    ```

2. **Environment Setup**
    ```bash
    # Move to the web app directory and setup env
    cp apps/web/.env.example apps/web/.env.local
    # Fill in your NOTION_API_KEY and DATABASE_IDs in apps/web/.env.local
    ```

3. **Install Dependencies**
    ```bash
    pnpm install
    ```

4. **Launch Development**
    ```bash
    # Run all apps or specify filter
    pnpm dev
    # or
    pnpm dev --filter @vxd/web
    ```

---

## 🧪 Quality Assurance

We maintain high code quality through rigorous testing and automated workflows.
>>>>>>> Stashed changes

```bash
# Run Unit Tests
pnpm test

# Run E2E Tests
pnpm test:e2e

# Playwright UI Mode
pnpm test:ui
```

---

<<<<<<< Updated upstream
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
=======
## 📄 License & Author
>>>>>>> Stashed changes

Copyright © 2026 **Vision eXperience Developer (VXD)**.  
This project is private and proprietary. Unauthorized copying or distribution is prohibited.

---

<<<<<<< Updated upstream
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
=======
## 🙏 Credits
- [Next.js Team](https://nextjs.org/) for the incredible framework.
- [Notion](https://notion.so) for being the best headless CMS.
- [Tailwind Labs](https://tailwindcss.com) for CSS superpowers.
>>>>>>> Stashed changes
