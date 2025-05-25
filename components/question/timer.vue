<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  stage: string
  timer: string
  timer_duration: string
  question_count:string
  question_num: string
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
  if (isNaN(time) || !Number(props.timer_duration)) return 0
  return ((time) / Number(props.timer_duration)) * 100
})

// Метка таймера
const timerLabel = computed(() => {
  if (props.stage === 'discussion')
  {
    if (props.question_count === props.question_num)
      {
        return 'Результаты через:'
      }
    else{
      return 'Следующий вопрос через:'
    }
  }
  else{
    return 'Времени осталось:'
  }
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

<style></style>
