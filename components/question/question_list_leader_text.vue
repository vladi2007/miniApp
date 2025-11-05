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
  data_answers:{
    text:string,
    percentage:string
  }[]
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

</script>

<template>
  <div class="question_question-list">


    <div class="question_question_type">{{ props.type }}</div>
    <div class="question_question_weight">баллов за вопрос: {{ props.question.question_weight }}</div>
    <div class="question_list">

      <div v-if="stage==='discussion'" v-for="answer in data_answers" :key="answer.text" class="question_answer text_answer" 
      >
        <span class="question_text">{{ answer.text }}</span>

        <span v-if="isDiscussion" class="question_percent">
          {{ answer.percentage }}%
        </span>
      </div>

    </div>


  </div>
</template>

<style></style>
