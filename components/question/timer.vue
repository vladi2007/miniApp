<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  stage: string
  timer: string
  timer_duration: string
}>()

// Храним максимальное значение таймера (первое пришедшее число)
// Вместо maxTime используем timer_duration для вычисления прогресса
const timerDuration = ref<number | null>(null)

watch(
  () => props.timer_duration,
  (newVal) => {
    const numeric = Number(newVal)
    if (!isNaN(numeric) && timerDuration.value === null) {
      timerDuration.value = numeric
    }
  },
  { immediate: true }
)

// Вычисляем прогресс в процентах
const progressPercent = computed(() => {
  const time = Number(props.timer)
  if (isNaN(time) || !timerDuration.value) return 0
  return ((time - 1) / timerDuration.value) * 100  
})

// Метка таймера
const timerLabel = computed(() => {
  return props.stage === 'discussion'
    ? 'Следующий вопрос через:'
    : 'Времени осталось:'
})
</script>

<template>
  <div class="question_timer">
    <div class="question_logo">
      <img src="/images/waiting/Clik.svg" />
      <img src="/images/waiting/Group.svg" />
    </div>

    <p class="question_timer-text">{{ timerLabel }} {{ timer }}</p>

    <!-- Серый фон -->
    <div class="question_grey-line">
      <!-- Прогресс -->
      <div class="question_green-line" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </div>
</template>

<style >
</style>
