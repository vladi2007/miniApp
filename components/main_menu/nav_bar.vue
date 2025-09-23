<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// фунция для навигации
const route = useRouter()
function goTo(url: string) {
  route.push(url)


}
function goBack() {
  route.push('/leader/interactives')
}
const currentPath = ref(window.location.pathname)


const isMainMenu = computed(() => currentPath.value === "/leader/main_menu" || currentPath.value === "/")

onMounted(() => {
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
  })
})

</script>

<template>
  <div class="nav_bar" :class="{ nav_bar_out_main_menu: !isMainMenu }">

    <div class="nav_bar_elements"> <!--  v-if="isMainMenu" -->
      <div class="reports" v-if="isMainMenu" @click="goTo('/leader/history')">
        Отчеты
      </div>
      <div class="interactives" @click="goTo('/leader/interactives')" v-if="isMainMenu">
        Управление интерактивами
      </div>
      <div class="broadcast" v-if="isMainMenu" @click="goTo('/leader/broadcasts')">
        Рассылка
      </div>
      <div class="nav_bar_logo" :class="{ nav_bar_logo_out_main_menu: !isMainMenu }">
        <img src="/images/main_menu/logo.svg" id="nav_bar_logo" />
      </div>
    </div>

  </div>
</template>

<style>
@import url("~/assets/css/main_menu/nav_bar.scss");
</style>
