<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Waiting_leader from '~/components/waiting/waiting_leader.vue'
import Countdown_leader from '~/components/countdown/countdown_leader.vue'
import Question_leader from '~/components/question/question_leader.vue'
import InteractiveEnd_leader from '~/components/interactive_end/interactive_end_leader.vue'
import { useAuthStore } from '~/store/auth'
// Реактивные переменные
const route = useRoute()
const interactiveId = route.params.id
const router = useRouter()
const data = ref(null)
let send = null // функция отправки
const config = useRuntimeConfig().public
const auth = useAuthStore()
// Функция для создания websocket
function createWebSocket(interactiveId) {
  const url = config.wsBackend
  // Предполагаю, что useWebSocket возвращает { data, send }
  const ws = useWebSocket(`${url}/organization/${interactiveId}?token=${auth.accessToken}`)
  send = ws.send
  ws.open = () => {
    // Отправляем текущий токен серверу
    send(JSON.stringify({ type: 'auth', token: auth.accessToken }))
  }

  // Обновляем реактивный data
  watch(ws.data, (val) => {
    data.value = val
  })

  // // Отслеживаем закрытие WebSocket
  // watch(ws.status, (newStatus) => {
  //   if (newStatus === 'CLOSED') {
  //     console.log('WebSocket закрыт')
  //     router.push('/leader/new_interactives') // редирект при закрытии
  //   }
  // })
}

onMounted(() => {
  createWebSocket(interactiveId)
})

// props для компонента
const data_props = ref({
  stage: '',
  data: {},
  pause: {},
  data_answers: {},
  winners: {},
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
  }
  catch (error) {
    console.error('Ошибка при разборе данных WebSocket:', error)
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

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <component
    :is="componentMap[data_props.stage]"
    v-if="data_props.stage"
    :data="data_props.data"
    :stage="data_props.stage"
    context="leader"
    class="component"
    :on-status="sendStatus"
    :pause="data_props.pause"
    :data_answers="data_props.data_answers"
    :winners="data_props.winners"
  />
</template>
