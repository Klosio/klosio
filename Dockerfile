FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat python3 make g++
RUN apk update
WORKDIR /app
COPY .gitignore .gitignore
RUN npm install -g turbo
COPY --from=builder /app/out/full/ .
RUN npm install -ci
RUN turbo run build --filter=server

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server
USER server


WORKDIR /app
COPY --from=installer --chown=server:nodejs /app ./
EXPOSE 3000
CMD npm run start:server:prod