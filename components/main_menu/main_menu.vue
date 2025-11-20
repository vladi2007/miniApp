<script setup lang="ts">



import description from '~/components/main_menu/description.vue'

const router = useRouter()
async function goTo(url: string) {
   
  router.push(url)
}
</script>

<template>
    <div class="main_menu_fon">
        <div class="header">
            <img src="/public/images/interactive_editor/logo.svg" id="logo_header" />
        </div>
        <div class="nav">
            <div class="nav_main" :class="['active_nav', 'nav_main']"style="cursor: pointer;">
                О нас
            </div>
            <div class="nav_interactives" @click="goTo('/leader/new_interactives')"style="cursor: pointer;">
                Интерактивы
            </div>
            <div :class="[ 'nav_reports']" @click="goTo('/leader/history')"style="cursor: pointer;">
                Отчеты
            </div>
            <div class="nav_broadcasts" @click="goTo('/leader/broadcasts')"style="cursor: pointer;">
                Рассылка
            </div>
        </div>
        <description />
    </div>
</template>


<style>
@import url("~/assets/css/main_menu/main_menu.scss");
</style>
<style scoped>




.header {
    width: 100dvw;
    height: calc((71 / 832) * 100dvh);
    background-color: #853CFF;
    display: flex;
    align-items: center;
}

#logo_header {
    width: calc((123/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
    margin-left: auto;
    margin-right: calc((40.29/1280) * 100dvw);
}

.nav {
    display: flex;
    gap: calc((20 / 1280) * 100dvw);
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((112 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    font-style: Medium;
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;

}

.nav>div:hover {
    color: #1D1D1D;
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

</style>
