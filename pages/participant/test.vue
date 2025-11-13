<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebApp } from 'vue-tg'
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'

const questions = [
  {
    id: '3323232',
    title: 'Кто был первым ректором УрФУ?',
    question: {
      id: 'asdas3',
      text: 'Сколько абитуриентов поступило в 2025 году?',
      position: '3',
      type: 'one',
      question_weight: '2',
      image: 'https://carclicker.ru/images/2f0aba5c-e9e3-43d3-8efd-744661137a8f.jpg'
    },
    answers: [
      { id: '1', text: '1023' },
      { id: '2', text: '2643' },
      { id: '3', text: '1941' },
      { id: '4', text: '1723' },
    ],
    correct: '3',
    percentages: [
      { id: '1', percentage: 25 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 40 },
      { id: '4', percentage: 15 },
    ], winners: [
      { position: '1', username: "@tehas", score: "10" },
      { position: '2', username: "@teamproject", score: "7" },
      { position: '3', username: "@menchik", score: "5" }
    ]
  },
  {
    id: '1',
    title: 'Когда оснsdsdsdsdsdsdsdsовали УрФУ?',
    question: {
      id: 'asdasdasdsas',
      text: 'Интересные факты про УрФУ?',
      position: '1',
      type: 'text',
      question_weight: '5',
      image: 'https://carclicker.ru/images/3359a87d-a883-4c9d-b3a7-6cbd4615eb81.jpg'
    },
    data_answers: [
      { text: "Контур", percentage: 10 },
      { text: "Яндекс", percentage: 20 },
      { text: "Очень интересно", percentage: 60 },
      { text: "ArtSoft", percentage: 10 },
    ], answers: [
      { id: '1', percentage: 10 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 60 },
      { id: '4', percentage: 10 },
    ],
    correct: '2',
    percentages: [
      { id: '1', percentage: 10 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 60 },
      { id: '4', percentage: 10 },
    ], winners: [
      { position: '1', username: "@menchik", score: "5" },
      { position: '2', username: "@tehas", score: "0" },
      { position: '3', username: "@teamproject", score: "0" }
    ]
  },
  {
    id: '2323232323232',
    title: 'Кто был первым ректором УрФУ?',
    question: {
      id: '2',
      text: 'Как называется одно из направлений магистратуры ИРИТ-РТФ, связанное с ИИ?',
      position: '2',
      type: 'many',
      question_weight: '5',
      image: 'https://carclicker.ru/images/012790ad-b310-4566-bcc0-469793c9b6f7.jpg'
    },
    answers: [
      { id: '3', text: 'IT в бизнесе' },
      { id: '6', text: 'Инфобез ИСПДн и КИИ' },
      { id: '7', text: 'Полиграфия и упаковка' },
      { id: '5', text: 'Радиоэлектронная инж' },
    ],
    correct: ['3', '5'],
    percentages: [
      { id: '1', percentage: 25 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 40 },
      { id: '4', percentage: 15 },
    ],
    winners: [
      { position: '1', username: "@tehas", score: "10" },
      { position: '2', username: "@teamproject", score: "5" },
      { position: '3', username: "@menchik", score: "5" }
    ]
  },
  {
    id: '3323232',
    title: 'Кто был первым ректором УрФУ?',
    question: {
      id: '3',
      text: 'Сколько абитуриентов поступило в 2025 году?',
      position: '3',
      type: 'one',
      question_weight: '2',
      image: 'https://carclicker.ru/images/2f0aba5c-e9e3-43d3-8efd-744661137a8f.jpg'
    },
    answers: [
      { id: '1', text: '1023' },
      { id: '2', text: '2643' },
      { id: '3', text: '1941' },
      { id: '4', text: '1723' },
    ],
    correct: '3',
    percentages: [
      { id: '1', percentage: 25 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 40 },
      { id: '4', percentage: 15 },
    ], winners: [
      { position: '1', username: "@tehas", score: "10" },
      { position: '2', username: "@teamproject", score: "7" },
      { position: '3', username: "@menchik", score: "5" }
    ]
  },

]
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




const { open, close, send, data } = useWebSocket(`ws://localhost:4000/ws`)



// Этап ожидания
const startWaitingCycle = () => {
  currentComponentKey.value = 'waiting'
  timerData.value = {
    stage: 'waiting',
    data: {
      title: 'Интересные факты про УрФУ',
      description: 'Проверь на сколько хорошо ты знаешь УрФУ. В данном интерактиве используются факты о которых мало кто знает.',
      code: 'QUIZ2025',
      participants_active: '23',
    },
    pause: {
      timer_n: Number(123123),
      state: "yes"

    },
  }

  setTimeout(() => startCountdownCycle(), 1000)
}

