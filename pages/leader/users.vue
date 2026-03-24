<script setup lang="ts">
import users from '~/components/users/users.vue'

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <users />
</template>

<style></style>
