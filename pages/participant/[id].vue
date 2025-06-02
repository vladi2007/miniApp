<script setup>
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
  const ws = useWebSocket(`wss://voshod07.ru/ws?interactive_id=${interactiveId}&telegram_id=${telegramId}&role=participant`)
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
// Отправка ответа
function sendAnswer(answerId) {
  send(JSON.stringify({ answer_id: answerId }))
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
      :stage="data_props.stage" :onAnswer="sendAnswer" context="participant"/>
  </div>
</template>
