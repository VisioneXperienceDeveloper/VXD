# VXD Blog & Slack Clone Monorepo Documentation

Welcome to the central documentation for the Vision Experience Developer (VXD) project. This monorepo hosts multiple applications, including a high-fidelity portfolio/blog and a full-featured Slack clone.

## Core Documentation

- **[Tech Stack](tech_stack.md)**: Detailed overview of the technologies used across the monorepo.
- **[Architecture](architecture.md)**: High-level architectural design and directory structure (FSD).
- **[Database Schema](database_schema.md)**: Convex database schema and data models.
- **[Authentication](authentication.md)**: Identity management and access control flow.
- **[Testing](testing.md)**: Testing strategies and CI/CD pipelines.
- **[Guidelines](guidelines.md)**: Coding standards and contribution rules.

## Features

### Slack Clone
- **[Chat](features/slack/chat.md)**: Real-time messaging, threads, and reactions.
- **[Auth](features/slack/auth.md)**: Clerk and Convex authentication integration.
- **[Workspace](features/slack/workspace.md)**: Workspace management and membership.

### Blog
- **[Search](features/blog/search.md)**: Content and tag-based post search.
- **[Comments](features/blog/comments.md)**: User comments and feedback.

## Applications

- **[web](apps/web.md)**: The main portfolio and blog application.
- **[slack-web](apps/slack-web.md)**: Web-based Slack clone.
- **[blog-web](apps/blog-web.md)**: Decoupled blog application.
- **[slack-landing](apps/slack-landing.md)**: Marketing landing page for the Slack clone.

## Development

Refer to the [Deployment Guide](deployment_guide.md) for instructions on how to deploy the applications to production.
