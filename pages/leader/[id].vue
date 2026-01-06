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

const userRole = useState('userRole').value.role
const data = ref(null)
let send = null // функция отправки
const userId = useState('telegramUser')
// Функция для создания websocket
function createWebSocket(interactiveId, telegramId) {
  // Предполагаю, что useWebSocket возвращает { data, send }
  const ws = useWebSocket(`wss://voshod07.ru/dev/ws?interactive_id=${interactiveId}&telegram_id=${telegramId}&role=${userRole}`)
  send = ws.send

  // Обновляем реактивный data
  watch(ws.data, (val) => {
    data.value = val
  })

  // Инициализация соединения (по примеру твоего кода)
  send(JSON.stringify({ type: 'init', id: interactiveId }))
}



 if (userId) {
    createWebSocket(interactiveId, userId.value)
  }


// props для компонента
const data_props = ref({
  stage: '',
  data: {},
  pause: {},
  data_answers: {},
  winners:{},
})

// Парсим и обновляем data_props при изменении data.value
watch(data, (newVal) => {
  if (!newVal) return
  try {
    const parsedData = JSON.parse(newVal)
    data_props.value.stage = parsedData.stage || ''
    data_props.value.data = parsedData.data || {}
    data_props.value.pause = parsedData.pause || {}
     data_props.value.data_answers = parsedData.data_answers || {}
     data_props.value.winners = parsedData.winners || {}
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
  <component :is="componentMap[data_props.stage]" v-if="data_props.stage" :data="data_props.data"
    :stage="data_props.stage" context="leader" class="component" :onStatus="sendStatus" :pause="data_props.pause" :data_answers="data_props.data_answers" :winners="data_props.winners"/>
</template>