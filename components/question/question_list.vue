<script setup>
import { ref } from 'vue'

const answers = ['Аудиторией', 'Библиотекой', 'Лабораторией', 'Спортивным залом']
const votes = ref([25, 10, 50, 15])

const selectedAnswer = ref(null)
const correctAnswer = ref(null)

const showBanner = ref(false)
const isCorrect = ref(false)

const answerReceived = ref(false)
const isTimeUp = ref(false) // флаг времени

// Выбор ответа
function selectAnswer(index) {
  if (answerReceived.value || isTimeUp.value) return

  selectedAnswer.value = index
  showBanner.value = true

  // Имитация ответа сервера
  setTimeout(() => {
    correctAnswer.value = 2 // например, правильный — 3-й
    isCorrect.value = selectedAnswer.value === correctAnswer.value
    answerReceived.value = true

    if (!isCorrect.value) {
      showBanner.value = false
    }
  }, 5000)
}

// Автоистечение времени через 10 секунд
setTimeout(() => {
  isTimeUp.value = true
}, 5000)
</script>

<template>
  <div class="question-list">
    <div class="number">
      <img src="/images/question/Star_3.svg" class="icon" />
      <p class="question-num-text">Вопрос 1/10</p>
    </div>

    <p class="title">
      Помещение музейно-выставочного комплекса в ГУКе первоначально было
    </p>

    <div class="list">
      <div
        v-for="(option, index) in answers"
        :key="index"
        class="answer"
        :class="{
          selected: selectedAnswer === index && correctAnswer === null,
          correct: correctAnswer !== null && selectedAnswer === index && correctAnswer === index,
          incorrect: correctAnswer !== null && selectedAnswer === index && correctAnswer !== index,
          correctOutline: correctAnswer !== null && index === correctAnswer && selectedAnswer !== index,
          wrongOutline: correctAnswer !== null && index !== correctAnswer && index !== selectedAnswer
        }"
        @click="selectAnswer(index)"
      >
        <span class="text">{{ option }}</span>
        <span
          v-if="correctAnswer !== null"
          class="percent"
          :class="{ white: selectedAnswer === index }"
        >
          {{ votes[index] }}%
        </span>
      </div>
    </div>

    <!-- Плашка -->
    <div
      v-if="showBanner"
      :class="['accepted-banner', isCorrect ? 'success' : 'default']"
    >
      <img v-if="isCorrect" src="/images/question/Group_1.svg" class="check-icon" alt="Check Icon" />
      {{ isCorrect ? 'Правильный ответ' : 'Ответ принят!' }}
    </div>
  </div>
</template>

<style scoped>
.question-list {
  margin-left: 22px;
  margin-right: 22px;
  position: relative;
}

.number {
  margin-top: 45px;
  position: relative;
  width: 131px;
  height: 41px;
  background-image: url("/images/question/Vector_80.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  position: absolute;
  bottom: 20px;
  right: 0;
  width: 37px;
  height: 37px;
}

.question-num-text {
  font-weight: 400;
  font-size: 16px;
}

.title {
  margin-top: 14px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.answer {
  background-color: #f7f7f7;
  border-radius: 8px;
  height: 46px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  color: #1d1d1d;
  padding-left: 35px;
}

.answer:hover {
  background-color: #e0e0e0;
}

.answer.selected {
  background-color: #853cff;
  color: white;
}

.answer.correct {
  background-color: #6ab23d;
  color: white;
}

.answer.correctOutline {
  border: 1px solid #6ab23d;
  color: #1d1d1d;
  background-color: #f7f7f7;
}

.answer.incorrect {
  border: 1px solid #f0436c;
  background-color: #f0436c;
  color: white;
}

.answer.wrongOutline {
  border: 1px solid #f0436c;
  background-color: #f7f7f7;
  color: #1d1d1d;
}

.percent {
  font-size: 14px;
  color: #333;
  padding-right: 13px;
}

.percent.white {
  color: white;
}

.accepted-banner {
  margin-top: 24px;
  padding: 12px;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.accepted-banner.default {
  background-color: #853cff;
  color: white;
}

.accepted-banner.success {
  background-color: #6ab23d;
  color: white;
}

.check-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
