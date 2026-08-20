<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Mistikterra is a single **Next.js 16** (App Router, React 19, TypeScript, Tailwind v4) web app for a luxury travel agency. Its core flow: browse curated destinations on `/` and submit a personalized trip inquiry, which POSTs to the `/api/inquiries` route handler and returns a confirmation with a `MT-XXXXXX` reference. Inquiries are stored in an in-memory array (`src/lib/inquiries.ts`), so they reset on every server restart — there is no database.

Standard commands live in `package.json` scripts (`dev`, `build`, `start`, `lint`, `test`). Non-obvious notes:

- The dev server uses Turbopack by default and writes to `.next/dev` (separate from `next build`'s `.next`), so dev and build can run concurrently. A lockfile prevents two `next dev` instances on the same project.
- Bare `npx tsc --noEmit` fails with `Cannot find name 'LayoutProps'`/`RouteContext` until Next.js generates route types. Run `npx next typegen` (or `next dev`/`next build`) first; `npm run build` already type-checks, so it is the authoritative check.
- `next lint` was removed in Next.js 16; lint via `npm run lint` (ESLint flat config) directly.
- Tests use Vitest with a `node` environment (`vitest.config.mts`); config must stay `.mts` (or `.mjs`) to avoid an ESM-in-CJS warning.

