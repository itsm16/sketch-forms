# SketchForms

A hand-drawn form builder. Sketch a form on a canvas, save it, share a public
link, and collect responses.

## Features

- Email/password sign up and sign in with a secure JWT cookie session
- Canvas form builder (form container, inputs, textareas, buttons, text, lines)
- Create, load, update, publish/unpublish, and delete forms
- Public live form pages at `/live/[id]`
- Response collection and a per-form responses table
- Starter templates that create editable forms
- Single-command production build and Vercel deployment

## Stack

- **Web:** Next.js 16 (App Router), React 19, Tailwind CSS
- **API:** tRPC served from the Next.js route handler at `/api/trpc`
- **Database:** PostgreSQL + Drizzle ORM
- **Monorepo:** pnpm workspaces + Turborepo
- **UI:** shadcn-style components, wired-elements, roughjs

`apps/api` is an optional standalone Express server that exposes the same tRPC
router. The Vercel deployment does not need it.

## Local development

```sh
pnpm install
cp .env.example .env

# Starts the local Postgres container (database: "dev")
docker compose up -d

# Creates the tables
pnpm db:migrate

# Runs the web app on http://localhost:3000
pnpm dev
```

`setup.sh` symlinks the root `.env` into each workspace package so every package
reads the same configuration.

### Using an existing PostgreSQL server

Set `DATABASE_URL` in `.env` to your database, then run:

```sh
pnpm db:migrate
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Long random string used to sign auth tokens |
| `NEXT_PUBLIC_API_URL` | No | Leave empty to use the built-in `/api/trpc` route |

Generate a production secret with:

```sh
openssl rand -hex 32
```

## Deploy to Vercel

1. Create a PostgreSQL database with Neon, Vercel Postgres, Supabase, or any
   hosted Postgres provider. Use the pooled connection string for the app.
2. Run the migrations against that database from your machine:

   ```sh
   DATABASE_URL="postgresql://..." pnpm --filter @repo/database db:migrate
   ```

3. Push this repository to GitHub and import it in Vercel.
4. In the Vercel project settings:
   - Set **Root Directory** to `apps/web`.
   - Framework preset: **Next.js**.
   - Add `DATABASE_URL` and `JWT_SECRET` environment variables for Production,
     Preview, and Development.
   - Leave `NEXT_PUBLIC_API_URL` unset.
5. Deploy. Vercel runs `next build` from `apps/web` and serves the tRPC API from
   the same deployment at `/api/trpc`.

After deploying, sign up, create a form, save it from the builder, make sure
**Accepting responses** is enabled, and share the `/live/<form-id>` link.

## Useful commands

```sh
pnpm dev                         # run all apps
pnpm build                       # build all apps/packages
pnpm lint                        # lint web + api
pnpm check-types                 # TypeScript checks for the web app
pnpm db:generate                 # generate a Drizzle migration
pnpm db:migrate                  # apply migrations
pnpm --filter @repo/database db:push  # quick schema push (development only)
```
