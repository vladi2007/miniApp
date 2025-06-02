<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  questions_count: string
  question: {
    id: string
    text: string
    position: string
  }
  answers: {
    id: string
    text: string
  }[]
  percentages: {
    id: string
    percentage: number
  }[]
  id_correct_answer: string
  timer: string
  stage: string
  onAnswer: (answerId: string) => void
}>()

// Стейт для хранения ответов
const answers = ref(props.answers)

// Следим за изменениями в props.answers
watch(
  () => props.answers,
  (newAnswers) => {
    // Обновляем состояние, только если пришли новые ответы
    if (newAnswers && newAnswers.length > 0) {
      answers.value = newAnswers
    }
    // Если новый массив пустой, не обновляем состояние
  },
  { deep: true }
)
const selectedAnswer = ref<string | null>()
const showBanner = ref(false) // Состояние для плашки

const isDiscussion = computed(() => props.stage === 'discussion')
console.log(props)
// Позволяет выбирать только в режиме "question"
function selectAnswer(answerId: string) {
  if (isDiscussion.value) return // Блокируем выбор в режиме discussion
  selectedAnswer.value = answerId
  showBanner.value = true
  props.onAnswer(answerId)

  // Показываем плашку при выборе ответа
}

const isCorrect = computed(() => {
  return selectedAnswer.value === String(props.id_correct_answer)
})

const getPercentage = (id: string) => {
  return props.percentages.find((p) => p.id === id)?.percentage ?? 0
}
const currStage = ref(props.stage)
const prevStage = ref(props.stage)

watch(
  () => props.stage,
  (newVal, oldVal) => {
    prevStage.value = oldVal
    currStage.value = newVal
    if (oldVal === "discussion" && newVal === "question") {
      selectedAnswer.value = null
    }
  }
)
// Следим за приходом idCorrectAnswer
watch(
  () => props.id_correct_answer,
  () => {
    if (selectedAnswer.value && selectedAnswer.value !== String(props.id_correct_answer)) {
      showBanner.value = false // Скрываем плашку, если ответ неправильный


    }
    () => {

    }
  }
)

</script>

<template>
  <div class="question_question-list">
    <div class="question_number">
      <img src="/images/question/Star_3.svg" class="question_icon" />
      <p class="question_question-num-text">Вопрос {{ props.question.position }}/ {{ props.questions_count }}</p>
    </div>

    <p class="question_title">{{ props.question.text }}</p>

    <div class="question_list">
      <div v-for="answer in answers" :key="answer.id" class="question_answer" :class="{
        selected: selectedAnswer === String(answer.id) && !isDiscussion,
        correct: isDiscussion && selectedAnswer === String(answer.id) && String(props.id_correct_answer) === String(answer.id),
        incorrect: isDiscussion && selectedAnswer === String(answer.id) && String(props.id_correct_answer) !== String(answer.id),
        correctOutline: isDiscussion && String(props.id_correct_answer) === String(answer.id) && selectedAnswer !== String(answer.id),
        wrongOutline: isDiscussion && String(answer.id) !== String(props.id_correct_answer) && String(answer.id) !== selectedAnswer
      }" @click="selectAnswer(String(answer.id))">
        <span class="question_text">{{ answer.text }}</span>
        <span v-if="isDiscussion" class="question_percent" :class="{ white: selectedAnswer === answer.id }">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>
    </div>

    <div v-if="showBanner && isCorrect" :class="['question_accepted-banner', 'success']">
      <img src="/public/images/question/Group_1.svg" />
      Правильный ответ
    </div>
    <div v-if="showBanner && !isCorrect" :class="['question_accepted-banner', 'default']">
      Ответ принят!
    </div>

  </div>
</template>

<style>
.question_question-list {
  margin-left: 22px;
  margin-right: 22px;
  position: relative;
}

.question_number {
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

.question_icon {
  position: absolute;
  bottom: 20px;
  right: 0;
  width: 37px;
  height: 37px;
}

.question_question-num-text {
  font-weight: 400;
  font-size: 16px;
}

.question_title {
  margin-top: 14px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.question_list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.question_answer {
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

.question_answer:hover {
  background-color: #e0e0e0;
}

.question_answer.selected {
  background-color: #853cff;
  color: white;
}

.question_answer.correct {
  background-color: #6ab23d;
  color: white;
}

.question_answer.correctOutline {
  border: 1px solid #6ab23d;
  color: #1d1d1d;
  background-color: #f7f7f7;
}

.question_answer.incorrect {
  border: 1px solid #f0436c;
  background-color: #f0436c;
  color: white;
}

.question_answer.wrongOutline {
  border: 1px solid #f0436c;
  background-color: #f7f7f7;
  color: #1d1d1d;
}

.question_percent {
  font-size: 14px;
  color: #333;
  padding-right: 13px;
}

.question_percent.white {
  color: white;
}

.question_accepted-banner {
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

.question_accepted-banner.default {
  background-color: #853cff;
  color: white;
}

.question_accepted-banner.hidden {
  display: none
}

.question_accepted-banner.success {
  background-color: #6ab23d;
  color: white;
}

.question_check-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>