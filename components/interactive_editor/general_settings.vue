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
async function saveInteractiveButton() {
  const id = await submitInteractive()
 
  if (id !== null) {
    router.push(`/leader/interactives`)
  }
}
async function startInteractive() {
  const id = await submitInteractive()
 
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
              <label>Название интерактива*<textarea v-model="form.title" maxlength="40" /></label>
              <label>Описание интерактива*<textarea v-model="form.description" id="description_input"
                  maxlength="115" /></label>
            </div>

            <div class="input-group">
              <label>Место проведения интерактива*<textarea v-model="form.location" maxlength="40" /></label>
            </div>
            <div class="input-group">
              <label>Целевая аудитория участников*<textarea v-model="form.target_audience" maxlength="40" /></label>
            </div>
          </div>

          <div class="form-column-second">
            <div class="input-group">
              <label>ФИО ведущего*<textarea v-model="form.responsible_full_name" maxlength="40" /></label>
            </div>
            <div class="input-group">
              <label>Время ответа (сек.)*<textarea type="number" v-model.number="form.answer_duration"
                  maxlength="2" /></label>
              <label>Время на показ ответа (сек.)*<textarea type="number" v-model.number="form.discussion_duration"
                  maxlength="2" /></label>
              <label>Обратный отсчет перед стартом (сек.)*<textarea type="number"
                  v-model.number="form.countdown_duration" maxlength="2" /></label>
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
                <input v-model="answer.text" type="text" class="answer-input" placeholder="Поле для ввода ответа"
                  maxlength="50" />
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
@import url("~/assets/css/interactive_editor/general_settings.scss");
</style>
