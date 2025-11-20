<script setup lang="ts">


import Header from "~/components/header.vue"
import description from '~/components/main_menu/description.vue'

const router = useRouter()
async function goTo(url: string, active:string) {
   if (active ==="menu") return
  router.push(url)
}
</script>

<template>
    <div class="main_menu_fon">
        <Header :goTo="goTo" :active="'menu'"/>
        <description />
    </div>
</template>


<style>
@import url("~/assets/css/main_menu/main_menu.scss");
</style>
<style scoped>





</style>
