# Repository Guidelines

## Project Structure

This is a Vite + React 19 + TypeScript application. Application bootstrap and routing live in `src/main.tsx` and `src/routers.tsx`; shared styling is in `src/index.css`. Organize reusable primitives under `src/components` (including shadcn-style controls in `src/components/ui`) and shared helpers in `src/lib`. Product code belongs in feature folders such as `src/features/agent`, with feature-specific `api`, `components`, `data`, `hooks`, `mapper`, `schemas`, and `types` subfolders as they grow. Static files belong in `public`; imported assets belong in `src/assets`.

## Build, Test, and Development Commands

Install dependencies with `npm install`, then use:

- `npm run dev` — start the Vite development server with hot reload.
- `npm run build` — type-check through the TypeScript project build and create the production bundle.
- `npm run typecheck` — run TypeScript without emitting files.
- `npm run lint` — check all source files with ESLint.
- `npm run format` — format TypeScript and TSX files with Prettier and Tailwind class sorting.
- `npm run preview` — serve the built bundle locally for a production-style check.

There is currently no test runner configured. Add tests and a corresponding npm script when introducing testable behavior.

## Coding Style & Naming

Use 2-space indentation, LF line endings, no semicolons, double quotes, and an 80-character print width, as defined in `.prettierrc`. Run Prettier and ESLint before submitting changes. Use `PascalCase` for React components, `camelCase` for functions and variables, and lowercase feature directory names. Prefer the `@/*` alias for imports from `src` (for example, `@/components/ui/button`). Keep Tailwind classes formatted by the configured Prettier plugin.

## Testing Guidelines

No coverage threshold or test naming convention is established yet. When adding a test framework, place tests near the behavior they cover or in a clearly named `tests` directory, use descriptive names such as `agent-page.test.tsx`, and document the new command here.

## Commit & Pull Requests

The existing history uses concise conventional-style messages such as `feat: initial commit`; follow the `type: summary` pattern (`feat`, `fix`, `refactor`, `docs`, or `chore`). Keep commits focused. Pull requests should explain the user-visible change, mention validation commands run, link the relevant issue when available, and include screenshots or a short recording for UI changes.

## Configuration & Security

Do not commit secrets, local environment files, generated `dist` output, or dependency caches. Review changes to routing, API configuration, and shared UI components carefully because they can affect all features.
