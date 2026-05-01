<script setup lang="ts">
import header_logo from '../components/header_logo.vue'
import Header from '../components/header.vue'

const router = useRouter()
const props = defineProps<{
  active_nav: string
}>()
async function goTo(url: string, active: string): Promise<void> {
  if (active === props.active_nav) return
  router.push(url)
}
</script>

<template>
  <div class="layot">
    <header_logo />
    <div class="layot_margins">
      <Header :go-to="goTo" :active="props.active_nav" />
      <slot />
    </div>
  </div>
</template>

<style>
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
