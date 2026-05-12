# Coding Guidelines

To maintain consistency across the monorepo, all developers must adhere to the following standards.

## Code Quality

- **ESLint & Prettier**: Always follow the project's linting and formatting rules. CI will fail if these are not met.
- **TypeScript**: Use strict typing. Avoid `any` unless absolutely necessary.
- **React Components**: 
  - Prefer functional components and hooks.
  - Use **Derived State** instead of syncing state via `useEffect`.
  - Never call `setState` synchronously within a `useEffect`.

## Feature-Sliced Design (FSD)

- Respect the boundaries between layers (App -> Pages -> Widgets -> Features -> Entities -> Shared).
- Cross-importing between features or entities is generally discouraged; use `shared` or lift logic to a `widget`.

## Git Workflow

- **Branching**:
  - `main`: Production.
  - `feature/*`: New features.
  - `bugfix/*`: Fixes.
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/).
- **Pull Requests**: Every PR must pass CI checks and be reviewed before merging.

## Documentation

- **Vertical Slice First**: Always document features as complete slices (UI + Backend + Logic).
- **Living Docs**: Update `/docs` immediately whenever the architecture, stack, or schema changes.
