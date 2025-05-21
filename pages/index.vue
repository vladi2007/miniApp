<script setup>
import { ref } from 'vue'

import Waiting_leader from '~/components/waiting/waiting_leader.vue'
import Countdown_leader from '~/components/countdown/countdown_leader.vue'
import Question_leader from '~/components/question/question_leader.vue'
import InteractiveEnd_leader from '~/components/interactive_end/interactive_end_leader.vue'

const { send } = useWebSocket("ws://localhost:4000/ws")

function sendStatus(status) {
  send(JSON.stringify({ interactive_status: status }))
}

const componentMap = {
  waiting: Waiting_leader,
  countdown: Countdown_leader,
  question: Question_leader,
  discussion: Question_leader,
  end: InteractiveEnd_leader,
}

let intervalId = null
let time = 0
let timer_duration = 0
let questions_count = 0

const timerData = ref({})


function resetInterval() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const startWaitingCycle = () => {
  resetInterval()
  timerData.value = {
    stage: 'waiting',
    data: {
      title: 'Интересные факты про УрФУ',
      description: 'Проверь на сколько хорошо ты знаешь УрФУ. В данном интерактиве используются факты о которых мало кто знает.',
      code: 'QUIZ2025',
      participants_active: '23',
    }
  }
  setTimeout(() => startCountdownCycle(), 3000)
}

const startCountdownCycle = () => {
  resetInterval()
  time = 10
  timerData.value = {
    stage: 'countdown',
    data: {
      timer: String(time),
    },
  }

  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      resetInterval()
      startQuestionCycle()
    }
  }, 1000)
}

const startQuestionCycle = () => {
  resetInterval()
  time = 5
  timer_duration = 5
  questions_count = 10

  timerData.value = {
    stage: 'question',
    data: {
      questions_count: String(questions_count),
      timer_duration: String(timer_duration),
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

  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      resetInterval()
      startDiscussionCycle()
    }
  }, 1000)
}

const startDiscussionCycle = () => {
  resetInterval()
  time = 5

  timerData.value = {
    stage: 'discussion',
    data: {
      questions_count: String(questions_count),
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

  intervalId = setInterval(() => {
    time--
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      resetInterval()
      startEndCycle()
    }
  }, 1000)
}

const startEndCycle = () => {
  resetInterval()
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

startWaitingCycle()
// timerData.value = {
//     stage: 'end',
//     data: {
//       title: 'Интересные факты про УрФУ',
//       participants_total: '120',
//       winners: [
//         { position: '1', username: 'Иван123' },
//         { position: '2', username: 'Maria_K' },
//         { position: '3', username: 'AlexDev' },
//       ],
//     },
//   }
</script>

<template>
  <component :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage" :context="'leader'"
    class="component" :onStatus="sendStatus" />
</template>
