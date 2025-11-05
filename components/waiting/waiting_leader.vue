<script setup lang="ts">

// imports
import type { WaitingData, Pause } from '~/types/stageData'  
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'
import Links from '~/components/waiting/links.vue'

// data from backend
const props = defineProps<{
    stage: string
    data: WaitingData
    context: string
    onStatus: (status: string) => void
    pause: Pause
}>()

// composables
import { UseGoBack } from '~/composables/go_back'
import { UseWaitingLeader } from '~/composables/interactive/interactive_leader/waiting_leader/waiting_leader'
const { router, go_Back } = UseGoBack()
const { morePause, startBeforePause } = UseWaitingLeader(props.pause.timer_n, router, props.onStatus)

</script>

<template>
    <div class="waiting_participant_waiting">
        <div>
            <Links :code="props.data.code" />
        </div>
        <div class="waiting_description_column">
            <div class="waiting_description_column_style">
                <div class="waiting_logo">
                    <div class="waiting_logo_img">
                        <img src="/images/waiting/Group_7055.svg" id="logo" />
                    </div>
                </div>
                <div class="waiting_description-content">
                    <div class="waiting_desc-comp">
                        <Description :title="props.data?.title || ''" :description="props.data?.description || ''"
                            :context="context" :goBack="go_Back" :onStatus="props.onStatus" />
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
@import url("/assets/css/waiting/waiting_links.scss");

* {
    margin: 0;
    padding: 0;
}
</style>
