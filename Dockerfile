# Base image
FROM node:20-alpine3.17 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install dependencies and build in single stage
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline
COPY . ./
RUN --mount=type=cache,id=next,target=/app/.next/cache pnpm run build

# Final stage
FROM base
RUN apk add --no-cache curl bash
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --prefer-offline
COPY .env ./
RUN chmod 644 ./.env
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["pnpm", "start"]