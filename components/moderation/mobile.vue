<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

type ModerationList = {
    username: string
    participant_id: string
    is_hidden: boolean
    is_blocked: boolean
}

const props = defineProps<{
    interactiveId: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const config = useRuntimeConfig().public
const auth = useAuthStore()

const data = ref(null)
const participants = ref<ModerationList[]>([])

let send: any = null

function createWebSocket(interactiveId: string) {
    const url = config.wsBackend

    const ws = useWebSocket(
        `${url}/moderation/${interactiveId}?token=${auth.accessToken}`,
    )

    send = ws.send

    ws.open = () => {
        send(JSON.stringify({
            type: 'auth',
            token: auth.accessToken,
        }))
    }

    watch(ws.data, (val) => {
        data.value = val
    })
}

onMounted(() => {
    createWebSocket(props.interactiveId)
})

watch(data, (newVal) => {
    if (!newVal) return

    try {
        const parsedData = JSON.parse(newVal)

        participants.value = parsedData.data || []
    }
    catch (error) {
        console.error('Ошибка websocket:', error)
    }
})

const sortedParticipants = computed(() =>
    [...participants.value]
        .sort((a, b) => Number(b.participant_id) - Number(a.participant_id)),
)

function toggleHidden(id: string) {
    const participant = participants.value.find(
        p => p.participant_id === id,
    )

    if (participant) {
        participant.is_hidden = !participant.is_hidden
    }

    send?.(JSON.stringify({ hide: id }))
}

const showBanSheet = ref(false)
const selectedId = ref<string | null>(null)

function openBanSheet(id: string) {
    const participant = participants.value.find(
        p => p.participant_id === id,
    )

    if (participant?.is_blocked) return

    selectedId.value = id
    showBanSheet.value = true
}

function blockParticipant() {
    if (!selectedId.value) return

    send?.(JSON.stringify({
        block: Number(selectedId.value),
    }))

    showBanSheet.value = false
}

watch(showBanSheet, (val) => {
    document.body.classList.toggle('modal-open', val)
})

const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

function onTouchStart(e: TouchEvent) {
    isDragging.value = true
    startY.value = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
    if (!isDragging.value) return

    currentY.value = e.touches[0].clientY

    const diff = currentY.value - startY.value

    if (diff > 0) {
        const sheet = document.querySelector('.sheet') as HTMLElement

        if (sheet) {
            sheet.style.transform = `translateY(${diff}px)`
        }
    }
}

function onTouchEnd() {
    isDragging.value = false

    const diff = currentY.value - startY.value

    const sheet = document.querySelector('.sheet') as HTMLElement

    if (!sheet) return

    if (diff > 150) {
        showBanSheet.value = false
        sheet.style.transform = ''
    }
    else {
        sheet.style.transform = 'translateY(0)'
    }
}
</script>

<template>
    <div :class="$style.moderation">
        <div :class="$style.moderation__header">
            <div :class="$style.moderation__goback" @click="emit('close')">
                <img src="/public/images/moderation/goback.svg">
            </div>

            <img src="/public/images/logo.svg" :class="$style.moderation__logo">
        </div>

        <div :class="$style.moderation__block">
            <span :class="$style.moderation__block_header">
                Модерация участников
            </span>

            <div class="users_form_finder_finder" :class="$style.users_form_finder_finder">
                <img src="/public/images/history/finder.svg" class="users_form_input-icon"
                    :class="$style['users_form_input-icon']">

                <input type="text" placeholder="Поиск участников" class="users_form_search-input" maxlength="32"
                    :class="$style['users_form_search-input']">
            </div>

            <div :class="$style.moderation__list">
                <div :class="$style.moderation__list_header">
                    <span>Никнеймы</span>
                    <span>Модерация</span>
                </div>

                <div :class="$style.moderation__list_container">
                    <div v-for="participant in sortedParticipants" :key="participant.participant_id"
                        :class="$style.moderation__list_body">
                        <div @click="toggleHidden(participant.participant_id)">
                            <span>
                                {{
                                    participant.is_hidden
                                        ? '•••'
                                        : participant.username
                                }}
                            </span>
                        </div>

                        <img :style="{
                            cursor: participant.is_blocked
                                ? 'default'
                                : 'pointer',
                        }" :src="participant.is_blocked
                            ? '/images/moderation/banned.svg'
                            : '/images/moderation/ban.svg'
                            " @click="openBanSheet(participant.participant_id)">
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showBanSheet" class="sheet-overlay" @click="showBanSheet = false">
            <div class="sheet" @click.stop @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
                <div class="sheet-handle"></div>

                <div class="sheet-content">
                    <div>
                        Вы уверены, что хотите заблокировать участника?
                    </div>

                    <button id="cancel" class="danger" @click="blockParticipant">
                        Заблокировать
                    </button>

                    <button id="ban" @click="showBanSheet = false">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
