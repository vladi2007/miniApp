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

}
//данные от бекенда
const props = defineProps<{
    stage: string
    data: WaitingData
    context: string
    onStatus: (status: string) => void
    pause: Pause
}>()


function morePause() {
    props.onStatus('more_pause')
}

function startBeforePause() {
    props.onStatus('going')
}


watch(() => props.pause.timer_n, (newWal) => {
    if (newWal === 0) {
        router.push("/leader/interactives").then(() => {
            // Перезагрузка после успешной навигации
            window.location.reload()
        })
    }
})
</script>

<template>
    <div class="waiting_participant_waiting">
       
        <div>
            <Links :code="props.data.code" />
        </div>
        <div class="waiting_description_column">
            <div style="
    background-color: #853cff;
    width: calc((749 / 1280) * 100dvw);
    min-height: calc((516 / 832) * 100dvh);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Белый блок — сверху */
    padding-bottom: calc((20 / 832) * 100dvh); /* отступ снизу */
    border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  ">

            
            <div class="waiting_logo">
                <div class="waiting_logo_img">
                    <img src="/images/waiting/Group_7055.svg" id="logo" />

                </div>


            </div>
            <div class="waiting_description-content">

                <div class="waiting_desc-comp">
                    <Description :title="props.data?.title || ''" :description="props.data?.description || ''"
                        :context="context" :goBack="goBack" :onStatus="props.onStatus" />
                    
                </div>


            </div>
            </div>
            <div>
                <Active :count="props.data.participants_active" :context="context" />
            </div>

        </div>
        <div v-if="props.pause.state === 'timer_n'" class="waiting_edit_popup-overlay">
            <div class="waiting_edit_popup-content">
                <div class="waiting_edit_popup-text">Вы слишком долго бездействовали, запустите интерактив или через
                    {{ props.pause.timer_n }}
                    секунд он будет закрыт

                </div>
                <div class="waiting_edit_popup-actions">
                    <button @click="startBeforePause()" class="waiting_edit_popup-btn save">Запустить
                        интерактив</button>
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
@import url("/assets/css/waiting/waiting_leader.scss");
* {
    margin: 0;
    padding: 0;
}
</style>
