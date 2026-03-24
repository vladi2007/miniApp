<script setup>
import broadcasts from '~/components/broadcasts/new_broadcasts.vue'

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <broadcasts />
</template>

<style></style>
