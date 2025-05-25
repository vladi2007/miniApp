<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Предположим, что isTMA, init, viewport уже импортированы или доступны
// Пример (раскомментируй и замени своими реализациями при необходимости):
// import { isTMA, init, viewport } from '~/utils/telegram'

onMounted(() => {
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.setBackgroundColor('#ffffff')
  }

  window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand();
})
</script>

<style>
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;

}
</style>
