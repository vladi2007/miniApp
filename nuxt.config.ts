// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules:[ '@vueuse/nuxt'],
  nitro:{
    experimental:{
      websocket: true
    }
  },
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
    
    },
    build: {
      sourcemap: true
    }
  },


  

  
  // modules: [
  //   '@nuxtjs/proxy',
  // ],
  
  // serverHandlers : [
  //   {
  //     route: '/ws',
  //     handler: '~/server/api/wsProxy.js',
  //   },
  // ],

})