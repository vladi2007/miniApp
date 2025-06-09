<script setup lang="ts">
import { useRouter } from 'vue-router'
import nav_bar from '~/components/main_menu/nav_bar.vue'

import interactives_list from '~/components/interactives/interactives_list.vue'
const route= useRouter()
function goToMainMenu() {

    route.push("/leader/main_menu")

}
const props = defineProps<{
    interactives_list: {
        interactives_list_conducted: {
            title: string,
            question_count: string,
            target_audience: string,
            id: string,
            date_completed: string
        }[]
        interactives_list_not_conducted: {
            title: string,
            question_count: string,
            target_audience: string,
            id: string,
            date_completed: string
        }[]
    }

}>()



function create_new_interactive() {

    route.push('/leader/create_interactive')

}


</script>

<template>
    <div class="interactive_body">
        <nav_bar />
        <div class="interactives_top_menu">
            <div>
                <button class="interactives_backButton" @click="goToMainMenu()">
                    Вернуться
                </button>
            </div>
            <div class="interactives_top_menu_header">
                Запуск/<br>
                создание интерактивов
            </div>
            <div class="interactives_top_menu_create_interactive" @click="create_new_interactive()">
                Создать интерактив
            </div>
        </div>
        <div class="interactives_lists">
            <img src="/images/interactives/Group_107.svg" id="interactives_line" />
            <img src="/images/interactives/Group_108.svg" id="interactives_line2" />
            <interactives_list :header="'Непроведенные интерактивы'"
                :interactives_list="props.interactives_list.interactives_list_not_conducted" :status="'not_end'" />
            <interactives_list :header="'Проведенные интерактивы'" class="interactive_list_second"
                :interactives_list="props.interactives_list.interactives_list_conducted" :status="'end'" />
        </div>



    </div>
</template>

<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}


.interactive_body {letter-spacing: 1px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
}

.interactives_lists {
  flex-grow: 1; /* чтобы занимал всё оставшееся пространство */
}
.interactives_top_menu {
    width: 1319px;
    height: 217px;
    margin: 0 auto;
    letter-spacing: 1px;
    ;
    margin-top: 19px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 2 колонки одинаковой ширины */
    grid-template-rows: 1fr 1fr;
    /* 2 строки одинаковой высоты */


}

/* Верхний левый угол */
.interactives_top_menu>div:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
}

/* Нижний левый угол */
.interactives_top_menu_header {
    grid-column: 1;
    grid-row: 2;
    align-self: end;
    /* прижать к низу ячейки */
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 36px;
}

/* Нижний правый угол */
.interactives_top_menu_create_interactive {cursor: pointer;
    grid-column: 2;
    grid-row: 2;
    justify-self: end;
    /* по правому краю */
    align-self: end;
    /* по нижнему краю */
    width: 313px;
    height: 62px;
    background-color: #6AB23D;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    border-radius: 5px;
    font-size: 24px;
    font-weight: 500;
    vertical-align: middle;
}
.interactives_top_menu_create_interactive:hover{
    background-color: #9AC57E;

}
.interactives_backButton {cursor: pointer;
    width: 229px;
    height: 62px;
    border-radius: 5px;
    background-color: white;
    color:#853CFF;
    border: 2px solid #853CFF;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
}
.interactives_backButton:hover {cursor: pointer;
    width: 229px;
    height: 62px;
    border-radius: 5px;
    background-color: #853CFF;
    color: white;
    border: 2px solid #853CFF;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
}
.interactives_lists {
    width: 1345px;
    height: 1504px;

    margin: 0 auto;
    margin-top: 35px;
    position: relative;
    margin-bottom: 12px;
    ;
}

#interactives_line {
    position: absolute;
    top: 13px;
    left: 0;
    ;
}

#interactives_line2 {
    position: absolute;
    top: 780px;
    ;
    left: 0;
    ;
}

.interactive_list_second {
    margin-top: 34px;
}
</style>
