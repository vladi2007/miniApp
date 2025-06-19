# Click Telegram Mini App Docs RU
**Пользовательская документация Click Telegram Mini App на русском языке**
---
## Введение
**Click Telegram Mini App** — это интерактивное веб-приложение, разработанное для проведения онлайн-квизов прямо в Telegram с использованием Telegram Mini Apps.
Проект создан для решения следующих задач:
- 🔄 Оптимизация проведения онлайн-мероприятий и викторин.
- 👥 Упрощение взаимодействия между ведущим и участниками.
- 📊 Автоматизация сбора, хранения и анализа пользовательских данных.
- 🎮 Повышение вовлечённости аудитории через игровые механики и удобный интерфейс.
---
## О репозитории
Репозиторий содержит модуль с frontend. 
Структура проекта:

- `/server` — серверная логика, API, работа с Telegram API.
- `/pages` — страницы фронтенда на Nuxt 3.
- `/components` — переиспользуемые Vue-компоненты.
- `/assets/css` — стили.
- `Dockerfile` — конфигурация для сборки и деплоя в Docker.
---
Репозиторий с backend: https://github.com/mrBoB1k/FastAPITelegramMiniApp
## Стэк технологий

- **Nuxt 3** — основной фреймворк (на базе Vue.js).
- **Node.js** — для серверной логики.
- **TypeScript** *(опционально)* — строгая типизация.
- **Docker** — деплой через контейнеры.
- **Telegram WebApp API** — интеграция с Telegram.
---
# Nuxt Minimal Starter

Изучите документацию  [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction).

## Установка

**Установите зависимости**

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Сервер разработки

**Запустите сервер разработки `http://localhost:3000`:**

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

**Соберите билд для продакшена**

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

**Локальный предпросмотр билда для продашкена**

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Смотрите больше информации здесь [deployment documentation](https://nuxt.com/docs/getting-started/deployment).
"# miniApp" 

**Для запуска приложения локально в telegram Mini App нужно:**
 - создать тестового бота в боте @BotFather
 - создать тестовый mini App в боте @BotFather
 - привязать mini app к боту через @BotFather
 - Привязать URL с приложением к mini app и боту через @BotFather
    ВАЖНО: Telegram требует чтобы соединение было зашифрованное, поэтому для запуска локально требуется HTTPS соединение.
    Как это сделать: Использовать сервисы для проксирования, например российский аналог Ngrok - Cloudpub.
    Cloudpub проксирует ваш localhost и выдаёт вам URL с HTTPS. Его и нужно привязать к вашему mini App.
 - Запустить локально приложение
 - запустить mini App
