# Walkthrough: Monorepo CI/CD Fix

I have fixed the "No Next.js version detected" error by restructuring the CI/CD workflows to correctly target the application directories in the monorepo.

## Changes Made

### 🚀 Consolidated Deployment Workflows
Moved application-specific workflows from subdirectories to the root `.github/workflows/` directory for standard GitHub Actions support and better visibility.
- [deploy-web.yml](file:///Users/cjungwo/Documents/Project/Blog/vxd-blog/feature/.github/workflows/deploy-web.yml)
- [deploy-blog-web.yml](file:///Users/cjungwo/Documents/Project/Blog/vxd-blog/feature/.github/workflows/deploy-blog-web.yml)

### 🛠️ Fixed Build Context
Updated the Vercel CLI commands to use the `--cwd` context (via `working-directory` in GitHub Actions). This ensures that `vercel build` correctly identifies the `next` dependency within `apps/web/` and `apps/blog-web/`.

### 🧹 Cleaned Up Redundant Files
Removed the leftover `.github` directories from `apps/web/` and `apps/blog-web/` to prevent confusion and redundant workflow execution.

## Verification
The workflows are now correctly configured to:
1.  **Install dependencies** at the monorepo root.
2.  **Run tests** using Turbo with appropriate filters (`--filter=@vxd/web`).
3.  **Build and Deploy** specifically from the application directories.

Next time you push to the `main` branch, the new workflows will trigger and deploy the applications correctly.
