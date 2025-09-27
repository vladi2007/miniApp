<template>

  <head>
    <meta src='https://telegram.org/js/telegram-web-app.js?57'>
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
// разворачиваем mini app на весь экран
onMounted(() => {
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {


    const tg = Telegram.WebApp

    tg.setBackgroundColor('#ffffff')
    const initData = tg.initDataUnsafe;
    const userId = tg.initDataUnsafe?.user?.id
    const platform = Telegram.WebApp.platform
    // Сохраняем весь объект как JSON-строку
    sessionStorage.setItem('telegram_init_data', JSON.stringify(initData));
    console.log("initDataUnsafe saved:", initData);
    if (platform !== 'android' && platform !== 'ios') {
      const version = Telegram.WebApp?.version || "0.0";
      console.log(parseFloat(version))
      if (parseFloat(version) >= 6.1 && Telegram.WebApp.requestFullscreen) {
        Telegram.WebApp.requestFullscreen();
      } else {
        console.log(`Fullscreen not supported. WebApp version: ${version}`);
      }
    }

  }
  bridge.postEvent('web_app_setup_closing_behavior', {
    need_confirmation: true,
  });

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