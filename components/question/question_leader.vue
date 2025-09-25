<script setup lang="ts">
// Путь может отличаться в зависимости от структуры проекта
import timer_leader from '~/components/question/timer_leader.vue';
import question_list_leader from '~/components/question/question_list_leader.vue';
import question_leader_buttons from '~/components/question/question_leader_buttons.vue';
import { defineProps } from 'vue'
import type { QuestionData } from '~/types/stageData'
const route = useRoute()
// пропс для работы с данными от бекенда
const props = defineProps<{
  stage: string
  data: QuestionData
  context: string
  onAnswer: () => void
  onStatus: (status: string) => void// Используем тип WaitingData
}>()
// для изменения цвета фона
onMounted(() => {
  document.body.classList.add('question-leader-background');
});
onUnmounted(() => {
  document.body.classList.remove('question-leader-background');
});
</script>

<template>
  <div class='question_leader'>
    <img src="/images/waiting/Group_7055.svg" id="logo_2" />
    <!-- Горизонтальный блок -->
    <div class="question_leader_top-bar">
      <div>
        <question_leader_buttons :onStatus="onStatus" />
      </div>
      <div class='question_leader_timer'>
        <timer_leader :timer="data.timer" :stage="stage" :timer_duration="data.timer_duration" :context="context"
          :question_num="data.question.position" :question_count="data.questions_count" />
      </div>
    </div>
    <div class="question_leader_list_fone">
      <question_list_leader :timer="data.timer" :question="data.question" :answers="data.answers"
        :id_correct_answer="data.id_correct_answer" :percentages="data.percentages" :stage="stage" :onAnswer="onAnswer"
        :questions_count="data.questions_count" :context="context" />
    </div>


  </div>
</template>

<style>
@import url("~/assets/css/question/question_leader.scss");
@import url("~/assets/css/question/question_list_leader.scss");
@import url("~/assets/css/question/timer_leader.scss");
@import url("~/assets/css/question/question_leader_buttons.scss");
</style>
