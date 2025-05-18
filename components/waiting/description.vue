
<script setup lang="ts">
const props = defineProps<{ title: string; description: string }>()
</script>

<template>
  <div class="waiting_description">
    <div class="waiting_desc-content">
      <p class="waiting_interactive-title">{{ title }}</p>
      <div class="waiting_interactive-description">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>
