# Blog Web Application

A dedicated, high-performance blog application decoupled from the main portfolio.

## Overview

- **Framework**: Next.js 15 (App Router)
- **Directory**: `apps/blog-web`
- **Port**: 5100 (Local)
- **Production URL**: `https://vxd-blog-web.vercel.app`

## Key Features

- **Dynamic Content**: Fetched from Notion CMS via `@vxd/notion-client`.
- **Performance**: Optimized images and server-side rendering.
- **Comments**: Real-time comments powered by Convex.
- **Search**: Advanced filtering by tags and content.

## Integration

- **Shared Components**: Uses `@vxd/ui` for consistent branding.
- **Backend**: Uses `@vxd/slack-backend` for comments and reactions (reusing the scalable infrastructure).
