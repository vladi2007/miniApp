<script setup>
import { ref, watch } from 'vue'
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

// Инициализация данных
// const timerData = ref({
//   stage: "waiting",
//   data: {
//     title: "Тестовое мероприятие",
//     description: "Это описание тестового мероприятия, которое проводится в рамках демонстрации.",
//     code: "XYZ123",
//     participants_active: "15"
//   }
// })


// const timerData = ref({
//   stage: "countdown",
//   data: {
//     timer:"15"
//   }
// })


// const timerData = ref({
//   stage: "end",
//   data: {
//     title: "Итоги мероприятия",
//     participants_total: "25",
//     winners: [
//     {
//       position: "1",
//       username: "User_One"
//     },
//     {
//       position: "2",
//       username: "User_Two"
//     },
//      {
//       position: "3",
//       username: "User_Three"
//     }
//   ]
//   }
  
// }
// )



const timerData = ref({
  stage: "question",
  data: {
    timer: "30", 
    title: "Какой язык программирования используется для создания Vue?",
    code: "ABC123",
    question: {
      id: "1",
      text: "Какой язык программирования используется для создания Vue?",
      position: "1"
    },
    answers: [
      {
        id: "1",
        text: "JavaScript"
      },
      {
        id: "2",
        text: "Python"
      },
      {
        id: "3",
        text: "Java"
      },
      {
        id: "4",
        text: "C++"
      }
    ]
  }
}
)

// Активный ключ компонента
const currentComponentKey = ref("waiting")

// // Используем WebSocket (вам нужно подключить библиотеку или определить функцию useWebSocket)
// const { status, data, send, open, close } = useWebSocket("wss://voshod07.ru/ws")

// // Отслеживаем приходящие данные
// watch(data, (newValue) => {
//   const dict = JSON.parse(newValue) // Парсим данные от сервера
//   timerData.value = dict // Обновляем данные для компонента
//   currentComponentKey.value = dict.stage // Устанавливаем новый активный компонент
// })
</script>

<template>
  <div>
    <!-- Динамически рендерим компонент в зависимости от значения currentComponentKey -->
    <component :is="componentMap[timerData.stage]" :data="timerData.data" :stage="timerData.stage" />
  </div>
</template>