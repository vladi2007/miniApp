<!-- <script setup>

import { ref, onMounted } from 'vue'

import main_menu from '~/components/main_menu/main_menu.vue'

const webApp = ref(null)
const initDataUnsafe = ref(null)
const my_interactives = ref(null)

const isLoading = ref(true) // <- новый флаг

const isReady = ref(false)
const role = ref(null)

onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe

    const userId = initDataUnsafe.value?.user?.id

    if (userId) {
      const { data, error } = await useFetch('/api/role', {
        query: {
          telegram_id: "1",
        },
      })
      
      if (!error.value && data.value?.role) {
        role.value = data.value.role
        console.log(`УРА${data.value.role}`)
      } else {
        console.error("Ошибка запроса или пустой ответ", error.value)
      }
    }

    isReady.value = true
  }
})
console.log(role.value)
</script>

<template>
  
  <div v-if="isReady">
    <main_menu v-if="role !== 'leader'" />
    
    <div v-else class="you_are_not_leader">
      <div>У вас нет прав ведущего!</div>
    </div>
  </div>
</template>

<style >
.you_are_not_leader {
  background-color: white;
  height: 100vh;
  width: 100vw;
  
  display: flex;                /* Используем Flexbox */
  justify-content: center;     /* Центр по горизонтали */
  align-items: center;         /* Центр по вертикали */
  text-align: center;          /* Центрируем текст внутри блока */
  font-family: 'Lato', sans-serif;
  font-size: 64px;
  font-weight: 500;
}
</style> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebApp } from 'vue-tg'
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'

const webApp = ref(null)
const initDataUnsafe = ref(null)

onMounted(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe
  }
})

const user = computed(() => initDataUnsafe.value?.user.id)

const componentMap = {
  waiting: Waiting,
  countdown: Countdown,
  question: Question,
  discussion: Question,
  end: InteractiveEnd,
}
import { useRoute } from 'vue-router'

const route = useRoute()
const interactiveId = route.params.id

const { data, send } = useWebSocket(`ws://localhost:4000/ws?interactive_id=${interactiveId}&telegram_id=2&role=participant&x_key=super-secret-key`)
onMounted(() => {
  send(JSON.stringify({ type: 'init', id: interactiveId }))
})
// props для компонента
const data_props = ref({
  stage: '',   // например, 'waiting', 'countdown' и т.п.
  data: {}     // объект с данными для компонента
})

// Когда data.value меняется, обновляем data_props
watch(data, (newVal) => {
  if (!newVal) return

  // Так как данные приходят как строка, нужно её распарсить
  try {
    const parsedData = JSON.parse(newVal)
    
    // Ожидаем, что parsedData будет объектом с ключами "stage" и "data"
    data_props.value.stage = parsedData.stage || ''
    data_props.value.data = parsedData.data || {}
  } catch (error) {
    console.error("Ошибка при разборе данных WebSocket:", error)
  }
})

function sendStatus(status) {
  send(JSON.stringify({ interactive_status: status }))
}


const timerData = ref({})


</script>


<template>
  <div>

   
    <component :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage"
      :onAnswer="sendAnswer" />
  </div>
</template> 
