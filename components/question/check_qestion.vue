<script setup lang="ts">
// Путь может отличаться в зависимости от структуры проекта
import timer from '~/components/question/timer.vue';
import question_list from '~/components/question/question_list.vue';
import { defineProps } from 'vue'
import type { QuestionData } from '~/types/stageData'

// Данные от бекенда
const props = defineProps<{
  timer: string,
  questions_count: string,
  question: string,
  answers: {
    answer: string
  }[],
  score: string,
  currentIndex: string,
  type: string,
}>()
const type_text = computed(() => {
  if (props.type === 'one')
    return 'Один правильный ответ'
  else if (props.type === 'many')
    return 'Несколько правильных ответов'
  else
    return 'Введите правильный ответ'

}
)
console.log('type:', props.type);

watch(type_text, (newWalue) => {
  type_text
})
</script>

<template>
  <div class="check_question">

    <div class="check_question_timer">
      <div class="check_question_logo">
        <img src="/public/images/interactive_editor/logo.svg" />

      </div>

      <div class="check_question_timer-text">Время на ответ: {{ props.timer }}</div>

      <div class="check_question_green-line"></div>





    </div>
    <div class="check_question_question-list">
      <div class="check_question_number">
        <div class="check_question_question-num-text">
          Вопрос {{ props.currentIndex + 1 }}<span style="color:#A9A9A9">/{{ props.questions_count }}</span>
        </div>
        <img src="/images/question/Star_3.svg" class="check_question_icon" />
      </div>

      <div class="check_question_title">{{ props.question ? props.question : 'Вопрос*' }} </div>
      <div class="check_question_title_score">{{ type_text }}<br />Балл: {{ props.score }} </div>
      <div class="check_question_list">
        <div v-for="answer in answers" class="check_question_answer">
          <span class="check_question_text">{{ answer.text ? answer.text : 'Поле для ввода' }}</span>
        </div>
      </div>




    </div>

  </div>
</template>

<style scoped>
@import url("/assets/css/question/check_question.scss");
</style>
