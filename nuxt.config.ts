// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app:{
    head:{
      meta:[

      ],
      script: [
        {
            src: 'https://telegram.org/js/telegram-web-app.js', defer: true
        }
    ]
    }
  },
  ssr:true,
  vite: {
    server: {
      allowedHosts: ['tidily-viable-mongoose.cloudpub.ru'],
    
    }
  },
  serverHandlers : [
    {
      route: '/ws',
      handler: '~/server/api/wsProxy.js',
    },
  ],
})
