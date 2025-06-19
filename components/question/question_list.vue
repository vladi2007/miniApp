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
      <p class="question_question-num-text">Вопрос {{ props.question.position }}/{{ props.questions_count }}</p>
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
    

  </div>
</template>

<style>

</style>