<script setup>
import new_interactives from '~/components/interactives/new_interactives.vue'

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <new_interactives />
</template>

<style></style>
