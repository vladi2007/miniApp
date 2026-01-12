# =========================
# 🏗 BUILDER STAGE
# =========================
FROM node:22-alpine AS builder

WORKDIR /miniApp

# Build-time args
ARG NUXT_APP_BASE_URL
ARG NUXT_APP_BUILD_ASSETS_DIR
ENV NUXT_APP_BASE_URL=$NUXT_APP_BASE_URL
ENV NUXT_APP_BUILD_ASSETS_DIR=$NUXT_APP_BUILD_ASSETS_DIR

COPY package*.json ./
RUN npm install
COPY . .

# Build Nuxt с правильными baseURL/buildAssetsDir
RUN npm run build

# =========================
# 🚀 RUNTIME STAGE
# =========================
FROM node:22-alpine

WORKDIR /miniApp

COPY package*.json ./
RUN npm install --production
COPY --from=builder /miniApp/.output ./.output

COPY server/api/ws-proxy-server.js ./ws-proxy-server.js
RUN npm install concurrently ws



EXPOSE 3000

CMD ["npm", "run", "start"]
