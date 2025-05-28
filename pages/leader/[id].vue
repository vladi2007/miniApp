<script setup>
import { ref, watch } from 'vue'

import Waiting_leader from '~/components/waiting/waiting_leader.vue'
import Countdown_leader from '~/components/countdown/countdown_leader.vue'
import Question_leader from '~/components/question/question_leader.vue'
import InteractiveEnd_leader from '~/components/interactive_end/interactive_end_leader.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const interactiveId = route.params.id

const { data, send } = useWebSocket(`wss://carclicker.ru/ws/${interactiveId}?telegram_id=2&role=leader&x_key=super-secret-key`)

// props для компонента
const data_props = ref({
  stage: '',   // например, 'waiting', 'countdown' и т.п.
  data: {}     // объект с данными для компонента
})

// Когда data.value меняется, обновляем data_props
watch(data, (newVal) => {
  if (!newVal) return

  // Так как данные приходят как строка, нужно её распарсить
  try {
    const parsedData = JSON.parse(newVal)
    
    // Ожидаем, что parsedData будет объектом с ключами "stage" и "data"
    data_props.value.stage = parsedData.stage || ''
    data_props.value.data = parsedData.data || {}
  } catch (error) {
    console.error("Ошибка при разборе данных WebSocket:", error)
  }
})

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
