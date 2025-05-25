<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  stage: string
  timer: string
  timer_duration: string
  context: string
}>()

// Храним максимальное значение таймера (первое пришедшее число)
// Вместо maxTime используем timer_duration для вычисления прогресса
const timerDuration = ref<number | null>(null)
const isLeaderContext = computed(() => props.context === 'leader')
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
const isLeader = computed(() => props.stage !== 'participant')
// Вычисляем прогресс в процентах
const progressPercent = computed(() => {
  const time = Number(props.timer)
  if (isNaN(time) || !timerDuration.value) return 0
  return ((time - 1) / timerDuration.value) * 100
})

// Метка таймера
const timerLabel = computed(() => {

  if (!isLeader.value) return props.stage === 'discussion'
    ? 'Следующий вопрос через:'
    : 'Времени осталось:'
})
</script>

<template>
  <div class="question_timer">
    <div class="question_logo" v-if="!isLeader">
      <img src="/images/waiting/Clik.svg" />
      <img src="/images/waiting/Group.svg" />
    </div>

    <div class="question_timer-text-wrapper" v-if="isLeaderContext">
      <div class="question_timer-text">
        {{ timer }}
      </div>
    </div>
    <div v-else class="question_timer-text">
      {{ timerLabel }} {{ timer }}
    </div>

    <!-- Серый фон -->
    <div class="question_grey-line" v-if="!isLeader">
      <!-- Прогресс -->
      <div class="question_green-line" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </div>
</template>

<style></style>
