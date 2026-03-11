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

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем все зависимости (dev + prod)
RUN yarn install --frozen-lockfile

# Копируем весь проект
COPY . .

# Собираем Nuxt
RUN yarn build


# =========================
# 🚀 RUNTIME STAGE
# =========================
FROM node:22-alpine

WORKDIR /miniApp

# Копируем только результат билда из builder stage
COPY --from=builder /miniApp/.output ./.output
COPY server/api/ws-proxy-server.js ./ws-proxy-server.js

# Устанавливаем только те зависимости, которые нужны для runtime
# (ws нужен для прокси, concurrent можно убрать и запускать через sh)
RUN yarn add ws

# Открываем порт
EXPOSE 3000

# Запуск сервера Nuxt + ws-прокси без concurrently
CMD sh -c "node .output/server/index.mjs & node ws-proxy-server.js"