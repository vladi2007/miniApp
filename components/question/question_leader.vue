<script setup lang="ts">
// imports
import { toRef } from 'vue'
import question_list_leader_one from '~/components/question/question_list_leader_one.vue'
import question_list_leader_text from '~/components/question/question_list_leader_text.vue'
import question_leader_buttons from '~/components/question/question_leader_buttons.vue'
import type { Pause, QuestionData, QuestionWinners } from '~/types/stageData'
import mobile from '../moderation/mobile.vue'
// composables
import { UseQuestionLeader } from '~/composables/interactive/interactive_leader/question_leader/question_leader'
import { useTimer } from '~/composables/interactive/timer'

// data from backend
const props = defineProps<{
  stage: string
  data: QuestionData
  context: string
  onAnswer: (id: string) => void
  onStatus: (status: string) => void
  pause: Pause
  winners: QuestionWinners[]
  data_answers: any
  code: string
}>()
const { pauseRef, removeFromPause, morePause, typedScore } = UseQuestionLeader(props.onStatus, computed(() => props.pause.state), computed(() => props.stage))
const { timerLabel, type, progressPercent, resetting } = useTimer(
  computed(() => props.stage),
  computed(() => props.data.questions_count),
  computed(() => props.data.question.position),
  computed(() => props.data.question.type),
  computed(() => props.data.timer),
  computed(() => props.data.timer_duration),
)
const showPopup = ref(false)
const defaultWinners = [
  { position: 1, score: 5, username: "Иванов Иван Сергеевич", participant_id: "1", is_hidden: false, is_blocked: false },
  { position: 1, score: 5, username: "Петров Петр Петрович", participant_id: "2", is_hidden: true, is_blocked: false },
  { position: 1, score: 5, username: "Сидоров Сидор Сидорович", participant_id: "3", is_hidden: false, is_blocked: true },
]

const participants = ref(
  (Array.isArray(props.winners) ? props.winners : defaultWinners).map((winner, index) => ({
    ...winner,
    participant_id: winner.participant_id ?? String(index + 1),
    is_hidden: winner.is_hidden ?? true,
  }))
)
function toggleHidden(id: string) {

  const winner = props.winners.find(w => w.participant_id === id)
  if (winner) {
    winner.is_hidden = !winner.is_hidden
  }
  props.onAnswer(id)
}
function toggleHiddenName(id: string) {
  if (!isMobile) return
  const winner = props.winners.find(w => w.participant_id === id)
  if (winner) {
    winner.is_hidden = !winner.is_hidden
  }
  props.onAnswer(id)
}
const showMobileModeration = ref(false)
const isMobile = useMediaQuery('(max-width: 1280px)')
function closeMobileModeration() {
  showMobileModeration.value = false
}
async function openModeration(id: string) {
  // Проверяем, есть ли id
  if (!id) return;
  // если мобильный экран — открываем компонент
  if (isMobile.value) {
    showMobileModeration.value = true
    return
  }
  // Формируем URL (подставляем id)
  const url = `/leader/moderation/${id}`;

  // Открываем в новой вкладке
  window.open(url, '_blank');
}
const root = document.documentElement

if (!root.dataset.appHeightFixed) {
  const height = window.innerHeight
  root.style.setProperty('--app-height-fixed', `${height}px`)
  root.dataset.appHeightFixed = 'true'
}

const startY = ref(0)
const currentY = ref(0)
const $style = useCssModule()
const isDragging = ref(false)
function resetTouch() {
  isDragging.value = false
  startY.value = 0
  currentY.value = 0
}
function closeAllPopups() {
  showPopup.value = false

  resetTouch()
}
function onTouchStart(e: TouchEvent) {
  if (!isMobile.value) return

  isDragging.value = true
  startY.value = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value

  if (diff > 0) {
    e.preventDefault()

    const sheet = document.querySelector(`.${$style.question__popup_overlay}`) as HTMLElement
    if (sheet) {
      sheet.style.transform = `translateY(${diff}px)`
      sheet.style.transition = 'none'
    }
  }
}

