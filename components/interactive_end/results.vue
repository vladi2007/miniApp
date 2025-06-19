<script setup lang="ts">
const props = defineProps<{
  title: string
  participantsTotal: string
}>()
</script>

<template>
  <div class="end_description">
    <div class="end_desc-content">
      <p class="end_interactive-title">{{ props.title }}</p>
      <div class="participants-num">
        <div class="num">
          <p>{{ props.participantsTotal }}</p>
        </div>
        <p class="participant-text">Участников</p>
      </div>
    </div>
  </div>
</template>

<style>

</style>