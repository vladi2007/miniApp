<script setup>
import { ref, onMounted } from 'vue'

// Импортируем компоненты
import Waiting from '~/components/waiting/waiting.vue'
import Countdown from '~/components/countdown/countdown.vue'
import Question from '~/components/question/question.vue'
import InteractiveEnd from '~/components/interactive_end/interactive_end.vue'

// Словарь компонентов по имени
const componentMap = {
  "waiting": Waiting,
  "countdown": Countdown,
  "question": Question,
  "discussion": Question,
  "end": InteractiveEnd
}

// Упорядоченный список ключей компонентов для переключения
const componentOrder = ["waiting", "countdown", "question", "discussion", "end"]

// Активный ключ компонента
const currentComponentKey = ref(componentOrder[0])

// Данные из WebSocket
const timerData = ref("300") // Пример с таймером

// Функция для имитации получения данных из WebSocket (тестовые данные)
const getTestDataFromWebSocket = () => {
  // Пример полученных данных для компонента
  const data = {
    stage: "question", // Это будет передано в компонент как stage
    data: {
      timer: "150", // Время для компонента countdown
    }
  }
  
  // Обновляем данные
  timerData.value = data.data.timer
}

// Симуляция получения данных из WebSocket при монтировании
onMounted(() => {
  getTestDataFromWebSocket() // Инициализация данных

  // Циклическое переключение компонентов каждые 5 секунд
  let index = 0
  setInterval(() => {
    index = (index + 1) % componentOrder.length
    currentComponentKey.value = componentOrder[index]
  }, 5000)
})
</script>

<template>
  <!-- Отображение текущего компонента и передача данных через props -->
  <component 
    :is="componentMap[currentComponentKey]" 
    :data="timerData" 
    :stage="currentComponentKey"
  />
</template>

<style>
/* Добавь стили по необходимости */
</style>
