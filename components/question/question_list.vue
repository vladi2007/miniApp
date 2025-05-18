<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  
  timer: string  // Используем тип WaitingData
  question: {
    id: string
    text: string
    position: string
  }
  answers:{
    id: string
    text: string
  }[]
  idCorrectAnswer: string
  percentages:{
    id: string
    percentage: number
  }[]
}>()
console.log(props)
</script>

<template>
  <div class="question_question-list">
    <!-- Вопрос -->
    <div class="question_number">
      <img src="/images/question/Star_3.svg" class="question_icon" />
      <p class="question_question-num-text">123123</p>
    </div>

    <p class="question_title">123123321</p>

    <!-- Список ответов -->
    <div class="question_list">
      <div>
        <span class="question_text">123231</span>
        <span>
          хуй
        </span>
      </div>
    </div>

    <!-- Плашка -->
    <!-- <div
      v-if="showBanner"
      :class="['question_accepted-banner', isCorrect ? 'success' : 'default']"
    >
      <img v-if="isCorrect" src="/images/question/Group_1.svg" class="question_check-icon" alt="Check Icon" />
      {{ isCorrect ? 'Правильный ответ' : 'Ответ принят!' }}
    </div> -->
  </div>
</template>

<style scoped>

</style>
