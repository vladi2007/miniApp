<script setup lang="ts">
import { defineProps } from 'vue'
import type { CountdownData } from '~/types/stageData'
// Получаем данные через props
const props = defineProps<{
  data: CountdownData // Используем тип данных WaitingData, который должен быть определен в типах
}>()
</script>

<template>
  <div class="countdown_timer">
    <div class="countdown_logo">
      <img src="/images/countdown/Vector_92.svg" id="countdown_circle" />
      <img src="/images/countdown/Star_4.svg" id="countdown_circle_star" />
      <img src="/images/countdown/Star_7.svg" id="countdown_star_7" />
      <img src="/images/countdown/Star_3.svg" id="countdown_star_3" />
      <img src="/images/countdown/Star_2.svg" id="countdown_star_2" />
      <img src="/images/countdown/Star_6.svg" id="countdown_star_6" />
      <img src="/images/countdown/Vector.svg" id="countdown_vector" />
      <img src="/images/countdown/Vector_90.svg" id="countdown_circle_line" />
    </div>

    <p class="countdown_timer-text">{{ props.data.timer }}</p>
  </div>
</template>

<style >
@import url("~/assets/css/countdown/countdown.scss");


</style>
