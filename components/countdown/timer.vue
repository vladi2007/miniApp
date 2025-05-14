<script>


</script>

<template>
    <div class="timer">
        
       <div class ="logo">

            <img src="/images/countdown/Vector_92.svg" id ="circle" />
            <img src="/images/countdown/Star_4.svg" id ="circle_star"/>
            <img src="/images/countdown/Star_7.svg"id ="star_7"/>
            
            <img src="/images/countdown/Star_3.svg" id ="star_3"/>
            <img src="/images/countdown/Star_2.svg"id ="star_2" />
            <img src="/images/countdown/Star_6.svg"id ="star_6" />
            <img src="/images/countdown/Vector.svg"id ="vector"  />
            <img src="/images/countdown/Vector_90.svg"id ="circle_line"  />
       </div>
       <p class ="timer-text">0</p>

    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Это гарантирует, что padding и border будут учитываться в общем размере элементов */
}
.timer {
    padding: 0px;
    margin: 0px;
    background-color: #853CFF;
    

}
.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 128px;
  font-weight: 700;
  color: white; /* или черный, если круг светлый */
  z-index: 3; /* выше, чем у круга */
  pointer-events: none; /* чтобы не мешать кликам */
 
}

body {background-color: #853CFF;
  font-family: 'Work Sans';
  height: 100%;
  width: 100%;
}



.fixed {
    position: absolute;
    /* Эта картинка будет фиксированной */
    /* Место, где будет находиться картинка */
    right: 0;
    /* Место, где будет находиться картинка */
    z-index: 0;
    /* Делаем эту картинку поверх остальных */
    top: 6px;
}

#circle{
    position: absolute;
    top: 50%; /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 50%; /* Позиционируем по горизонтали на 50% от родительского контейнера */
    transform: translate(-50%, -50%); 
    z-index: 2;
}
#circle_line{
    position: absolute;
    top: calc(50% + 159px); /* Используем calc для добавления 20px к 50% высоты родительского контейнера */
    left: calc(50% - 109px); /* Позиционируем по горизонтали на 50% от родительского контейнера */
    transform: translate(-50%, -50%); 
}
#circle_star{
    position: absolute;
    top: calc(50% + 75px); /* Используем calc для добавления 20px к 50% высоты родительского контейнера */
    left: calc(50% - 157px); /* Позиционируем по горизонтали на 50% от родительского контейнера */
    transform: translate(-50%, -50%); 
    z-index: 0;
}


#star_2{
    height: 213px;
    width: 106px;
    position: absolute;
    top: 230px; /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 0; /* Прижимаем к левому краю контейнера */
    transform: translate(0, -50%); /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}
#star_3{
   position: absolute;
    right: 108px; /* Прижимаем к правому краю контейнера */
    top: 95px; /* По вертикали по центру контейнера */
    transform: translateY(-50%); /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 4; /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}
#star_6{

    position: absolute;
    bottom: 60px; /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 28px; /* Прижимаем к левому краю контейнера */
     /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}
#star_7{

    position: absolute;
    bottom: 133px; /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 13px; /* Прижимаем к левому краю контейнера */
     /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}
#vector {
    position: absolute;
    right: 0; /* Прижимаем к правому краю контейнера */
    top: 130px; /* По вертикали по центру контейнера */
    transform: translateY(-50%); /* Корректируем положение по вертикали для идеального центрирования */
    z-index: 2; /* Устанавливаем z-index, если нужно, чтобы элемент был выше/ниже других */
}

</style>
