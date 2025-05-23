<script setup>



import nav_bar from '~/components/main_menu/nav_bar.vue'
import description from '~/components/main_menu/description.vue'

</script>

<template>
    <div class = "main_menu_fon" >
       <nav_bar/>
       <description/>
    </div>
</template>

<style >
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
.main_menu_fon{
    background-color: white;
    width: 100vmax;
    height: 100vh;
}
</style>
