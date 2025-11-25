<script setup lang="ts">import type { EndData, EndWinners } from '~/types/stageData'
// таблица лидеров
const props = defineProps<{
  winners: { position: number, username: string, time: number, score: number }[]
}>()

import { useRouter } from 'vue-router'

// Получаем экземпляр маршрутизатора
const router = useRouter()

// Функция возврата на предыдущую страницу
function goToMainMenu() {

  router.push('/leader/new_interactives')

}
// форматируем секунды → мм:сс
function formatTime(secondsStr: number): string {
  const seconds = Number(secondsStr)
  if (isNaN(seconds)) return String(secondsStr) // защита от нечисловых значений

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
</script>

<template>
  <div class="winners_table">
    <div class="table">
      <div class="title">
        Лидерборд
      </div>
      <simplebar 
        style="height: calc((318 / 832) * 100dvh);   margin-top: calc((22 / 832) * 100dvh); margin-right: calc((25/1280)*100dvw);">
        <div class="winners_list">
          <div v-for="(winner, index) in props.winners" :key="index" class="winner_row">
            <div class="winner">
              <div class="position">{{ winner.position }} место</div>
              <div class="name">{{ winner.username }}</div>
              <div class="time">{{ formatTime(winner.time) }}</div>
              <div class="score">{{ winner.score }}</div>
            </div>
            <div class="Line"></div>
          </div>

        </div>
      </simplebar>
      <div class="goto_main_menu_end">
        <button class="goto_main_menu_button_end" @click="goToMainMenu()" style="cursor: pointer;">
          Выйти
        </button>
      </div>
    </div>

  </div>
</template>

<style>
.goto_main_menu_end {
  width: calc((216/1280)*100dvw);
  margin-left: auto;
}

.goto_main_menu_button_end {
  margin-top: calc((72/832)*100dvh);
  width: calc((216/1280)*100dvw);
  height: calc((44/832)*100dvh);
  margin-left: auto;
  background-color: white;
  border: 1px solid #853CFF;
  border-radius: calc((5/832)*100dvh);

  font-family: "Lato",sans-serif;
font-weight: 500;
font-style: Medium;
  font-size: clamp(10px, calc((24 / 1280) * 100dvw), 48px);
  letter-spacing: clamp(0.1px, calc((24 / 100 / 1280) * 100dvw), 0.48px);
text-align: center;
vertical-align: middle;
color:#853CFF;
}


</style>
