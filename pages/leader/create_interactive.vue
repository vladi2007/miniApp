<script setup>
import create_interactive from '~/components/interactive_editor/create_interactive.vue'
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave(async (to, from, next) => {
  await clearInteractiveSessionData()
  next()
})
definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <create_interactive />
</template>

<style></style>
