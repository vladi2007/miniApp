<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  step: number
  mode: string
}>()
const id = computed(() => route.params.id as string)
const emit = defineEmits<{ (e: 'update-step', value: number): void }>()

const router = useRouter()
const route = useRoute()

const form = ref({
  title: '',
  description: '',
  target_audience: '',
  location: '',
  responsible_full_name: '',
  answer_duration: 10,
  discussion_duration: 5,
  countdown_duration: 5,
  questions: [
    {
      text: '',
      position: 1,
      answers: Array(4).fill(null).map(() => ({ text: '', is_correct: false }))
    }
  ]
})

const currentQuestionIndex = ref(0)
const currentQuestion = computed(() => form.value.questions[currentQuestionIndex.value])

type CreateInteractiveResponse = {
  data: {
    interactive_id: number
  }

}
const webApp = ref(null)
const initDataUnsafe = ref(null)
const userId = ref(null)

// Загрузка данных интерактива при edit или dublicate
onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe


    userId.value = initDataUnsafe.value?.user?.id
  }
  if (props.mode === 'edit' || props.mode === 'dublicate') {

    const id = route.params.id as string
    try {
      const data = await $fetch(`/api/get_interactive`, {
        method: 'GET',
        query: {
          telegram_id: userId.value,
          
          id: id
        }
      })
      console.log(data)
      form.value = {
        title: data.title,
        description: data.description,
        target_audience: data.target_audience,
        location: data.location,
        responsible_full_name: data.responsible_full_name,
        answer_duration: data.answer_duration,
        discussion_duration: data.discussion_duration,
        countdown_duration: data.countdown_duration,
        questions: data.questions.map((q: any, index: number) => ({
          text: q.text,
          position: index + 1,
          answers: q.answers.map((a: any) => ({
            text: a.text,
            is_correct: a.is_correct
          }))
        }))
      }

      currentQuestionIndex.value = 0
    } catch (err) {
      console.error('Ошибка загрузки интерактива:', err)
      window.Telegram.WebApp.showAlert('Не удалось загрузить данные интерактива.')
    }
  }
})

function addQuestion() {
  const question = currentQuestion.value

  

  form.value.questions.push({
    text: '',
    position: form.value.questions.length + 1,
    answers: Array(4).fill(null).map(() => ({ text: '', is_correct: false }))
  })
  currentQuestionIndex.value = form.value.questions.length - 1
}

function removeQuestion() {
  if (form.value.questions.length > 1) {
    form.value.questions.splice(currentQuestionIndex.value, 1)
    
    // Обновляем позиции всех вопросов
    form.value.questions.forEach((q, index) => {
      q.position = index + 1
    })

    // Переносим указатель на предыдущий вопрос, если удалили последний
    currentQuestionIndex.value = Math.min(currentQuestionIndex.value, form.value.questions.length - 1)
  }
}

function goToQuestions() {
  const f = form.value
  if (
    f.title &&
    f.description &&
    f.target_audience &&
    f.location &&
    f.responsible_full_name &&
    f.answer_duration > 0 &&
    f.discussion_duration > 0 &&
    f.countdown_duration >= 0
  ) {
    emit('update-step', 2)
    window.scrollTo(0, 0)
  } else {
    window.Telegram.WebApp.showAlert('Пожалуйста, заполните все обязательные поля')
  }
}
defineExpose({
  saveInteractive
})
function markCorrectAnswer(questionIndex: number, answerIndex: number) {
  const answers = form.value.questions[questionIndex].answers
  answers.forEach((ans, idx) => {
    ans.is_correct = idx === answerIndex
  })
}

