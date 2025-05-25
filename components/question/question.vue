<script setup lang="ts">
// Путь может отличаться в зависимости от структуры проекта
import timer from '~/components/question/timer.vue';
import question_list from '~/components/question/question_list.vue';
import { defineProps } from 'vue'
import type { QuestionData } from '~/types/stageData'


const props = defineProps<{
  stage: string
  data: QuestionData 
  context:string
  onAnswer: (answerId: string) => void
  onStatus: (status: string) => void  // Используем тип WaitingData
}>()

</script>

<template>
  <div class='question'>
    <img src="/images/question/Star_2.svg" id="question_star_2" />
    <img src="/images/question/Vector_89.svg" id="question_vector_2" />

    <!-- Компонент Timer -->
    <timer :timer="data.timer" :stage="stage" :timer_duration="data.timer_duration" :context="context" :question_num="data.question.position" :question_count="data.questions_count"/>

    <!-- В зависимости от типа данных, отображаем различные компоненты -->
    <question_list :timer="data.timer" :question="data.question" :answers="data.answers"
      :id_correct_answer="data.id_correct_answer" :percentages="data.percentages" :stage="stage":onAnswer="onAnswer" :questions_count ="data.questions_count" :context="context" />


  </div>
</template>

<style>
@import url("~/assets/css/question/question.scss");
@import url("~/assets/css/question/question_list.scss");
@import url("~/assets/css/question/timer.scss");
</style>
