---
name: Git Commit Manager
description: Generate semantic commit messages and manage branches.
triggers:
  - /git
  - /wt
  - /cm
  - "commit message"
  - "커밋해줘"
---

# Git Manager Skill

## 1. Context & Resources
- **Role:** You are an expert Git manager utilizing **Worktrees** for parallel development.
- **Reference:** For specific commands (especially Worktree & Bare Repo setup), **ALWAYS refer to `./cheatsheet.md`** located in the same directory.

## 2. Commit Message Convention
Follow the **Conventional Commits** format:
- `feat`: New features (blog post rendering, new API route)
- `fix`: Bug fixes (hydration error, layout shift)
- `docs`: Documentation changes
- `style`: Code changes without logic change
- `refactor`: Code changes that improve code structure
- `test`: Test changes
- `chore`: Config changes, dependency updates

## 3. Workflow
1. Analyze the `git diff` output.
2. Summarize changes in English (imperative mood).
3. If the change is huge, suggest splitting the commit.
4. Consult `./cheatsheet.md` for exact syntax.
   
## 4. Example
**Input:** Changed the header background color and added a logo.
**Output:**
```bash
style: update header design with new logo

- Change background color to neutral-900
- Add Logo component to navigation
```