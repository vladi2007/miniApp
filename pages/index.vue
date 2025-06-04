<!-- <script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebApp } from 'vue-tg'
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'

// Реактивные переменные
const route = useRoute()
const interactiveId = route.params.id
const webApp = ref(null)
const initDataUnsafe = ref(null)
const userId = ref(null)

const data = ref(null)
let send = null // функция отправки

// Функция для создания websocket
function createWebSocket(interactiveId, telegramId) {
  // Предполагаю, что useWebSocket возвращает { data, send }
  const ws = useWebSocket(`ws://localhost:4000/ws?interactive_id=7&telegram_id=2&role=participant`)
  send = ws.send

  // Обновляем реактивный data
  watch(ws.data, (val) => {
    data.value = val
  })

  // Инициализация соединения (по примеру твоего кода)
  send(JSON.stringify({ type: 'init', id: interactiveId }))
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe
    userId.value = initDataUnsafe.value?.user?.id
  }
})
// Создаем websocket только когда userId стал известен
watch(userId, (newUserId) => {
  if (newUserId) {
    createWebSocket(interactiveId, newUserId)
  }
})
// props для компонента
const data_props = ref({
  stage: '',
  data: {}
})

// Парсим и обновляем data_props при изменении data.value
watch(data, (newVal) => {
  if (!newVal) return
  try {
    const parsedData = JSON.parse(newVal)
    data_props.value.stage = parsedData.stage || ''
    data_props.value.data = parsedData.data || {}
  } catch (error) {
    console.error("Ошибка при разборе данных WebSocket:", error)
  }
})

function sendStatus(id) {
  if (send) {
    send(JSON.stringify({ anwer_id: id }))
  }
}

const componentMap = {
  waiting: Waiting,
  countdown: Countdown,
  question: Question,
  discussion: Question,
  end: InteractiveEnd,
}
const timerData = ref({})


</script>


<template>
  <div>


    <component v-if="data_props.stage" :is="componentMap[data_props.stage]" :data="data_props.data"
      :stage="data_props.stage" :onAnswer="sendStatus" />
  </div>
</template> -->

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