function onTouchEnd(e: TouchEvent, start: string) {
  if (!isMobile.value || !isDragging.value) return
  isDragging.value = false

  const diff = currentY.value - startY.value
  const sheet = document.querySelector(`.${$style.question__popup_overlay}`) as HTMLElement
  if (sheet) {
    sheet.style.transform = ''
  }

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    closeAllPopups()

    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch(
  [showPopup],
  ([popup]) => {
    if (!popup) {
      resetTouch()
    }
  }
)
</script>

<template>
  <div :class="$style.question">
    <div :class="$style.question__header">
      <div :class="$style.question__logo">
        <img :class="$style.question__logo_click" id="logo_2" src="/images/waiting/Group_7055.svg">
        <img @click="openModeration(code)" :class="$style.question__logo_moderation"
          src="/public/images/waiting/open_moderation.svg">
      </div>
      <div :class="$style.question__timer_mobile">
        <div :class="$style.question__timer_mobile_text">
          {{ timerLabel }} {{ data.timer }}
        </div>

        <div :class="$style.question__timer_mobile_bar">
          <div :style="{ width: progressPercent + '%' }" :class="{ 'no-transition': resetting }" />
        </div>
      </div>

    </div>
    <div :class="$style.question__body">
      <div :class="$style.question__question">
        <div :class="$style.question__number">
          <img src="/public/images/question/Group 7099.svg" class="question_icon">
          <div>
            Вопрос {{ data.question.position }}<div style="color: #A9A9A9;">
              /{{ data.questions_count }}
            </div>
          </div>

        </div>
        <div :class="$style.question__timer_desktop">

          <div :class="$style.question__timer_desktop_text">
            {{ timerLabel }} {{ data.timer }}

          </div>
          <div :class="$style.question__timer_desktop_bar">
            <div :style="{ width: progressPercent + '%' }" :class="{ 'no-transition': resetting }" />
          </div>
        </div>
      </div>
      <div :class="$style.question__text">
        {{ props.data.question.text }}
      </div>
      <div :class="$style.question__list">
        <question_list_leader_one v-if="props.data.question.type === 'one' || props.data.question.type === 'many'"
          :timer="data.timer" :question="data.question" :answers="props.data_answers"
          :id_correct_answer="props.data_answers.id_correct_answer" :percentages="props.data_answers.percentages"
          :stage="stage" :on-answer="onAnswer" :questions_count="data.questions_count" :context="context"
          :type="type" />
        <question_list_leader_text v-if="props.data.question.type === 'text'" :timer="data.timer"
          :question="data.question" :answers="props.data_answers" :id_correct_answer="data.id_correct_answer"
          :percentages="data.percentages" :stage="stage" :on-answer="onAnswer" :questions_count="data.questions_count"
          :context="context" :type="type" :data_answers="data.data_answers" />

        <div :class="$style.question__leaders">
          <img :class="$style.question__leaders_img" v-if="props.data.question.image !== ''"
            :src="props.data.question.image">
          <div
            :class="[$style.question__leaders_table, !props.data.question.image && $style.question__leaders_table_noImage]"
            v-if="stage === 'discussion'">
            <div :class="$style.question__leaders_table_line" />
            <div :class="$style.question__leaders_table_header">
              Лидеры: <div>
                баллы
              </div>
              <img src="/public/images/question/Vector (1).svg">
            </div>


            <div :class="$style.question__leaders_table_list">
              <div :class="$style.question__leaders_table_item" v-for="winner in props.winners"
                :key="winner.participant_id">

                <div :class="$style.question__leaders_table_position">
                  {{ winner.position }}
                </div>
                <img :src="!winner.is_hidden ? '/images/moderation/hide_name.svg' : '/images/moderation/open_name.svg'"
                  @click="toggleHidden(winner.participant_id)" />
                <div @click="toggleHiddenName(winner.participant_id)" :class="$style.question__leaders_table_name">
                  {{ winner.is_hidden ? '•••' : winner.username
                  }}
                </div>
                <div :class="$style.question__leaders_table_score">
                  {{ winner.score }}
                </div>
              </div>
            </div>
          </div>
          <question_leader_buttons :on-status="onStatus" :pause="pauseRef" @show="showPopup = true"
            @close="showPopup = false" />
        </div>
      </div>
    </div>
    <div v-if="showPopup && props.pause.state !== 'timer_n'" :class="$style.question__popup">
      <div :class="[$style.question__popup_overlay]" @click.stop @touchstart="onTouchStart" @touchmove="onTouchMove"
        @touchend="(e) => onTouchEnd(e, 'popup')">
        <img src="/public/images/moderation/close_popup.svg" @click="showPopup = false" />
        <div :class="$style.question__popup_line"></div>
        <div :class="$style.question__popup_text">
          Вы уверены, что хотите завершить интерактив?
        </div>
        <div :class="$style.question__popup_text_">
          Это действие отменить будет невозможно.<br></br>
          Результаты интерактива будут доступны во вкладке «Отчёты».
        </div>
        <div :class="[$style.question__popup_buttons]">
          <button @click="showPopup = false"
            :class="[$style.question__popup_btn, $style.question__popup_btn_first, $style.question__popup_btn_first_delete]">
            Отменить
          </button>
          <button
            :class="[$style.question__popup_btn, $style.question__popup_btn_second, $style.question__popup_btn_second_delete]"
            @click="props.onStatus('end')">
            Завершить
          </button>
        </div>
      </div>
    </div>
    <div v-if="props.pause.state === 'timer_n'" :class="$style.question__popup">
      <div :class="[$style.question__popup_overlay]">
        <div :class="$style.question__popup_line"></div>
        <div :class="[$style.question__popup_text, $style.question__popup_text_pause,]">
          Вы слишком долго бездействовали, запустите интерактив или через {{
            props.pause.timer_n }} секунд
          он будет закрыт
        </div>
        <div :class="[$style.question__popup_buttons]">
          <button @click="removeFromPause()"
            :class="[$style.question__popup_btn, $style.question__popup_btn_pause, $style.question__popup_btn_first, $style.question__popup_btn_first_start]">
            Снять с паузы
          </button>
          <button @click="morePause()"
            :class="[$style.question__popup_btn, $style.question__popup_btn_pause, $style.question__popup_btn_second, $style.question__popup_btn_second_start]">
            Еще подождать
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showMobileModeration && isMobile" :class="$style.question__mobile">
    <mobile :interactive-id="props.code" @close="closeMobileModeration" />
  </div>
</template>
<style>
.no-transition {
  transition: none !important;
}
</style>
<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

.question {
  padding: 0 22px;
  box-sizing: border-box;
  width: 100%;

  @media (min-width:1280px) {
    padding: 0;

  }

  &__mobile {
    position: fixed;
    inset: 0;
    z-index: 9999;

    background: white;

    overflow-y: auto;
  }

  &__header {
    height: 95px;
    background-color: #853CFF;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;


    @media (min-width:1280px) {
      width: 100dvw;
      height: calc(71/832*100dvh);
      border-radius: 0;
      padding: 0;
      display: flex;
      align-items: center;
    }


  }

  &__logo {
    box-sizing: border-box;
    padding: 0 14px;
    padding-top: 10px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (min-width:1280px) {
      padding: 0;
      height: calc(50/832*100dvh);
      margin-left: auto;
      margin-right: calc(40/1280*100dvw);
      ;
    }

    &_click {
      width: 50px;
      height: 25px;

      @media (min-width:1280px) {

        height: calc(50/832*100dvh);
        aspect-ratio: 125 / 50;
        width: auto;
      }
    }

    &_moderation {
      width: 18px;
      height: 12px;

      @media (min-width:1280px) {
        display: none;
      }
    }
  }

  &__question {
    @media (min-width:1280px) {

      display: flex;
      gap: 0px;
      align-items: center;
    }
  }

  &__timer {


    &_desktop {
      display: none;

      @media (min-width:1280px) {

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: calc(4/832*100dvh);
        margin-left: calc(161/1280*100dvw);
        width: calc(318/1280*100dvw);
      }

      &_text {
        color: #1D1D1D;
        font-size: clamp(32px, 2vw, 44px);
        font-weight: 500;
        white-space: nowrap;
      }

      &_bar {
        height: calc(7/832*100dvh);
        width: 100%;
        background-color: #E9E9E9;
        border-radius: 26px;

        &>div {
          height: calc(7/832*100dvh);
          width: 100%;
          background-color: #97DE6B;
          border-radius: 26px;
          transition: width 1s linear;
        }
      }
    }

    &_mobile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 10px;

      gap: 5px;

      @media (min-width:1280px) {
        display: none;
      }

      &_text {
        color: white;
        font-size: 16px;
        font-weight: 700;
      }

      &_bar {
        width: calc(100% - 28px);
        height: 7px;
        background-color: white;
        border-radius: 26px;

        &>div {
          width: 100%;
          padding: 0 14px;
          height: 7px;
          background-color: #6ab23d;
          border-radius: 26px;
          transition: width 1s linear;
        }
      }
    }
  }

  &__body {
    margin-top: 11px;
    width: 100%;
    //687
    max-height: 650px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 650px;

    @media (min-width:1280px) {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: calc(100% - calc(130/1280*100dvw));
      margin: 0 calc(65/1280*100dvw);
      margin-top: calc(16/832*100dvh);

    }
  }

  &__number {
    display: flex;
    font-size: 16px;
    color: #1D1D1D;
    position: relative;
    width: 119px;
    height: 41px;
    display: flex;
    align-items: center;

    background-image: url("/images/question/Vector_80.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    left: -7px;

    @media (min-width:1280px) {
      width: calc(252/1280*100dvw);
      height: auto;
      aspect-ratio: 252 / 79;
      left: calc(-18/1280*100dvw);
      ;
      display: flex;
      font-size: clamp(36px, 2.5vw, 52px);
    }

    &>div {
      display: flex;
      margin-left: 7px;

      @media (min-width:1280px) {
        display: flex;
        margin-left: calc(18/1280*100dvw);
      }
    }

    &>img {
      position: absolute;
      top: -4px;
      right: -5px;
      width: 27px;
      height: 27px;

      @media (min-width:1280px) {
        margin-left: calc(7/1280*100dvw);
        top: calc(-5/832*100dvh);
        ;
        right: calc(-5/1280*100dvw);
        ;
        width: calc(43/1280*100dvw);
        height: calc(43/832*100dvh);
      }
    }
  }

  &__text {
    margin-top: 13px;
    color: #1D1D1D;
    font-size: 16px;

    @media (min-width:1280px) {
      margin-top: calc(29/832*100dvh);
      font-size: clamp(36px, 2.5vw, 52px);
      font-weight: 500;
      margin-left: calc(7/1280*100dvw);
      ;
    }

  }

  &__list {
    width: 100%;

    flex: 1;
    display: flex;
    flex-direction: column;

    @media (min-width:1280px) {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: calc(28/1280*100dvw);
      ;
    }
  }

  &__leaders {
    display: flex;
    flex-direction: column-reverse;
    flex: 1;

    @media (min-width:1280px) {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: calc(504/832*100dvh);
    }

    &_img {
      display: none;

      @media (min-width:1280px) {
        width: calc(473/1280*100dvw);
        height: auto;
        aspect-ratio: 473/266;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
    }



    &_table {
      position: absolute;
      height: calc((118 / 844) * var(--app-height-fixed));
      top: 804px;
      left: 45px;
      width: calc(100% - 90px);
      margin: 0 auto;

      font-family: "Lato", sans-serif;
      font-weight: 400;
      font-size: 16px;
      letter-spacing: 0.16px;
      vertical-align: middle;

      @media (min-height:844px) {
        top: calc((806 / 844) * var(--app-height-fixed))
      }

      @media (min-width:1280px) {
        position: relative;
        top: 0;
        left: 0;
        margin-top: calc(20/832*100dvh);
        width: 100%;
        height: calc(154/832*100dvh);
        border-radius: 8px;
        padding: calc(10/832*100dvh) calc(20/1280*100dvw);
        padding-top: 0;
        border: 2px solid #E0E0E0;
        margin-bottom: calc(20/832*100dvh);
        font-size: clamp(16px, 2.5vw, 32px);
      }

      &_noImage {

        @media (min-width:1280px) {
          margin-top: calc(73/832*100dvh);
        }
      }

      &_line {
        height: 1px;
        background-color: #E9E9E9;
        width: 100%;

        @media (min-width:1280px) {
          display: none;
        }
      }

      &_header {
        margin-top: 3px;
        display: flex;
        align-items: center;
        height: 24px;
        gap: 5px;

        @media (min-width:1280px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: calc(40/832*100dvh);
          width: 100%;
          border-bottom: 1.5px solid #E9E9E9;
          font-size: clamp(20px, 1.5vw, 70px);
        }

        &>div {
          display: none;

          @media (min-width:1280px) {
            display: flex;
          }
        }

        &>img {
          @media (min-width:1280px) {
            display: none;
          }
        }
      }

      &_item {
        display: flex;
        align-items: center;
        height: 14px;

        @media (min-width:1280px) {
          height: calc(14/832*100dvh)
        }


        &>img {
          display: none;

        }
      }

      &_list {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        height: 100%;

        @media (min-width:1280px) {
          margin-top: calc(16/832*100dvh);
          gap: calc(18/832*100dvh);
        }

      }

      &_position {
        color: #000000;
        font-size: 16px;

        @media (min-width:1280px) {
          font-size: clamp(20px, 1vw, 30px);
        }
      }

      &_name {
        margin-left: 14px;

        @media (min-width:1280px) {
          font-size: clamp(20px, 1vw, 30px);
          margin-left: calc(14/1280*100dvw);
          ;
        }
      }

      &_score {
        margin-left: auto;

        @media (min-width:1280px) {
          font-size: clamp(20px, 1vw, 30px);
          margin-right: calc(25/1280*100dvw);
        }
      }
    }
  }


  &__popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #00000052;

    z-index: 22222999;

    display: flex;
    justify-content: center;

    &_more {
      height: 317px !important;
    }

    &_overlay {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      background: white;
      height: 458px;
      margin: 0px;
      width: 100%;
      margin-top: auto;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      touch-action: pan-y; // Разрешаем только вертикальный скролл
      transition: transform 1s ease;

      @media (min-width:1056px) {
        height: 233px;
        margin-top: 273px;
        width: 544px;
        border-radius: 18px;
        padding: 0;
      }

      &>img {
        display: none;

        @media (min-width:1056px) {
          display: block;
          margin-left: auto;
          margin-top: 20px;
          margin-right: 20px;
          width: 16px;
          height: 16px;
        }
      }

      &_dubl {
        @media (min-width:1056px) {
          height: 270px !important;
        }

      }

      &_edit {
        @media (min-width:1056px) {
          height: 173px !important;
        }

      }

    }

    &_line {
      background-color: #A9A9A9;
      border-radius: 5px;
      height: 5px;
      width: 72px;
      margin: 0 auto;
      margin-top: 20px;

      @media (min-width:1056px) {
        display: none;

      }
    }

    &_text {
      color: #1D1D1D;
      font-size: 14px;
      font-weight: 500;
      margin-top: 40px;
      padding: 0 22px;

      @media (min-width:1056px) {
        font-size: 20px;
        font-weight: 700;
        box-sizing: border-box;
        padding-left: 20px;
        margin-top: 0px;
      }

      &_report {
        text-align: center;
      }

      &_pause {
        @media (min-width:1056px) {
          font-size: 20px;
          font-weight: 700;
          margin-top: 20px;
        }
      }

      &_ {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 10px;
        color: #7D7D7D;
        line-height: 120%;
        font-weight: 400;
        letter-spacing: 1%;

        @media (min-width:1056px) {
          font-size: 16px;
          margin-top: 19px;
        }
      }
    }

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 148px;

      @media (min-width:1056px) {
        position: absolute;
        right: 0;
        position: absolute;
        bottom: 20px;
        display: flex;
        flex-direction: row;
      }

      &_delete {
        @media (min-width:1056px) {
          margin-top: 56px;
        }
      }

      &_report {
        margin-top: 121px;

        @media (min-width:1056px) {
          margin: 0;
          position: absolute;
          bottom: 20px;
          display: flex;
          flex-direction: column-reverse;
          gap: 10px;
          right: 62px;

        }

        &>button {

          @media (min-width:1056px) {
            width: 360px;


          }
        }
      }

      &_edit {
        @media (min-width:1056px) {
          margin-top: 25px;
        }
      }

    }

    &_btn {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;

      @media (min-width:1056px) {
        height: 41px;
        font-size: 20px;
        cursor: pointer;
      }

      &_pause {
        @media (min-width:1056px) {
          width: 168px !important;
        }
      }

      &_first {
        @media (min-width:1056px) {
          width: 138px;
        }

        &_delete {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;


          @media (min-width:1056px) {
            background-color: white;
            border: 1px solid white;
            color: #7D7D7D;
          }

          &:hover {
            @media (min-width:1056px) {
              border: 1px solid #1D1D1D;
              color: #1D1D1D;
            }
          }
        }

        &_start {
          background-color: white;
          border: 1px solid #853CFF;
          color: #853CFF;

          &:hover {
            @media (min-width:1056px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }

        &_report {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;

          &:hover {
            @media (min-width:1056px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }

      }

      &_second {
        @media (min-width:1056px) {
          width: 138px;
        }

        &_delete {
          background-color: #F0436C;
          color: white;
          border: 1px solid #F0436C;

          @media (min-width:1056px) {
            background-color: white;
            border: 1px solid #F0436C;
            color: #F0436C;
          }

          &:hover {
            @media (min-width:1056px) {
              border: 1px solid #F0436C;
              background-color: #F0436C;
              color: white;
            }
          }
        }

        &_start {
          background-color: #6AB23D;
          color: white;
          border: 1px solid #6AB23D;

          &:hover {
            @media (min-width:1056px) {
              background-color: #559130;
            }
          }
        }
      }

      &_third {
        @media (min-width:1056px) {
          width: 138px;
        }

        &_start {
          background-color: #853CFF;
          color: white;
          border: 1px solid #853CFF;

          &:hover {

            @media (min-width:1056px) {
              background-color: #AA77FF;
            }
          }
        }
      }
    }

    &_block {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 0px;
      font-size: 14px;
      font-weight: 400;
      color: #1D1D1D;

      &_conducted {
        margin-top: 11px;
        padding-top: 11px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 22px; // Отступ слева
          right: 22px; // Отступ справа
          height: 1px;
          background-color: #1D1D1D1D;
        }
      }
    }

    &_func {
      height: 39px;
      display: flex;
      align-items: center;
      padding: 0px 22px 0px 18px;

      &:hover {
        background-color: #E0E0E0;
      }

      img:first-child {
        width: 24px;
        height: 24px;
      }

      img:last-child {
        margin-left: auto; // Прижимает стрелку к правому краю
      }

      &>div {
        margin-left: 6px;
      }
    }



    &_div {
      height: 1px;
      margin-top: 11px;
      padding: 0 22px;
    }

    &_report {
      margin-top: 19px;
      padding: 0 22px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      font-size: 14px;

    }

    &_option {
      display: flex;
      align-items: center;
      gap: 5px;

      &>img {
        width: 17px;
        height: 17px;
      }
    }
  }


}
</style>
