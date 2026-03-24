<script setup lang="ts">
import user from '~/components/users/user.vue'

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <user />
</template>

<style></style>
