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
  score:string
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
const isValidScore = computed(() => {
  return typeof props.score === 'number' || 
         (typeof props.score === 'string' && props.score.trim() !== '')
})
</script>

<template>
  <div class="question_timer">
    <div class="question_logo">
      <img src="/public/images/question/Group 7067 (1).svg" />
    </div>

    <div class="question_timer-text">{{ timerLabel }} {{ timer }}</div>

    <div class="question_grey-line">
      <div class="question_green-line" :style="{ width: progressPercent + '%' }"
        :class="{ 'no-transition': resetting }" />
    </div>
    <div v-if="score && props.stage==='discussion'" class="question_timer_score">
Ваш результат: {{ isValidScore ? score : 0 }}
    </div>
  </div>
</template>

<style></style>