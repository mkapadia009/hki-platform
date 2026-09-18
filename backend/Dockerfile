FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

# --- Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3001

# Command to run the app
CMD ["npm", "run", "start:prod"]
