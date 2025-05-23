<script setup lang="ts">
const props = defineProps<{ count: string; context:string}>()
</script>

<template>
  <div class="waiting_active">
    <div class="waiting_active_number">{{ count }}</div>
    <div class="waiting_active_text">Активных,<br>участников</div>
  </div>
</template>

<style>

</style>