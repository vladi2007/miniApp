<script setup lang="ts">
function goTo(url: string) {
  window.location.href=url
  
  
}
</script>

<template>
    <div class = "nav_bar">
        <div class ="nav_bar_elements">
            <div class ="reports" @click="goTo(`https://voshod07.ru/leader/main_menu`)">
Отчеты/История
            </div>
            <div class="interactives" @click="goTo(`https://voshod07.ru/leader/interactives`)">
             Управление интерактивами
            </div>
            <div class ="broadcast" >
                Рассылка
            </div>
            <div class = "nav_bar_logo">
                     <img src="/images/main_menu/logo.svg" id="nav_bar_logo" />
            </div>
        </div>
       
    </div>
</template>

<style >
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
    
    max-width: 1340px; /* ограничиваем ширину содержимого */
    margin: 0 auto; /* выравнивание по центру */
}

.nav_bar_elements > div{ font-weight: 500;  color: white;
    font-size: 24px;
    vertical-align: middle;text-align: center;
}
.reports{text-align: center;
 
    vertical-align: middle;
    width: 224px;
 
   
}

.interactives{margin-left: 173px;
    width: 347px;


}

.broadcast{margin-left: 173px;
    width: 138px;
   vertical-align: middle;
}

.nav_bar_logo{margin-left: 146.62px;
    width: 138px;
    height: 50px;;
}
</style>
