<script setup lang="ts">
import header_logo from '~/components/header_logo.vue'
import login from '~/components/login/login.vue'

definePageMeta({
  middleware: ['init', 'hide-login'],
})
</script>

<template>
  <header_logo />
  <login />
</template>

<style></style>
