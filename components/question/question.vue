<script setup lang="ts">

// imports
import { defineProps } from 'vue'
import type { QuestionData } from '~/types/stageData'
import timer from './timer.vue';
import question_list from './question_list.vue';
import question_list_many from './question_list_many.vue';
import question_list_text from './question_list_text.vue';
// data from backend
const props = defineProps<{
  stage: string
  data: QuestionData
  context: string
  onAnswer: () => void
  score:string
  winners: any
  data_answers?:any | undefined

}>()
onMounted(() => {
  // Сохраняем изначальную высоту экрана в CSS переменную
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
})
</script>

<template>
  <div class='question'>
    
     
     <timer :timer="data.timer" :stage="stage" :timer_duration="data.timer_duration" :context="context"
      :question_num="data.question.position" :question_count="data.questions_count"  :score="props.score"/>

     <question_list v-if="data.question.type ==='one'" :timer="data.timer" :question="data.question" :answers="props.data_answers"
      :id_correct_answer="props.data_answers?.id_correct_answer ?? null" :percentages="props.data_answers.percentages" :stage="stage" :onAnswer="onAnswer"
      :questions_count="data.questions_count" :context="context" :type="props.data.question.type"/> 

    <question_list_many v-if="data.question.type ==='many'" :timer="data.timer" :question="data.question" :answers="props.data_answers"
     :id_correct_answer="props.data_answers?.id_correct_answer ?? null" :percentages="props.data_answers.percentages" :stage="stage" :onAnswer="onAnswer"
      :questions_count="data.questions_count" :context="context" :type="props.data.question.type" /> 
      
      <question_list_text v-if="data.question.type ==='text'" :timer="data.timer" :question="data.question" :answers="data.data_answers"
      :id_correct_answer="props.data_answers?.id_correct_answer ?? null" :percentages="data.percentages" :stage="stage" :onAnswer="onAnswer"
      :questions_count="data.questions_count" :context="context" :data_answers="data_answers" :type="props.data.question.type"/>
      <div v-if="stage==='discussion'" class ="question_leader_boardboard">
       
        <div class ="question_leader_board_line"/>
        <div class ="question_leader_board_header">
          <div>
            Лидеры:
          </div>
          <img src="/public/images/question/Vector (1).svg"/>
        </div>
        <div class ="question_leader_board_list_list" >
          <div class="question_leader_board_winner" v-for="winner in props.winners">
              <div class="question_leader_board_winner_position">{{ winner.position }}</div>
              <div class="question_leader_board_winner_name">{{ winner.username }}</div>
              <div class="question_leader_board_winner_score">{{ winner.score }}</div>
            </div>
        </div>
        <div style=" font-size: 0.001px; color: white; height: calc((30 / 844) * var(--app-height));;;">.</div>
      </div>
      
  </div>
</template>

<style>
@import url("~/assets/css/question/question.scss");
@import url("~/assets/css/question/question_list.scss");
@import url("~/assets/css/question/timer.scss");
:root {
  --app-height: 100vh;
}
.question_leader_boardboard{
  position: absolute;
  height: calc((118 / 844) * var(--app-height));;
  
  top:calc((804.54 / 844) * var(--app-height));
  bottom: calc((30 / 844) * var(--app-height));;
  left: calc((45 / 390) * 100dvw);;
  width: calc((300 / 390) * 100dvw);
  margin: 0 auto;;
  padding-bottom: calc((28 / 844) * var(--app-height));;;

  font-family: "Lato", sans-serif;
font-weight: 400;
font-size: clamp(10px, calc((16 / 390) * 100dvw),32px);

letter-spacing:  clamp(0.10px, calc((16 / 100 / 390) * 100dvw),0.32px);
vertical-align: middle;

}

.question_leader_board_line{
  height: calc((1 / 844) * var(--app-height));;
  background-color: #E9E9E9;
  width: 100%;
}
.question_leader_board_header{
  display: flex;
  align-items: center;
  font-weight: 500;
  height: calc((24 / 844) * var(--app-height));;
  margin-top:calc((3 / 844) * var(--app-height));;
}
.question_leader_board_header > img{
  margin-left: calc((10 / 390) * 100dvw);;
}

.question_leader_board_list_list{
    margin-top:calc((12 / 844) * var(--app-height));;
  height: calc((78 / 844) * var(--app-height));;
  display: grid;
  gap:calc((18 / 844) * var(--app-height));;
}

.question_leader_board_list_list >div{
  line-height:calc((14 / 844) * var(--app-height));; ;
  height: calc((14 / 844) * var(--app-height));;
}

.question_leader_board_winner{
  display: flex;
}
.question_leader_board_winner_name{
   margin-left: calc((14 / 390) * 100dvw);;
}
.question_leader_board_winner_score{
  margin-left: auto;
   margin-right: calc((1 / 390) * 100dvw);;
  
}
</style>
