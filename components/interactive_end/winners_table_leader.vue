<script setup lang="ts">
import type { Pause, QuestionData, QuestionWinners } from '~/types/stageData'

import { useRouter } from 'vue-router'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'
// таблица лидеров
const props = defineProps<{
  isCheck?: boolean
  winners: QuestionWinners[]
  onAnswer?: (id: string) => void
}>()

const winners: QuestionWinners[] = [
  {
    position: '1',
    username: 'Алексей',
    score: '10',
    time: 75,
    participant_id: 'user_1',
    is_hidden: false,
  },
  {
    position: '2',
    username: 'Мария',
    score: '10',
    time: 81,
    participant_id: 'user_2',
    is_hidden: false,
  },
  {
    position: '3',
    username: 'Иван',
    score: '9',
    time: 89,
    participant_id: 'user_3',
    is_hidden: true,
  },
  {
    position: '4',
    username: 'Екатерина',
    score: '9',
    time: 94,
    participant_id: 'user_4',
    is_hidden: false,
  },
  {
    position: '5',
    username: 'Дмитрий',
    score: '8',
    time: 99,
    participant_id: 'user_5',
    is_hidden: false,
  },
  {
    position: '6',
    username: 'Ольга',
    score: '8',
    time: 105,
    participant_id: 'user_6',
    is_hidden: false,
  },
  {
    position: '7',
    username: 'Сергей',
    score: '8',
    time: 111,
    participant_id: 'user_7',
    is_hidden: true,
  },
  {
    position: '8',
    username: 'Анна',
    score: '7',
    time: 116,
    participant_id: 'user_8',
    is_hidden: false,
  },
  {
    position: '9',
    username: 'Павел',
    score: '7',
    time: 120,
    participant_id: 'user_9',
    is_hidden: false,
  },
  {
    position: '10',
    username: 'Наталья',
    score: '7',
    time: 126,
    participant_id: 'user_10',
    is_hidden: false,
  },
  {
    position: '11',
    username: 'Артём',
    score: '6',
    time: 132,
    participant_id: 'user_11',
    is_hidden: false,
  },
  {
    position: '12',
    username: 'Татьяна',
    score: '6',
    time: 138,
    participant_id: 'user_12',
    is_hidden: true,
  },
  {
    position: '13',
    username: 'Виктор',
    score: '5',
    time: 145,
    participant_id: 'user_13',
    is_hidden: false,
  },
  {
    position: '14',
    username: 'Юлия',
    score: '5',
    time: 151,
    participant_id: 'user_14',
    is_hidden: false,
  },
  {
    position: '15',
    username: 'Максим',
    score: '4',
    time: 158,
    participant_id: 'user_15',
    is_hidden: false,
  },
  {
    position: '16',
    username: 'Елена',
    score: '4',
    time: 166,
    participant_id: 'user_16',
    is_hidden: false,
  },
  {
    position: '17',
    username: 'Константин',
    score: '3',
    time: 173,
    participant_id: 'user_17',
    is_hidden: true,
  },
  {
    position: '18',
    username: 'Светлана',
    score: '3',
    time: 181,
    participant_id: 'user_18',
    is_hidden: false,
  },
  {
    position: '19',
    username: 'Никита',
    score: '2',
    time: 190,
    participant_id: 'user_19',
    is_hidden: false,
  },
  {
    position: '20',
    username: 'Дарья',
    score: '1',
    time: 198,
    participant_id: 'user_20',
    is_hidden: false,
  },
]


// Получаем экземпляр маршрутизатора
const router = useRouter()

