<script setup lang="ts">
import header_logo from '../components/header_logo.vue';
import Header from "../components/header.vue"
const router = useRouter()
const props = defineProps<{
    active_nav:string
}>()
async function goTo(url: string, active: string):Promise<void> {
    if (active === props.active_nav) return
    router.push(url)
}
</script>
<template>
    <div class="layot">
        <header_logo/>
        <div class ="layot_margins" >

        
              
         <Header :goTo="goTo" :active="props.active_nav" ></Header>
         <slot  ></slot>
         </div>
    </div>
</template>
<style>
@media (max-height:1078px),
(max-width:1918px) {
.layot_margins{width: calc((1056 / 1280) * 100dvw);
        box-sizing: border-box;
    padding: 0;
    margin: 0;
       margin-left: calc((112 / 1280) * 100dvw);
    }
}

@media (min-width:1918px) and (min-height:1078px) {
 .layot_margins{width: 1056px; 
        box-sizing: border-box;
    padding: 0;
    margin: 0;
       margin:0 auto 0 auto;
    }
}

.layot {
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