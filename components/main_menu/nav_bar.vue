<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route= useRouter()
function goTo(url: string) {
  route.push(url)
  
  
}
function goBack(){
    route.push('/leader/interactives')
}
const currentPath = ref(window.location.pathname)


const isMainMenu = computed(() => currentPath.value === "/leader/main_menu" || currentPath.value === "/" )

onMounted(() => {
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
  })
})

</script>

<template>
    <div class = "nav_bar" :class="{ nav_bar_out_main_menu: !isMainMenu }">
     
        <div class ="nav_bar_elements">               <!--  v-if="isMainMenu" -->
            <div class ="reports"  v-if="isMainMenu" @click="goTo('/leader/history')">
Отчеты
            </div>
            <div class="interactives" @click="goTo('/leader/interactives')"  v-if="isMainMenu">
             Управление интерактивами
            </div>
            <div class ="broadcast" v-if="isMainMenu" @click="goTo('/leader/broadcasts')">
                Рассылка
            </div>
            <div class = "nav_bar_logo" :class="{ nav_bar_logo_out_main_menu: !isMainMenu}">
                     <img src="/images/main_menu/logo.svg" id="nav_bar_logo"  />
            </div>
        </div>
       
    </div>
</template>

<style >
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
.nav_bar {
    font-family: 'Lato', sans-serif;
    height: 71px;;
    background-color: #AA77FF;
    width: 100%; /* тянется на всю ширину экрана */
}

.nav_bar_elements {
    display: flex;
     align-items: center; /* Центрирование по вертикали */
    height: 100%; /* Занимает всю высоту nav_bar */
    justify-content: space-between;
    max-width: 1340px; /* ограничиваем ширину содержимого */
    margin: 0 auto; /* выравнивание по центру */
   
}

.nav_bar_elements > div{ font-weight: 500; color: #DDC9FF;
    font-size: 24px;
    vertical-align: middle;text-align: center; 
}
/* Наведение на элементы */
.nav_bar_elements > div:hover {
  color: white;
}
.reports{text-align: center;
 
    vertical-align: middle;
    width: 134px;
 cursor: pointer;
   
}

.interactives{
    width: 347px;
 cursor: pointer;

}

.broadcast{ 
    width: 138px;
   vertical-align: middle; cursor: pointer;
}

.nav_bar_logo{ 
    width: 138px;
    height: 50px;;
}
.nav_bar_out_main_menu{
    background-color: #853CFF;
}
.nav_bar_logo_out_main_menu{
    margin-left: auto;
}
</style>
