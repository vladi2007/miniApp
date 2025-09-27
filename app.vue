<template>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <div>
    <NuxtPage />

  </div>
</template>

<script setup>

import { onMounted } from 'vue'

// разворачиваем mini app на весь экран
onMounted(() => {
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.setBackgroundColor('#ffffff')
    const platform = Telegram.WebApp.platform
    if (platform !== 'android' && platform !== 'ios') {
      const version = Telegram.WebApp?.version || "0.0";
      console.log(parseFloat(version) )
if (parseFloat(version) >= 6.1 && Telegram.WebApp.requestFullscreen) {
  Telegram.WebApp.requestFullscreen();
} else {
  console.log(`Fullscreen not supported. WebApp version: ${version}`);
}
    }
  
  }


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