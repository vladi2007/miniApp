# Этап сборки
FROM node:22-alpine AS builder

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
FROM node:22-alpine

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
COPY server/api/ws-proxy-server.js ./ws-proxy-server.js

# Устанавливаем concurrently и ws
RUN npm install concurrently ws

# Добавь скрипт в package.json:
# "start": "concurrently \"node .output/server/index.mjs\" \"node ws-proxy-server.js\""

CMD ["npm", "run", "start"]
