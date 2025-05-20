 <script setup>
import { ref, watch , onMounted} from 'vue'
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

const timerData = ref({})
const currentComponentKey = ref('waiting')
let intervalId = null
let time = 0
let timer_duration = 0
let questions_count = 0
// Веб-сокет

const socket = ref(null)
watch(user, (newUser) => {
  if (newUser) {
    // Создаем соединение, только когда user.id существует
    socket.value = new WebSocket(`wss://voshod07.ru/ws?telegram_id=123123&secret_key=123123`)
    socket.value.onopen = () => {
      console.log("WebSocket подключен")
    }
    socket.value.onmessage = (message) => {
      console.log("Получено сообщение от сервера:", message.data)
    }
    socket.value.onclose = () => {
      console.log("WebSocket закрыт")
    }
    socket.value.onerror = (error) => {
      console.log("Ошибка WebSocket:", error)
    }
  }
})
const startWaitingCycle = () => {
  currentComponentKey.value = 'waiting'
  timerData.value = {
    stage: 'waiting',
    data: {
      title: 'Ожидание начала игры',
      description: 'Скоро начнём, ждём остальных участников.',
      code: 'QUIZ2025',
      participants_active: '23',
    }
  }

  setTimeout(() => startCountdownCycle(), 3000)
}

// Отправка ответа
function sendAnswer(answerId) {
  send(JSON.stringify({ answer_id: answerId }))
}

// Показываем waiting и запускаем цикл
setTimeout(() => startCountdownCycle(), 3000) // подождать 3 секунды на экране ожидания

const startCountdownCycle = () => {
  time = 10
  currentComponentKey.value = 'countdown'
  timerData.value = {
    stage: 'countdown',
    data: {
      timer: String(time),
    },
  }

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      clearInterval(intervalId)
      startQuestionCycle()
    }
  }, 1000)
}

const startQuestionCycle = () => {
  time = 5
  timer_duration = 5
  questions_count=10
  currentComponentKey.value = 'question'
  timerData.value = {
    stage: 'question',
    data: {
     questions_count:String(questions_count),
      timer_duration:String(timer_duration),
      timer: String(time),
      title: 'Какой язык программирования используется для создания Vue?',
      code: 'ABC123',
      question: {
        id: '1',
        text: 'Какой язык программирования используется для создания Vue?',
        position: '1',
      },
      answers: [
        { id: '1', text: 'JavaScript' },
        { id: '2', text: 'Python' },
        { id: '3', text: 'Java' },
        { id: '4', text: 'C++' },
      ],
    },
  }

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      clearInterval(intervalId)
      startDiscussionCycle()
    }
  }, 1000)
}

const startDiscussionCycle = () => {
  time = 5
  currentComponentKey.value = 'discussion'
  timerData.value = {
    stage: 'discussion',
    data: {
      questions_count:String(questions_count),
      timer: String(time),
      title: 'Какой язык программирования используется для создания Vue?',
      code: 'ABC123',
      question: {
        id: '1',
        text: 'Какой язык программирования используется для создания Vue?',
        position: '1',
      },
      answers: [
        { id: '1', text: 'JavaScript' },
        { id: '2', text: 'Python' },
        { id: '3', text: 'Java' },
        { id: '4', text: 'C++' },
      ],
      idCorrectAnswer: '1',
      percentages: [
        { id: '1', percentage: 65 },
        { id: '2', percentage: 15 },
        { id: '3', percentage: 10 },
        { id: '4', percentage: 10 },
      ],
    },
  }

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      clearInterval(intervalId)
      showEndScreen()
    }
  }, 1000)
}

const showEndScreen = () => {
  currentComponentKey.value = 'end'
  timerData.value = {
    stage: 'end',
    data: {
      title: 'Игра завершена!',
      participants_total: '120',
      winners: [
      { position: '1', username: 'Иван123' },
      { position: '2', username: 'Maria_K' },
      { position: '3', username: 'AlexDev' },
    ],
    },
    
  }
  setTimeout(() => startWaitingCycle(), 5000)
}

// Начать с waiting
timerData.value = {
  stage: 'waiting',
  data: {
    title: 'Ожидание начала игры',
    description: 'Скоро начнём, ждём остальных участников.',
    code: 'QUIZ2025',
    participants_active: '23',
  }
}


</script>


<template>
  <div>

   
    <component :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage"
      :onAnswer="sendAnswer" />
  </div>
</template> 

<style>
@import url("~/assets/css/waiting/active_users.scss");
@import url("~/assets/css/waiting/description.scss");
@import url("~/assets/css/waiting/waiting.scss");
@import url("~/assets/css/countdown/countdown.scss");
</style>
