# Vercel Deployment Guide for Monorepo

본 프로젝트는 Turborepo 기반의 모노레포 구조로 변경되었습니다. Vercel 배포 시 다음 설정을 확인해 주세요.

## 1. Vercel 프로젝트 설정 (apps/web)

Vercel에서 새 프로젝트를 생성하거나 기존 프로젝트의 설정을 다음과 같이 변경합니다.

- **Root Directory**: `apps/web` (중요)
- **Framework Preset**: `Next.js`
- **Build Command**: `cd ../.. && pnpm build --filter=@vxd/web...` (또는 `pnpm turbo build --filter=@vxd/web...`)
- **Install Command**: `pnpm install` (Vercel이 자동으로 감지하지만, 필요한 경우 명시)
- **Output Directory**: `.next`

## 2. 환경 변수 (Environment Variables)

`apps/web/.env.local`에 정의된 다음 환경 변수들을 Vercel 프로젝트 설정에 등록해야 합니다.

- `NOTION_API_KEY`
- `NOTION_POSTS_DATA_SOURCE_ID`
- `NOTION_COMMENTS_DATA_SOURCE_ID`
- `NEXT_PUBLIC_BASE_URL`

## 3. 특정 브랜치 배포 제외 (Ignored Build Step)

본 프로젝트는 `main` 브랜치에서만 프로덕션 배포가 이루어지도록 설정되어 있습니다. `features` 통합 브랜치나 기타 `feature/*` 브랜치에서의 불필요한 빌드를 방지하려면 다음 설정을 적용하세요.

1.  Vercel 프로젝트 설정 -> **Git** -> **Ignored Build Step** 섹션으로 이동합니다.
2.  명령어 창에 다음을 입력합니다:
    ```bash
    bash scripts/vercel-ignore-build.sh
    ```
3.  이제 `main` 브랜치를 제외한 모든 브랜치에 대한 푸시는 Vercel 빌드를 건너뛰게 됩니다.

## 4. CI/CD 최적화

GitHub와 연동되어 있다면, `.github/workflows/ci.yml`이 자동으로 동작하여 PR 시점에 빌드 및 테스트 가능 여부를 체크합니다.

Turborepo의 캐시 기능을 활용하기 위해 Vercel 설정에서 **Remote Caching**을 활성화하는 것을 권장합니다.
