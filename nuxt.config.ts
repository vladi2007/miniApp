// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  
  nitro:{
    experimental:{
      websocket: true
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
        head: {
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                }
            ],
            script: [{src: 'https://telegram.org/js/telegram-web-app.js'}],
        }
    },
  
  vite: {
    server: {
      allowedHosts: ['tidily-viable-mongoose.cloudpub.ru',"allegedly-innate-dotterel.cloudpub.ru"],
    
    },
    build: {
      sourcemap: true
    }
  },
  ssr:false,
  runtimeConfig: {
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
        secretKey: process.env.SECRET_KEY,
    },
  modules:['@vueuse/nuxt','@pinia/nuxt'],
  css: [
    '@fontsource/lato' // Импортируем шрифт Lato
   
  ]
})