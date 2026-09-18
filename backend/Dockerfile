# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# Generate the Prisma Client BEFORE building.
# Without this, @prisma/client has no types and tsc fails with "PrismaClient not found".
RUN pnpm prisma generate
RUN pnpm build

# Stage 2: Run only the compiled output (smaller image)
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable

# pnpm-workspace.yaml must be copied here too — it contains the allowBuilds
# permissions for packages like bcrypt and prisma that need to run build scripts
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
