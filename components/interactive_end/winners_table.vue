<script setup lang="ts">
const props = defineProps<{
  winners: { position: string, username: string }[]
}>()

import { useRouter } from 'vue-router'

// Получаем экземпляр маршрутизатора
const router = useRouter()

// Функция возврата на предыдущую страницу
function goToMainMenu() {
  window.location.href="https://voshod07.ru/"
  
  
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
          <span class = "winner-position">8</span>
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
.winners_table {

  font-family: 'Lato';
  margin-top: 50px;
  display: grid;
  /* Используем flexbox */
  justify-content: center;
  /* Выравнивание по горизонтали */

  /* Высота экрана */


}

.table {font-family: 'Lato';
  margin-top: 5px;
  width: 1380px;
  ;
  height: 452px;
  ;
  border: 4px solid #D9D9D9;
  border-radius: 30px;
}

.title {font-family: 'Lato';
  font-family: 'Lato';
  text-align: center;
  margin-top: 31px;
  font-weight: 700;
  font-size: 32px;
  line-height: 24px;
  ;
}

.winners_list {font-family: 'Lato';
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  /* 3 строки одинаковой высоты */
  gap: 31px;
  /* расстояние между строками — можно изменить */
  margin-top: 31px;
  padding: 0 16px;


}

#first {}

.winner {font-family: 'Lato';width: 100%;
  vertical-align: middle;
  background-color: #F7F7F7;
  padding: 33px;
  border-radius: 5px;
  font-weight: 500;


  font-size: 32px;
  ;
  line-height: 24px;
  ;
  text-align: left;


  /* Новый стиль для выравнивания содержимого */
  display: flex;
  align-items: center;
}

.name {
  margin-left: 41px;
  ;
}

.goto_main_menu{margin-left: auto;margin-right: 34px;
  margin-top:50px;
}

.goto_main_menu_button{
  background-color: #853CFF;
  width: 280px;
  height: 65px;
  border-radius: 5px;;
  border: 1px #853CFF;;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;color:white;
}

.winner-position{margin-right: 46px;
  margin-left: auto;
}
</style>
