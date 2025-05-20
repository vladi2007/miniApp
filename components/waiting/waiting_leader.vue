<script setup lang="ts">
import type { WaitingData } from '~/types/stageData'  // Импортируем тип данных
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'
import Links from '~/components/waiting/links.vue'

import { useRouter } from 'vue-router'

// Получаем экземпляр маршрутизатора
const router = useRouter()

// Функция возврата на предыдущую страницу
function goBack() {
  router.back()
}
const props = defineProps<{
    stage: string
    data: WaitingData  // Используем тип WaitingData
     onStatus: () => void
}>()
function click_sendStatus() {
   
  props.onStatus()
  
    // Показываем плашку при выборе ответа
}
</script>

<template>
    <div class="waiting_participant_waiting">
        <img src="/images/waiting/Vector_95.svg" id="waiting_vector_1" />
        <img src="/images/waiting/Vector_94.svg" id="waiting_vector_2" />
        <img src="/images/waiting/Star_4_(1).svg" id="waiting_star1" />
        <div><Links/></div>
        <div class="waiting_description_column">
            <div class="waiting_logo">
                <div class="waiting_logo_img">
                    <img src="/images/waiting/Group_7055.svg" id="logo" />
                    
                </div>


            </div>
            <div class="waiting_description-content">

                <div class="waiting_desc-comp">
                    <Description :title="props.data?.title || ''" :description="props.data?.description || ''" />
                    <div class ="waiting_leader_buttons">
                        <button class ="waiting_back"@click ="goBack">
                            Вернуться
                        </button>
                         <button class ="waiting_start" @click="click_sendStatus()">
                            Запустить
                        </button>

                    </div>
                </div>
                <!-- Передаем тестовые данные в компоненты -->
                
                
            </div>
            <div>
                    <Active :count="props.data.participants_active" />
                </div>
            
        </div>





    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    /* Это гарантирует, что padding и border будут учитываться в общем размере элементов */
}

.waiting_participant_waiting {
    display: flex;
    width: 100%;
    height: 100%;
    padding-left: 30px;
    padding-right: 30px;
}



.waiting_description_column {
    margin-left: auto;
    width: 773px;
    
    height: 525px;
    background-color: #853CFF;
     border-bottom-left-radius: 26px;
    border-bottom-right-radius: 26px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    /* 70% высоты для белого фона */
}

.waiting_logo {
    position: relative;
}

#logo {
    position: absolute;
    right: 10px;
    top: 12px
}

.waiting_desc-comp {


    background-color: #FFFFFF;
    height: 391px;
    width: 680px;
    ;
    margin: 0 auto;
    border-radius: 30px;

}

#waiting_vector_1{left: 0;
    position: absolute;
}

#waiting_vector_2{z-index: 1;
    position: absolute;
    bottom: 0;
    right: 0;
}
#waiting_star1{z-index: 2;
    position: absolute;
    bottom: 30px;
    right: 190px;
}
.waiting_leader_buttons{margin-top:48px;  font-family: 'Lato'; font-weight: 500; font-size: 24px; vertical-align: middle; line-height: 120%;
    display: flex;
  
    
}
.waiting_back{background-color: #F0436C; font-family: 'Lato'; font-weight: 500; font-size: 24px; vertical-align: middle; line-height: 120%;letter-spacing: 1px;
    color: white;
    width: 185px;
    height: 50px;
    border-radius: 5px;
    border:#F0436C 3px;
    margin-left: 131px;;
    
}
.waiting_start{ background-color: #6AB23D; font-family: 'Lato'; font-weight: 500; font-size: 24px; vertical-align: middle; line-height: 120%; letter-spacing: 1px;
   color: white;
    width: 185px;
    height: 50px;
    border-radius: 5px;
    border:#6AB23D 3px;
    margin-left: auto;
    margin-right: 131px;;
}
</style>
