<script setup>
import { ref, onMounted, watch } from 'vue'

const phase = ref('answer') // 'answer' | 'next'
const remainingTime = ref(5)
const progress = ref(100)

const timerText = ref('Время на ответ')

// Универсальный таймер с кастомным временем
function startTimer(seconds, nextPhase) {
  let total = seconds
  remainingTime.value = total
  progress.value = 100

  const interval = setInterval(() => {
    remainingTime.value--
    progress.value = (remainingTime.value / total) * 100

    if (remainingTime.value <= 0) {
      clearInterval(interval)

      if (nextPhase === 'next') {
        phase.value = 'next'
        timerText.value = 'Следующий вопрос через'
        startTimer(3, null) // финальная фаза
      } 
     
    }
  }, 1000)
}

onMounted(() => {
  startTimer(5, 'next')
})
</script>

<template>
  <div class="timer">
    <div class="logo">
      <img src="/images/waiting/Clik.svg" />
      <img src="/images/waiting/Group.svg" />
    </div>

    <p class="timer-text">{{ timerText }}: {{ remainingTime }}</p>

    <!-- Серый фон -->
    <div class="grey-line">
      <!-- Прогресс -->
      <div class="green-line" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.timer {
  margin-left: 22px;
  margin-right: 22px;
  background-color: #853cff;
  height: 110px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 26px;
  border-bottom-right-radius: 26px;
}

.logo {
  padding-top: 23px;
  margin-left: 14px;
}

.timer-text {
  font-family: 'Lato';
  color: white;
  font-weight: 700;
  line-height: 120%;
  font-size: 16px;
  text-align: center;
  margin-top: 21px;
}

.grey-line {
  height: 7px;
  background-color: white;
  margin: 0 auto;
  border-radius: 26px;
  width: 90%;
  margin-top: 12px;
  position: relative;
}

.green-line {
  height: 100%;
  background-color: #6ab23d;
  border-radius: 26px;
  transition: width 1s ease-out;
}
</style>
