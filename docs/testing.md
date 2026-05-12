# Testing & CI/CD

Quality assurance is automated through a series of checks integrated into the development workflow and CI/CD pipelines.

## Local Verification

Before pushing code or creating a Pull Request, the following checks are **mandatory**:

1.  **Linting**: `npm run lint` (Checks code quality and FSD boundaries).
2.  **Testing**: `npm run test` (Executes unit and integration tests).
3.  **Building**: `npm run build` (Ensures the project compiles without errors).

You can use the `/ci` agent skill to run these checks sequentially.

## Continuous Integration (CI)

Our GitHub Actions pipeline runs on every Pull Request to the `main` branch. It ensures:
- All lint rules pass.
- Type checks are valid across all packages.
- Build artifacts are successfully generated.
- Unit tests pass.

## Continuous Deployment (CD)

- **Main Branch**: Merges to `main` trigger automatic deployment to production environments (Vercel).
- **Preview Environments**: Every PR generates a unique preview URL for testing and stakeholder review.
