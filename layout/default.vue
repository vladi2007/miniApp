<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    console.log('Telegram WebApp detected')

    Telegram.WebApp.ready()

    Telegram.WebApp.setBackgroundColor('#ffffff')
    console.log('Background set to white')
  } else {
    console.log('Telegram WebApp NOT detected')
  }
})
</script>

<template>
  <NuxtPage />
</template>
