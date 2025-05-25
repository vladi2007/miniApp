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

const timerData = ref({})
const currentComponentKey = ref('waiting')
let intervalId = null
let time = 0
let timer_duration = 10

const questions = [
  {
    id: '1',
    title: 'Когда была запущена первая магистерская программа в ИРИТ-РТФ',
    question: {
      id: '1',
      text: 'Когда была запущена первая магистерская программа в ИРИТ-РТФ?',
      position: '1',
    },
    answers: [
      { id: '1', text: '2011' },
      { id: '2', text: '2005' },
      { id: '3', text: '2010' },
      { id: '4', text: '2007' },
    ],
    correct: '3',
    percentages: [
      { id: '1', percentage: 65 },
      { id: '2', percentage: 15 },
      { id: '3', percentage: 10 },
      { id: '4', percentage: 10 },
    ],
  },
  {
    id: '2',
    title: 'Кто был первым ректором УрФУ?',
    question: {
      id: '2',
      text: 'Как называется одно из направлений магистратуры ИРИТ-РТФ, связанное с ИИ?',
      position: '2',
    },
    answers: [
      { id: '1', text: 'Робототехника и мехатроника' },
      { id: '2', text: 'Программная инженерия' },
      { id: '3', text: 'Искусственный интеллект и цифровые технологии' },
      { id: '4', text: 'Сетевое администрирование' },
    ],
    correct: '3',
    percentages: [
      { id: '1', percentage: 25 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 40 },
      { id: '4', percentage: 15 },
    ],
  },
  {
    id: '3',
    title: 'Когда основали УрФУ?',
    question: {
      id: '3',
      text: 'Какая компания является партнёром программ магистратуры ИРИТ-РТФ?',
      position: '3',
    },
    answers: [
      { id: '1', text: 'Сбер' },
      { id: '2', text: 'Яндекс' },
      { id: '3', text: 'Уралсофт' },
      { id: '4', text: 'Mail.ru' },
    ],
    correct: '2',
    percentages: [
      { id: '1', percentage: 10 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 60 },
      { id: '4', percentage: 10 },
    ],
  },
]

let currentQuestionIndex = 0
let questions_count = questions.length

const { open, close, send, data } = useWebSocket(`ws://localhost:4000/ws?huy=123`)

function sendAnswer(answerId) {
  send(JSON.stringify({ answer_id: answerId }))
}

// Этап ожидания
const startWaitingCycle = () => {
  currentComponentKey.value = 'waiting'
  timerData.value = {
    stage: 'waiting',
    data: {
      title: 'Интересные факты про магистратуру ИРИТ-РТФ',
      description: 'Познакомься поближе с магистратурой ИРИТ-РТФ. В данном интерактиве используются факты о которых мало кто знает.',
      code: 'QUIZ2025',
      participants_active: '23',
    },
  }

  setTimeout(() => startCountdownCycle(), 3000)
}

const startCountdownCycle = () => {
  time = 5
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
  const q = questions[currentQuestionIndex]
  time = 10
  timer_duration=10
  currentComponentKey.value = 'question'
  timerData.value = {
    stage: 'question',
    data: {
      questions_count: String(questions_count),
      timer_duration: String(timer_duration),
      timer: String(time),
      title: q.title,
      code: 'ABC123',
      question: q.question,
      answers: q.answers,
    },
  }

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time < 0) {
      clearInterval(intervalId)
      startDiscussionCycle()
    }
  }, 1000)
}

const startDiscussionCycle = () => {
  const q = questions[currentQuestionIndex]
  time = 5
  timer_duration=5
  currentComponentKey.value = 'discussion'
  timerData.value = {
    stage: 'discussion',
    data: {
      timer_duration:String(timer_duration),
      questions_count: String(questions_count),
      timer: String(time),
      title: q.title,
      code: 'ABC123',
      question: q.question,
      answers: q.answers,
      id_correct_answer: q.correct,
      percentages: q.percentages,
    },
  }

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time < 0) {
      clearInterval(intervalId)
      currentQuestionIndex++
      if (currentQuestionIndex < questions.length) {
        startQuestionCycle()
      } else {
        showEndScreen()
      }
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

  currentQuestionIndex = 0
  setTimeout(() => startWaitingCycle(), 5000)
}

// Старт с экрана ожидания
startWaitingCycle()
</script>


<template>
  <div>

   
    <component :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage"
      :onAnswer="sendAnswer" />
  </div>
</template> 

