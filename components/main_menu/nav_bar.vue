<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// фунция для навигации
const route = useRouter()
function goTo(url: string) {
  route.push(url)
}
// текущий url(нужен для удобства при локальной разработке)
const currentPath = ref(window.location.pathname)

// нужен для удобства при локальной разработке)
const isMainMenu = computed(() => currentPath.value === '/leader/main_menu' || currentPath.value === '/')

onMounted(() => {
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
  })
})
</script>

<template>
  <div
    class="nav_bar"
    :class="{ nav_bar_out_main_menu: !isMainMenu }"
  >
    <div class="nav_bar_elements">
      <!--  v-if="isMainMenu" -->
      <div
        v-if="isMainMenu"
        class="reports"
        @click="goTo('/leader/history')"
      >
        Отчеты
      </div>
      <div
        v-if="isMainMenu"
        class="interactives"
        @click="goTo('/leader/interactives')"
      >
        Управление интерактивами
      </div>
      <div
        v-if="isMainMenu"
        class="broadcast"
        @click="goTo('/leader/broadcasts')"
      >
        Рассылка
      </div>
      <div
        class="nav_bar_logo"
        :class="{ nav_bar_logo_out_main_menu: !isMainMenu }"
      >
        <img
          id="nav_bar_logo"
          src="/images/main_menu/logo.svg"
        >
      </div>
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/main_menu/nav_bar.scss");
</style>
