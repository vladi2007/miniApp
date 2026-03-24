<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'

const layout = 'default'
onMounted(() => {

})
</script>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;

}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
