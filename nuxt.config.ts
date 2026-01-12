// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  
  nitro:{
    experimental:{
      websocket: true
    }
  },
  runtimeConfig: {
     public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      wsBackend: process.env.NUXT_PUBLIC_WS_BACKEND || '',
      wsFrontend: process.env.NUXT_PUBLIC_WS_FRONTEND || ''
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: process.env.NUXT_APP_BUILD_ASSETS_DIR || '/_nuxt/',
        head: {
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                }
            ],
            script: [{src: 'https://telegram.org/js/telegram-web-app.js'}],
            link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap'
        }
      ]
        }
    },
  
  vite: {
    server: {
      allowedHosts: ['tidily-viable-mongoose.cloudpub.ru',"allegedly-innate-dotterel.cloudpub.ru","swimmingly-astounding-nyala.cloudpub.ru", 
"heatedly-gleaming-whydah.cloudpub.ru", "noisily-unattached-otter.cloudpub.ru","statically-creative-emu.cloudpub.ru","compulsively-tops-accentor.cloudpub.ru"],
    
    },
    build: {
      sourcemap: true
    }
  },
  ssr:false,
 
  modules:['@vueuse/nuxt','@pinia/nuxt'],
  css: [
    '@fontsource/lato' // Импортируем шрифт Lato
   
  ],
  router: {
    options: {
      globalMiddleware: ['~/middleware/role']
    }
  }
  
})