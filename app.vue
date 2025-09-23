<template>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
  <div>
    <NuxtPage />
    
  </div>
</template>

<script setup>
window.Telegram.WebApp.expand()
import { onMounted } from 'vue'

// разворачиваем mini app на весь экран
onMounted(() => {
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.setBackgroundColor('#ffffff')
    const platform = Telegram.WebApp.platform
  if (platform !== 'android' && platform !== 'ios') {
    Telegram.WebApp.requestFullscreen()
  }
    
  }

  
})
</script>

<style>
html, body, #__nuxt {
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
