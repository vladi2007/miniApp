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
@import url("~/assets/css/interactives/interactives.scss");
</style>
