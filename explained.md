# Monorepo Structure Explanation

This repository is a `pnpm` + `turborepo` monorepo with two main groups:

- `apps/` — runnable applications
- `packages/` — shared libraries and backend/core logic

---

## Root

`c:/space/trpc-monorepo-main`

- `package.json`
  - top-level monorepo scripts: `build`, `dev`, `db:generate`, `db:migrate`, `lint`, `format`, `check-types`
  - uses `turbo` and `dotenv-cli`
- `pnpm-workspace.yaml`
  - includes all workspace packages under `apps/*` and `packages/*`

---

## apps/

### `apps/api/`

This is the backend API service.

- `src/index.ts`
  - likely the bootstrap/start script for the server
- `src/server.ts`
  - sets up Express + tRPC server routes
- `package.json`
  - depends on `@repo/trpc`, `@repo/logger`
  - uses `express`, `cors`, `trpc-to-openapi`, `zod`
- `tsup.config.ts`
  - build configuration for bundling the API server

Purpose:
- expose API endpoints
- host tRPC routers
- generate OpenAPI/docs from tRPC definitions

### `apps/web/`

This is the frontend Next.js application.

- `app/`
  - Next.js app directory with routes and pages
  - includes auth pages such as `(auth)/sign-up/page.tsx`
- `components/`
  - reusable UI components and element wrappers
- `hooks/`
  - custom React hooks such as `use-mobile.ts`
- `lib/`
  - general utility functions
- `providers/`
  - React providers and global wrappers
- `trpc/`
  - frontend tRPC client setup and configuration
- `package.json`
  - depends on `@repo/trpc`
  - uses `next`, `react`, `@tanstack/react-query`, `@trpc/react-query`, `zod`, Tailwind, Radix UI

Purpose:
- user-facing website
- auth flows, UI rendering, data fetching over tRPC

---

## packages/

### `packages/trpc/`

Shared tRPC logic used by both backend and frontend.

- `server/`
  - `context.ts`
  - `schema.ts`
  - `routes/`
  - `services/`
  - shared utilities for tRPC router construction
- `client/`
  - browser/client tRPC configuration

Purpose:
- common router definitions
- shared API contract and types
- single source of truth for tRPC schema and routes

### `packages/database/`

Database layer and migration setup.

- `schema.ts`
- `drizzle.config.ts`
- `models/`
- `package.json`
  - uses `drizzle-orm`, `drizzle-kit`, `pg`

Purpose:
- define database schema
- manage migrations
- provide ORM access and database models

### `packages/logger/`

Shared logging utility.

- `index.ts`
- `env.ts`

Purpose:
- centralized logger setup
- reusable across backend and services

### `packages/services/`

Shared business logic and external integrations.

- `clients/google-oauth.ts`
- `user/index.ts`
- `user/model.ts`

Purpose:
- encapsulate service logic
- handle auth, user operations, and external API clients
- keep domain logic outside the app entrypoints

### `packages/eslint-config/`

Shared ESLint configuration.

- `base.js`
- `next.js`
- `react-internal.js`

Purpose:
- consistent linting rules across all packages and apps

### `packages/typescript-config/`

Shared TypeScript configuration.

- `base.json`
- `nextjs.json`
- `node.json`

Purpose:
- consistent TS settings across apps and packages

---

## What does what?

- `apps/api` = backend API service
- `apps/web` = frontend Next.js application
- `packages/trpc` = shared tRPC router and client definitions
- `packages/database` = database schema, migrations, ORM config
- `packages/logger` = shared logger helper
- `packages/services` = shared business/domain logic
- `packages/eslint-config` = lint rules for the repo
- `packages/typescript-config` = shared TS config presets

---

# Packages are plain workspace packages, not overall apps.

Yes — packages is exactly for that.

packages contains workspace packages, not apps.
Each package is usually its own package.json and can be a plain shared library.
You should avoid dumping everything into one big utils package if you can split responsibilities.
Example structure:

logger → logger helper only
trpc → shared tRPC router/client logic
database → DB schema and migrations
services → business logic helpers
logger is a good example:

small responsibility
one entrypoint like index.ts
sets up Winston or another logger
may include env type validation with zod if it reads logger-specific env vars
can mark logging env as dev behavior inside its config
So yes:

packages items are plain packages
they are not whole backend apps
they are small, reusable pieces used by backend and frontend packages/apps
they are close to backend/shared logic, but not the backend app itself

---

## Current file location

`apps/web/app/(auth)/sign-up/page.tsx`

- This page is part of the frontend Next.js app
- It belongs to the auth UI flow, not the backend API

---

## tRPC flow overview

1. Frontend uses `@repo/trpc` client from `apps/web/src/trpc` or `packages/trpc/client`
2. Requests go to the backend in `apps/api` through shared tRPC routers in `packages/trpc`
3. Backend services and database packages execute business logic and data persistence
4. Shared types keep frontend and backend contract-safe


---

# FAQ

## Can I have more than one app inside `apps/`?

Yes. `apps/` is a folder convention for workspace apps, and it can contain multiple packages.

- You can have `apps/api`, `apps/web`, `apps/worker`, `apps/cli`, etc.
- Each one should be a separate workspace package with its own `package.json`.
- The app can be any kind of runnable package: Next.js, Express, plain Node, or any other app type.

## Can apps be `pnpm init` packages or Next.js apps?

Yes. Each app only needs a valid `package.json`.

- A Next.js app is a normal package in the workspace.
- A simple `pnpm init` package is also fine.
- The root workspace config (`pnpm-workspace.yaml`) picks up all `apps/*` packages.

## Are `packages/` for both apps to use?

Yes. `packages/` is typically for shared code that apps and other packages can import.

- Use `packages/` for shared libraries, utilities, configs, services, or data access.
- Apps under `apps/` can depend on packages in `packages/`.
- Other packages can also depend on each other if needed.

## Can package folders be named anything?

Yes, the folder name is up to you.

- The import name is defined by the package’s `package.json` `name` field.
- Example: folder `packages/logger` can have `name: "@repo/logger"`.
- Keep names clear and unique so workspace imports remain easy.

## Are packages also proper pnpm init apps?

Yes, every package in the workspace should have its own `package.json`.

- `packages/` items are workspace packages.
- They do not have to be runnable apps.
- They can be libraries, shared logic, or config packages used by apps.

