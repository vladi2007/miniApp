<script setup lang="ts">
const props = defineProps<{ count: string }>()
</script>

<template>
  <div class="waiting_active">
    <div class="waiting_active_number">{{ count }}</div>
    <div class="waiting_active_text">Активных,<br>пользователей</div>
  </div>
</template>
