# syntax=docker/dockerfile:1

# =============================================
# Stage 1: Base
# =============================================
FROM oven/bun:1-alpine AS base
WORKDIR /app

# =============================================
# Stage 2: Install all dependencies (for build)
# =============================================
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# =============================================
# Stage 3: Install production dependencies only
# @sentry/* is externalized from Nitro bundle,
# so it must be available at runtime.
# =============================================
FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# =============================================
# Stage 4: Build the application
# =============================================
FROM base AS build
COPY --from=deps /app/node_modules node_modules
COPY . .

ENV NODE_ENV=production
# Use --bun flag to ensure Bun's native runtime is used during Vite build
RUN bun --bun run build

# =============================================
# Stage 5: Production image
# =============================================
FROM base AS release
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules (needed for externalized @sentry/* packages)
COPY --from=prod-deps --chown=bun:bun /app/node_modules node_modules

# Copy the Nitro build output and the instrument file copied by the build script
COPY --from=build --chown=bun:bun /app/.output .output

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "--preload", "./.output/server/instrument.server.mjs", ".output/server/index.mjs"]
