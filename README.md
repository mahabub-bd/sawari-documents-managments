# SawariBD Monorepo

| Package | Path | Version | Stack |
|---|---|---|---|
| Backend API | [apps/api/](apps/api/) | 1.1.0 | NestJS 11, Mongoose, JWT |
| Frontend | [apps/web/](apps/web/) | 0.2.0 | Next.js 15, React 19, Tailwind |

Managed as a **pnpm workspace** (Node >= 20, pnpm >= 9).

## Local development

```bash
pnpm install
pnpm dev            # backend :3000 + frontend :3002 in parallel
pnpm dev:backend    # backend only
pnpm dev:frontend   # frontend only
pnpm build          # build both
pnpm test           # backend jest tests
```

## Docker

```bash
cp .env.example .env   # fill in AWS keys & secrets
docker compose up --build -d
```

Services: frontend `:3002`, backend `:3000` (Swagger at `/docs`), MongoDB `:27017`.

Build args: `NEXT_PUBLIC_API_URL` is baked into the frontend image at build time — set it in `.env` before `docker compose build`.

## Note for Windows local builds

`next build` with `output: "standalone"` requires symlink permission (Windows Developer Mode or admin). Inside Docker this works normally.
