<script setup lang="ts">
import { defineProps } from 'vue'
import type { CountdownData, Pause } from '~/store/types/stageData'

// пропс для обработки данных на фазе интерактива: countdown. тип CountdownData описан в файле types/stageData.ts
const props = defineProps<{
  data: CountdownData
}>()
</script>

<template>
  <div class="countdown_timer">
    <div class="countdown_logo">
      <img
        id="countdown_vector_leader"
        src="/public/images/countdown/Vector_94_leader.svg"
      >

      <img
        id="countdown_star_2_leader"
        src="/public/images/countdown/Star_2_leader.svg"
      >

      <img
        id="countdown_circle_line_leader"
        src="/public/images/countdown/circle_leader.svg"
      >

      <img
        id="countdown_vector2_leader"
        src="/public/images/countdown/Vector_95_leader.svg"
      >
      <img
        id="countdown_star_8_leader"
        src="/public/images/countdown/Star_8_leader.svg"
      >

      <img
        id="countdown_star_7_2_leader"
        src="/public/images/countdown/Star_7_2_leader.svg"
      >
      <img
        id="countdown_star_3_2_leader"
        src="/public/images/countdown/Star_3_2_leader.svg"
      >
      <img
        id="countdown_star_9_leader"
        src="/public/images/countdown/Star_9_leader.svg"
      >
      <img
        id="countdown_star_6_1_leader"
        src="/public/images/countdown/Star_6_1_leader.svg"
      >
      <img
        id="countdown_ellipse2_leader"
        src="/public/images/countdown/Ellipse_49_leader.svg"
      >
      <img
        id="countdown_star_13_leader"
        src="/public/images/countdown/Star_13_leader.svg"
      >
      <img
        id="countdown_ellipse3_leader"
        src="/public/images/countdown/Ellipse_51_leader.svg"
      >
    </div>

    <div class="countdown_timer-text">
      {{ props.data.timer }}
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/countdown/countdown_leader.scss");
</style>
