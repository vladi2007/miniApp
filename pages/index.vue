 <script setup>
import { ref, watch , onMounted} from 'vue'

import Waiting_leader from '~/components/waiting/waiting_leader.vue'
import Countdown_leader from '~/components/countdown/countdown_leader.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'



const { status, data, send, open, close } = useWebSocket("ws://localhost:4000/ws")

let time=0


function sendStatus(){
  send(JSON.stringify({interactive_status:"going" }) )
}
const componentMap = {
  waiting: Waiting_leader,
  countdown: Countdown_leader,
  question: Question,
  discussion: Question,
  end: InteractiveEnd,
}
const timerData = ref({})
// Начать с waiting
timerData.value = {
  stage: 'waiting',
  data: {
    title: 'Интересные факты про УрФУ',
    description: 'Проверь на сколько хорошо ты знаешь УрФУ. В данном интерактиве используются факты о которых мало кто знает.',
    code: 'QUIZ2025',
    participants_active: '223',
  }
}
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
  setTimeout(() => startCountdownCycle(), 500)
}
const currentComponentKey = ref('waiting')
const startCountdownCycle = () => {
  time = 10
  currentComponentKey.value = 'countdown'
  timerData.value = {
    stage: 'countdown',
    data: {
      timer: String(time),
    },
  }

  
  let intervalId = setInterval(() => {
    
    timerData.value.data.timer = String(time)
    if (time <= 0) {
      time =10
      startWaitingCycle()
      
    }
  }, 1000)
}


startWaitingCycle()

</script>
<template>
  <component :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage"
       class="component" :onStatus="sendStatus" />
</template>

<style>


</style>