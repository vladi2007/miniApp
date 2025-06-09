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
const progressWidth = ref(0)
watch(() => props.timer, (newVal, oldVal) => {
  const numericNew = Number(newVal)
  const numericOld = Number(oldVal)

  if (numericNew > numericOld) {
    // Принудительно сбросить ширину, убрав анимацию
    resetting.value = true
    progressWidth.value = 0

    // Через requestAnimationFrame снова задать корректное значение
    requestAnimationFrame(() => {
      resetting.value = false
      const percent = 100 - (numericNew / Number(props.timer_duration)) * 100
      progressWidth.value = percent
    })
  } else {
    const percent = 100 - (numericNew / Number(props.timer_duration)) * 100
    progressWidth.value = percent
  }
})

// Вычисляем прогресс в процентах
const progressPercent = computed(() => {
  const time = Number(props.timer)
  if (isNaN(time) || !Number(props.timer_duration)) return 0
  return 100 - ((time) / Number(props.timer_duration)) * 100
})
const resetting = ref(false)

watch(() => props.timer, (newVal, oldVal) => {
  // Если таймер резко сброшен к 0 или обратно в начальное значение
  if (Number(newVal) > Number(oldVal)) {
    resetting.value = true
    // Через event loop вернем флаг обратно, чтобы анимация снова работала
    requestAnimationFrame(() => {
      resetting.value = false
    })
  }
})
// Метка таймера
const timerLabel = computed(() => {
  if (props.stage === 'discussion')
  {
    if (props.question_count === props.question_num)
      {
        return 'Конец интерактива через:'
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
      <div class="question_green-line" :style="{ width: progressPercent + '%' }"
        :class="{ 'no-transition': resetting }" />
    </div>
  </div>
</template>

<style></style>