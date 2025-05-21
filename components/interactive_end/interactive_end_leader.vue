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
.interactive_leader_end{
    width: 100%;
    height: 100%;
  
}

.interactive_end_leader_results{position: relative; margin:0 auto;
    width: 1380px;
    height: 281px;;
    background-color: #853CFF;border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 26px;
    border-bottom-right-radius: 26px;}
#logo_leader {
    position: absolute;
    right: 10px;
    top: 12px
}









</style>