async function submitInteractive(): Promise<number | null> {
  const f = form.value


  // Проверяем обязательные поля
  if (!f.title) {
    window.Telegram.WebApp.showAlert('Пожалуйста, введите название интерактива.')
    return null
  }
  if (!f.description) {
    window.Telegram.WebApp.showAlert('Пожалуйста, введите описание интерактива.')
    return null
  }
  if (!f.target_audience) {
    window.Telegram.WebApp.showAlert('Пожалуйста, укажите целевую аудиторию.')
    return null
  }
  if (!f.location) {
    window.Telegram.WebApp.showAlert('Пожалуйста, укажите место проведения.')
    return null
  }
  if (!f.responsible_full_name) {
    window.Telegram.WebApp.showAlert('Пожалуйста, укажите ФИО ведущего.')
    return null
  }

  if (f.questions.length === 0) {
    window.Telegram.WebApp.showAlert('Добавьте хотя бы один вопрос.')
    return null
  }

  // Проверяем каждый вопрос
  for (let i = 0; i < f.questions.length; i++) {
    const q = f.questions[i]
    if (!q.text.trim()) {
      window.Telegram.WebApp.showAlert(`Пожалуйста, заполните текст вопроса №${i + 1}.`)
      return null
    }
    if (q.answers.length !== 4) {
      window.Telegram.WebApp.showAlert(`Вопрос №${i + 1} должен содержать ровно 4 ответа.`)
      return null
    }
    for (let j = 0; j < q.answers.length; j++) {
      if (!q.answers[j].text.trim()) {
        window.Telegram.WebApp.showAlert(`Пожалуйста, заполните текст ответа №${j + 1} в вопросе №${i + 1}.`)
        return null
      }
    }
    const hasCorrect = q.answers.some(ans => ans.is_correct)
    if (!hasCorrect) {
      window.Telegram.WebApp.showAlert(`Пожалуйста, выберите правильный ответ в вопросе №${i + 1}.`)
      return null
    }
  }
  if (
    !f.title ||
    !f.description ||
    !f.target_audience ||
    !f.location ||
    !f.responsible_full_name ||
    f.questions.length === 0
  ) {
    window.Telegram.WebApp.showAlert('Пожалуйста, заполните все обязательные поля и добавьте хотя бы один вопрос.')
    return null
  }

  const payload = {
    title: f.title,
    description: f.description,
    target_audience: f.target_audience,
    location: f.location,
    responsible_full_name: f.responsible_full_name,
    answer_duration: f.answer_duration,
    discussion_duration: f.discussion_duration,
    countdown_duration: f.countdown_duration,
    questions: f.questions.map(q => ({
      text: q.text,
      position: q.position,
      answers: q.answers.map(ans => ({
        text: ans.text,
        is_correct: ans.is_correct
      }))
    }))
  }




  try {
    let response: CreateInteractiveResponse

    if (props.mode === 'edit') {
      console.log(userId.value)
      console.log("создание")
      const id = route.params.id as string

      response = await $fetch<CreateInteractiveResponse>(`/api/edit_interatcive`, {
        method: 'PATCH',
        query: {
          telegram_id: userId.value,
          
          id: id
        },
        body: payload
      })
    } else {
      const id = route.params.id as string
      response = await $fetch<CreateInteractiveResponse>(`/api/create_interactive`, {
        method: 'POST',
        query: {
          telegram_id: userId.value,
          
          id: id
        },
        body: payload
      })
    }

    return response.data.interactive_id
  } catch (err) {
    console.error('Ошибка при отправке:', err)
    window.Telegram.WebApp.showAlert('Произошла ошибка при отправке.')
    return null
  }
}

async function saveInteractive(): Promise<boolean> {
  const id = await submitInteractive()
  if (id !== null) {
    return true
  }
  return false
}
async function saveInteractiveButton(){
  const id = await submitInteractive()
  console.log(id)
  if (id !== null) {
    router.push(`/leader/interactives`)
  }
}
async function startInteractive() {
  const id = await submitInteractive()
  console.log(id)
  if (id !== null) {
    router.push(`/leader/${id}`)
  }
}
const showSavePopup = ref(false)
async function confirmSave() {
  showSavePopup.value = false
  await saveInteractive()
}
</script>

