<script setup lang="ts">
import header_logo from '../header_logo.vue';
import header from '../header.vue';
const router = useRouter()
async function goTo(url: string, active: string) {
    if (active === "interactives") return
    router.push(url)
}
</script>
<template>
    <div class="user">
        <header_logo/>
        <div class ="interactives_margins" >

        
              
         <Header :goTo="goTo" :active="'interactives'" />
         </div>
    </div>
</template>
<style>
@media (max-height:1078px),
(max-width:1918px) {

}

@media (min-width:1918px) and (min-height:1078px) {

}

.interactives {
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background-color: white;
    position: relative;
    overflow-x: hidden;
}
</style>