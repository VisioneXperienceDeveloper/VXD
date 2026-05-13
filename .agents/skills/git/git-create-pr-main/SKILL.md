---
name: gpr-main
description: Creates a Pull Request from the 'features' integration branch to the 'main' production branch.
---

# Git Create PR to Main Skill

Use this skill when all features have been merged into the `features` branch and you are ready to deploy to production.

## Workflow

1. **Verify Integration State**:
   - Checkout the `features` branch.
   - Pull the latest changes from `origin features`.
   - **MANDATORY**: Run CI checks (`npm run lint`, `npm run test`, `npm run build`) on the `features` branch.

2. **Sync with Main**:
   - Ensure `features` is up-to-date with `main` to avoid merge conflicts.

3. **Push to Features**:
   - `git push origin features`

4. **Create Pull Request to Main**:
   - Use the `mcp_github-mcp-server_create_pull_request` tool.
   - **Base**: `main`.
   - **Head**: `features`.
   - **Title**: `release: merge features into main` or a summary of the batched features.
   - **Body**: Provide a comprehensive list of all features and changes included in this release.

## Guidelines

- **Batch Summary**: Ensure the PR body clearly lists all individual feature branches or PRs that were merged into `features`.
- **Production Readiness**: Only use this skill when the `features` branch is stable and ready for production.

## Reference

Follow the branching strategy defined in [AGENTS.md](../../../AGENTS.md).