<template>
  <div class="general_settings">


    <div class="form-wrapper">

      <!-- Step 1: General Settings -->
      <div v-if="props.step === 1" class="general_settings">


        <div class="form-grid">
          <div class="form-column-first">
            <div class="input-group">
              <label>Название интерактива*<textarea v-model="form.title" maxlength="40"/></label>
              <label>Описание интерактива*<textarea v-model="form.description" id="description_input" maxlength="115"/></label>
            </div>

            <div class="input-group" >
              <label>Место проведения интерактива*<textarea v-model="form.location" maxlength="40"/></label>
            </div>
            <div class="input-group">
              <label>Целевая аудитория участников*<textarea v-model="form.target_audience" maxlength="40" /></label>
            </div>
          </div>

          <div class="form-column-second">
            <div class="input-group">
              <label>ФИО ведущего*<textarea v-model="form.responsible_full_name" maxlength="40"/></label>
            </div>
            <div class="input-group">
              <label>Время ответа (сек.)*<textarea type="number" v-model.number="form.answer_duration" maxlength="2"/></label>
              <label>Время на показ ответа (сек.)*<textarea type="number"
                  v-model.number="form.discussion_duration" maxlength="2"/></label>
              <label>Обратный отсчет перед стартом (сек.)*<textarea type="number"
                  v-model.number="form.countdown_duration" maxlength="2"/></label>
            </div>
            <div class="next-btn" @click="goToQuestions">
              <div class="next-btn-text">Наполнение интерактива</div>
            </div>
          </div>
        </div>


      </div>

      <!-- Step 2: Questions -->
      <div v-else-if="props.step === 2" class="questions_section">

        <!-- Панель навигации по вопросам -->
        <div class="question-nav">
          <div class="question_nav_header">Навигатор по вопросам</div>
          <div class="question-buttons">
            <button class="quest-nav-button" v-for="(q, index) in form.questions" :key="index"
              :class="{ active: index === currentQuestionIndex }" @click="currentQuestionIndex = index">
              {{ index + 1 }}
            </button>
          </div>
          <div class="question-actions">
            <button @click="removeQuestion" :disabled="form.questions.length === 1"
              id="delete_question">Удалить</button>
            <button @click="addQuestion" id="add_question">Добавить</button>

          </div>
        </div>

        <!-- Редактирование вопроса -->
        <div v-if="currentQuestion" class="question-form" id="answers_form">
          <div class="question-header">Вопрос {{ currentQuestion.position }}</div>
          <div class="input-group" id="question-text">
            <label class="question_label">Вопрос*</label>
            <textarea v-model="currentQuestion.text" type="text" id="question_textarea" maxlength="100" />

          </div>

          <div class="input-group" id="answers">
            <label class="question_label" id="answers-text">Ответы*</label>
            <div v-for="(answer, index) in currentQuestion.answers" :key="index" class="answer-item">
              <label class="answer-wrapper">
                <input type="radio" :name="'correct-answer-' + currentQuestionIndex" :checked="answer.is_correct"
                  @change="markCorrectAnswer(currentQuestionIndex, index)" />
                <input v-model="answer.text" type="text" class="answer-input" placeholder="Поле для ввода ответа" maxlength="50"/>
              </label>
            </div>

          </div>
          <!-- Кнопки "Сохранить" и "Запуск" -->
          <div class="question-controls">
            <button class="start-button" @click="startInteractive()">Запуск</button>
            <button class="save-button" @click="showSavePopup = true">Сохранить</button>

          </div>

        </div>


      </div>
    </div>
    <div v-if="showSavePopup" class="settings_popup-overlay">
    <div class="settings_popup-content">
      <div class="settings_popup-text">Сохранить интерактив и перейти к списку всех интерактивов?</div>
      <div class="settings_popup-buttons">
        <button class="settings_popup-btn confirm" @click="saveInteractiveButton()">Да</button>
        <button class="settings_popup-btn cancel" @click="showSavePopup = false">Нет</button>
      </div>
    </div>
  </div>
  </div>
