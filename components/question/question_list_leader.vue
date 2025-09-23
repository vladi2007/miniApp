<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// пропс для работы с данными от бекенда
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
  context: string
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



// отслеживаем, что вопрос сменился на обсуждение его и показ правильного ответа
const isDiscussion = computed(() => props.stage === 'discussion')


// Позволяет выбирать только в режиме "question"


// количество ответов в процентах
const getPercentage = (id: string) => {
  return props.percentages.find((p) => p.id === id)?.percentage ?? 0
}





</script>

<template>
  <div class="question_question-list">
    <div class="question_number">
      <img src="/public/images/question/question_mun_star.svg" id="question_mun_star">
      <p class="question_question-num-text">Вопрос {{ props.question.position }}/{{ props.questions_count }}</p>
    </div>

    <p class="question_title">{{ props.question.text }}</p>

    <div class="question_list">
      <div v-for="answer in answers" :key="answer.id" class="question_answer" :class="{
        correct: answer.id === props.id_correct_answer,
        wrongOutline: isDiscussion && answer.id !== props.id_correct_answer
      }">
        <span class="question_text">{{ answer.text }}</span>
        <span v-if="isDiscussion" class="question_percent">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>
    </div>


  </div>
</template>

<style></style>
