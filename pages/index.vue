<script setup lang="ts">
import header_logo from '~/components/header_logo.vue'
import Layout from '~/components/layout.vue';
import login from '~/components/login/login.vue'

definePageMeta({
  middleware: ['init', 'hide-login'],
})
</script>

<template>
  <Layout :active_nav="'login'">
    <login />
  </layout>


</template>

<style></style>