// Функция возврата на предыдущую страницу
function goToMainMenu() {
  router.push({ path: '/leader/new_interactives' })
}
// форматируем секунды → мм:сс
function formatTime(secondsStr: number): string {
  const seconds = Number(secondsStr)
  if (isNaN(seconds)) return String(secondsStr) // защита от нечисловых значений

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
const isMobile = useMediaQuery('(max-width: 1280px)')
function toggleHidden(id: string) {
  if (!isMobile) return;
  if (props.isCheck)
    return
  const winner = props.winners.find(w => w.participant_id === id)
  if (winner) {
    winner.is_hidden = !winner.is_hidden
  }

  if (props.onAnswer) props.onAnswer(id)
}
function toggleHiddenName(id: string) {
  if (!isMobile) return;
  if (props.isCheck)
    return
  const winner = props.winners.find(w => w.participant_id === id)
  if (winner) {
    winner.is_hidden = !winner.is_hidden
  }

  if (props.onAnswer) props.onAnswer(id)
}
</script>

<template>
  <div :class="$style.leaderboard">
    <div :class="$style.leaderboard__header">
      Лидерборд
    </div>
    <div :class="$style.leaderboard__table_header">
      <div :class="$style.leaderboard__table_header_position">
        место
      </div>
      <div :class="$style.leaderboard__table_header_name">
        участник
      </div>
      <div :class="$style.leaderboard__table_header_time">
        время
      </div>
      <div :class="$style.leaderboard__table_header_score">
        балл
      </div>
    </div>
    <simplebar style="width: 100%">
      <div :class="$style.leaderboard__table">
        <div :class="$style.leaderboard__table_item" v-for="(winner, index) in props.winners" :key="index">
          <div :class="$style.leaderboard__table_position">
            {{ winner.position }}
          </div>
          <div :class="$style.leaderboard__table_hide" @click="toggleHidden(winner.participant_id)">
            <img v-if="!isCheck && !isMobile"
              :src="!winner.is_hidden ? '/images/moderation/hide_name.svg' : '/images/moderation/open_name.svg'" />
          </div>

          <div :class="$style.leaderboard__table_name" @click="toggleHiddenName(winner.participant_id)">

            {{ winner.is_hidden && !isCheck ? '•••' : winner.username
            }}
          </div>
          <div :class="$style.leaderboard__table_time">
            {{ formatTime(winner.time) }}
          </div>
          <div :class="$style.leaderboard__table_score">
            {{ winner.score }}
          </div>
        </div>
      </div>

    </simplebar>
    <button :class="$style.leaderboard__home" @click="goToMainMenu()">
      Выйти
    </button>
  </div>
</template>

<style></style>
<style>
.simplebar-scrollbar::before {
  display: none;
}

.simplebar-track {
  display: none;
}

@media (min-width:1280px) {
  .simplebar-scrollbar::before {
    display: block;
  }

  .simplebar-track {
    display: block;
  }
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

.leaderboard {
  margin-top: 30px;
  border: 2px solid #D9D9D9;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 303px;
  height: 303px;
  z-index: 1000;
  position: relative;

  @media (min-width:1280px) {
    margin-top: calc(47/832*100dvh);
    border: none;
    max-height: calc(487/832*100dvh);
    height: calc(487/832*100dvh);
    ;
    padding-left: calc(49/1280*100dvw);
    padding-right: calc(49/1280*100dvw);
  }

  &__header {
    font-size: 16px;
    font-weight: 500;
    margin-top: 6px;
    line-height: 24px;
    color: #000000;

    @media (min-width:1280px) {
      margin-top: 0;
      font-size: clamp(24px, 1.5vw, 34px);
    }
  }


  &__table {
    margin-top: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 220px;
    margin-bottom: 10px;

    @media (min-width:1280px) {
      margin-top: calc(0/832*100dvh);
      font-size: clamp(40px, 2.5vw, 56px);
      line-height: 40px;
      max-height: calc(328/832*100dvh);
      overflow-y: auto;
      width: calc(100%);


    }

    &_header {
      width: 100%;
      padding: 0 7px;
      margin-top: 14px;
      display: flex;
      align-items: center;
      height: 24px;

      @media (min-width:1280px) {
        padding: 0;
        height: calc(41/832*100dvh);
        padding-top: calc(10/832*100dvh);
        padding-bottom: calc(10/832*100dvh);
        padding-right: calc(25/1280*100dvw);
        display: flex;
        align-items: center;
        margin-top: calc(12/832*100dvh);
        position: relative;

      }

      &::after {
        @media (min-width:1280px) {
          content: '';
          position: absolute;
          left: calc(0/1280*100dvw);
          right: calc(25/1280*100dvw);
          bottom: 0;
          height: 1px;
          background: #E9E9E9;


        }

      }

      &>div {

        font-size: 14px;
        color: #000000;

        @media (min-width:1280px) {

          font-size: clamp(20px, 1.5vw, 24px);
          display: flex;
          align-items: center;

        }
      }

      &_position {
        width: 47px;

        @media (min-width:1280px) {
          width: calc(57/1280*100dvw);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }

      &_name {
        width: 60px;
        margin-left: 58px;

        @media (min-width:1280px) {
          width: calc(250/1280*100dvw);
          margin-left: calc(82/1280*100dvw);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }

      &_time {
        width: 48px;
        text-align: center;
        margin-left: auto;

        @media (min-width:1280px) {
          width: calc(57/1280*100dvw);
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

      }

      &_score {
        width: 37px;
        text-align: center;
        margin-left: 2px;

        @media (min-width:1280px) {
          margin: 0;
          width: calc(82/1280*100dvw);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin-left: calc(128/1280*100dvw);
          margin-right: calc(123/1280*100dvw);
        }
      }
    }

    &>div {
      line-height: 24px;
      font-size: 14px;
      color: #000000;

      @media (min-width:1280px) {
        padding: 0;
        margin: 0;
        line-height: auto;
        ;
        font-size: clamp(20px, 1.5vw, 24px);

      }
    }

    &_item {
      display: flex;
      width: calc(100% - 20px);
      margin: 0 auto;
      padding: 11px 11px 11px 5px;

      border-radius: 5px;
      margin-bottom: 10px;
      height: 36px;
      background-color: #F7F7F7;

      @media (min-width:1280px) {
        height: calc(41/832*100dvh);
        background-color: white;
        border-bottom: 1.5px solid #E9E9E9;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 0;
        margin: 0;
        border-radius: 0;
        width: calc(100% - calc(25/1280*100dvw));
      }

    }

    &_position {
      width: 14px;
      text-align: center;

      @media (min-width:1280px) {
        width: calc(16/1280*100dvw);
        margin-left: calc(19/1280*100dvw);
        text-align: left;
      }
    }

    &_name {
      width: 199px;
      margin-left: 14px;
      white-space: nowrap;
      text-align: left;

      @media (min-width:1280px) {
        width: calc(250/1280*100dvw);
        margin-left: calc(103/1280*100dvw);
        text-align: center;
      }

    }

    &_time {
      width: 45px;
      text-align: center;
      margin-left: auto;

      @media (min-width:1280px) {
        width: calc(57/1280*100dvw);
      }
    }

    &_score {
      width: 10px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;

      @media (min-width:1280px) {
        width: calc(82/1280*100dvw);
        text-align: center;
        margin-left: calc(128/1280*100dvw);
        margin-right: calc(123/1280*100dvw);
      }
    }
  }

  &__home {
    display: none;

    @media (min-width:1280px) {
      display: flex;
      margin-top: auto;
      margin-left: auto;
      height: calc(44/832*100dvh);
      width: calc(216/1280*100dvw);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(24px, 1.5vw, 34px);
      border-radius: 5px;
      border: 1px solid #853CFF;
      color: #853CFF;
      background-color: white;
    }
  }
}
</style>
