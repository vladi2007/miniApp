<script setup lang="ts">
// Путь может отличаться в зависимости от структуры проекта
import timer from '~/components/question/timer.vue';
import question_list from '~/components/question/question_list.vue';
import question_leader_buttons from '~/components/question/question_leader_buttons.vue';
import { defineProps } from 'vue'
import type { QuestionData } from '~/types/stageData'


const props = defineProps<{
  stage: string
  data: QuestionData 
  context:string
  onAnswer: () => void  
  onStatus: (status: string) => void// Используем тип WaitingData
}>()

</script>

<template>
  <div class='question_leader'>
    <img src="/images/waiting/Group_7055.svg" id="logo_2" />
    <!-- Горизонтальный блок -->
    <div class="question_leader_top-bar">
      <div><question_leader_buttons  :onStatus="onStatus"/></div>
      <div class ='question_leader_timer'><timer
        :timer="data.timer"
        :stage="stage"
        :timer_duration="data.timer_duration"
        :context="context"
      /></div>
    </div>
    <div class ="question_leader_list_fone"><question_list :timer="data.timer" :question="data.question" :answers="data.answers"
      :idCorrectAnswer="data.idCorrectAnswer" :percentages="data.percentages" :stage="stage":onAnswer="onAnswer" :questions_count ="data.questions_count" :context="context" /></div>


  </div>
</template>

<style>

.question_leader{
   width: 100vw;
  height: 100vh;
  background-color: #853CFF;
  overflow: hidden;
}
#logo_2 {
    position: absolute;
    left: 40px;
    top: 12px
}
.question_leader_list_fone{
    background-color: white; width: 1318px;
  height: 818px;
  border-radius: 26px;
  margin:0 auto;
  margin-top:32px;
}
.question_leader_top-bar { 
   display: flex;
   align-items: center;
             /* расстояние между кнопками и таймером */
 width: 807px;; 
 margin: 0 auto;    
margin-top:47px;
 /* необязательный отступ сверху */
}


.question_leader_timer{
    margin:auto 0;
    margin-left: 25px;;
    
}
</style>
