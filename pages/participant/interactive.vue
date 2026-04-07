<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'
// Реактивные переменные
const route = useRoute()

const interactiveId = ref<string | null>(null)

async function parseHash() {
  const hash = window.location.hash
  if (!hash) return

  const cleanHash = hash.slice(1) // убрали #
  const [path, queryString] = cleanHash.split('?')

  if (path !== 'interactive') return

  const query = Object.fromEntries(
    new URLSearchParams(queryString || '')
  )

  interactiveId.value = query.id as string
}
const data = ref(null)
let send = null
// Функция для создания websocket
function createWebSocket(interactiveId: string) {
  const config = useRuntimeConfig().public
  const ulr = config.wsBackend
  const params = new URLSearchParams()

  if (launchParams.value) {
    params.append('vkToken', launchParams.value)
  }

  if (userInfo.value) {
    params.append('vkInfo', userInfo.value)
  }

  if (email.value) {
    params.append('vkEmail', email.value)
  }

  if (phone.value) {
    params.append('vkPhone', phone.value)
  }

  const wsUrl = `${ulr}/${interactiveId}?${params.toString()}`

  const ws = useWebSocket(wsUrl)
  send = ws.send

  // Обновляем реактивный data
  watch(ws.data, (val) => {
    data.value = val
  })

  // Инициализация соединения (по примеру твоего кода)
  send(JSON.stringify({ type: 'init', id: interactiveId }))
}

const { $bridge } = useNuxtApp()
const launchParams = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const userInfo = ref<string>('')
const ready = ref<boolean>(false)
// Функция для кодирования объекта в Base64
const encodeBase64 = (obj: unknown) => {
  const jsonString = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(jsonString)));
};

onMounted(async () => {
  await parseHash();
  await $bridge.send("VKWebAppGetLaunchParams")
    .then((data) => {
      console.log("Launch params:", data);
      const base64 = encodeBase64(data);
      console.log("Launch params (Base64):", base64);
      launchParams.value = base64
    })
    .catch((error) => console.error("VKWebAppGetLaunchParams error:", error));

  await $bridge.send("VKWebAppGetEmail")
    .then((data) => {
      console.log("Email data:", data);
      if (data) {
        const base64 = encodeBase64(data);
        console.log("Email (Base64):", base64);
        email.value = base64
      }
    })
    .catch((error) => console.error("VKWebAppGetEmail error:", error));

  await $bridge.send("VKWebAppGetPhoneNumber")
    .then((data) => {
      console.log("Phone data:", data);
      if (data.phone_number) {
        const base64 = encodeBase64(data);
        console.log("Phone (Base64):", base64);
        phone.value = base64
      }
    })
    .catch((error) => console.error("VKWebAppGetPhoneNumber error:", error));

  await $bridge.send("VKWebAppGetUserInfo")
    .then((data) => {
      console.log("User info:", data);
      if (data.id) {
        const base64 = encodeBase64(data);
        console.log("User info (Base64):", base64);
        userInfo.value = base64
      }
    })
    .catch((error) => console.error("VKWebAppGetUserInfo error:", error));

  ready.value = true
})
watch(
  [ready, interactiveId],
  ([isReady, id]) => {
    if (!isReady || !id) return

    createWebSocket(id)
  },
  { immediate: true }
)
// props для компонента
const data_props = ref({
  stage: '',
  data: {},
  pause: {},
  data_answers: {},
  winners: {},
  score: {},
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
  }
  catch (error) {
    console.error('Ошибка при разборе данных WebSocket:', error)
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
    <component :is="componentMap[data_props.stage]" v-if="data_props.stage" :data="data_props.data"
      :stage="data_props.stage" :on-answer="send" context="participant" :data_answers="data_props.data_answers"
      :winners="data_props.winners" :score="data_props.score" />
  </div>
</template>
