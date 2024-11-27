# Base image
FROM node:20-alpine3.17 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install dependencies (dev and prod)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build application
FROM base AS build
COPY . ./
COPY --from=deps /app/node_modules ./node_modules
RUN --mount=type=cache,target=.next pnpm run build

# Install only production dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Final stage
FROM base
RUN apk add --no-cache curl bash
COPY .env ./ 

# Only copy the .env file in the final stage
RUN chmod 644 ./.env
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
EXPOSE 3000
CMD ["pnpm", "start"]