<script setup lang="ts">
import organization_settings from '~/components/organization_settings/organization_settings.vue'

definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <organization_settings />
</template>

<style></style>
