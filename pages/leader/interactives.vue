<script setup >
import interactives from '~/components/interactives/interactives.vue'
import { ref, onMounted } from 'vue'
// данные о пользователе
const webApp = ref(null)
const initDataUnsafe = ref(null)
const my_interactives = ref(null)
const userId =ref(null)

// запрос на бекенд для получения списка интерактивов
onMounted(async () => {
  
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe
    

    userId.value = initDataUnsafe.value?.user?.id

    if (userId) {
      const  {data, error}  = await useFetch(`/api/get_interactives`, {
  
        query: {
          telegram_id: userId.value,
          
          
        },
        
      })
      
      if (data.value) {
        // Приводим числовые поля к строкам
        const mapList = (list) =>
          list.map(item => ({
            title: item.title,
            question_count: String(item.question_count),
            target_audience: item.target_audience,
            id: String(item.id),
            date_completed: item.date_completed
          }))

        my_interactives.value = {
          interactives_list_conducted: mapList(data.value.interactives_list_conducted),
          interactives_list_not_conducted: mapList(data.value.interactives_list_not_conducted)
        }
      }
    }
  }
})
</script>

<template>
  <div>

    <interactives v-if="my_interactives" :interactives_list="my_interactives" />
  </div>
</template>

<style >

</style>
