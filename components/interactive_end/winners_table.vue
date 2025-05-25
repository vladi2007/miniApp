<script setup lang="ts">
const props = defineProps<{
  winners: { position: string, username: string }[]
}>()
</script>

<template>
  <div class="winners_table">
    <div class="table">
      <div class="title">
        Таблица лидеров
      </div>

      <div class="winners_list">
        <!-- Динамически отображаем список победителей -->
        <div v-for="(winner, index) in props.winners" :key="index" class="winner">
          <span class="position">{{ winner.position }}.</span>
          <span class="name">{{ winner.username }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Ваши стили */
</style>