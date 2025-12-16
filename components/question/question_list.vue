<script setup lang="ts">

// imports
import { ref, computed, watch } from 'vue'

// data from backend
import { saveToLocaleStorage, loadFromLocalStorage, clearLocalStorage } from '~/utils/deviceStorage'
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
  onAnswer: (answerId: number | number[] | string | null) => void
  type: string
}>()

// ref for Props.answers
const answers = ref(props.answers)
const isAnswerSent = ref(false)
// key for localStorage
const route = useRoute()
const interactiveId = route.params.id as string
const ANSWERS_STORAGE_KEY = computed(() => `interactive_answers_${interactiveId}_${props.question.id}`)

// load props.answers from localStorage
onMounted(() => {
  const savedAnswers = loadFromLocalStorage(ANSWERS_STORAGE_KEY.value)
  const savedState = loadFromLocalStorage(isAnsweredKey.value)
  const savedAnswer = loadFromLocalStorage(storageKey.value)
  if (savedAnswer){
    selectedAnswer.value=savedAnswer
  }
  if (Array.isArray(savedAnswers)) {
    answers.value = savedAnswers
  } else {
    answers.value = props.answers
  }
  isAnswerSent.value = savedState === true
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


const selectedAnswer = ref<number | null>(null)

const STORAGE_KEY_PREFIX = 'interactive_selected_answer_'
const storageKey = computed(() => STORAGE_KEY_PREFIX + props.question.id)
const ANSWERS_STORAGE_KEY_PREFIX = 'interactive_answers_'
const answersStorageKey = computed(() => ANSWERS_STORAGE_KEY_PREFIX + props.question.id)
const ANSWERED_KEY_PREFIX = 'isAnswered'
const isAnsweredKey = computed(() => ANSWERED_KEY_PREFIX + props.question.id)





// текст выбранного ответа

const showBanner = ref(false) // Состояние для плашки
// Загружаем сохранённый ответ при монтировании



const isButtonDisabled = ref(true)
// Позволяет выбирать только в режиме "question"
async function selectAnswer(answerId: string) {
  if (isDiscussion.value || isAnswerSent.value || String(props.timer)==="0") return

  if (selectedAnswer.value === Number(answerId)) {
    // Повторный клик — сброс
    selectedAnswer.value = null
    showBanner.value = false
    isButtonDisabled.value = true
    clearLocalStorage(storageKey.value)
    return
  }

  selectedAnswer.value = Number(answerId)
  showBanner.value = true

  // Дадим Vue время обновить DOM, особенно на iOS
  await nextTick()
  isButtonDisabled.value = false

  saveToLocaleStorage(storageKey.value, answerId)
}

// --- ОТПРАВКА ОТВЕТА ---
async function sendAnswer() {
  if ( isAnswerSent.value) return




  props.onAnswer(JSON.stringify({ answer_id: String(selectedAnswer.value) }))

  isAnswerSent.value = true
  isButtonDisabled.value = true
  saveToLocaleStorage(isAnsweredKey.value, true)
}



// отслеживаем смену фазы интерактива
const currStage = ref(props.stage)
const prevStage = ref(props.stage)

watch(
  () => props.stage,
  (newVal, oldVal) => {
    prevStage.value = oldVal
    currStage.value = newVal
    if (oldVal === "discussion" && newVal === "question") {
      selectedAnswer.value = null
      isAnswerSent.value = false
      isButtonDisabled.value = false
      clearLocalStorage(storageKey.value)
      clearLocalStorage(isAnsweredKey.value)
    }
  }
)
// Следим за приходом idCorrectAnswer
watch(
  () => props.id_correct_answer,
  () => {
    if (selectedAnswer.value && selectedAnswer.value !== Number(props.id_correct_answer)) {
      showBanner.value = false // Скрываем плашку, если ответ неправильный


    }
    () => {

    }
  }
)
const type = computed(() => {
  if (props.question.type === "one") {
    return "Один правильный ответ";
  } else if (props.question.type === "many") {
    return "Несколько правильных ответов";
  } else {
    return "Введите правильный ответ";
  }
});

watch(
  () => props.stage,
  async (newStage, oldStage) => {
    // Когда время вопроса истекает и переходим в обсуждение
    if (oldStage === "question" && newStage === "discussion") {
      // Если пользователь выбрал ответ, но не отправил — отправляем автоматически
      if (selectedAnswer.value !== null && !isAnswerSent.value) {
        await sendAnswer()
      }
    }
  }
)
</script>

<template>

  <div class="question_question-list">
    <div class="question_number">

      <img src="/public/images/question/Group 7099.svg" class="question_icon" />
      <div class="question_question-num-text">Вопрос {{ props.question.position }}<span style="color: #A9A9A9;">/{{
        props.questions_count }}</span></div>
    </div>

    <div class="question_title">{{ props.question.text }}</div>
    <div class="question_type">{{ type }}</div>
    <div class="question_weight">баллов за вопрос: {{ props.question.question_weight }}</div>
    <img class="question_image" :src="props.question.image" v-if="props.question.image !== ''" />
    <div class="question_list">
      <div v-for="answer in answers" :key="answer.id" class="question_answer" :class="{
        selected: selectedAnswer === Number(answer.id) && !isDiscussion,
        correct:  isAnswerSent && isDiscussion && selectedAnswer === Number(answer.id) && String(props.id_correct_answer) === String(answer.id),
        incorrect: isAnswerSent && isDiscussion && selectedAnswer === Number(answer.id) && String(props.id_correct_answer) !== String(answer.id),
        correctOutline: isDiscussion && String(props.id_correct_answer) === String(answer.id) && selectedAnswer !== Number(answer.id),
        wrongOutline: isDiscussion && String(props.id_correct_answer) !== String(answer.id) && Number(answer.id) !== selectedAnswer
      }" @click="selectAnswer(String(answer.id))">
        <span class="question_text">{{ answer.text }}</span>

        <span v-if="isDiscussion" class="question_percent" :class="{ white: selectedAnswer === answer.id }">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>

    </div>
    <button v-if="!isDiscussion && showBanner" class="send_button" :class="{ answer_sent: isAnswerSent }"
      :disabled="isButtonDisabled" @click="sendAnswer">
      {{ isAnswerSent ? 'Ответ отправлен' : 'Отправить ответ' }}
    </button>
    <div v-if="isDiscussion && String(props.id_correct_answer) === String(selectedAnswer)"
      :class="['question_accepted-banner', 'success']">
      <img src="/public/images/question/Group_1.svg" style="height: calc((20 / 844) * var(--app-height)); 
  width: calc((15 / 390) * 100dvw);; " />
      <div style=" margin-left: calc((2 / 390) * 100dvw);; ">Правильный ответ</div>
    </div>
  </div>
</template>

<style>
.question_type {
  margin-top: calc((5 / 844) * 100dvh);
}

.question_weight {
  margin-top: calc((2 / 844) * 100dvh);
}

.question_type,
.question_weight {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: Regular;
  line-height: 120%;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  color: #A9A9A9;
}

.question_image {
  width: calc((231 / 390) * 100dvw);
  margin: 0px auto;
  aspect-ratio: 16 / 9;
  margin-left: calc((58 / 390) * 100dvw);
  background-color: #A9A9A9;
}

.send_button {
  height: calc((45 / 844) * 100dvh);
  width: calc((346 / 390) * 100dvw);
  ;
  background-color: white;
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: Regular;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  line-height: clamp(10px, calc((24 / 390) * 100dvw), 48px);
  vertical-align: middle;

  white-space: pre-wrap;

  word-break: break-word;
  color: #6AB23D;
  border: calc((1.5 / 844) * 100dvh) solid #6AB23D;
  border-radius: calc((8/844) * 100dvh);
  margin-top: calc((19 / 844) * 100dvh);
  display: flex;
  align-items: center;
  justify-content: center;
}

.answer_sent {
  background-color: #6AB23D !important;
  color: #fff !important;
}


.send_button {
  position: relative;
  z-index: 9999;
  cursor: pointer;

}
</style>