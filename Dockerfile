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

# Копируем только результат билда
COPY --from=builder /miniApp/.output ./.output

# Открываем порт
EXPOSE 3000

# Запуск только Nuxt сервера
CMD ["node", ".output/server/index.mjs"]