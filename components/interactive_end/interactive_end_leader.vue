<script setup lang="ts">
import { defineProps } from 'vue'
import type { EndData } from '~/types/stageData'
import Results from '~/components/interactive_end/results.vue'
import WinnersTable from '~/components/interactive_end/winners_table.vue'

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
        <Results :title="props.data.title" :participantsTotal="props.data.participants_total" :stage="props.stage" />
     </div>
    
    
    <!-- <div class="interactive_end_leader_star-wrapper">
      <img src="/images/interactive_end/Star_7.svg" id="interactive_end_leader_star" />
    </div> -->
    
    <!-- Передаем данные в компонент WinnersTable -->
    <WinnersTable :winners="props.data.winners"/>
  </div>
</template>

<style>









</style>
