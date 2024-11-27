FROM node:20-alpine3.17 AS base
WORKDIR /app

# Final stage
FROM base
RUN apk add --no-cache curl bash
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --prefer-offline
COPY .env ./
RUN chmod 644 ./.env
COPY .next ./.next
EXPOSE 3000
CMD ["pnpm", "start"]