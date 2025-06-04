<script setup lang="ts">
const props = defineProps<{
  winners: { position: string, username: string }[]
}>()

import { useRouter } from 'vue-router'

// Получаем экземпляр маршрутизатора
const router = useRouter()

// Функция возврата на предыдущую страницу
function goToMainMenu() {
  
  router.push('/leader/main_menu')
  
}
</script>

<template>
  <div class="winners_table">
    <div class="table">
      <div class="title">
        Таблица лидеров
      </div>

      <div class="winners_list">
        <!-- Динамически отображаем список победителей -->
        <div v-for="(winner, index) in props.winners" :key="index" class="winner">
          <span class="position">{{ winner.position }}.</span>
          <span class="name">{{ winner.username }}</span>
          <!-- <span class = "winner-position">8</span> -->
        </div>
      </div>

    </div>
    <div class="goto_main_menu">
      <button class="goto_main_menu_button" @click="goToMainMenu()">
        Вернуться на главную страницу
      </button>
    </div>
  </div>
</template>

<style>

</style>
