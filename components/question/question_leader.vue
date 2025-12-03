<script setup lang="ts">

// imports
import { toRef } from 'vue'
import question_list_leader_one from '~/components/question/question_list_leader_one.vue';
import question_list_leader_text from '~/components/question/question_list_leader_text.vue';
import question_leader_buttons from '~/components/question/question_leader_buttons.vue';
import { defineProps } from 'vue'
import type { Pause, QuestionData, QuestionWinners } from '~/types/stageData'

// data from backend
const props = defineProps<{
  stage: string
  data: QuestionData
  context: string
  onAnswer: () => void
  onStatus: (status: string) => void
  pause: Pause
  winners: QuestionWinners[]
  data_answers:any
}>()

// composables
import { UseQuestionLeader } from '~/composables/interactive/interactive_leader/question_leader/question_leader';
import { useTimer } from '~/composables/interactive/timer';
const { pauseRef, removeFromPause, morePause, typedScore, } = UseQuestionLeader(props.onStatus, computed(() => props.pause.state), computed(() => props.stage),)
const { timerLabel, type, progressPercent, resetting } = useTimer(
  computed(() => props.stage),
  computed(() => props.data.questions_count),
  computed(() => props.data.question.position),
  computed(() => props.data.question.type),
  computed(() => props.data.timer),
  computed(() => props.data.timer_duration)
)
const showPopup=ref(false)
</script>

<template>
  <div class='question_leader'>
    <div class="question_leader_logo">
      <img src="/images/waiting/Group_7055.svg" id="logo_2" />
    </div>
    <div class="question_leader_content">

      <div class='question_leader_top'>
        <div class="question_leader_top_question_num">
          <div style="display: flex;">Вопрос {{ data.question.position }}<div style="color: #A9A9A9;">
              /{{ data.questions_count }}</div>
          </div>
     
        </div>
        <div class="question_leader_top_timer">
          {{ timerLabel }} {{ data.timer }}
          <div class="question_grey-line">
            <div class="question_green-line" :style="{ width: progressPercent + '%' }"
              :class="{ 'no-transition': resetting }" />
          </div>
        </div>
      </div>
      <div class="question_title">{{ props.data.question.text }}</div>
      <div class="question_leader_answers_image">
        <div class="question_leader_list_fone">
          <question_list_leader_one v-if="props.data.question.type === 'one' || props.data.question.type === 'many'"
            :timer="data.timer" :question="data.question" :answers="props.data_answers"
            :id_correct_answer="props.data_answers.id_correct_answer" :percentages="props.data_answers.percentages" :stage="stage"
            :onAnswer="onAnswer" :questions_count="data.questions_count" :context="context" :type="type" />
          <question_list_leader_text v-if="props.data.question.type === 'text'" :timer="data.timer"
            :question="data.question" :answers="props.data_answers" :id_correct_answer="data.id_correct_answer"
            :percentages="data.percentages" :stage="stage" :onAnswer="onAnswer" :questions_count="data.questions_count"
            :context="context" :type="type" :data_answers="data.data_answers" />
        </div>

        <div class="question_leader_image">
          <img class="question_leader_image_image" :src="props.data.question.image"
            v-if="props.data.question.image !== ''" />
          <div class="question_leader_winners" v-if="stage==='discussion'"
            :class="{ no_image: props.data.question.image === '' }">
            <div class="question_leader_winners_header">
              Лидеры: <div class="winners_table_score">баллы</div>
            </div>

            <div class="question_leader_winners_header_line" />
            <div class="question_leader_winners_list">
              <div v-for="winner in props.winners" class="question_leader_winners_list_item">
                <div style="width: calc((14/1280)*100dvw);">{{ winner.position }}</div>
                <div style="margin-left: calc((14/1280)*100dvw);">{{ winner.username }}</div>
                <div style="margin-left:auto; margin-right:calc((20/1280)*100dvw); width: calc((16/1280)*100dvw); display: flex;align-items: center;
                justify-content: center;
                ">{{ winner.score }} </div>
              </div>
            </div>
          </div>
          <question_leader_buttons :onStatus="onStatus" :pause="pauseRef"
            :class="{ no_image_buttons: props.data.question.image === '' }"
            @show="showPopup=true"
            @close="showPopup=false"
             />
        </div>
      </div>
    </div>
    <div v-if="showPopup" class="interactives_delete_popup-overlay">
      <div class="interactives_delete_popup">
        <div class="interactives_delete_popup-close" @click="showPopup=false">
            <img src="/public/images/interactives/delete_close.svg"/>
        </div>
        <div class="interactives_delete_popup-header">
          <div class="interactives_delete_popup-header-text">
            Вы уверены, что хотите завершить интерактив?
          </div>
          <div  class="interactives_delete_popup-header-text_">Это действие отменить будет невозможно.<br></br>
