
<script setup lang="ts">
const props = defineProps<{ title: string; description: string ;context:string}>()
</script>

<template>
  <div class="waiting_description">
    <div class="waiting_desc-content">
      <div class="waiting_interactive-title">{{ title }}</div>
      <div class="waiting_interactive-description">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<style>

</style>
