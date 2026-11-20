# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter sawari_backend

# ---- Build ----
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
RUN pnpm --filter sawari_backend build

# ---- Production ----
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/main.js"]
