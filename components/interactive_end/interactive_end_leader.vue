<script setup lang="ts">
import { defineProps } from 'vue'
import type { EndData } from '~/types/stageData'
import Results_leader from '~/components/interactive_end/results_leader.vue'
import WinnersTable_leader from '~/components/interactive_end/winners_table_leader.vue'

// Получаем данные через props
const props = defineProps<{
    stage: string,
    data: EndData // Используем тип данных EndData
}>()
</script>

<template>
  <div class="interactive_leader_end">
    
    
    <!-- Передаем данные в компонент Results -->
     <div class ='interactive_end_leader_results'>
        <img src="/images/waiting/Group_7055.svg" id="logo_leader" />
        <Results_leader :title="props.data.title" :participantsTotal="props.data.participants_total" :stage="props.stage" />
     </div>
    
    
    <!-- <div class="interactive_end_leader_star-wrapper">
      <img src="/images/interactive_end/Star_7.svg" id="interactive_end_leader_star" />
    </div> -->
    
    <!-- Передаем данные в компонент WinnersTable -->
    <WinnersTable_leader :winners="props.data.winners"/>
  </div>
</template>

<style>

@import url("~/assets/css/interactive_end/results_leader.scss");
@import url("~/assets/css/interactive_end/winners_table_leader.scss");
@import url("~/assets/css/interactive_end/interactive_end_leader.scss");







</style>
