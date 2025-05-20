<script setup lang="ts">
import { defineProps } from 'vue'
import type { CountdownData } from '~/types/stageData'
// Получаем данные через props
const props = defineProps<{
  data: CountdownData // Используем тип данных WaitingData, который должен быть определен в типах
}>()
</script>

<template>
  <div class="countdown_timer">
    <div class="countdown_logo">
      
      <img src="/images/countdown/Vector_94_leader.svg" id="countdown_vector_leader" />
      <img src="/images/countdown/Vector_92_leader.svg" id="countdown_circle_leader" />
      <img src="/images/countdown/Star_2_leader.svg" id="countdown_star_2_leader" />
      <img src="/images/countdown/Vector_88_leader.svg" id="countdown_circle_line_leader" />
      <img src="/images/countdown/Vector_95_leader.svg" id="countdown_vector2_leader" />
      <img src="/images/countdown/Star_8_leader.svg" id="countdown_star_8_leader" />
      <img src="/images/countdown/Ellipse_50_leader.svg" id="countdown_ellipse1_leader" />
      <img src="/images/countdown/Star_4_2_leader.svg" id="countdown_star_4_2_leader" />
      <img src="/images/countdown/Star_7_2_leader.svg" id="countdown_star_7_2_leader" />
      <img src="/images/countdown/Star_3_2_leader.svg" id="countdown_star_3_2_leader" />
      <img src="/images/countdown/Star_9_leader.svg" id="countdown_star_9_leader" />
      <img src="/images/countdown/Star_6_1_leader.svg" id="countdown_star_6_1_leader" />
      <img src="/images/countdown/Ellipse_49_leader.svg" id="countdown_ellipse2_leader" />
      <img src="/images/countdown/Star_13_leader.svg" id="countdown_star_13_leader" />
      <img src="/images/countdown/Ellipse_51_leader.svg" id="countdown_ellipse3_leader" />
      <img src="/images/countdown/Star_12_leader.svg" id="countdown_star_12_leader" />
    </div>

    <p class="countdown_timer-text">{{ props.data.timer }}</p>
  </div>
</template>

<style >


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Это гарантирует, что padding и border будут учитываться в общем размере элементов */
}

.countdown_timer {
    padding: 0px;
    margin: 0px;
    
   height: 100vh;
    background-color: #853CFF;

}

#countdown_ellipse3_leader{
    position: absolute;
    top: 86px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left:506px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_star_4_2_leader{
    position: absolute;
    top: 445px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 70px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_star_13_leader{
    position: absolute;
    top:55px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 241px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_ellipse2_leader{
    position: absolute;
    top: 518px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 68px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}

#countdown_star_12_leader{
    position: absolute;
    top: 5px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 415px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_star_6_1_leader{

    position: absolute;
    bottom: 244px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left:  149px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_star_3_2_leader{
    position: absolute;
    bottom: 131px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    right:  473px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
.countdown_timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 128px;
    font-weight: 700;
    color: white;
    /* или черный, если круг светлый */
    z-index: 3;
    /* выше, чем у круга */
    pointer-events: none;
    /* чтобы не мешать кликам */

}

#countdown_star_7_2_leader{
    position: absolute;
    bottom: 88px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 77px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_star_9_leader{
    position: absolute;
    bottom: 147px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 342px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}
#countdown_ellipse1_leader{
    position: absolute;
    top: 348px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 20px;;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
    z-index: 2;
}

#countdown_circle_leader {
    position: absolute;
    top: 50%;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 50%;
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
    transform: translate(-50%, -50%);
    z-index: 2;
}

#countdown_circle_line {
    position: absolute;
    top: calc(50% + 159px);
    /* Используем calc для добавления 20px к 50% высоты родительского контейнера */
    left: calc(50% - 109px);
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
    transform: translate(-50%, -50%);
}

#countdown_circle_star {
    position: absolute;
    top: calc(50% + 75px);
    /* Используем calc для добавления 20px к 50% высоты родительского контейнера */
    left: calc(50% - 157px);
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
    transform: translate(-50%, -50%);
    z-index: 0;
}


#countdown_star_2_leader {
    
    position: absolute;
    top: 230px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 0;
    /* Прижимаем к левому краю контейнера */
    transform: translate(0, -50%);
    /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}

#countdown_star_3 {
    position: absolute;
    right: 108px;
    /* Прижимаем к правому краю контейнера */
    top: 95px;
    /* По вертикали по центру контейнера */
    transform: translateY(-50%);
    /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 4;
    /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}

#countdown_star_6 {

    position: absolute;
    bottom: 60px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 28px;
    /* Прижимаем к левому краю контейнера */
    /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}

#countdown_star_7 {

    position: absolute;
    bottom: 133px;
    /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 13px;
    /* Прижимаем к левому краю контейнера */
    /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}

#countdown_vector {
    position: absolute;
    right: 0;
    /* Прижимаем к правому краю контейнера */
    top: 130px;
    /* По вертикали по центру контейнера */
    transform: translateY(-50%);
    /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 2;
    /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}
#countdown_vector_leader{
     position: absolute;
    left: 0;
    /* Прижимаем к правому краю контейнера */
    bottom: 0px;
    /* По вертикали по центру контейнера */
    
    /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 2;
    /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}
#countdown_circle_line_leader{
    position: absolute;
    top: calc(50% + 205px);
    /* Используем calc для добавления 20px к 50% высоты родительского контейнера */
    left: calc(50% - 249px);
    /* Позиционируем по горизонтали на 50% от родительского контейнера */
   
}

#countdown_vector2_leader{
     position: absolute;
    right:0;
    /* Прижимаем к правому краю контейнера */
    top: 0px;
    /* По вертикали по центру контейнера */
    
    /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 2;
    /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}

#countdown_star_8_leader{
     position: absolute;
    right:200px;
    /* Прижимаем к правому краю контейнера */
    top: 65px;
    /* По вертикали по центру контейнера */
    
    /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 0;
    /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}
</style>
