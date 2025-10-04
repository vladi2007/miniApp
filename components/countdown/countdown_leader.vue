<script setup lang="ts">
import { defineProps } from 'vue'
import type { CountdownData,Pause } from '~/types/stageData'


// пропс для обработки данных на фазе интерактива: countdown. тип CountdownData описан в файле types/stageData.ts
const props = defineProps<{
  data: CountdownData
}>()
</script>

<template>
  <div class="countdown_timer">
    <div class="countdown_logo">

      <img src="/images/countdown/Vector_94_leader.svg" id="countdown_vector_leader" />
      <img src="/images/countdown/Vector_92_leader.svg" id="countdown_circle_leader" />
      <img src="/images/countdown/Star_2_leader.svg" id="countdown_star_2_leader" />
      <img src="/images/countdown/Vector_88_leader.svg" id="countdown_circle_line_leader" />
      <img src="/images/countdown/Vector_95_leader.svg" id="countdown_vector2_leader" />
      <img src="/images/countdown/Star_8_leader.svg" id="countdown_star_8_leader" />
      <img src="/images/countdown/Ellipse_50_leader.svg" id="countdown_ellipse1_leader" />
      <img src="/images/countdown/Star_4_2_leader.svg" id="countdown_star_4_2_leader" />
      <img src="/images/countdown/Star_7_2_leader.svg" id="countdown_star_7_2_leader" />
      <img src="/images/countdown/Star_3_2_leader.svg" id="countdown_star_3_2_leader" />
      <img src="/images/countdown/Star_9_leader.svg" id="countdown_star_9_leader" />
      <img src="/images/countdown/Star_6_1_leader.svg" id="countdown_star_6_1_leader" />
      <img src="/images/countdown/Ellipse_49_leader.svg" id="countdown_ellipse2_leader" />
      <img src="/images/countdown/Star_13_leader.svg" id="countdown_star_13_leader" />
      <img src="/images/countdown/Ellipse_51_leader.svg" id="countdown_ellipse3_leader" />
      <img src="/images/countdown/Star_12_leader.svg" id="countdown_star_12_leader" />
    </div>

    <p class="countdown_timer-text">{{ props.data.timer }}</p>
  </div>
</template>

<style>
@import url("~/assets/css/countdown/countdown_leader.scss");
</style>