</template>


<style>
.settings_popup-overlay {  font-family: 'Lato', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings_popup-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  width: 400px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}

.settings_popup-text {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 30px;

}

.settings_popup-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.settings_popup-btn {
  width: 120px;
  height: 45px;
  font-size: 20px;
  font-family: 'Lato', sans-serif;
  border-radius: 8px;
  cursor: pointer;
}

.settings_popup-btn.confirm {
  background-color: #6AB23D;
  border: 2px solid #6AB23D;
  color: white;
}
.settings_popup-btn.confirm:hover {
  background-color: #9AC57E; border: 2px solid  #9AC57E;
}

.settings_popup-btn.cancel {
  background-color: #F0436C;
  border: 2px solid #F0436C;
  color: white;
}
.settings_popup-btn.cancel:hover {
  background-color: #DE7D94; border: 2px solid  #DE7D94;
}
textarea {white-space: pre-wrap;      /* сохраняет переводы строк и переносит при необходимости */
  word-break: break-word; 
  resize: none;
}
.quest-nav-button {font-size: 24px;;
  cursor: pointer;font-family: 'Lato', sans-serif; font-weight: 400; vertical-align: middle;
}
.quest-nav-button:hover{ color: white;
  background-color: #AA77FF;
}
.quest-nav-button.active { color: white;
  background-color: #853CFF;

  border-color: #853CFF;
}
#question_textarea {
  height: 100px;
  ;
  border-radius: 18px;
  ;
}

.answer-wrapper {
  display: flex;
  align-items: center;
  position: relative;

}

.answer-wrapper input[type="radio"] {
  position: absolute;
  left: 23px;
  height: 38px;
  width: 38px;
  z-index: 2;
  top: 38px;

  border-radius: 50%;
  /* чтобы было круглое */

  /* Добавим фиолетовую рамку */
  border: 4px solid #853CFF;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: white;
  cursor: pointer;
  outline: none;
}

/* Для того чтобы радио выглядело как радио с рамкой и менялось при выборе */
.answer-wrapper input[type="radio"]:hover{
  background-color: #AA77FF;
}
.answer-wrapper input[type="radio"]:checked {
  background-color: #853CFF;
  box-shadow: 0 0 0 3px #853CFF inset;
}

/* Чтобы показать точку внутри при выборе */
.answer-wrapper input[type="radio"]:checked::before {
  content: "";
  display: block;
  width: 14px;
  height: 14px;
  margin: 11px auto;
  border-radius: 50%;
  background-color: #853CFF;
  /* точка внутри тоже фиолетовая */
}

.answer-input {
  padding-left: 78px;
  /* пространство под radio */
  height: 75px;
  width: 100%;
  border: 4px solid white;
  border-radius: 18px;
  font-size: 24px;
}

.answer-input::placeholder {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;

  letter-spacing: 1px;


}

* {
  padding: 0;
  ;
  margin: 0;
  ;
}

#answers {
  margin-top: 30px;
  height: 476px;
  ;
}

.question-header {
  height: 26px;
  ;
  margin-left: 46px;
  ;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;
  letter-spacing: 1px;
  ;
}

#question-text {
  margin-top: 35px;
  ;
}


.question_nav_header {
  

  margin: 0 auto;
  margin-top: 48px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;
  letter-spacing: 1px;
  ;
}

.questions_section {
  display: grid;
  grid-template-columns: 350px 911px;
  ;
  gap: 48px;
  ;
}

.question-nav {
  margin-top: 99px;
  display: flex;
  flex-direction: column;
  height: 446px;

  border-radius: 30px;
  border: 3px solid #853CFF;

}

