# Этап сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /miniApp

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
#RUN npm install
RUN npm ci
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

# Запуск приложения
CMD ["node", ".output/server/index.mjs"]
