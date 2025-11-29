<script setup lang="ts">
const props = defineProps<{
    goTo: (url: string, active:string) => void;
    active:string
}>()

</script>
<template>

        <div class="nav" :class="{margins:props.active==='menu'}">
            <div class="nav_main" :class="{active_nav : props.active === 'menu'}" @click="goTo('/leader/main_menu', 'menu')">
                О нас
            </div>
            <div class="nav_interactives" :class="{active_nav : props.active === 'interactives'}" @click="goTo('/leader/new_interactives',  'interactives')">
                Интерактивы
            </div>
            <div class= "nav_reports" :class="{active_nav : props.active === 'reports'}" @click="goTo('/leader/history', 'reports')">
                Отчеты
            </div>
            <div class="nav_broadcasts" :class="{active_nav : props.active === 'broadcasts'}"  @click="goTo('/leader/broadcasts', 'broadcasts')">
                Рассылка
            </div>
        </div>
</template>
<style scoped>
@media (max-width:1918px), (max-height:1078px){

.margins{width: calc((1056 / 1280) * 100dvw);
    margin:0 auto 0 auto;
margin-left: calc((112/1280)*100dvw) !important;
}
.nav {
    display: flex;
    gap: calc((20 / 1280) * 100dvw);
    margin-top: calc((34 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    font-style: Medium;
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;
    margin-left: calc((0/1280*100dvw)); 
}

.nav>div:hover {
    color: #1D1D1D;
}
.nav > div{
    cursor: pointer;
}
.nav_main:not(.active_nav):hover::after,
.nav_interactives:not(.active_nav):hover::after,
.nav_reports:not(.active_nav):hover::after,
.nav_broadcasts:not(.active_nav):hover::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    margin-top: 0px;
    background-color: #853CFF;
}

.active_nav {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    color: #1D1D1D;

    vertical-align: middle;
    display: grid;
    width: fit-content;
}

.active_nav::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    color: #1D1D1D !important;
    margin-top: 0px;
    background-color: #853CFF;
}
}
@media (min-width:1918px) and (min-height:1078px){

.margins{width: 1056px !important;
    margin:0 auto 0 auto !important;
       margin-top:55px !important;
       padding-left: 146px;;
}
.nav {
    display: flex;
    gap: 20px;
    margin-top:55px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px;
    letter-spacing: 0.2px;
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;
    margin-left: 146px;; 
}

.nav>div:hover {
    color: #1D1D1D;
}
.nav > div{
    cursor: pointer;
}
.nav_main:not(.active_nav):hover::after,
.nav_interactives:not(.active_nav):hover::after,
.nav_reports:not(.active_nav):hover::after,
.nav_broadcasts:not(.active_nav):hover::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    margin-top: 0px;
    background-color: #853CFF;
}

.active_nav {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    color: #1D1D1D;

    vertical-align: middle;
    display: grid;
    width: fit-content;
}

.active_nav::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    color: #1D1D1D !important;
    margin-top: 0px;
    background-color: #853CFF;
}
}

</style>