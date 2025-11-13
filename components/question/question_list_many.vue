<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { saveToLocaleStorage, loadFromLocalStorage, clearLocalStorage } from '~/utils/deviceStorage'




const props = defineProps<{
  questions_count: string
  question: {
    id: string
    text: string
    position: string
    type: string
    question_weight: string
    image: string
  }
  answers: any
  percentages: any
  id_correct_answer: string | string[] // может быть массив правильных
  timer: string
  stage: string
  context: string
  onAnswer: (answerId: number | number[] | string) => void
}>()

// несколько выбранных ответов
const selectedAnswers = ref<Number[]>([])
const route = useRoute()
const STORAGE_KEY_PREFIX = 'interactive_selected_answers_'
const storageKey = computed(() => STORAGE_KEY_PREFIX + props.question.id)
const ANSWERS_STORAGE_KEY_PREFIX = 'interactive_answers_'
const answersStorageKey = computed(() => ANSWERS_STORAGE_KEY_PREFIX + props.question.id)
const ANSWERED_KEY_PREFIX = 'isAnsweredMany_'
const isAnsweredKey = computed(() => ANSWERED_KEY_PREFIX + props.question.id)
const interactiveId = route.params.id as string
const ANSWERS_STORAGE_KEY = computed(() => `interactive_answers_${interactiveId}_${props.question.id}`)
const answers = ref(props.answers)
const showBanner = ref(false)
const isButtonDisabled = ref(true)
const isAnswerSent = ref(false)

const isDiscussion = computed(() => props.stage === 'discussion')

// загрузка данных
onMounted(() => {
  const saved = loadFromLocalStorage(storageKey.value)
  const savedState = loadFromLocalStorage(isAnsweredKey.value)

  if (Array.isArray(saved)) {
    selectedAnswers.value = saved
    if (saved.length > 0) {
      showBanner.value = true
      isButtonDisabled.value = false
    }
  }

  isAnswerSent.value = savedState === true
})


// выбор/отмена ответа
function toggleAnswer(answerId: string) {
  if (isAnswerSent.value || isDiscussion.value ||  String(props.timer)===String(0)) return

  const index = selectedAnswers.value.indexOf(Number(answerId))

  if (index > -1) {
    // снять выбор
    selectedAnswers.value.splice(index, 1)
  } else {
    // добавить выбор
    selectedAnswers.value.push(Number(answerId))
  }

  showBanner.value = selectedAnswers.value.length > 0
  isButtonDisabled.value = selectedAnswers.value?.length === 0

  saveToLocaleStorage(storageKey.value, selectedAnswers.value)
  saveToLocaleStorage(answersStorageKey.value, answers.value)
}

// отправка ответа
function sendAnswer() {
  if (selectedAnswers.value?.length === 0  || isAnswerSent.value ) return
  const answer_ids = selectedAnswers.value.map(String)
  props.onAnswer((JSON.stringify({ answer_ids: answer_ids })))
  isButtonDisabled.value = true
  isAnswerSent.value = true
  saveToLocaleStorage(isAnsweredKey.value, true)
}

// проценты для результатов
const getPercentage = (id: string) => {
  return props.percentages.find((p) => p.id === id)?.percentage ?? 0
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
      selectedAnswers.value = []
      isAnswerSent.value = false
      isButtonDisabled.value = false
      clearLocalStorage(storageKey.value)
      clearLocalStorage(isAnsweredKey.value)
    }
  }
)
// тип вопроса
const type = computed(() => {
  return `Выберите несколько ответов`
})

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

const isAllCorrect = computed(() => {
  // Преобразуем оба массива в строки для сравнения множеств
  const correct = Array.isArray(props.id_correct_answer)
    ? props.id_correct_answer.map(String).sort()
    : [String(props.id_correct_answer)].sort()

  const selected = selectedAnswers.value.map(String).sort()

  // Совпадает ли состав
  return (
    correct.length === selected.length &&
    correct.every((id, i) => id === selected[i])
  )
})

watch(
  () => props.stage,
  async (newStage, oldStage) => {
    // Когда время вопроса истекает и переходим в обсуждение
    if (oldStage === "question" && newStage === "discussion") {
      // Если пользователь выбрал ответ, но не отправил — отправляем автоматически
      if (selectedAnswers.value !== null && !isAnswerSent.value) {
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
      <div class="question_question-num-text">
        Вопрос {{ props.question.position }}
        <span style="color: #A9A9A9;">/{{ props.questions_count }}</span>
      </div>
    </div>

    <div class="question_title">{{ props.question.text }}</div>
    <div class="question_type">{{ type }}</div>
    <div class="question_weight">баллов за вопрос: {{ props.question.question_weight }}</div>

    <img class="question_image" :src="props.question.image" v-if="props.question.image !== ''" />

    <div class="question_list">
      <div v-for="answer in answers" :key="answer.id" class="question_answer" :class="{
        selected: selectedAnswers.includes(Number(answer.id)) && !isDiscussion,
        correct: isAnswerSent && isDiscussion && selectedAnswers.includes(Number(answer.id)) &&
          String(props.id_correct_answer).includes(String(answer.id)),
        incorrect: isAnswerSent && isDiscussion && selectedAnswers.includes(Number(answer.id)) &&
          !String(props.id_correct_answer).includes(String(answer.id)),
        correctOutline: isDiscussion && !selectedAnswers.includes(Number(answer.id)) &&   String(props.id_correct_answer).includes(String(answer.id)),
        wrongOutline: isDiscussion && !selectedAnswers.includes(Number(answer.id)) &&   !String(props.id_correct_answer).includes(String(answer.id))
      }" @click="toggleAnswer(String(answer.id))">
        <span class="question_text">{{ answer.text }}</span>

        <span v-if="isDiscussion" class="question_percent" :class="{ white: selectedAnswers.includes(answer.id) }">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>
    </div>
    <div class="question_actions" v-if="!isDiscussion && showBanner">
      <button class="send_button" :disabled="isButtonDisabled" :class="{ answer_sent: isAnswerSent }"
        @click="sendAnswer">
        {{ isAnswerSent ? 'Ответ отправлен' : 'Отправить ответ' }}
      </button>
    </div>
    <div v-if="isDiscussion && isAllCorrect"
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

.question_actions>button {
  height: calc((45 / 844) * 100dvh);
  width: calc((346 / 390) * 100dvw);
  ;

  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: Regular;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  line-height: clamp(10px, calc((24 / 390) * 100dvw), 48px);
  vertical-align: middle;

  white-space: pre-wrap;
background-color: white;
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
