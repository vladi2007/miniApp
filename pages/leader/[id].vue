<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Waiting_leader from '~/components/waiting/waiting_leader.vue'
import Countdown_leader from '~/components/countdown/countdown_leader.vue'
import Question_leader from '~/components/question/question_leader.vue'
import InteractiveEnd_leader from '~/components/interactive_end/interactive_end_leader.vue'

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
  const ws = useWebSocket(`wss://voshod07.ru/ws?interactive_id=${interactiveId}&telegram_id=${telegramId}&role=leader`)
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

function sendStatus(status) {
  if (send) {
    send(JSON.stringify({ interactive_status: status }))
  }
}

const componentMap = {
  waiting: Waiting_leader,
  countdown: Countdown_leader,
  question: Question_leader,
  discussion: Question_leader,
  end: InteractiveEnd_leader,
}
</script>
<template>
  <component
    :is="componentMap[data_props.stage]"
    v-if="data_props.stage"   
    :data="data_props.data"
    :stage="data_props.stage"
    context="leader"
    class="component"
    :onStatus="sendStatus"
  />
</template>