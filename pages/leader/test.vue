<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebApp } from 'vue-tg'
import Waiting from '~/components/waiting/waiting_leader.vue'
import Countdown from '~/components/countdown/countdown_leader.vue'
import Question from '~/components/question/question_leader.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end_leader.vue'

const questions = [
  {
    id: '1',
    title: 'Когда основали УрФУ?',
    question: {
      id: '1',
      text: 'Какая компания является партнёром программ магистратуры ИРИТ-РТФ?',
      position: '1',
      type:'text',
      question_weight:'5',
      image:'https://carclicker.ru/images/b70c3c0b-772b-4a36-adf9-9cf881223d2a.svg'
    },
    data_answers: [
      { text:"asdasd", percentage: 10 },
      { text:"asdasd", percentage: 20 },
      { text:"asdasd", percentage: 60 },
      {text:"asdasd", percentage: 10 },
    ],answers: [
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
    ],winners:[
      {position:'1', username:"123", score:"1"},
        {position:'2', username:"123", score:"4"},
          {position:'3', username:"123", score:"10"}
    ]
  },
 {
    id: '2',
    title: 'Кто был первым ректором УрФУ?',
    question: {
      id: '2',
      text: 'Как называется одно из направлений магистратуры ИР123123ИТ-РТФ, связанное с ИИ?',
      position: '2',
      type:'many',
      question_weight:'5',
      image:'https://carclicker.ru/images/b70c3c0b-772b-4a36-adf9-9cf881223d2a.svg'
    },
    answers: [
      { id: '1', text: '5555555555555555555555' },
      { id: '2', text: '555555555555555555555555555' },
      { id: '3', text: '55555555555555555555555555' },
      { id: '4', text: '555555555555555555555555555' },
    ],
    correct: ['3','2'],
    percentages: [
      { id: '1', percentage: 25 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 40 },
      { id: '4', percentage: 15 },
    ],
    winners:[
      {position:'1', username:"123", score:"1"},
        {position:'2', username:"213", score:"4"},
          {position:'3', username:"123", score:"10"}
    ]
  },
  {
    id: '3',
    title: 'Кто был первым ректором УрФУ?',
    question: {
      id: '3',
      text: 'Как называется одно из направлений магистратуры ИРИТ-РТФ, связанное с ИИ?',
      position: '3',
      type:'one',
      question_weight:'2',
      image:''
    },
    answers: [
      { id: '1', text: 'Робототехника и мехатроника' },
      { id: '2', text: 'Программная инженерия' },
      { id: '3', text: 'Искусственный интеллекn' },
      { id: '4', text: 'Сетевое администрирование' },
    ],
    correct: '3',
    percentages: [
      { id: '1', percentage: 25 },
      { id: '2', percentage: 20 },
      { id: '3', percentage: 40 },
      { id: '4', percentage: 15 },
    ],winners:[
      {position:'1', username:"123", score:"1"},
        {position:'2', username:"123", score:"4"},
          {position:'3', username:"123", score:"10"}
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
      title: 'Интересные факты про УрФУ',
      description: 'Проверь на сколько хорошо ты знаешь УрФУ. В данном интерактиве используются факты о которых мало кто знает.',
      code: 'QUIZ2025',
      participants_active: '23',
    },
    pause:{
      timer_n : Number(123123),
      state:  "yes"

    },
  }

  setTimeout(() => startCountdownCycle(), 5000)
}

const startCountdownCycle = () => {
  time = 5
  currentComponentKey.value = 'countdown'
  timerData.value = {
    stage: 'countdown',
    data: {
      timer: String(time),
    },
    pause:{
      timer_n : Number(123123),
      state:  "yes"

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
      data_answers:q.data_answers
    },
    pause:{
      timer_n : Number(123123),
      state:  "yes"

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
  timer_duration=10
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
      id_correct_answer: Array.isArray(q.correct) ? q.correct : [q.correct],
      percentages: q.percentages,
       data_answers:q.data_answers
    },
    pause:{
      timer_n : Number(123123),
      state:  "yes"

    },
    winners:q.winners
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
      title: 'Интересные факты про УрФУ',
      participants_total: '45',
      winners: [
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
        { position: '1', username: 'Иван123', score:'asdasd', time:'940'},
        { position: '2', username: 'Maria_K', score:'asdasd', time:'13112' },
        { position: '3', username: 'AlexDev' , score:'asdasd', time:'245'},
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

   
    <component v-if="timerData" :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage"
      :onAnswer="sendAnswer" :pause="timerData.pause" :winners="timerData.winners"/>
  </div>
</template> 
