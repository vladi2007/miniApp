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

// Предположим, что isTMA, init, viewport уже импортированы или доступны
// Пример (раскомментируй и замени своими реализациями при необходимости):
// import { isTMA, init, viewport } from '~/utils/telegram'

onMounted(() => {
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.setBackgroundColor('#ffffff')
    window.Telegram.WebApp.requestFullscreen()
    
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
