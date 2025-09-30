<script setup lang="ts">
import type { WaitingData, Pause } from '~/types/stageData'  // Импортируем тип данных
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'
import Links from '~/components/waiting/links.vue'

import { useRouter } from 'vue-router'

// Получаем экземпляр маршрутизатора
const router = useRouter()

// Функция возврата на предыдущую страницу
function goBack() {
    router.push("/leader/interactives").then(() => {
        // Перезагрузка после успешной навигации
        window.location.reload()
    })

}//данные от бекенда
const props = defineProps<{
    stage: string
    data: WaitingData
    context: string
    onStatus: (status: string) => void
    pause:Pause
}>()
const pausePopUp=ref('no')

function morePause() {
    pausePopUp.value='no'
    props.onStatus('more_pause')
}

function startBeforePause(){
    pausePopUp.value='no'
    props.onStatus('going')
}
watch( () => props.pause.state, (newWal) => {
    pausePopUp.value = newWal
})

watch( () => props.pause.timer_n, (newWal) => {
    if (newWal === 0){
        router.push("/leader/interactives").then(() => {
        // Перезагрузка после успешной навигации
        window.location.reload()
    })
    }
})
</script>

<template>
    <div class="waiting_participant_waiting">
        <img src="/images/waiting/Vector_95.svg" id="waiting_vector_1" />
        <img src="/images/waiting/Vector_94.svg" id="waiting_vector_2" />
        <img src="/images/waiting/Star_4_(1).svg" id="waiting_star1" />
        <div>
            <Links :code="props.data.code" />
        </div>
        <div class="waiting_description_column">
            <div class="waiting_logo">
                <div class="waiting_logo_img">
                    <img src="/images/waiting/Group_7055.svg" id="logo" />

                </div>


            </div>
            <div class="waiting_description-content">

                <div class="waiting_desc-comp">
                    <Description :title="props.data?.title || ''" :description="props.data?.description || ''"
                        :context="context" />
                    <div class="waiting_leader_buttons">
                        <button class="waiting_back" @click="goBack">
                            Вернуться
                        </button>
                        <button class="waiting_start" @click="onStatus('going')">
                            Запустить
                        </button>

                    </div>
                </div>
                <!-- Передаем тестовые данные в компоненты -->


            </div>
            <div>
                <Active :count="props.data.participants_active" :context="context" />
            </div>

        </div>
        <div v-if="pausePopUp==='yes'" class="waiting_edit_popup-overlay">
            <div class="waiting_edit_popup-content">
                <div class="waiting_edit_popup-text">Вы слишком долго бездействовали, запустите интерактив или через n секунд он будет закрыт

                </div>
                <div class="waiting_edit_popup-actions">
                    <button @click="startBeforePause()" class="waiting_edit_popup-btn save">Запустить интерактив</button>
                    <button @click=morePause() class="waiting_edit_popup-btn cancel">Еще подождать</button>
                </div>
            </div>
        </div>




    </div>
</template>

<style>



@import url("/assets/css/waiting/active_users_leader.scss");
@import url("/assets/css/waiting/description_leader.scss");
@import url("/assets/css/waiting/waiting_leader.scss");
</style>
