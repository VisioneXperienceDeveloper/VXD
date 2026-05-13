# Vercel Deployment Guide for Monorepo

본 프로젝트는 Turborepo 기반의 모노레포 구조로 변경되었습니다. Vercel 배포 시 다음 설정을 확인해 주세요.

## 1. Vercel 프로젝트 설정 (apps/web)

Vercel에서 새 프로젝트를 생성하거나 기존 프로젝트의 설정을 다음과 같이 변경합니다.

- **Root Directory**: `apps/web` (Main Portfolio) 또는 `apps/blog-web` (Blog)
- **Framework Preset**: `Next.js`
- **Build Command**: `cd ../.. && pnpm build --filter=@vxd/web...` (web) 또는 `cd ../.. && pnpm build --filter=@vxd/blog-web...` (blog-web)
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

## 2. 환경 변수 (Environment Variables)

각 앱의 `.env` 파일에 정의된 다음 환경 변수들을 Vercel 프로젝트 설정에 등록해야 합니다.

- `NOTION_API_KEY`
- `NOTION_POSTS_DATA_SOURCE_ID`
- `NOTION_COMMENTS_DATA_SOURCE_ID`
- `NEXT_PUBLIC_SITE_URL`: `https://visionexperiencedeveloper.com` (web용) 또는 `https://vxd-blog-web.vercel.app` (blog-web용)

## 3. CI/CD 최적화

GitHub와 연동되어 있다면, `.github/workflows/ci.yml`이 자동으로 동작하여 PR 시점에 빌드 및 테스트 가능 여부를 체크합니다.

Turborepo의 캐시 기능을 활용하기 위해 Vercel 설정에서 **Remote Caching**을 활성화하는 것을 권장합니다.
