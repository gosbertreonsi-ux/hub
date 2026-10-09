# Multi-stage Dockerfile for MIZIZI SOCIAL Full-Stack App
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and build static client
COPY . .
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node modules and package.json
COPY package*.json ./
RUN npm install --omit=dev

# Copy built frontend dist and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Install tsx globally or run with tsx for typescript server
RUN npm install -g tsx

# Prepare uploads and data volumes
RUN mkdir -p uploads data

EXPOSE 3000

CMD ["tsx", "server.ts"]
