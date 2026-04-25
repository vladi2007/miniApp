<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'
import connection from '~/components/participant_interactive/connection.vue'
// Реактивные переменные
const route = useRoute()

const id = route.params.id as string
const data = ref(null)
let send = null
const isBanned = ref(false)
const sendName = ref<((msg: string) => void) | null>(null)
// Функция для создания websocket
function createWebSocket(interactiveId: string, token: string) {
    const config = useRuntimeConfig().public
    const ulr = config.wsBackend



    const wsUrl = `${ulr}/${interactiveId}?anonymToken=${token}`

    const ws = useWebSocket(wsUrl, {
        onConnected(ws) {
        },
        onDisconnected(ws, event) {
            isBanned.value = JSON.parse(event.reason).detail
        },
        onError(ws, event) {
        },
        onMessage(ws, event) {
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


const ready = ref<boolean>(false)
const token = ref<string | null>(null)

onMounted(() => {
    const id = route.params.id as string
    token.value = localStorage.getItem(`anonym_${id}`)
    ready.value = true
})
watch(
    [ready, () => id, token],
    ([isReady, id, tokenVal]) => {
        if (!isReady || !id || !tokenVal) return

        createWebSocket(id as string, tokenVal)
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
console.log('nameIsSended:', nameIsSended.value)
onMounted(() => {
    // Сохраняем изначальную высоту экрана в CSS переменную
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
})
</script>

<template>
    <div>
        <connection :nameIsSended="!nameIsSended" v-if="!nameIsSended" :on-name-sent="() => { nameIsSended = true }"
            :on-answer="sendName" :vk="false" :initName="'Аноним'" />
        <component :is="componentMap[data_props.stage]" v-if="nameIsSended" :data="data_props.data"
            :stage="data_props.stage" :on-answer="send" context="participant" :data_answers="data_props.data_answers"
            :winners="data_props.winners" :score="data_props.score" :isBanned="isBanned" />


    </div>
</template>
