FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true

FROM base AS deps
COPY package.json ./
RUN pnpm install

FROM base AS dev
COPY package.json ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]

FROM base AS builder
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
