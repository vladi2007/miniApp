<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  stage: string
  timer: string
  timer_duration: string
  question_count:string
  question_num: string
}>()

const timerDuration = ref<number | null>(null)
const progressWidth = ref(0)
const resetting = ref(false) // Флаг для отслеживания сброса

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

// Отслеживаем момент, когда таймер достигает 0
watch(
  () => props.timer,
  (newVal, oldVal) => {
    const numericNew = Number(newVal)
    const numericOld = Number(oldVal)
    
    // Если таймер перешел с 1 на 0
    if (numericOld === 0 && numericNew > 0) {
      resetting.value = true
      
      // Включаем анимацию обратно после небольшой задержки
      
    }
    if (numericOld!== 0) {
      resetting.value = false
      // Включаем анимацию обратно после небольшой задержки
      
    }
  }
)

// Вычисляем прогресс в процентах
const progressPercent = computed(() => {
  const time = Number(props.timer)
  if (isNaN(time) || !Number(props.timer_duration)) return 0
  return 100 - (time / Number(props.timer_duration)) * 100
})

// Метка таймера
const timerLabel = computed(() => {
  if (props.stage === 'discussion') {
    if (props.question_count === props.question_num) {
      return 'Конец интерактива через:'
    } else {
      return 'Следующий вопрос через:'
    }
  } else {
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
      <div class="question_green-line" 
           :style="{ width: progressPercent + '%' }"
           :class="{ 'no-transition': resetting }" />
    </div>
  </div>
</template>

<style>
.no-transition {
  transition: none !important;
}
</style>