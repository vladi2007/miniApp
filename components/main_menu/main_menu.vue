<script setup lang="ts">


import Header from "~/components/header.vue"
import description from '~/components/main_menu/description.vue'
import header_logo from "~/components/header_logo.vue"
const router = useRouter()
async function goTo(url: string, active:string) {
   if (active ==="menu") return
  router.push(url)
}

</script>

<template>
    <div class="main_menu_fon">
           <header_logo/>
           <Header :goTo="goTo" :active="'menu'" />
        <div class ="main_menu_content" >
            
            <description />
        </div>
    </div>
</template>


<style>

@import url("/assets/css/main_menu/main_menu.scss");
* {
  margin: 0;
  box-sizing: border-box;
}
.main_menu_fon {
 width: 100dvw;
    height: 100dvh;
    
    background-color: white;
}


.main_menu_content{
     width: 1320px;
     margin: 0 auto 0 auto;
    
}

</style>
