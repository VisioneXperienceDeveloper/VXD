---
name: Git Commit Manager
description: Generate semantic commit messages and manage branches.
triggers:
  - @git
  - "commit message"
  - "커밋해줘"
---

# Git Manager Skill

## 1. Commit Message Convention
Follow the **Conventional Commits** format:
- `feat`: New features (blog post rendering, new API route)
- `fix`: Bug fixes (hydration error, layout shift)
- `refactor`: Code changes without logic change
- `chore`: Config changes, dependency updates

## 2. Workflow
1. Analyze the `git diff` output.
2. Summarize changes in English (imperative mood).
3. If the change is huge, suggest splitting the commit.

## 3. Example
**Input:** Changed the header background color and added a logo.
**Output:**
```bash
feat: update header design with new logo

- Change background color to neutral-900
- Add Logo component to navigation
```