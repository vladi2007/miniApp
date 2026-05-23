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
    image: string
  }
  answers: any
  percentages: any
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
  }
  else {
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
  { deep: true },
)

// flag for styles props.answers on stage==='discussion'
const isDiscussion = computed(() => props.stage === 'discussion')

// find answer`s percentage
const getPercentage = (id: string) => {
  return props.percentages.find(p => p.id === id)?.percentage ?? 0
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
  <div :class="$style.question">
    <div :class="$style.question__type">
      {{ props.type }}
    </div>
    <div :class="$style.question__score">
      баллов за вопрос: {{ props.question.question_weight }}
    </div>
    <img :class="$style.question__img" v-if="props.question.image !== ''" :src="props.question.image">
    <div :class="$style.question__list">
      <div v-for="answer in answers" :key="answer.id" :class="[{
        correct: isDiscussion && correctAnswers.includes(String(answer.id)),
        wrongOutline: isDiscussion && !correctAnswers.includes(String(answer.id)),

      }, $style.question__answer]">
        <span :class="$style.question__answer_text">{{ answer.text }}</span>

        <span v-if="isDiscussion"
          :class="[$style.question__answer__percent, { question_percent_white: correctAnswers.includes(String(answer.id)) }]">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>
    </div>
  </div>
</template>
<style>
.correct {
  background-color: #6AB23D !important;
  color: #FFFFFF !important;
}

.wrongOutline {
  border: 1.5px solid #F0436C;
}

@media (min-width:1280px) {


  .wrongOutline {
    border: 2px solid #F0436C;
  }
}
</style>
<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

.question {
  margin-top: 5px;
  width: 100%;
  margin-bottom: 10px;

  @media (min-width:1280px) {
    margin-top: calc(15/832*100dvh);
    width: calc(649/1280*100dvw);

  }

  &__type {
    color: #A9A9A9;
    font-size: 16px;
    font-weight: 400;

    @media (min-width:1280px) {
      margin-left: calc(7/1280*100dvw);
      font-size: clamp(36px, 2.5vw, 52px);
      font-weight: 500;
    }
  }

  &>img {
    display: block;
    margin: 0 auto;
    width: 231px;
    aspect-ratio: 231 / 130;

    @media (min-width:1280px) {
      display: none;

    }
  }

  &__score {
    color: #A9A9A9;
    font-size: 16px;
    font-weight: 400;

    @media (min-width:1280px) {
      margin-left: calc(7/1280*100dvw);
      font-size: clamp(32px, 2.5vw, 48px);
      font-weight: 500;
    }
  }

  &__list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;

    gap: 19px;

    @media (min-width:1280px) {
      margin-top: calc(15/832*100dvh);
      gap: calc(20/832*100dvh);
      ;
    }

    &>div {
      box-sizing: border-box;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #F7F7F7;
      border-radius: 8px;
      padding: 10px;

      @media (min-width:1280px) {
        box-shadow: 0px 1px 10px 0px #00000059;
        height: calc(58/832*100dvh);
        font-size: clamp(32px, 2.5vw, 48px);
      }
    }
  }

  &__answer {
    color: #1D1D1D;
    font-size: 16px;
  }

  &__percent {
    color: #1D1D1D;
    font-size: 16px;
  }
}
</style>