const startCountdownCycle = () => {
  time = 5
  currentComponentKey.value = 'countdown'
  timerData.value = {
    stage: 'countdown',
    data: {
      timer: String(time),
    },
    pause: {
      timer_n: Number(123123),
      state: "yes"

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
let currentQuestionIndex = 0;
let questions_count = questions.length;
const startQuestionCycle = () => {
  const q = questions[currentQuestionIndex]
  time = 10
  timer_duration = 10
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
      data_answers: q.data_answers
    },
    pause: {
      timer_n: Number(123123),
      state: "yes"

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
  time = 10
  timer_duration = 10
  currentComponentKey.value = 'discussion'
  timerData.value = {
    stage: 'discussion',
    data: {
      timer_duration: String(timer_duration),
      questions_count: String(questions_count),
      timer: String(time),
      title: q.title,
      code: 'ABC123',
      question: q.question,
      answers: q.answers,
      id_correct_answer: Array.isArray(q.correct) ? q.correct : [q.correct],
      percentages: q.percentages,
      data_answers: q.data_answers
    },
    pause: {
      timer_n: Number(123123),
      state: "yes"

    },
    winners: q.winners,
    score:"123",
    data_answers:{
      is_correct: correct,
      percentage:100,
      answers:[
{
  text:"123123",
   percentage:"23",
},{
  text:"123123",
   percentage:"23",
},{
  text:"123123",
   percentage:"23",
}
      
      
    
  ]}}

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
  }, 10000000)
}

const showEndScreen = () => {
  currentComponentKey.value = 'end'
  timerData.value = {
    stage: 'end',
    data: {
      title: '123sssssssssssssssssssssssssssssssssssss',
      participants_total: '23',

    },
    winners: [
      { position: '1', username: '@tehas', time: '90', score: '10' },       // 1:30 → 90
      { position: '2', username: '@teamproject', time: '88', score: '9' },  // 1:28 → 88
      { position: '3', username: '@menchik', time: '86', score: '9' },      // 1:26 → 86
      { position: '4', username: '@artemdev', time: '85', score: '8' },     // 1:25 → 85
      { position: '5', username: '@viktorpro', time: '84', score: '8' },    // 1:24 → 84
      { position: '6', username: '@luna_code', time: '82', score: '8' },    // 1:22 → 82
      { position: '7', username: '@dariatech', time: '81', score: '7' },    // 1:21 → 81
      { position: '8', username: '@mrxcode', time: '80', score: '7' },      // 1:20 → 80
      { position: '9', username: '@sergey_io', time: '78', score: '7' },    // 1:18 → 78
      { position: '10', username: '@frontendcat', time: '77', score: '6' }, // 1:17 → 77
      { position: '11', username: '@ai_master', time: '76', score: '6' },   // 1:16 → 76
      { position: '12', username: '@olegjs', time: '75', score: '6' },      // 1:15 → 75
      { position: '13', username: '@mashabot', time: '73', score: '5' },    // 1:13 → 73
      { position: '14', username: '@vladpython', time: '72', score: '5' },  // 1:12 → 72
      { position: '15', username: '@denisdev', time: '71', score: '5' },    // 1:11 → 71
      { position: '16', username: '@nina_ml', time: '70', score: '4' },     // 1:10 → 70
      { position: '17', username: '@romaa', time: '68', score: '4' },       // 1:08 → 68
      { position: '18', username: '@anastasia_q', time: '67', score: '4' }, // 1:07 → 67
      { position: '19', username: '@andrew_data', time: '66', score: '3' }, // 1:06 → 66
      { position: '20', username: '@codewolf', time: '65', score: '3' },    // 1:05 → 65
      { position: '21', username: '@alexfast', time: '64', score: '3' },    // 1:04 → 64
      { position: '22', username: '@yuliana', time: '63', score: '2' },     // 1:03 → 63
      { position: '23', username: '@pavelr', time: '62', score: '2' }       // 1:02 → 62
    ]
  }

  currentQuestionIndex = 0
  setTimeout(() => startWaitingCycle(), 1000)
}
function sendAnswer(answer) {
  if (timerData.value.data.question.type ==='one'){
      send(JSON.stringify({ answer_id: answer }))
  }
  else if (timerData.value.data.question.type ==='many')
  {
    send(JSON.stringify({ answer_ids: answer }))
  }
  else{
    send(JSON.stringify({ answer_text: answer }))
  }
}
// Старт с экрана ожидания
startWaitingCycle()
</script>


<template>
  <div>


    <component v-if="timerData" :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage"
      :onAnswer="sendAnswer" :pause="timerData.pause" :winners="timerData.winners" :score="timerData.score" :data_answers="timerData.data_answers"/>
  </div>
</template>