Результаты интерактива будут доступны во вкладке «Отчёты».</div>
        </div>
        <div class="interactives_delete_popup-body">
            <button class="interactives_delete_popup-button cancel" @click="showPopup=false">Отменить</button>
          <button class="interactives_delete_popup-button confirm" @click="props.onStatus('end')">Завершить
          </button>
          
        </div>
      </div>
    </div>
    <div v-if="props.pause.state === 'timer_n'" class="question_leader_popup-overlay">
      <div class="question_leader_popup-content">
        <div class="question_leader_popup-text">Вы слишком долго бездействовали, запустите интерактив или через {{
          props.pause.timer_n }} секунд
          он будет закрыт

        </div>
        <div class="question_leader_popup-actions">
          <button @click="removeFromPause()" class="question_leader_popup-btn save">Снять с паузы</button>
          <button @click="morePause()" class="question_leader_popup-btn cancel">Еще подождать</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
@import url("~/assets/css/question/question_leader.scss");
@import url("~/assets/css/question/question_list_leader.scss");
@import url("~/assets/css/question/timer_leader.scss");
@import url("~/assets/css/question/question_leader_buttons.scss");

.no-transition {
  transition: none !important;
}
.interactives_delete_popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
   background: #00000052;

  z-index: 22222999;

  display: flex;
  justify-content: center;
 
}

.interactives_delete_popup {
     margin-top:calc((273/832)*100dvh);
  background: white;
  border-radius: calc((18/832)*100dvh);
  width: calc((524/1280)*100dvw);
height: calc((233/832)*100dvh);

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  position: relative;
}
.interactives_delete_popup-close {
  position: absolute;

   width: calc((16/1280)*100dvw);
height: calc((16/832)*100dvh);
  cursor: pointer;
  color: #aaa;
}
.interactives_delete_popup-close > img{
    width: calc((16/1280)*100dvw);
height: calc((16/832)*100dvh);
}
.interactives_delete_popup-header-text {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
  margin: 0 auto;
  margin-top:calc((24/832)*100dvh);
  margin-left:  calc((20/1280)*100dvw);;
}
.interactives_delete_popup-header-text_{  margin-left:  calc((20/1280)*100dvw);;
    font-family: "Lato", sans-serif;  margin-top:calc((19/832)*100dvh); color:#7D7D7D;
font-weight: 400;
font-style: Regular;
  font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
line-height: 120%;
letter-spacing: 1%;
vertical-align: middle;

}
.interactives_delete_popup-body {margin-left:  calc((218/1280)*100dvw);;
  display: flex; margin-top:calc((59/832)*100dvh);
  
}
.interactives_delete_popup-button {
   width: calc((138/1280)*100dvw) !important;
height: calc((41/832)*100dvh);
  border-radius: 8px;
font-family: "Lato", sans-serif;
font-weight: 500;
font-style: Medium;
  font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
line-height: 120%;
letter-spacing: 1%;
text-align: center;
vertical-align: middle;

 
}
.interactives_delete_popup-button:nth-child(1) {
  background-color: white; color:#7D7D7D;border:none;;
}
.interactives_delete_popup-button:nth-child(1):hover {
  color: #1D1D1D;
   border: calc((1.5/832)*100dvh) solid #1D1D1D;

}
.interactives_delete_popup-button:nth-child(2) {margin-left:  calc((10/1280)*100dvw);;
  background-color: white;
  color: #F0436C;
  border: calc((1.5/832)*100dvh) solid #F0436C;
  border-color: #F0436C;
}
.interactives_delete_popup-button:nth-child(2):hover {
  background-color:  #F0436C;
  color: white;
}
</style>
