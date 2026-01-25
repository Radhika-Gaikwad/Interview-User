# =========================
# 1️⃣ Build stage
# =========================
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# IMPORTANT: Vite must see env at build time
COPY .env.production .env

# Build Vite app
RUN npm run build

# =========================
# 2️⃣ Nginx serve stage
# =========================
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
