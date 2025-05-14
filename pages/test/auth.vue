<template>
    <div v-if="webApp">
      <p>Telegram WebApp is ready!</p>
      <p>User: {{ user?.first_name }}</p>
      
      <p>Chat ID: {{ signature }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  
  const webApp = ref(null)
  const initDataUnsafe = ref(null)
  
  onMounted(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      webApp.value = window.Telegram.WebApp
      initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe
    }
  })
  
  const user = computed(() => initDataUnsafe.value?.user)
  const queryId = computed(() => initDataUnsafe.value?.query_id)
  const chatType = computed(() => initDataUnsafe.value?.chat_type)
  const chatInstance = computed(() => initDataUnsafe.value?.chat_instance)
  const startParam = computed(() => initDataUnsafe.value?.start_param)
  const authDate = computed(() => initDataUnsafe.value?.auth_date)
  const hash = computed(() => initDataUnsafe.value?.hash)
  const signature = computed(() => initDataUnsafe.value?.signature)
  </script>
  