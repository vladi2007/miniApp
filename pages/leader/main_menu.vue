
<script setup>

import { ref, onMounted } from 'vue'

import main_menu from '~/components/main_menu/main_menu.vue'


// страница для защиты доступа к функционалу 
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
     //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
    const { $telegram } = useNuxtApp();
    userId.value = $telegram.initDataUnsafe.value?.user?.id;
    if (userId.value) {
      const  data = await useFetch('/api/role', {
        query: {
          telegram_id: userId.value,
        },
      })


      role.value = data.data.value.role
      
    }

    isReady.value = true
  }
})

</script>

<template>
  <!-- Показываем только когда данные загружены -->
  <div >
    <main_menu   />
    
    
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
