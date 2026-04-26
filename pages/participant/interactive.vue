<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'
import connection from '~/components/participant_interactive/connection.vue'
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
const isBanned = ref(false)
const sendName = ref<((msg: string) => void) | null>(null)
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

  const ws = useWebSocket(wsUrl, {
    onConnected(ws) {
      console.log('Connected!')
    },
    onDisconnected(ws, event) {
      console.log('Disconnected!', event.code, JSON.parse(event.reason).detail)
      isBanned.value = JSON.parse(event.reason).detail
    },
    onError(ws, event) {
      console.error('Error:', event)
    },
    onMessage(ws, event) {
      console.log('Message:', event.data)
    },
  })
  send = ws.send
  sendName.value = (msg: string) => {
    ws.send(msg)
  }
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
      const base64 = encodeBase64(data);
      launchParams.value = base64
    })
    .catch((error) => console.error("VKWebAppGetLaunchParams error:", error));

  await $bridge.send("VKWebAppGetEmail")
    .then((data) => {
      if (data) {
        const base64 = encodeBase64(data);
        email.value = base64
      }
    })
    .catch((error) => console.error("VKWebAppGetEmail error:", error));

  await $bridge.send("VKWebAppGetPhoneNumber")
    .then((data) => {
      if (data.phone_number) {
        const base64 = encodeBase64(data);
        phone.value = base64
      }
    })
    .catch((error) => console.error("VKWebAppGetPhoneNumber error:", error));

  await $bridge.send("VKWebAppGetUserInfo")
    .then((data) => {
      if (data.id) {
        const base64 = encodeBase64(data);
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



const componentMap = {
  waiting: Waiting,
  countdown: Countdown,
  question: Question,
  discussion: Question,
  end: InteractiveEnd,
}
const timerData = ref({})
const nameIsSended = ref<boolean>(false)
onMounted(() => {
  // Сохраняем изначальную высоту экрана в CSS переменную
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
})
</script>

<template>
  <div>
    <component :is="componentMap[data_props.stage]" v-if="nameIsSended" :data="data_props.data"
      :stage="data_props.stage" :on-answer="send" context="participant" :data_answers="data_props.data_answers"
      :winners="data_props.winners" :score="data_props.score" :isBanned="isBanned" />
    <connection :nameIsSended="!nameIsSended" v-else :on-name-sent="() => { nameIsSended = true }" :on-answer="sendName"
      :vk="true" />

  </div>
</template>
