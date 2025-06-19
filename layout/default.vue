<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {


    Telegram.WebApp.ready()

    Telegram.WebApp.setBackgroundColor('#ffffff')

  } 
})
</script>

<template>
  <NuxtPage />
</template>
