<script setup lang="ts">

// imports
import { ref, computed, watch } from 'vue'

// data from backend
const props = defineProps<{
  stage: string
  timer: string
  timer_duration: string
  question_count: string
  question_num: string
  type:string
}>()

// composables
import { useTimer } from '~/composables/interactive/timer';
const { timerLabel, type, progressPercent, resetting } = useTimer(
  computed(() => props.stage),
  computed(() => props.question_count),
  computed(() => props.question_num),
  computed(() => props.type),
  computed(() => props.timer),
  computed(() => props.timer_duration)
)

</script>

<template>
  <div class="question_timer">
    <div class="question_logo">
      <img src="/images/waiting/Clik.svg" />
      <img src="/images/waiting/Group.svg" />
    </div>

    <p class="question_timer-text">{{ timerLabel }} {{ timer }}</p>

    <div class="question_grey-line">
      <div class="question_green-line" :style="{ width: progressPercent + '%' }"
        :class="{ 'no-transition': resetting }" />
    </div>
  </div>
</template>

<style></style>