.question-actions {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.question-buttons {
  margin: 0 auto;
  overflow-y: auto;
  width: 290px;
  ;
  margin-top: 39px;
  max-height: 225px;
  ;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  /* если нужно переносить строки */
  gap: 12px;

}

.question-actions>button {
  cursor: pointer;
}

.question-buttons>button {
  cursor: pointer;
  height: 65px;
  width: 65px;
  ;
  background-color: white;
  border-radius: 15px;
  ;
  border: 3px solid #853CFF;
}

#add_question {
  color: white;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 1px;
  vertical-align: middle;
  width: 130px;
  height: 40px;
  border-radius: 5px;
  background-color: #6AB23D;
  border: 1px solid #6AB23D;
}
#add_question:hover{
  background-color: #9AC57E; border: 1px solid #9AC57E;
}
#delete_question {
  color: white;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 1px;
  vertical-align: middle;
  width: 130px;
  height: 40px;
  border: 1px solid #F0436CF0;
  border-radius: 5px;
  background-color: #F0436CF0;
  margin-bottom: 15px;
}
#delete_question:hover{
  background-color: #DE7D94;border: 1px solid #DE7D94;
} 
.question-form {
  margin-top: 38px;
  width: 911px;
  height: 753px;
  ;

}


.general_settings {
  width: 1360px;
  height: 738px;

  margin: 0 auto;


  font-family: 'Lato', sans-serif;

}

.form-wrapper {
  display: grid;


}

.form-grid {
  padding-top: 68px;
  display: grid;
  grid-template-columns: 659px 665px;

  gap: 36px;

}

.form-grid>div {
  display: flex;
  flex-direction: column;
  gap: 30px;
  ;
}

.form-column-first {
  height: 738px;
  ;

}

.form-column-second {
  height: 606px;
  ;

}

.input-group {
  background-color: #853CFF;
  display: flex;
  flex-direction: column;
  padding-left: 23px;

  padding-right: 25px;
  ;
  padding-bottom: 20px;
  ;
  border-radius: 26px;
  ;
}

.input-group label {
  display: flex;
  flex-direction: column;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;
  color: white;
  letter-spacing: 1px;
  ;
}

.input-group textarea {
  margin-top: 20px;
  height: 72px;
  ;

  border-radius: 18px;
  ;
  border: 4px solid white;
  ;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  ;
  letter-spacing: 1px;
  ;

}

.input-group label+label {
  margin-top: 14px;
}

#description_input {
  height: 163px;
  ;
}

.input-group label:first-of-type {
  padding-top: 20px;
}

.next-btn {
  cursor: pointer;
  margin-left: 284px;
  ;
  width: 348px;
  ;
  padding: 25px 50px 25px 50px;
  ;
  border-radius: 5px;
  background-color: #6AB23D;
  ;

  color: white;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 1px;
  ;
}
.next-btn:hover{
  background-color: #9AC57E;

} 
.next-btn-text {
  text-align: center;
  height: 57px;
  ;
}

.question_label {
  margin-left: 22px;
}

.question_label textarea {
  margin-right: 22px;
  ;
  /* сбрасываем возможное влияние */

}

.answer-item {
  margin-bottom: 9px;
  ;
}

.question-controls {
  width: 739px;
  ;
  margin-left: auto;
  margin-top: 62px;
  margin-bottom: 179px;;
}

.start-button {
  cursor: pointer;
  width: 352px;
  height: 62px;
  ;
  background-color: #F0436C;
  border: 1px solid #F0436C;
  ;
  border-radius: 5px;
  ;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 1px;
  color: white;
  ;
}
.start-button:hover{
  background-color: #DE7D94;border: 1px solid  #DE7D94;
}
.save-button {
  cursor: pointer;
  width: 351px;
  height: 62px;
  ;
  background-color: #6AB23D;
  border: 1px solid #6AB23D;
  border-radius: 5px;
  ;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 1px;
  color: white;
  ;
  margin-left: 36px;
  ;
}
.save-button:hover{
  background-color:#9AC57E;border: 1px solid  #9AC57E;
}
</style>
