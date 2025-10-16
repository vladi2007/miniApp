<template>

  <head>
    <meta>
    </meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <div>
    <NuxtPage />

  </div>
</template>

<script setup>

import { onMounted } from 'vue'
import * as bridge from "@telegram-apps/sdk"
window.Telegram.WebApp.expand();
window.Telegram.WebApp.requestFullscreen();
onMounted( () => {
  if (Telegram.WebApp) {
    

    const tg = Telegram.WebApp

    tg.setBackgroundColor('#ffffff')
    const initData = tg.initDataUnsafe
  
    const platform = Telegram.WebApp.platform
    // Сохраняем весь объект как JSON-строку
    sessionStorage.setItem('telegram_init_data', JSON.stringify(initData));

    if (platform !== 'android' && platform !== 'ios') {
      window.Telegram.WebApp.requestFullscreen()
        Telegram.WebApp.requestFullscreen();
    }

  }
 bridge.postEvent('web_app_setup_closing_behavior', {
   need_confirmation: true,
 });
 bridge.postEvent('web_app_expand')
 bridge.postEvent('web_app_request_fullscreen')

})
</script>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;

}


#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>