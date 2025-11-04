<script setup lang="ts">
// Путь может отличаться в зависимости от структуры проекта
import timer_leader from '~/components/question/timer_leader.vue';
import question_list_leader_one from '~/components/question/question_list_leader_one.vue';
import question_list_leader_text from '~/components/question/question_list_leader_text.vue';
import question_leader_buttons from '~/components/question/question_leader_buttons.vue';
import { defineProps } from 'vue'
import { saveToLocaleStorage, loadFromLocalStorage, clearLocalStorage } from '~/utils/deviceStorage'
import type { Pause, QuestionData } from '~/types/stageData'
const route = useRoute()
const interactiveId = route.params.id as string
// пропс для работы с данными от бекенда
const props = defineProps<{
  stage: string
  data: QuestionData
  context: string
  onAnswer: () => void
  onStatus: (status: string) => void// Используем тип WaitingData
  pause: Pause
  winners: any
}>()
// для изменения цвета фона
onMounted(() => {
  document.body.classList.add('question-leader-background');
});
onUnmounted(() => {
  document.body.classList.remove('question-leader-background');
});

const pauseRef = ref("no")
function removeFromPause() {

  props.onStatus('pause')
  pauseRef.value = "no"
}
watch(() => props.pause.state, (newWal) => {


  if (newWal === "timer_n") {


  }
  else {
    pauseRef.value = newWal
  }


})
function morePause() {

  props.onStatus('more_pause')
  pauseRef.value = "yes"
}
const timerLabel = computed(() => {
  if (props.stage === 'discussion') {
    if (Number(props.data.questions_count) === Number(props.data.question.position)) {
      return 'Конец интерактива через:'
    } else {
      return 'Следующий вопрос через:'
    }
  } else {
    return 'Время на ответ:'
  }
})
const progressPercent = computed(() => {
  const time = Number(props.data.timer)
  if (isNaN(time) || !Number(props.data.timer_duration)) return 0
  return 100 - (time / Number(props.data.timer_duration)) * 100
})

const resetting = ref(false) // Флаг для отслеживания сброса
watch(
  () => props.timer,
  (newVal, oldVal) => {
    const numericNew = Number(newVal)
    const numericOld = Number(oldVal)

    // Если таймер перешел с 1 на 0
    if (numericOld === 0 && numericNew > 0) {
      resetting.value = true

      // Включаем анимацию обратно после небольшой задержки

    }
    if (numericOld !== 0) {
      resetting.value = false
      // Включаем анимацию обратно после небольшой задержки

    }
  }
)

const type = computed(() => {
  if (props.data.question.type === "one") {
    return 'Один правильный ответ'
  }

  else if (props.data.question.type === "many") {
    return 'Несколько правильных ответов'
  }
  else {
    return 'Введите правильный ответ'
  }
})

function typedScore(value: number) {
  if ((9 < value % 100) && (value % 100 < 20)
    || (4 < value % 10) && (value % 10 < 10)
    || (value % 10 == 0))
    return "баллов";
  else if (value % 10 == 1)
    return "балл";
  return "балла";
}
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
          <div class="question_leader_winners" v-if="props.winners" :class="{ no_image: props.data.question.image === '' }">
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


.question_leader_content {}

.question_leader_top {
  display: flex;
  height: calc((79 / 252) * ((252 / 1280) * 100dvw));
  display: flex;
  align-items: center;
}

.question_leader_top_question_num {
  position: relative;
  background-image: url("/public/images/question/Group 7096.svg");
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  align-items: center;
  width: calc((252 / 1280) * 100dvw);
  height: calc((79 / 252) * ((252 / 1280) * 100dvw));
  /* пропорциональная высота */
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-style: Medium;
  font-size: clamp(10px, calc((36 / 1280) * 100dvw), 72px);
  letter-spacing: clamp(0.1px, calc((36 / 100 / 1280) * 100dvw), 0.72px);
}

.question_leader_top_question_num>div {
  margin-left: calc((12 / 1280) * 100dvw);
  font-family: "Lato", sans-serif;
}

