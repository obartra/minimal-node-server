# Builder Image
FROM node:22-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --prefer-offline

COPY . .
RUN npm run build

# Production Image
FROM node:22-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-audit --prefer-offline

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
