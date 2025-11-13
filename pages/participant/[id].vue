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
      //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
    const { $telegram } = useNuxtApp();
    userId.value = $telegram.initDataUnsafe.value?.user?.id;
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
  data: {},
  pause: {},
  data_answers: {},
  winners:{},
  score:{}
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
       data_props.value.score = parsedData.score || {}
  } catch (error) {
    console.error("Ошибка при разборе данных WebSocket:", error)
  }
})

// // Отправка ответа
// function sendAnswer(answer) {

//   // Если ответ — число
//   if (data_props.data?.question?.type ==='one') {
//     send(JSON.stringify({ answer_id: String(answer) }))
//   }
//   // Если ответ — массив чисел
//   else if (data_props.data?.question?.type ==='many') {
//     const answer_ids = answer.map(String)
//     send(JSON.stringify({ answer_ids:answer_ids }))
//   }
//   // Всё остальное — считаем текстом
//   else {
//     send(JSON.stringify({ answer_text: answer }))
//   }
// }


function sendAnswer(answer) {

  send(JSON.stringify({ answer_id: String(answer) }))
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
      :stage="data_props.stage" :onAnswer="send" context="participant" :data_answers="data_props.data_answers" :winners="data_props.winners" :score="data_props.score"/>
  </div>
</template>
