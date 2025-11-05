<script setup lang="ts">

// imports
import { ref, computed, watch } from 'vue'

// data from backend
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

// ref for Props.answers
const answers = ref(props.answers)

// key for localStorage
const route = useRoute()
const interactiveId = route.params.id as string
const ANSWERS_STORAGE_KEY = computed(() => `interactive_answers_${interactiveId}_${props.question.id}`)

// load props.answers from localStorage
onMounted(() => {
  const savedAnswers = loadFromLocalStorage(ANSWERS_STORAGE_KEY.value)
  if (Array.isArray(savedAnswers)) {
    answers.value = savedAnswers
  } else {
    answers.value = props.answers
  }
})

// watcher for props.answers
watch(
  () => props.answers,
  (newAnswers) => {
    if (newAnswers && newAnswers.length > 0) {
      answers.value = newAnswers
      saveToLocaleStorage(ANSWERS_STORAGE_KEY.value, newAnswers)
    }
  },
  { deep: true }
)

// flag for styles props.answers on stage==='discussion'
const isDiscussion = computed(() => props.stage === 'discussion')

// find answer`s percentage
const getPercentage = (id: string) => {
  return props.percentages.find((p) => p.id === id)?.percentage ?? 0
}

// return array of answers id 
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
