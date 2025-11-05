<script setup lang="ts">

// imports
import { defineProps } from 'vue'
import type { QuestionData } from '~/types/stageData'

// data from backend
const props = defineProps<{
  stage: string
  data: QuestionData
  context: string
  onAnswer: (answerId: string) => void

}>()

</script>

<template>
  <div class='question'>
    <img src="/images/question/Star_2.svg" id="question_star_2" />
    <img src="/images/question/Vector_89.svg" id="question_vector_2" />

    <!-- <timer :timer="data.timer" :stage="stage" :timer_duration="data.timer_duration" :context="context"
      :question_num="data.question.position" :question_count="data.questions_count" /> -->

    <!-- <question_list :timer="data.timer" :question="data.question" :answers="data.answers"
      :id_correct_answer="data.id_correct_answer" :percentages="data.percentages" :stage="stage" :onAnswer="onAnswer"
      :questions_count="data.questions_count" :context="context" /> -->


  </div>
</template>

<style>
@import url("~/assets/css/question/question.scss");
@import url("~/assets/css/question/question_list.scss");
@import url("~/assets/css/question/timer.scss");
</style>
