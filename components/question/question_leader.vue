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
            :timer="data.timer" :question="data.question" :answers="data.answers"
            :id_correct_answer="data.id_correct_answer" :percentages="data.percentages" :stage="stage"
            :onAnswer="onAnswer" :questions_count="data.questions_count" :context="context" :type="type" />
          <question_list_leader_text v-if="props.data.question.type === 'text'" :timer="data.timer"
            :question="data.question" :answers="data.answers" :id_correct_answer="data.id_correct_answer"
            :percentages="data.percentages" :stage="stage" :onAnswer="onAnswer" :questions_count="data.questions_count"
            :context="context" :type="type" :data_answers="data.data_answers" />
        </div>

        <div class="question_leader_image">
          <img class="question_leader_image_image" :src="props.data.question.image"
            v-if="props.data.question.image !== ''" />
          <div class="question_leader_winners" v-if="props.winners"
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
            :class="{ no_image_buttons: props.data.question.image === '' }" />
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
</style>
