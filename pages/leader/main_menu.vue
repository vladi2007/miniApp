
<script setup>

import { ref, onMounted } from 'vue'

import main_menu from '~/components/main_menu/main_menu.vue'

const webApp = ref(null)
const initDataUnsafe = ref(null)
const my_interactives = ref(null)

const isLoading = ref(true) // <- новый флаг

const isReady = ref(false)
const role = ref(null)
const userId = ref(null)
onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe

    userId.value = initDataUnsafe.value?.user?.id
    console.log(userId.value)
    if (userId) {
      const  data = await useFetch('/api/role', {
        query: {
          telegram_id: userId.value,
        },
      })
      console.log("УРА")
      console.log(data.data.value.role)
      role.value = data.data.value.role
        console.log(role.value)
    }

    isReady.value = true
  }
})
console.log(role.value)
</script>

<template>
  <!-- Показываем только когда данные загружены -->
  <div v-if="isReady">
    <main_menu v-if="role === 'leader'" />
    
    <div v-else class="you_are_not_leader">
      <div>У вас нет прав ведущего!</div>
    </div>
  </div>
</template>

<style >
.you_are_not_leader {

  
  display: flex;                /* Используем Flexbox */
  justify-content: center;     /* Центр по горизонтали */
  align-items: center;         /* Центр по вертикали */
  text-align: center;          /* Центрируем текст внутри блока */
  font-family: 'Lato', sans-serif;
  font-size: 64px;
  font-weight: 500;
}
</style>
