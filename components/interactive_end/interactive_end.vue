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
  <div class="interactive_end">
    <div class="interactive_end_timer">
      <div class="interactive_end_logo">
        <img src="/images/waiting/Clik.svg" />
        <img src="/images/waiting/Group.svg" />
        <img src="/images/interactive_end/Vector_88.svg" id="interactive_end_vector" />
      </div>
    </div>
    
    <!-- Передаем данные в компонент Results -->
    <Results :title="props.data.title" :participantsTotal="props.data.participants_total"  :stage="props.stage" />
    
    <div class="interactive_end_star-wrapper">
      <img src="/public/images/interactive_end/Star_8.svg" id="interactive_end_star" />
    </div>
    
    <!-- Передаем данные в компонент WinnersTable -->
    <WinnersTable :winners="props.data.winners" />
  </div>
</template>

<style>
@import url("~/assets/css/interactive_end/results.scss");
@import url("~/assets/css/interactive_end/winners_table.scss");
@import url("~/assets/css/interactive_end/interactive_end.scss");
</style>
