<script setup lang="ts">
import { defineProps } from 'vue'
import type { CountdownData } from '~/types/stageData'
// пропс для обработки данных на фазе интерактива: countdown. тип CountdownData описан в файле types/stageData.ts
const props = defineProps<{
  data: CountdownData
}>()
</script>

<template>
  <div class="countdown_timer">
    <div class="countdown_logo">
      <img
        id="countdown_circle_star"
        src="/public/images/countdown/Group 7045.svg"
      >
      <img
        id="countdown_star_7"
        src="/public/images/countdown/Group 7096 (1).svg"
      >
      <img
        id="countdown_star_2"
        src="/public/images/countdown/Star_2.svg"
      >
      <img
        id="countdown_star_6"
        src="/public/images/countdown/Group 7097 (1).svg"
      >
      <img
        id="countdown_star_3"
        src="/public/images/countdown/Group 7098.svg"
      >
    </div>

    <p class="countdown_timer-text">
      {{ props.data.timer }}
    </p>
  </div>
</template>

<style>
@import url("~/assets/css/countdown/countdown.scss");
</style>