.question_leader_top_timer {
  display: grid;
  align-items: center;
  margin-left: calc((102 / 1280) * 100dvw);
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-style: Medium;
  font-size: clamp(10px, calc((32 / 1280) * 100dvw), 64px);
  letter-spacing: clamp(0.1px, calc((32 / 100 / 1280) * 100dvw), 0.64px);
  text-align: center;
  vertical-align: middle;
  min-width: calc((454 / 1280) * 100dvw);
  height: calc((47 / 832) * 100dvh);
}

.question_grey-line {
  width: calc((318 / 1280) * 100dvw);
  height: calc((7 / 832) * 100dvh);
  background-color: #E9E9E9;
  border-radius: 26px;
  margin: calc((4 / 832) * 100dvh) auto;
}

.question_green-line {
  width: calc((318 / 1280) * 100dvw);
  height: calc((7 / 832) * 100dvh);
  background-color: #6ab23d;
  border-radius: 26px;
  transition: width 1s linear;
}

.question_title {
  width: 100%;
  padding-left: calc((12 / 1280) * 100dvw);
  font-size: clamp(10px, calc((36 / 1280) * 100dvw), 72px);
  letter-spacing: clamp(0.1px, calc((36 / 100 / 1280) * 100dvw), 0.72px);
  font-family: "Lato", sans-serif;
  font-weight: 500;
  margin-top: calc((29 / 832) * 100dvh);
  line-height: clamp(10px, calc((36 / 1280) * 100dvw), 72px);
  ;
}

.question_leader_answers_image {
  display: grid;
  grid-template-columns: calc(649 / 1280 * 100dvw) calc(473 / 1280 * 100dvw);
  width: calc((1156 / 1280) *100dvw);
}

.question_leader_list_fone {}

.question_leader_image {
  height: calc((504 / 832) * 100dvh);
  width: calc((473/1280) * 100dvw);
  position: relative;
  margin-left: calc((28/1280) * 100dvw);
}

.question_leader_image_image {
  width: calc((473/1280) * 100dvw);
  height: calc((266 / 832) * 100dvh);
  background-color: #E0E0E0;
  object-fit: cover;
  /* делает, чтобы изображение полностью заполняло блок без искажений */
  object-position: center;
  /* центрирует */

}

.question_leader_winners {
  position: absolute;
  width: calc((473/1280) * 100dvw);
  height: calc((154 / 832) * 100dvh);
  border-radius: calc((8 / 832) * 100dvh);
  border: calc((2 / 832) * 100dvh) solid #E0E0E0;
  margin-top: calc((18 / 832) * 100dvh);
 
}

.question_leader_winners_header {
  margin-left: calc((20 / 1280) * 100dvw);
  margin-top: calc((10 / 832) * 100dvh);
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-style: Medium;
  vertical-align: middle;
  height: calc((24/832) * 100dvh);
  font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
  letter-spacing: clamp(0.1px, calc((20 / 100 / 1280) * 100dvw), 0.4px);
   display: flex;
   width: calc((433/1280) * 100dvw);

}
.winners_table_score{
  margin-left: auto;
}
.question_leader_winners_header_line {
  height: calc((1/832) * 100dvh);
  width: calc((433/1280) * 100dvw);
  margin: 0 auto;
  margin-top: calc((5 / 832) * 100dvh);
  background-color: #E0E0E0;
}

.question_leader_winners_list {
  width: calc((433/1280) * 100dvw);
  margin: 0 auto;
  height: calc((83/832) * 100dvh);
  margin-top: calc((15 / 832) * 100dvh);
}

.question_leader_winners_list_item {
  font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
  letter-spacing: clamp(0.10px, calc((20 / 100/ 1280) * 100dvw), 0.40px);
}

.question_leader_winners_list>div {

  display: flex;
  align-items: center;
  height: calc((15/832) * 100dvh);
  margin-bottom: calc((18/832)*100dvh);
  font-family: "Lato", sans-serif;
  font-weight: 400;
  vertical-align: middle;
  font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
  letter-spacing: clamp(0.10px, calc((20 / 100/ 1280) * 100dvw), 0.40px);
}

.no_image {
  margin-top: calc((78/832)*100dvh);
}
</style>
