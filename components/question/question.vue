<script >
import question_list from '/components/question/question_list';  // Путь может отличаться в зависимости от структуры проекта
import timer from '/components/question/timer';
export default {
    components: {
        question_list,
        timer // Регистрация компонента
    },
};

</script>

<template>
    <div class ='question'>
        <img src="/images/question/Star_2.svg"id ="star_2" />
           <img src="/images/question/Vector_89.svg" id ="vector" />
        <timer/>
    <question_list/>
    </div>
    
    
</template>

<style>
.question{
    
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Это гарантирует, что padding и border будут учитываться в общем размере элементов */
}
body {width: 100%;
    height: 100%;
    font-family: 'Lato';
    background-color: white
}
html, body {
    height: 100%;
}
#star_2{
    
    position: absolute;
    top: 180px; /* Позиционируем по вертикали на 50% от родительского контейнера */
    right: 0; /* Прижимаем к левому краю контейнера */
    transform: translate(0, -50%); /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}
#vector{
    
    position: absolute;
    top: 435px; /* Позиционируем по вертикали на 50% от родительского контейнера */
    left: 0; /* Прижимаем к левому краю контейнера */
    transform: translate(0, -50%); /* Убираем влияние transform на горизонтальное выравнивание */
    z-index: 0;
}
</style>
