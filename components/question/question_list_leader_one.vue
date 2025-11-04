<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// пропс для работы с данными от бекенда
const props = defineProps<{
  questions_count: string
  question: {
    id: string
    text: string
    position: string
    question_weight: string
    type: string
  }
  answers: {
    id: string
    text: string
  }[]
  percentages: {
    id: string
    percentage: number
  }[]
  id_correct_answer: string | string[]
  timer: string
  stage: string
  context: string
  onAnswer: (answerId: string) => void
  type: string
}>()
// Стейт для хранения ответов
const answers = ref(props.answers)
const route = useRoute()
const interactiveId = route.params.id as string
const ANSWERS_STORAGE_KEY = computed(() => `interactive_answers_${interactiveId}_${props.question.id}`)
// Загружаем ответы из localStorage, если есть
onMounted(() => {
  const savedAnswers = loadFromLocalStorage(ANSWERS_STORAGE_KEY.value)
  if (Array.isArray(savedAnswers)) {
    answers.value = savedAnswers
  } else {
    answers.value = props.answers
  }
})
// Следим за изменениями в props.answers
watch(
  () => props.answers,
  (newAnswers) => {
    // Обновляем состояние, только если пришли новые ответы
    if (newAnswers && newAnswers.length > 0) {
      answers.value = newAnswers
      saveToLocaleStorage(ANSWERS_STORAGE_KEY.value, newAnswers)
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


const correctAnswers = computed<string[]>(() => {
  const val = props.id_correct_answer
  if (Array.isArray(val)) return val.map(String)
  if (val == null) return []
  return [String(val)]
})

</script>

<template>
  <div class="question_question-list">


    <div class="question_question_type">{{ props.type }}</div>
    <div class="question_question_weight">баллов за вопрос: {{ props.question.question_weight }}</div>
    <div class="question_list">

      <div v-for="answer in answers" :key="answer.id" class="question_answer" :class="{
        correct: isDiscussion && correctAnswers.includes(String(answer.id)),
        wrongOutline: isDiscussion && !correctAnswers.includes(String(answer.id))
      }">
        <span class="question_text">{{ answer.text }}</span>

        <span v-if="isDiscussion" class="question_percent"
          :class="{ question_percent_white: correctAnswers.includes(String(answer.id)) }">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>

    </div>


  </div>
</template>

<style></style>
