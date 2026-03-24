<script setup>
import history from '~/components/history/new_history.vue'

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <history />
</template>

<style></style>