body.modal-open {
    overflow: hidden;
}

.sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
}

.sheet {
    width: 100%;
    height: 458px;
    background: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    box-sizing: border-box;

    animation: slideUp 0.25s ease;
    transition: transform 0.25s ease;
}

.sheet-handle {
    width: 72px;
    height: 5px;
    background: #A9A9A9;
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 20px;
}

.sheet-content {
    display: flex;
    flex-direction: column;
    align-items: center;



    button {
        height: 44px;
        border-radius: 8px;
        width: calc(100% - 44px);
        border: none;
        margin: 0 auto;
        cursor: pointer;
        margin-bottom: 10px;
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 1%;
        text-align: center;
        vertical-align: middle;

    }

    .danger {
        background: #F0436C;
        color: white;
    }
}

.sheet-content>div {
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 14px;
    letter-spacing: 1%;
    margin-top: 40px;

}

#cancel {
    margin-top: 175px;
}

#cancel:hover {
    color: #F0436C;
    background-color: white;
    border: 1.5px solid #F0436C;
}

#ban {
    color: #7D7D7D;
    border: 1.5px solid #7D7D7D;
    background-color: white;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}
</style>
<style module lang="scss">
:root {
    --app-height: 100dvh;
}

.moderation {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 10px;

    &__header {

        width: calc(100% - 24px);

        height: 49px;
        background-color: #853CFF;
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        display: flex;
        align-items: center;
        margin: 0 auto;
    }

    &__logo {
        height: 20px;
        width: 50px;
        margin-left: auto;
        margin-right: 14px;
    }

    &__goback {



        &>img {
            margin-left: 16px;
            height: 18px;
            width: 10px;
        }
    }

    &__block {
        margin-top: 61px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        width: 100%;

        &_header {
            font-family: "Lato", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 20px;
            line-height: 120%;
            letter-spacing: 1%;
            vertical-align: middle;
            color: #1D1D1D;
            height: 18px;
            margin: 0 auto;
        }
    }

    &__list {
        margin-top: 20px;
        min-height: 294px;
        background-color: #FFFFFF;
        overflow: hidden;
        margin-bottom: 34px;
        border: 1px solid #D9D9D9;
        border-radius: 15px;


        &_header {
            height: 39px;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            display: flex;
            align-items: center;
            padding-left: 20px;

            &>span {
                font-family: "Lato", sans-serif;
                font-weight: 400;
                font-style: Regular;
                font-size: 14px;
                letter-spacing: 1%;
                vertical-align: middle;
                white-space: nowrap;
                display: flex;
                align-items: center;
                height: 24px;
            }


            >span:nth-child(2) {
                margin-left: auto;
                margin-right: 20px;
            }


        }

        &_container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-bottom: 11px;
            ;
        }

        &_body {
            display: flex;
            align-items: center;
            height: 36px;
            margin: 0 10px;
            border-radius: 5px;

            background-color: #F7F7F7;
            padding: 0 10px;




            & span {
                font-family: "Lato", sans-serif;
                font-weight: 400;
                font-style: Regular;
                font-size: 14px;
                letter-spacing: 1%;
                vertical-align: middle;
                white-space: nowrap;
                display: flex;
                align-items: center;

            }

            &>div {
                display: flex;
                align-items: center;
                width: 270px;
            }



            &>img {
                margin-left: auto;
                margin-right: 28px;
                width: 20px;
                height: 20px;

            }

        }
    }
}

.users_form_finder_finder {
    margin-top: 20px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 12px;
    ;
}

.users_form_search-input {
    width: 100%;
    height: 37px;
    line-height: 37px;
    color: #1D1D1D !important;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-left: 30px;
    box-sizing: border-box;
}

.users_form_search-input::placeholder {
    line-height: 37px;
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #A9A9A9;
}

.users_form_input-icon {
    position: absolute;
    left: 22px;
    top: 50%;
    transform: translateY(-50%);
    width: 17px;
    height: 17px;
    pointer-events: none;
}
</style>