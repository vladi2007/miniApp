<script setup lang="ts">
import { defineProps } from 'vue'
import type { EndData, EndWinners } from '~/types/stageData'
import Results_leader from '~/components/interactive_end/results_leader.vue'
import WinnersTable_leader from '~/components/interactive_end/winners_table_leader.vue'

// Получаем данные через props
const props = defineProps<{
    stage: string,
    data: EndData
    winners:{ position: number, username: string, time: number, score: number }[]
}>()

onMounted(() => {
 clearAllDeviceStorage()
const { $queryClient } = useNuxtApp()
$queryClient.invalidateQueries(['interactives'])
})
</script>

<template>
  <div class="interactive_leader_end">
    
 
     <div class ='interactive_end_leader_results'>
        <img src="/images/waiting/Group_7055.svg" id="logo_leader" />
        <div style="height: 0px; font-size: 0.01px; color: blueviolet;">sd</div>
        <Results_leader :title="props.data.title" :participantsTotal="props.data.participants_total" :stage="props.stage" />
     </div>

    <WinnersTable_leader :winners="props.data.winners"/>
  </div>
</template>

<style>

@import url("~/assets/css/interactive_end/results_leader.scss");
@import url("~/assets/css/interactive_end/winners_table_leader.scss");
@import url("~/assets/css/interactive_end/interactive_end_leader.scss");







</style>
