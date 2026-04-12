<script setup lang="ts">
import type { Pause, QuestionData, QuestionWinners } from '~/types/stageData'

import { useRouter } from 'vue-router'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'
// таблица лидеров
const props = defineProps<{
  winners: QuestionWinners[]
  onAnswer: (id: string) => void
}>()

// Получаем экземпляр маршрутизатора
const router = useRouter()
// const winners = [
//   { position: 1, username: 'PlayerOne', time: 125, score: 1500 },
//   { position: 2, username: 'FastRunner', time: 138, score: 1420 },
//   { position: 3, username: 'Speedy', time: 150, score: 1300 },
//   { position: 4, username: 'NoobMaster', time: 180, score: 1100 },
//   { position: 5, username: 'Legend27', time: 210, score: 900 },
//   { position: 1, username: 'PlayerOne', time: 125, score: 1500 },
//   { position: 2, username: 'FastRunner', time: 138, score: 1420 },
//   { position: 3, username: 'Speedy', time: 150, score: 1300 },
//   { position: 4, username: 'NoobMaster', time: 180, score: 1100 },
//   { position: 5, username: 'Legend27', time: 210, score: 900 },
//   { position: 1, username: 'PlayerOne', time: 125, score: 1500 },
//   { position: 2, username: 'FastRunner', time: 138, score: 1420 },
//   { position: 3, username: 'Speedy', time: 150, score: 1300 },
//   { position: 4, username: 'NoobMaster', time: 180, score: 1100 },
//   { position: 5, username: 'Legend27', time: 210, score: 900 },
//   { position: 1, username: 'PlayerOne', time: 125, score: 1500 },
//   { position: 2, username: 'FastRunner', time: 138, score: 1420 },
//   { position: 3, username: 'Speedy', time: 150, score: 1300 },
//   { position: 4, username: 'NoobMaster', time: 180, score: 1100 },
//   { position: 5, username: 'Legend27', time: 210, score: 900 },
// ]

const participants = ref(
  props.winners.map((winner, index) => ({
    ...winner,
    participant_id: String(index + 1), // если нет participant_id, ставим индекс
    is_hidden: false, // по умолчанию имя видно
  }))
)

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
function toggleHidden(id: string) {
  const winner = props.winners.find(w => w.participant_id === id)
  if (winner) {
    winner.is_hidden = !winner.is_hidden
  }
  props.onAnswer(id)
}
</script>

<template>
  <div class="winners_table">
    <div class="table">
      <div class="title">
        Лидерборд
      </div>
      <div class="winners_list_header">
        <div style="width: calc((57 / 1280) * 100dvw) !important; white-space: nowrap;;text-align: center;">
          место
        </div>
        <div
          style="margin-left: calc((164/1280)*100dvw); width: calc((86 / 1280) * 100dvw);white-space: nowrap;;text-align: center;">
          участник
        </div>
        <div
          style="margin-left: calc((396/1280)*100dvw); width: calc((57 / 1280) * 100dvw);white-space: nowrap;;text-align: center;">
          время
        </div>
        <div
          style="margin-left: calc((139/1280)*100dvw); width: calc((52 / 1280) * 100dvw); text-align: center;white-space: nowrap;;text-align: center; ">
          балл
        </div>
      </div>
      <simplebar
        style="height: calc((318 / 832) * 100dvh);    margin-right: calc((25/1280)*100dvw);  margin-top: calc((10 / 832) * 100dvh);">
        <div class="winners_list">
          <div v-for="(winner, index) in props.winners" :key="index" class="winner_row">
            <div v-if="index === 0" class="Line" />
            <div class="winner">
              <div class="position">
                {{ winner.position }}
              </div>
              <img :src="winner.is_hidden ? '/images/moderation/hide_name.svg' : '/images/moderation/open_name.svg'"
                @click="toggleHidden(winner.participant_id)" :style="!winner.is_hidden
                  ? {
                    width: 'calc((22/1280) * 100dvw)',
                    height: 'calc((26/832) * 100dvh)',
                    marginLeft: 'calc((71/1280) * 100dvw)'
                  }
                  : {
                    width: 'calc((22/1280) * 100dvw)',
                    height: 'calc((18/832) * 100dvh)',
                    marginLeft: 'calc((71/1280) * 100dvw)'
                  }" />
              <div class="name">

                {{ !winner.is_hidden ? '•••' : winner.username
                }}
              </div>
              <div class="time">
                {{ formatTime(winner.time) }}
              </div>
              <div class="score">
                {{ winner.score }}
              </div>
            </div>
            <div class="Line" />
          </div>
        </div>
      </simplebar>
      <div class="goto_main_menu_end">
        <button class="goto_main_menu_button_end" style="cursor: pointer;" @click="goToMainMenu()">
          Выйти
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.winners_list_header {
  margin-top: calc((22 / 832) * 100dvh);
  display: flex;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-style: Medium;
  font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
  letter-spacing: clamp(0.1px, calc((24 / 100 / 1280) * 100dvw), 0.48px);
  vertical-align: middle;

}

.goto_main_menu_end {
  width: calc((216/1280)*100dvw);
  margin-left: auto;
}

.goto_main_menu_button_end {
  margin-top: calc((50/832)*100dvh);
  width: calc((216/1280)*100dvw);
  height: calc((44/832)*100dvh);
  margin-left: auto;
  background-color: white;
  border: calc((2 / 832) * 100dvh) solid #853CFF;
  border-radius: calc((5/832)*100dvh);

  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-style: Medium;
  font-size: clamp(10px, calc((24 / 1280) * 100dvw), 48px);
  letter-spacing: clamp(0.1px, calc((24 / 100 / 1280) * 100dvw), 0.48px);
  text-align: center;
  vertical-align: middle;
  color: #853CFF;
}

.goto_main_menu_button_end:hover {
  background-color: #AA77FF;
  ;
  color: #FFFFFF;
}
</style>
