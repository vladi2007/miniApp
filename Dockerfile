# Этап сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /miniApp

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
#RUN npm install
RUN npm install
# Копируем остальные файлы
COPY . .

# Сборка проекта
RUN npm run build

# Этап продакшена
FROM node:18-alpine

# Рабочая директория
WORKDIR /miniApp

# Установка минимальных зависимостей
COPY package*.json ./
RUN npm install --production

# Копируем сборку из предыдущего этапа
COPY --from=builder /miniApp/.output ./.output

# Указываем порт (Nuxt 3 по умолчанию использует 3000)
EXPOSE 3000

# Копируем сервер WebSocket-прокси
COPY ws-proxy-server.js ./ws-proxy-server.js

# Устанавливаем ws (он нужен только в рантайме)
RUN npm install ws

# Запускаем Nuxt и ws-прокси параллельно
CMD ["sh", "-c", "node .output/server/index.mjs & node ws-proxy-server.js"]
