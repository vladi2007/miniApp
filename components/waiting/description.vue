<script setup lang="ts">

// data from backend
const props = defineProps<{ title: string; description: string; context: string, goBack?: () => void, onStatus?: any }>()

</script>

<template>
  <div class="waiting_description">
    <div class="waiting_desc-content">
      <div class="waiting_interactive-title">{{ title }}</div>
      <div class="waiting_interactive-description">
        {{ description }}
      </div>
    </div>
    <div class="waiting_leader_buttons">
      <button class="waiting_back" @click="goBack">
        Вернуться
      </button>
      <button class="waiting_start" @click="onStatus('going')">
        Запустить
      </button>

    </div>
  </div>
</template>

<style>
</style>
