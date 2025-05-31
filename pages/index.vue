<script setup>
window.Telegram.WebApp.expand()
import history from '~/components/history/history.vue'
onMounted(() => {
  if (window.Telegram?.WebApp?.expand) {
    //Expands the app on the users' phone to 100% height
  }
})
let tg = window.Telegram.WebApp;
tg.expand()
</script>

<template>
    <history/>
</template>

<style >
html, body, #__nuxt {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  
  
}



</style>
<!-- <script setup>

import { ref, onMounted } from 'vue'

import main_menu from '~/components/main_menu/main_menu.vue'

const webApp = ref(null)
const initDataUnsafe = ref(null)
const my_interactives = ref(null)

const isLoading = ref(true) // <- новый флаг

const isReady = ref(false)
const role = ref(null)

onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe

    const userId = initDataUnsafe.value?.user?.id

    if (userId) {
      const { data, error } = await useFetch('/api/role', {
        query: {
          telegram_id: "2",
        },
      })
      console.log("УРА")
      if (!error.value && data.value?.role) {
        role.value = data.value.role
        console.log("УРА")
      } else {
        console.error("Ошибка запроса или пустой ответ", error.value)
      }
    }

    isReady.value = true
  }
})
console.log(role.value)
</script>

<template>

  <div v-if="isReady">
    <main_menu v-if="role === 'leader'" />
    
    <div v-else class="you_are_not_leader">
      <div>У вас нет прав ведущего!</div>
    </div>
  </div>
</template>

<style >
.you_are_not_leader {

  
  display: flex;                /* Используем Flexbox */
  justify-content: center;     /* Центр по горизонтали */
  align-items: center;         /* Центр по вертикали */
  text-align: center;          /* Центрируем текст внутри блока */
  font-family: 'Lato', sans-serif;
  font-size: 64px;
  font-weight: 500;
}
</style> -->
<!-- <script setup lang="ts">
import { ref } from 'vue'

const step = ref(1) // 1 — General settings, 2 — Questions

const form = ref({
  title: '',
  description: '',
  target_audience: '',
  location: '',
  responsible_full_name: '',
  answer_duration: 60,
  discussion_duration: 20,
  countdown_duration: 10,
  questions: [
    {
      text: '',
      position: 0,
      answers: [
        {
          text: '',
          is_answered: false
        }
      ]
    }
  ]
})
const currentQuestionIndex = ref(0)

const currentQuestion = computed(() => form.value.questions[currentQuestionIndex.value])

function addQuestion() {
  form.value.questions.push({
    text: '',
    position: form.value.questions.length,
    answers: [
      { text: '', is_answered: false }
    ]
  })
  currentQuestionIndex.value = form.value.questions.length - 1
}

function removeQuestion() {
  if (form.value.questions.length > 1) {
    form.value.questions.splice(currentQuestionIndex.value, 1)
    // Перейти к предыдущему вопросу или нулевому
    currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1)
  }
}
function goToQuestions() {
  // простая проверка: все поля general_settings заполнены
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
    step.value = 2
  } else {
    alert('Пожалуйста, заполните все обязательные поля')
  }
}
</script>

<template>
  <div class="form-wrapper">

   
    <div v-if="step === 1" class="general_settings">
      <h1>Общие настройки интерактива</h1>

      <div class="form-grid">
        <div class="form-column">
          <label>Название интерактива*<input v-model="form.title" /></label>
          <label>ФИО ведущего*<input v-model="form.responsible_full_name" /></label>
          <label>Описание интерактива*<textarea v-model="form.description" /></label>
          <label>Место проведения интерактива*<input v-model="form.location" /></label>
        </div>

        <div class="form-column">
          <label>Целевая аудитория участников*<input v-model="form.target_audience" /></label>
          <label>Время ответа (сек.)*<input type="number" v-model.number="form.answer_duration" /></label>
          <label>Время на показ ответа (сек.)*<input type="number" v-model.number="form.discussion_duration" /></label>
          <label>Обратный отсчет перед стартом (сек.)*<input type="number"
              v-model.number="form.countdown_duration" /></label>
        </div>
      </div>

      <button class="next-btn" @click="goToQuestions">Перейти к вопросам</button>
    </div>

  
    <div v-else-if="step === 2" class="questions_section">
      <h1>Создание вопросов</h1>


      <div class="question-nav">
        <div class="question-buttons">
          <button v-for="(q, index) in form.questions" :key="index" :class="{ active: index === currentQuestionIndex }"
            @click="currentQuestionIndex = index">
            Вопрос {{ index + 1 }}
          </button>
        </div>
        <div class="question-actions">
          <button @click="addQuestion">Добавить вопрос</button>
          <button @click="removeQuestion" :disabled="form.questions.length === 1">Удалить вопрос</button>
        </div>
      </div>


      <div v-if="currentQuestion" class="question-form">
        <label>Текст вопроса
          <input v-model="currentQuestion.text" type="text" />
        </label>

        <label>Позиция вопроса
          <input v-model.number="currentQuestion.position" type="number" />
        </label>

        <h3>Ответы</h3>
        <div v-for="(answer, index) in currentQuestion.answers" :key="index">
          <label>Ответ {{ index + 1 }}
            <input v-model="answer.text" type="text" />
          </label>
          <label>
            <input type="checkbox" v-model="answer.is_answered" />
            Правильный
          </label>
        </div>
      </div>

    
      <button class="back-button" @click="step = 1">
        Вернуться к главным настройкам
      </button>
    </div>
  </div>
</template>

<style scoped>
.back-button {
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #5a6268;
}

.form-wrapper {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  font-family: 'Lato', sans-serif;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 600;
}

input,
textarea {
  margin-top: 8px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.next-btn {
  margin-top: 30px;
  padding: 12px 24px;
  background-color: #853CFF;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.next-btn:hover {
  background-color: #6b2de0;
}

.question-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.question-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.question-buttons button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 4px;
  cursor: pointer;
}

.question-buttons button.active {
  background-color: #853CFF;
  color: white;
  font-weight: bold;
}

.question-actions button {
  margin-left: 10px;
  background-color: #28a745;
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.question-actions button:last-child {
  background-color: #dc3545;
}

.question-actions button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> -->
