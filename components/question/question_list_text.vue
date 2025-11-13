<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
  data_answers: any
  id_correct_answer: string
  timer: string
  stage: string
  onAnswer: (answerId: number | number[] | string | null) => void
}>()

// поля состояния
const userAnswer = ref('')
const showBanner = ref(false)
const isButtonDisabled = ref(true)
const isAnswerSent = ref(false)

const STORAGE_KEY_PREFIX = 'interactive_text_answer_'
const ANSWERED_KEY_PREFIX = 'isAnsweredText_'

const storageKey = computed(() => STORAGE_KEY_PREFIX + props.question.id)
const isAnsweredKey = computed(() => ANSWERED_KEY_PREFIX + props.question.id)

// проверка фазы
const isDiscussion = computed(() => props.stage === 'discussion')

// загрузка сохранённого состояния
onMounted(() => {
  const saved = loadFromLocalStorage(storageKey.value)
  const savedState = loadFromLocalStorage(isAnsweredKey.value)

  if (typeof saved === 'string' && saved.length > 0) {
    userAnswer.value = saved
    showBanner.value = true
    isButtonDisabled.value = false
  }

  isAnswerSent.value = savedState === true
})

// отслеживаем изменение текста
watch(userAnswer, (val) => {
  if (  String(props.timer)===String(0)){

  }
  else{

  
  showBanner.value = val.trim().length > 0
  isButtonDisabled.value = val.trim().length === 0
  saveToLocaleStorage(storageKey.value, val)
  }
})

// отправка
function sendAnswer() {
  if (!userAnswer.value.trim() || isAnswerSent.value) return

  props.onAnswer(JSON.stringify({ answer_text: userAnswer.value.trim() }))
  isButtonDisabled.value = true
  isAnswerSent.value = true
  saveToLocaleStorage(isAnsweredKey.value, true)
}

const currStage = ref(props.stage)
const prevStage = ref(props.stage)
watch(
  () => props.stage,
  (newVal, oldVal) => {
    prevStage.value = oldVal
    currStage.value = newVal
    if (oldVal === "discussion" && newVal === "question") {
      isAnswerSent.value = false
      isButtonDisabled.value = false
      userAnswer.value = ""
      clearLocalStorage(storageKey.value)
      clearLocalStorage(isAnsweredKey.value)
    }
  }
)
// // Отправка ответа
// function sendAnswer(answer) {

//   // Если ответ — число
//   if (typeof answer === 'Number') {
//     send(JSON.stringify({ answer_id: String(answer) }))
//   }
//   // Если ответ — массив чисел
//   else if (Array.isArray(answer) && answer.every(a => typeof a === 'Number')) {
//     const answer_ids = answer.map(String)
//     send(JSON.stringify({ answer_ids }))
//   }
//   // Всё остальное — считаем текстом
//   else {
//     send(JSON.stringify({ answer_text: answer }))
//   }
// }
// тип вопроса
const type = computed(() => `Введите свой ответ в поле для ввода`)

watch(
  () => props.stage,
  async (newStage, oldStage) => {
    // Когда время вопроса истекает и переходим в обсуждение
    if (oldStage === "question" && newStage === "discussion") {
      // Если пользователь выбрал ответ, но не отправил — отправляем автоматически
      if (userAnswer.value !== null && !isAnswerSent.value) {
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

    <div class="question_input-container">
      <textarea v-model="userAnswer" class="question_input" placeholder="Введите текст"
        :class="{ text_correct: isDiscussion && props.data_answers.is_correct,text_not_correct:isDiscussion && !props.data_answers.is_correct }"
        :disabled="isAnswerSent || isDiscussion">asdasd123123</textarea>
      <span v-if="isDiscussion && props.data_answers.percentage !== undefined" class="textarea-percentage">
        {{ props.data_answers.percentage }}%
      </span>
    </div>
    <div class="question_actions" v-if="!isDiscussion && showBanner">
      <button class="send_button" :disabled="isButtonDisabled" :class="{ answer_sent: isAnswerSent }"
        @click="sendAnswer">
        {{ isAnswerSent ? 'Ответ отправлен' : 'Отправить ответ' }}
      </button>
    </div>
    <div v-if="isDiscussion && props.data_answers.is_correct" :class="['question_accepted-banner', 'success']">
      <img src="/public/images/question/Group_1.svg" style="height: calc((20 / 844) * var(--app-height)); 
  width: calc((15 / 390) * 100dvw);; " />
      <div style=" margin-left: calc((2 / 390) * 100dvw);; ">Правильный ответ</div>
    </div>
    <div v-if="isDiscussion && !props.data_answers.is_correct" class="no_correct_text">
      <div class="no_correct_text_header">Правильные ответы</div>
      <div v-for="correct in props.data_answers?.answers" class="no_correct_list">
        <div class="no_correct_item">
        {{ correct.text }}<span
         >{{ correct.percentage
          }}%</span></div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-height: 100vh;
}

.question_type {
  margin-top: calc((5 / 844) * var(--app-height));
}

.question_weight {
  margin-top: calc((2 / 844) * var(--app-height));
}

.question_type,
.question_weight {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: 120%;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  color: #A9A9A9;
}

.question_input-container {
  margin-top: calc((15 / 844) * var(--app-height));
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.question_input-container::placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

.question_input {
  border: none !important;
  background-color: #F7F7F7;
  width: calc((346 / 390) * 100dvw);
  height: calc((45 / 844) * var(--app-height));
  border-radius: calc((8 / 844) * var(--app-height));
  padding: calc((10 / 844) * var(--app-height));
  font-family: "Lato", sans-serif;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  resize: none;
  outline: none;
  color: #1D1D1D;
  border: calc((1.5 / 844) * var(--app-height)) solid #F7F7F7 !important;
}


.question_actions>button {
  height: calc((45 / 844) * var(--app-height));
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

  word-break: break-word;
  color: #6AB23D;
  border: calc((1.5 / 844) * var(--app-height)) solid #6AB23D;
  border-radius: calc((8/844) * var(--app-height));
  margin-top: calc((19 / 844) * var(--app-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
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

.text_correct {
  border: calc((1.5 / 844) * var(--app-height)) solid #6AB23D !important;
}
.text_not_correct {
  border: calc((1.5 / 844) * var(--app-height)) solid #F0436C !important;
}
.textarea-percentage {
  position: absolute;
  right: calc((10 / 390) * 100dvw);

  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  pointer-events: none;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  line-height: clamp(10px, calc((24 / 390) * 100dvw), 48px);
}

.no_correct_text_header {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: Regular;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  color: #A9A9A9;
  margin-top: calc((20 / 844) * var(--app-height));
  ;
 margin-bottom: calc((10 / 844) * var(--app-height));
  ;
}
/* Первый элемент списка — чуть больше сверху */

.no_correct_list{   
  border: none !important;
  background-color: #C6E2B5;
  width: calc((346 / 390) * 100dvw);
  height: calc((45 / 844) * var(--app-height));
  border-radius: calc((8 / 844) * var(--app-height));
  padding: calc((10 / 844) * var(--app-height));
  font-family: "Lato", sans-serif;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  resize: none;
  outline: none;
  color: #1D1D1D;
  border: calc((1.5 / 844) * var(--app-height)) solid #6AB23D61 !important;
   margin-bottom: calc((19 / 844) * var(--app-height));
   display: flex;
  align-items: center;
}
.no_correct_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.no_correct_list:first-child {
  margin-top: calc((120 / 844) * var(--app-height)) ;
}
</style>
